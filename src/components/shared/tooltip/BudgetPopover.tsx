import React, { FC, ReactNode, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Popover } from 'antd';
import moment from 'moment';

import './styles.scss';
import Button from '../button/Button';
import { Input, Dropdown, Datepicker, CheckboxButton } from '../index';
import {
  IUpdateBudget,
  IAccountData,
  IContactData,
} from '../../../types/apiDataTypes';

import { IMainList } from '../../../types/basicComponentsTypes';
import { IRootState } from '../../../store/rootReducer';
import { IUtilState } from '../../../store/utils/utils.type';
import { AuthState } from '../../../store/auth/auth.type';
import {
  updateBudgetValue,
  updateFarmBudgetValue,
} from '../../../store/budget/budget.action';

interface IOwnProps {
  children: ReactNode;
  className?: string;
  value: string;
  data: any;
  type: 'budgeted' | 'actual';
}

const BudgetTooltip: FC<IOwnProps> = ({
  type,
  className,
  children,
  value,
  data,
}) => {
  const query = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const history = useHistory();

  const oldData = data.rdata ? JSON.parse(data.rdata) : null;
  const [from, setFrom] = useState(oldData ? oldData.from : '');
  const [expense_date, setExpenseDate] = useState(Number(data.expense_date));
  const [date, setDate] = useState(
    oldData ? oldData.date : moment().toDate().getTime(),
  );
  const [due_date, setDueDate] = useState(
    oldData ? oldData.due_date : moment().toDate().getTime(),
  );
  const [account, setAccount] = useState(oldData ? oldData.account : '');
  const [to_xero, setToXero] = useState(true);

  const [count, setCount] = useState('');
  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);

  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const contactData = useSelector<IRootState, IUtilState['xero_contacts']>(
    state => state.utils.xero_contacts,
  );
  const accountData = useSelector<IRootState, IUtilState['xero_accounts']>(
    state => state.utils.xero_accounts,
  );

  const onConfirm = () => {
    let sendData: IUpdateBudget = {};
    if (data.data_row === 'price') {
      sendData = {
        farm_id: data.farm_id,
        expenses_id: data.expenses_id,
        budget_id: data.budget_id,
        line_id: Number(query.get('line')),
        expenses_name: data.name,
        expense_date: expense_date.toString(),
        data_row: `${data.data_row}${
          type === 'budgeted' ? '_budget' : '_actual'
        }`,
        type: `${type === 'budgeted' ? 'b' : 'a'}`,
        value: count,
        comment,
        date: auth.xero ? date : 0,
        due_date: auth.xero ? due_date : 0,
        account: auth.xero ? account : '',
        from: auth.xero ? from : '',
        to_xero: auth.xero ? to_xero : false,
      };
    } else {
      sendData = {
        budget_id: data.budget_id,
        farm_id: data.farm_id,
        line_id: Number(query.get('line')),
        data_row: `${data.data_row}${type === 'budgeted' ? '' : '_actual'}`,
        type: `${type === 'budgeted' ? 'b' : 'a'}`,
        value: count,
        comment,
      };

      if (data.data_row === 'length') {
        sendData.data_row = `${data.data_row}${
          type === 'budgeted' ? '_budget' : '_actual'
        }`;
      }
    }

    if (data.budget_id === -1) {
      dispatch(
        updateFarmBudgetValue(
          sendData,
          data.data_row === 'price' ? 'price' : 'budget-part',
          history,
        ),
      );
    } else {
      dispatch(
        updateBudgetValue(
          sendData,
          data.data_row === 'price' ? 'price' : 'budget-part',
          history,
        ),
      );
    }
  };

  return (
    <>
      {type === 'actual' &&
        data.data_row === 'price' &&
        auth.xero &&
        data.budget_id !== -1 && (
          <Popover
            visible={visible}
            onVisibleChange={(v: boolean) => setVisible(v)}
            overlayClassName={className}
            placement='bottomLeft'
            content={
              <div>
                <Dropdown
                  className='mb-16 w-100'
                  placeholder='from'
                  onChange={val => setFrom(val)}
                  label='From'
                  options={contactData?.map(
                    (contact: IContactData) =>
                      ({
                        value: contact.ContactID,
                        label: contact.Name,
                        id: contact.ContactID,
                      } as IMainList),
                  )}
                  defaultValue={from}
                />
                <Datepicker
                  label='Expense Date'
                  defaultValue={expense_date}
                  onChange={e =>
                    setExpenseDate(
                      e ? e!.toDate().getTime() : moment().toDate().getTime(),
                    )
                  }
                  required
                />
                <Datepicker
                  label='Date'
                  className='mb-16'
                  defaultValue={date}
                  onChange={e => setDate(e!.toDate().getTime())}
                  required
                />
                <Datepicker
                  label='DueDate'
                  className='mb-16'
                  defaultValue={due_date}
                  onChange={e => setDueDate(e!.toDate().getTime())}
                  required
                />
                <Dropdown
                  className='mb-16 w-100'
                  placeholder='account'
                  onChange={val => setAccount(val)}
                  label='Account'
                  options={accountData?.map(
                    (act: IAccountData) =>
                      ({
                        value: act.Code,
                        label: act.Name,
                        id: act.Code,
                      } as IMainList),
                  )}
                  defaultValue={account}
                />
                <Input
                  onChange={e =>
                    setCount(Number(e.target.value) > -1 ? e.target.value : '0')
                  }
                  type='number'
                  value={count}
                  className='mb-16'
                  label='Value'
                  placeholder={value}
                />
                <Input
                  onChange={e => setComment(e.target.value)}
                  type='textarea'
                  value={comment}
                  label='Comment'
                  className='mb-20'
                  placeholder=''
                  isOptional
                />
                <CheckboxButton
                  className='mb-16'
                  label='Send to Xero?'
                  checked={to_xero}
                  onChange={e => setToXero(e.target.checked)}
                />
                <div className='d-flex justify-content-end align-items-center'>
                  <Button
                    width='small'
                    size={1}
                    type='transparent'
                    color='blue'
                    onClick={() => setVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    width='small'
                    size={3}
                    type='fill'
                    color='green'
                    className='ml-16'
                    onClick={onConfirm}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            }
            trigger='click'
          >
            {children}
          </Popover>
        )}
      {type === 'actual' &&
        data.data_row === 'price' &&
        (!auth.xero || data.budget_id === -1) && (
          <Popover
            visible={visible}
            onVisibleChange={(v: boolean) => setVisible(v)}
            overlayClassName={className}
            placement='bottomLeft'
            content={
              <div>
                <Input
                  onChange={e =>
                    setCount(Number(e.target.value) > -1 ? e.target.value : '0')
                  }
                  type='number'
                  value={count}
                  className='mb-16'
                  label='Value'
                  placeholder={value}
                />
                <Datepicker
                  label='Expense Date'
                  defaultValue={expense_date}
                  onChange={e =>
                    setExpenseDate(
                      e ? e!.toDate().getTime() : moment().toDate().getTime(),
                    )
                  }
                  required
                />
                <Input
                  onChange={e => setComment(e.target.value)}
                  type='textarea'
                  value={comment}
                  label='Comment'
                  className='mb-20'
                  placeholder=''
                  isOptional
                />
                <div className='d-flex justify-content-end align-items-center'>
                  <Button
                    width='small'
                    size={1}
                    type='transparent'
                    color='blue'
                    onClick={() => setVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    width='small'
                    size={3}
                    type='fill'
                    color='green'
                    className='ml-16'
                    onClick={onConfirm}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            }
            trigger='click'
          >
            {children}
          </Popover>
        )}
      {(type !== 'actual' || data.data_row !== 'price') && (
        <Popover
          visible={visible}
          onVisibleChange={(v: boolean) => setVisible(v)}
          overlayClassName={className}
          placement='bottomLeft'
          content={
            <div>
              <Input
                onChange={e =>
                  setCount(Number(e.target.value) > -1 ? e.target.value : '0')
                }
                type='number'
                value={count}
                className='mb-16'
                label='Value'
                placeholder={value}
              />
              <Datepicker
                label='Expense Date'
                defaultValue={expense_date}
                onChange={e =>
                  setExpenseDate(
                    e ? e!.toDate().getTime() : moment().toDate().getTime(),
                  )
                }
                required
              />
              <Input
                onChange={e => setComment(e.target.value)}
                type='textarea'
                value={comment}
                label='Comment'
                className='mb-20'
                placeholder=''
                isOptional
              />
              <div className='d-flex justify-content-end align-items-center'>
                <Button
                  width='small'
                  size={1}
                  type='transparent'
                  color='blue'
                  onClick={() => setVisible(false)}
                >
                  Cancel
                </Button>
                <Button
                  width='small'
                  size={3}
                  type='fill'
                  color='green'
                  className='ml-16'
                  onClick={onConfirm}
                >
                  Submit
                </Button>
              </div>
            </div>
          }
          trigger='click'
        >
          {children}
        </Popover>
      )}
    </>
  );
};

export default BudgetTooltip;
