import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Button,
  PlusIcon,
  InputModal,
  Paragrapgh,
  Input,
  MinusIcon,
  Title,
  Feedback,
  Spinner,
} from '../shared';

import './styles.scss';
import { IRootState } from '../../store/rootReducer';
import { IFarmState } from '../../store/farms/farms.type';
import { useWidth } from '../../util/useWidth';

interface IOwnProps {
  onCancel: () => void;
  onSubscribe: (qty: number, coupon: string) => void;
  subscriptionStatus: any;
  visible: boolean;
  title: string;
  textButton: string;
  disabled?: boolean;
}
const SubscriptionModal: FC<IOwnProps> = ({
  textButton,
  title,
  onCancel,
  onSubscribe,
  visible,
  disabled,
  subscriptionStatus,
}) => {
  const width = useWidth();
  const [value, setValue] = useState('0');
  const [isCoupon, setIsCoupon] = useState(false);
  const [couponValue, setCouponValue] = useState('');
  const [isSuccessApply, setIsSuccessApply] = useState(false);
  const farmsData = useSelector<IRootState, IFarmState['farmsData']>(
    state => state.farms.farmsData,
  );

  useEffect(() => {
    setValue(farmsData.length.toString());
  }, []);

  const handleOnApply = () => {
    setIsSuccessApply(true);
  };

  const clearState = () => {
    setIsCoupon(false);
    setIsSuccessApply(false);
    setValue(farmsData.length.toString());
    setCouponValue('');
  };

  const handleOnCancel = () => {
    clearState();
    onCancel();
  };

  const handleOnConfirm = async () => {
    await onSubscribe(Number(value), isSuccessApply ? couponValue : 'none');
    clearState();
  };

  return (
    <InputModal
      visible={visible}
      onCancel={handleOnCancel}
      title={title}
      type='confirm'
      confirmNameBtn={textButton}
      onConfirm={handleOnConfirm}
      disabled={disabled}
    >
      <Feedback
        className='mt-8 mb-16'
        isWithoutClosable
        theme='light'
        message={
          <>
            The plan will switch immediately, but no fees will be required until
            <span className='font-weight-500'>
              {' '}
              {subscriptionStatus.plan_data?.expire_at}
            </span>
          </>
        }
        type='info'
      />
      <div
        className={
          width > 520
            ? 'line-bottom mt-8 pb-20 d-flex align-items-center justify-content-between'
            : 'line-bottom mt-8 pb-20'
        }
      >
        <Paragrapgh
          className={width > 520 ? '' : 'pb-8'}
          size={1}
          color='black'
          align='default'
          fontWeight={400}
        >
          Number of farms
        </Paragrapgh>
        <div className='d-flex'>
          <Button
            color='blue'
            className='bg-gray'
            size={0}
            width='default'
            type='default'
            iconOnly
            disabled={Number(value) === farmsData.length}
            onClick={() =>
              setValue(
                Number(value) - 1 < 0 ? '0' : (Number(value) - 1).toString(),
              )
            }
          >
            <MinusIcon />
          </Button>
          <div className='input-number'>
            <Input
              className='tx-center'
              onChange={e =>
                setValue(Number(e.target.value) < 0 ? '0' : e.target.value)
              }
              type='text'
              readonly
              value={value}
              label=''
              placeholder='0'
            />
          </div>
          <Button
            color='blue'
            className='bg-gray'
            size={0}
            width='default'
            type='default'
            iconOnly
            onClick={() => setValue((Number(value) + 1).toString())}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
      {subscriptionStatus?.status === 'trial' &&
        !subscriptionStatus.plan_data?.coupon_used &&
        !isCoupon && (
          <div className='line-bottom d-flex pb-20 pt-18 justify-content-center'>
            <Paragrapgh
              size={1}
              fontWeight={500}
              color='default'
              align='default'
            >
              Have a coupon?{' '}
              <span
                className='pointer focus-none tx-color-2 font-weight-400'
                onKeyDown={() => undefined}
                onClick={() => setIsCoupon(true)}
                role='button'
                tabIndex={0}
              >
                Enter
              </span>
            </Paragrapgh>
          </div>
        )}
      {subscriptionStatus?.status === 'trial' &&
        !subscriptionStatus.plan_data?.coupon_used &&
        isCoupon && (
          <div className='line-bottom pb-20 pt-18'>
            <div
              className={
                width > 520
                  ? 'd-flex align-items-center justify-content-between'
                  : ''
              }
            >
              <Paragrapgh
                className={width > 520 ? '' : 'pb-4'}
                size={1}
                color='black'
                align='default'
                fontWeight={400}
              >
                Coupon
              </Paragrapgh>
              <div className={width > 520 ? 'd-flex' : ''}>
                <Input
                  onChange={e => setCouponValue(e.target.value)}
                  type='text'
                  className='coupon-input'
                  value={couponValue}
                  label=''
                  placeholder=''
                  required
                  readonly={isSuccessApply}
                />
                <Button
                  className={width > 520 ? 'ml-8' : 'mt-8'}
                  color='blue'
                  size={1}
                  width={width > 520 ? 'small' : 'wide'}
                  type='bordered'
                  onClick={handleOnApply}
                  disabled={isSuccessApply || couponValue === ''}
                >
                  Apply
                </Button>
              </div>
            </div>
            {/* {isSuccessApply && (
              <Feedback
                className='mt-12'
                isWithoutClosable
                theme='light'
                message={
                  <>
                    You have activated a coupon for 3 free months. The coupon is
                    valid from the next month and will be valid until{' '}
                    <span className='font-weight-500'> August 01, 2021</span>
                  </>
                }
                type='success'
              />
            )} */}
          </div>
        )}
      <div className='d-flex mb-24 mt-18 justify-content-between'>
        <Paragrapgh size={1} fontWeight={400} color='default' align='default'>
          Total:
        </Paragrapgh>
        <div>
          <div className='d-flex justify-content-end align-items-end'>
            <Title size={5} fontWeight={500} color='default' align='default'>
              ${Number(value) * 99}
            </Title>
            <Paragrapgh
              className='mb-6'
              size={2}
              fontWeight={400}
              color='black'
              align='default'
            >
              /month
            </Paragrapgh>
          </div>
          <Paragrapgh size={2} fontWeight={400} color='black-2' align='default'>
            $99 per farm x {Number(value)} farms
          </Paragrapgh>
        </div>
      </div>
      {disabled && <Spinner />}
    </InputModal>
  );
};

export default SubscriptionModal;
