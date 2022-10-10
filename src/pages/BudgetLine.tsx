import React, {
  FC,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Title,
  Dropdown,
  Button,
  Spinner,
  Feedback,
  UploadIcon,
} from '../components/shared';
import { sendMultipart } from '../apis';
import { useWidth } from '../util/useWidth';
import OverallTable from '../components/budget/OverallTable';
import ExportBudgetTable from '../components/budget/ExportBudgetTable';
import ImportBudget from '../components/budget/ImportBudget';
import { IMainList } from '../types/basicComponentsTypes';
import ButtonArrows from '../components/shared/button/ButtonArrows';
import ModalExpenses from '../components/budget/ModalExpenses';
import FarmModalExpenses from '../components/budget/FarmModalExpenses';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { BudgetState, IBudgetPayload } from '../store/budget/budget.type';
import { deleteMessage, getBudgetFarm } from '../store/budget/budget.action';
import { getXeroContacts, getXeroAccounts } from '../store/utils/utils.actions';
import NotFound from './NotFound';

const BudgetLine: FC = (): ReactElement => {
  const width = useWidth();
  const history = useHistory();
  const dispatch = useDispatch();

  const query = new URLSearchParams(useLocation().search);
  const [isModalVisibile, setIsModalVisibile] = useState(false);
  const [importModalVisibile, setImportModalVisibile] = useState(false);
  const [defaultDropdown, setDefaultDropdown] = useState('');
  const [isSpinner, setIsSpinner] = useState(false);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [farmName, setFarmName] = useState('Mussel Farm 1');
  const [data, setData] = useState<any>();
  const [isNotFound, setIsNotFound] = useState(false);
  const [importExpenseResult, setImportExpenseResult] = useState({
    visible: false,
    success: true,
    message: '',
  });
  const [lines, setLines] = useState<IMainList[]>([
    { value: '1', label: 'Overall budget', id: '1', apiValue: '1' },
  ]);
  const budgetMessageStore = useSelector<IRootState, BudgetState['message']>(
    state => state.budget.message,
  );
  const budgetInfoStore = useSelector<IRootState, BudgetState['info']>(
    state => state.budget.info,
  );
  const budgetStore = useSelector<IRootState, BudgetState['budget']>(
    state => state.budget.budget,
  );
  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  const getData = async () => {
    setIsSpinner(true);
    if (query.get('farm')) {
      await dispatch(
        getBudgetFarm({ farm_id: query.get('farm'), year }, 'farm', history),
      );
    } else {
      await dispatch(
        getBudgetFarm({ line_id: query.get('line'), year }, 'line', history),
      );
    }
    setIsSpinner(false);
  };

  useEffect(() => {
    dispatch(getXeroContacts(history));
    dispatch(getXeroAccounts(history));
  }, []);

  useEffect(() => {
    setData(budgetInfoStore);
  }, [budgetInfoStore]);

  useEffect(() => {
    if (budgetMessageStore.message) {
      if (
        budgetMessageStore.message.includes(
          'The selected farm id is invalid.',
        ) ||
        budgetMessageStore.message.includes('The selected line id is invalid.')
      ) {
        setIsNotFound(true);
      }
      setTimeout(() => {
        dispatch(deleteMessage());
      }, 3000);
    }

    if (budgetMessageStore.message === 'Success') {
      getData();
    }
  }, [budgetMessageStore.message]);

  const getMenu = (farms: IBudgetPayload): IMainList[] => {
    const menu: IMainList[] = [];
    menu.push({
      value: '1',
      label: 'Overall budget',
      id: '1',
      apiValue: farms?.id?.toString(),
    });
    farms?.lines?.map((line, index) => {
      menu.push({
        value: (index + 2).toString(),
        label: line.line_name,
        id: (index + 2).toString(),
        apiValue: line?.id?.toString(),
      });
      return null;
    });

    return menu;
  };

  const getDataForMenu = async () => {
    let foundItem;
    if (query.get('farm')) {
      const farms = budgetStore.find(
        itemFarm => itemFarm.id === Number(query.get('farm')),
      );
      setFarmName(farms?.name as string);
      const menu = getMenu(farms as IBudgetPayload);
      setLines(menu);
      foundItem = menu.find(item => item.label === 'Overall budget');
    } else {
      let foundedFarm: IBudgetPayload = {};
      budgetStore?.map(farm => {
        const foundedLine = farm?.lines?.find(
          line => line.id === Number(query.get('line')),
        );
        if (foundedLine) {
          foundedFarm = farm;
        }
        return null;
      });
      setFarmName(foundedFarm?.name as string);
      const menu = getMenu(foundedFarm);
      setLines(menu);
      foundItem = menu.find(
        item =>
          item.apiValue === query.get('line') &&
          item.label !== 'Overall budget',
      );
    }
    setDefaultDropdown(foundItem?.value as string);
  };

  useEffect(() => {
    getDataForMenu();
  }, [budgetStore]);

  const handleOnLine = (event: any) => {
    const itemSelected = lines.find(item => item.value === event.value);
    if (event.children === 'Overall budget') {
      history.push(`/budget/info?farm=${itemSelected?.apiValue}`);
    } else {
      history.push(`/budget/info?line=${itemSelected?.apiValue}`);
    }
    setDefaultDropdown(itemSelected?.value as string);
  };

  const importBudget = async (type: string, file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    let url = '';
    if (query.get('farm')) {
      formData.append('farm_id', query.get('farm')!);
      url = 'api/farm/budgets/import-farm-expenses-from-excel';
    } else if (query.get('line')) {
      formData.append('line_budget_id', `${budgetInfoStore[1].budget_id!}`);
      url = 'api/farm/line/budgets/import-line-expenses-from-excel';
    }

    formData.append('expenseType', type);
    const responseData = await sendMultipart(
      formData,
      'POST',
      url,
      true,
      auth.access_token,
    );
    if (responseData?.status === 'Success') {
      setImportExpenseResult({
        visible: true,
        success: true,
        message: `Import Expenses success! ${responseData.count} rows are imported.`,
      });
      getData();
    } else if (responseData?.status === 'Fail') {
      setImportExpenseResult({
        visible: true,
        success: false,
        message: responseData.message,
      });
    } else {
      setImportExpenseResult({
        visible: true,
        success: false,
        message:
          'There was an error while uploading. Please refresh page and try uploading again',
      });
    }
    setTimeout(() => {
      setImportExpenseResult({
        visible: false,
        success: true,
        message: '',
      });
    }, 3000);
    setImportModalVisibile(!importModalVisibile);
  };

  useEffect(() => {
    getData();
  }, [year, defaultDropdown]);

  return (
    <div className='budget bg-secondary min-height'>
      {!isNotFound ? (
        <div className='container'>
          <div
            className={
              width > 460
                ? 'd-flex pt-28 pb-24 pr-15 pl-21 align-items-center justify-content-between'
                : 'pt-16'
            }
          >
            <Title size={5} color='black-3' align='default' fontWeight={700}>
              {farmName}
            </Title>
            <ButtonArrows
              disabledPrev={isSpinner}
              disabledNext={year === new Date().getFullYear() || isSpinner}
              year={year}
              onChange={value => setYear(value)}
            />
          </div>
          <div className={width > 460 ? 'pl-15 pr-15 pb-34' : 'pb-70'}>
            <div className='budget-line d-flex justify-content-between align-items-center'>
              <Dropdown
                className='dropdown-budget'
                placeholder='Overall budget'
                onChange={(select, event) => handleOnLine(event)}
                label=''
                options={lines}
                defaultValue={defaultDropdown}
              />
              <div className='d-flex flex-direction-row align-items-center'>
                {query.get('line') && (
                  <>
                    <Button
                      className={width > 460 ? '' : 'mb-12 mt-12 mr-12 ml-12'}
                      color='blue'
                      size={4}
                      width={width > 460 ? 'small' : 'wide'}
                      type='bordered'
                      onClick={() => setIsModalVisibile(!isModalVisibile)}
                    >
                      Add expenses
                    </Button>
                    <ModalExpenses
                      onConfirm={() => setIsModalVisibile(false)}
                      visible={isModalVisibile}
                      onCancel={() => setIsModalVisibile(false)}
                    />
                  </>
                )}
                {query.get('farm') && (
                  <>
                    <Button
                      className={width > 460 ? '' : 'mb-12 mt-12 mr-12 ml-12'}
                      color='blue'
                      size={4}
                      width={width > 460 ? 'small' : 'wide'}
                      type='bordered'
                      onClick={() => setIsModalVisibile(!isModalVisibile)}
                    >
                      Add expenses
                    </Button>
                    <FarmModalExpenses
                      farmId={query.get('farm')}
                      onConfirm={() => setIsModalVisibile(false)}
                      visible={isModalVisibile}
                      onCancel={() => setIsModalVisibile(false)}
                    />
                  </>
                )}
                <ExportBudgetTable dataLine={data || []} />
                <button
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setImportModalVisibile(!importModalVisibile)}
                >
                  <UploadIcon />
                </button>
              </div>
            </div>
            {!isSpinner ? (
              <OverallTable
                dataLine={data}
                type={query.get('farm') ? 'farm' : 'line'}
              />
            ) : (
              <div className='mt-20'>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      ) : (
        <NotFound />
      )}

      {budgetMessageStore.message && (
        <Feedback
          message={budgetMessageStore.message}
          type={
            budgetMessageStore.message === 'Success' ||
            budgetMessageStore.message === 'success'
              ? 'success'
              : 'error'
          }
          theme='light'
          isGlobal
        />
      )}
      {importExpenseResult.visible && (
        <Feedback
          message={importExpenseResult.message}
          type={importExpenseResult.success ? 'success' : 'error'}
          theme='light'
          isGlobal
        />
      )}
      <ImportBudget
        onImport={importBudget}
        onCancel={() => setImportModalVisibile(false)}
        visible={importModalVisibile}
      />
    </div>
  );
};

export default BudgetLine;
