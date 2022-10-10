import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Radio } from 'antd';
import moment from 'moment';

import randomKey from '../../util/randomKey';
import { IRootState } from '../../store/rootReducer';
import { IUtilState, IUtilData } from '../../store/utils/utils.type';
import { getUtilData } from '../../store/utils/utils.actions';
import { AuthState } from '../../store/auth/auth.type';
import { IAccountData, IContactData } from '../../types/apiDataTypes';

import {
  Button,
  CloseIcon,
  DollarIcon,
  Dropdown,
  Input,
  InputModal,
  PlusIcon,
  RadioButton,
  Spinner,
  Datepicker,
  CheckboxButton,
} from '../shared';

import { IMainList, IModalBudget } from '../../types/basicComponentsTypes';
import { createBudget } from '../../store/budget/budget.action';
import { useWidth } from '../../util/useWidth';
import { composeApi } from '../../apis/compose';

interface IOwnProps {
  onCancel: (type: string) => void;
  onConfirm: () => void;
  visible: boolean;
  className?: string;
  type: string;
  paramId: number;
  options?: IMainList[];
}

const ModalAddExpenses: FC<IOwnProps> = ({
  type,
  visible,
  onCancel,
  className,
  onConfirm,
  paramId,
}) => {
  const width = useWidth();
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [contactData, setContactData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [expenses, setExpenses] = useState<IModalBudget[]>([
    {
      id: randomKey(),
      expenses_name: '',
      price_budget: '',
      line_budget_id: paramId,
      type: 'select',
      budget_type: 'a',
      to_xero: true,
      date: moment().toDate().getTime(),
      due_date: moment().toDate().getTime(),
      expense_date: moment().toDate().getTime(),
    },
  ]);

  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  const seedData = useSelector<IRootState, IUtilState['seeds']>(
    state => state.utils.seeds,
  );

  const maintenanceData = useSelector<IRootState, IUtilState['maintenances']>(
    state => state.utils.maintenances,
  );

  useEffect(() => {
    dispatch(getUtilData('all', history));

    composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/xero-data/contacts',
        requireAuth: true,
      },
      dispatch,
      auth,
      history,
    ).then(responseData => {
      if (responseData?.message === 'success') {
        setContactData(responseData.data);
      }
    });

    composeApi(
      {
        data: {
          scope: 'EXPENSE, ASSET, LIABILITY, EQUITY, REVENUE',
        },
        method: 'POST',
        url: 'api/xero-data/accounts',
        requireAuth: true,
      },
      dispatch,
      auth,
      history,
    ).then(responseData => {
      if (responseData?.message === 'success') {
        setAccountData(responseData.data);
      }
    });
  }, []);

  const handleOnConfirm = async () => {
    const newExpenses = expenses.map(item => {
      return {
        expenses_name: item.expenses_name,
        line_budget_id: Number(item.line_budget_id),
        type: type === 'seed' ? 's' : 'm',
        price_actual: item.budget_type === 'a' ? Number(item.price_budget) : 0,
        price_budget: item.budget_type === 'b' ? Number(item.price_budget) : 0,
        budget_type: item.budget_type,
        from: item.budget_type === 'a' && auth.xero ? item.from : '',
        date: item.budget_type === 'a' && auth.xero ? item.date : 0,
        due_date: item.budget_type === 'a' && auth.xero ? item.due_date : 0,
        expense_date: item.expense_date
          ? item.expense_date
          : moment().toDate().getTime(),
        account: item.budget_type === 'a' && auth.xero ? item.account : '',
        to_xero: auth.xero ? item.to_xero : false,
      };
    });

    setLoading(true);
    await dispatch(createBudget({ expenses: newExpenses }, history));

    onConfirm();
    setLoading(false);
    setExpenses([
      {
        id: randomKey(),
        expenses_name: '',
        price_budget: '',
        line_budget_id: paramId,
        type: 'select',
        budget_type: 'a',
        to_xero: true,
        date: moment().toDate().getTime(),
        due_date: moment().toDate().getTime(),
        expense_date: moment().toDate().getTime(),
      },
    ]);
  };

  const handleOnAddLine = () => {
    setExpenses([
      ...expenses,
      {
        id: randomKey(),
        expenses_name: '',
        price_budget: '',
        line_budget_id: paramId,
        type: 'select',
        budget_type: 'a',
        to_xero: true,
        date: moment().toDate().getTime(),
        due_date: moment().toDate().getTime(),
        expense_date: moment().toDate().getTime(),
      },
    ]);
    setDisabled(true);
  };

  const handleOnAddLineCustom = () => {
    setExpenses([
      ...expenses,
      {
        id: randomKey(),
        expenses_name: '',
        price_budget: '',
        line_budget_id: paramId,
        type: 'text',
        budget_type: 'a',
        to_xero: true,
        date: moment().toDate().getTime(),
        due_date: moment().toDate().getTime(),
        expense_date: moment().toDate().getTime(),
      },
    ]);
    setDisabled(true);
  };

  const handleOnPrice = (value: string, id: string) => {
    setExpenses(
      expenses.map(item =>
        item.id === id
          ? { ...item, price_budget: Number(value) > -1 ? value : '0' }
          : { ...item },
      ),
    );
  };

  const handleOnDate = (value: number, id: string) => {
    setExpenses(
      expenses.map(item =>
        item.id === id ? { ...item, date: value } : { ...item },
      ),
    );
  };

  const handleOnExpenseDate = (value: number, id: string) => {
    setExpenses(
      expenses.map(item =>
        item.id === id ? { ...item, expense_date: value } : { ...item },
      ),
    );
  };

  const handleOnDueDate = (value: number, id: string) => {
    setExpenses(
      expenses.map(item =>
        item.id === id ? { ...item, due_date: value } : { ...item },
      ),
    );
  };

  const handleToXero = (value: boolean, id: string) => {
    setExpenses(
      expenses.map(item =>
        item.id === id ? { ...item, to_xero: value } : { ...item },
      ),
    );
  };

  const handleOnFrom = (value: string, id: string) => {
    let empty = false;

    const newExpenses: IModalBudget[] = expenses.map(item => {
      if (item.id === id) {
        if (item.budget_type === 'a' && !item.account) empty = true;
        if (item.expenses_name === '') empty = true;
        return { ...item, from: value };
      }
      if (item.budget_type === 'a' && (!item.from || !item.account))
        empty = true;
      if (item.expenses_name === '') empty = true;
      return { ...item };
    });

    setDisabled(empty);
    setExpenses(newExpenses);
  };

  const handleOnAccount = (value: string, id: string) => {
    let empty = false;

    const newExpenses: IModalBudget[] = expenses.map(item => {
      if (item.id === id) {
        if (item.budget_type === 'a' && !item.from) empty = true;
        if (item.expenses_name === '') empty = true;
        return { ...item, account: value };
      }
      if (item.budget_type === 'a' && (!item.from || !item.account))
        empty = true;
      if (item.expenses_name === '') empty = true;
      return { ...item };
    });

    setDisabled(empty);
    setExpenses(newExpenses);
  };

  const handleOnBudgetType = (value: string, id: string) => {
    let empty = false;

    const newExpenses: IModalBudget[] = expenses.map(item => {
      if (item.id === id) {
        if (item.expenses_name === '') empty = true;
        if (value === 'a' && (!item.from || !item.account) && auth.xero)
          empty = true;
        return { ...item, budget_type: value };
      }
      if (
        item.budget_type === 'a' &&
        (!item.from || !item.account) &&
        auth.xero
      )
        empty = true;
      if (item.expenses_name === '') empty = true;
      return { ...item };
    });

    setDisabled(empty);
    setExpenses(newExpenses);
  };

  const handleOnName = (value: string, id: string) => {
    let empty = false;

    const newExpenses: IModalBudget[] = expenses.map(item => {
      if (item.id === id) {
        if (value === '') empty = true;
        if (
          item.budget_type === 'a' &&
          (!item.from || !item.account) &&
          auth.xero
        )
          empty = true;
        return { ...item, expenses_name: value };
      }
      if (
        item.budget_type === 'a' &&
        (!item.from || !item.account) &&
        auth.xero
      )
        empty = true;
      if (item.expenses_name === '') empty = true;
      return { ...item };
    });

    setDisabled(empty);
    setExpenses(newExpenses);
  };

  const handleOnCancel = (defaultType: string) => {
    setExpenses([
      {
        id: randomKey(),
        expenses_name: '',
        price_budget: '',
        line_budget_id: paramId,
        type: 'select',
        budget_type: 'a',
        to_xero: true,
        date: moment().toDate().getTime(),
        due_date: moment().toDate().getTime(),
        expense_date: moment().toDate().getTime(),
      },
    ]);
    onCancel(defaultType);
  };

  const handleOnDeleteLine = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <InputModal
          visible={visible}
          onCancel={() => handleOnCancel(type)}
          title={
            type === 'seed'
              ? 'Add seeding expenses'
              : 'Add maintenance expenses'
          }
          type='confirm'
          onConfirm={handleOnConfirm}
          className={className}
          disabled={disabled}
          modalWidth={920}
        >
          <div>
            {expenses.map((expense, index) => (
              <div
                className='budget__maintenance budget__maintenance--modal pos-relative'
                key={expense.id}
              >
                <div className='mb-12 d-flex align-items-center justify-content-between'>
                  <div className='budget__wrapper mr-16'>
                    {type === 'seed' && expense.type === 'select' && (
                      <Dropdown
                        className='mr-16 w-100'
                        placeholder='seed name'
                        onChange={value => handleOnName(value, expense.id)}
                        label='Seed name'
                        options={seedData.map(
                          (seed: IUtilData) =>
                            ({
                              value: seed.name,
                              label: seed.name,
                              id: seed.id,
                            } as IMainList),
                        )}
                        defaultValue={
                          expense.expenses_name
                            ? expense.expenses_name
                            : undefined
                        }
                      />
                    )}
                    {type === 'seed' && expense.type === 'text' && (
                      <Input
                        type='text'
                        onChange={e => handleOnName(e.target.value, expense.id)}
                        className='mr-16 w-100'
                        value={expense.expenses_name}
                        label='Seed name'
                        placeholder='seed name'
                      />
                    )}
                    {type !== 'seed' && expense.type === 'select' && (
                      <Dropdown
                        className='mr-16 w-100'
                        placeholder='maintenance name'
                        onChange={value => handleOnName(value, expense.id)}
                        label='Maintenance name'
                        options={
                          maintenanceData &&
                          maintenanceData.map(
                            (maintenance: IUtilData) =>
                              ({
                                value: maintenance.name,
                                label: maintenance.name,
                                id: maintenance.id,
                              } as IMainList),
                          )
                        }
                        defaultValue={
                          expense.expenses_name
                            ? expense.expenses_name
                            : undefined
                        }
                      />
                    )}
                    {type !== 'seed' && expense.type === 'text' && (
                      <Input
                        className='mr-16'
                        type='text'
                        value={expense.expenses_name}
                        placeholder='new maintenance'
                        onChange={e => handleOnName(e.target.value, expense.id)}
                        label='Maintenance name'
                      />
                    )}
                  </div>
                  <div className='budget__price-wrapper mr-16'>
                    <Input
                      type='number'
                      onChange={e => handleOnPrice(e.target.value, expense.id)}
                      value={expense.price_budget.toString()}
                      unit={<DollarIcon />}
                      label='Price'
                      placeholder='0'
                    />
                  </div>
                  <Datepicker
                    label='Expense Date'
                    defaultValue={expense.expense_date}
                    onChange={e =>
                      handleOnExpenseDate(
                        e ? e!.toDate().getTime() : moment().toDate().getTime(),
                        expense.id,
                      )
                    }
                    required
                  />
                  <span
                    className='budget__close-icon budget__close-icon--modal'
                    onKeyDown={() => undefined}
                    onClick={() => handleOnDeleteLine(expense.id)}
                    role='button'
                    tabIndex={0}
                  >
                    <CloseIcon />
                  </span>
                </div>
                <div
                  className='mb-12 d-flex align-items-end justify-content-between'
                  style={{
                    flexDirection: 'column',
                  }}
                >
                  <div>
                    <Radio.Group
                      className='d-flex'
                      onChange={e =>
                        handleOnBudgetType(e.target.value, expense.id)
                      }
                      value={expense.budget_type}
                    >
                      <RadioButton label='Budgeted' value='b' />
                      <RadioButton className='ml-34' label='Actual' value='a' />
                    </Radio.Group>
                  </div>
                </div>
                {expense.budget_type === 'a' && auth.xero && (
                  <div className='mb-12 d-flex align-items-center justify-content-between'>
                    <Dropdown
                      className='mr-16 w-30'
                      placeholder='from'
                      onChange={value => handleOnFrom(value, expense.id)}
                      label='From'
                      options={contactData.map(
                        (contact: IContactData) =>
                          ({
                            value: contact.ContactID,
                            label: contact.Name,
                            id: contact.ContactID,
                          } as IMainList),
                      )}
                      defaultValue={expense.from ? expense.from : undefined}
                    />
                    <div className='w-20 mr-16'>
                      <Datepicker
                        label='Date'
                        defaultValue={expense.date}
                        onChange={e =>
                          handleOnDate(
                            e
                              ? e!.toDate().getTime()
                              : moment().toDate().getTime(),
                            expense.id,
                          )
                        }
                        required
                      />
                    </div>
                    <div className='w-20 mr-16'>
                      <Datepicker
                        label='Due Date'
                        defaultValue={expense.due_date}
                        onChange={e =>
                          handleOnDueDate(
                            e
                              ? e!.toDate().getTime()
                              : moment().toDate().getTime(),
                            expense.id,
                          )
                        }
                        required
                      />
                    </div>
                    <Dropdown
                      className='mr-16 w-30'
                      placeholder='account'
                      onChange={value => handleOnAccount(value, expense.id)}
                      label='Account'
                      options={accountData.map(
                        (contact: IAccountData) =>
                          ({
                            value: contact.Code,
                            label: contact.Name,
                            id: contact.Code,
                          } as IMainList),
                      )}
                      defaultValue={
                        expense.account ? expense.account : undefined
                      }
                    />
                  </div>
                )}
                {expense.budget_type === 'a' && auth.xero && (
                  <div className='mb-12 d-flex align-items-center justify-content-end'>
                    <CheckboxButton
                      label='Send to Xero?'
                      checked={expense.to_xero}
                      onChange={e => handleToXero(e.target.checked, expense.id)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className='d-flex'>
            <Button
              className={width > 768 ? '' : 'mb-24'}
              color='blue'
              size={width > 768 ? 0 : 2}
              width={width > 768 ? 'default' : 'wide'}
              type='bordered'
              isNoneBorder={width > 768}
              iconLeft
              onClick={handleOnAddLine}
            >
              <span className='mr-4 ml-6 font-size-0'>
                <PlusIcon />
              </span>
              <span>Add</span>
            </Button>
            <Button
              className={width > 768 ? '' : 'mb-24'}
              color='blue'
              size={width > 768 ? 0 : 2}
              width={width > 768 ? 'default' : 'wide'}
              type='bordered'
              isNoneBorder={width > 768}
              iconLeft
              onClick={handleOnAddLineCustom}
            >
              <span className='mr-4 ml-6 font-size-0'>
                <PlusIcon />
              </span>
              <span>Add Custom</span>
            </Button>
          </div>
        </InputModal>
      )}
    </>
  );
};

export default ModalAddExpenses;
