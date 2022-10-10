import React, { useState, useEffect, FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Feedback,
  Subtitle,
  Title,
  ModalComponent,
  Spinner,
} from '../components/shared';
import Plan from '../components/subscription/Plan';
import CreditCard from '../components/subscription/CreditCard';
import Transaction from '../components/subscription/Transaction';
import CreditCardModal from '../components/subscription/CreditCardModal';
import SubscriptionModal from '../components/subscription/SubscriptionModal';

import { composeApi } from '../apis/compose';
import { downloadInvoice } from '../apis/index';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { IAlertInfo } from '../types/basicComponentsTypes';
import {
  ICardDetails,
  ISubscriptionState,
  IInvoice,
} from '../store/subscription/subscription.type';
import { setSubscriptionStatus } from '../store/subscription/subscription.actions';

const APPLY_SUBSCRIBE = 'Please Add Payment Method';
const CANCEL_SUBSCRIBE = 'Are you really going to unsubscribe?';
const PAYMENT_INACTIVE =
  'The payment attempt failed because additional action is required before it can be completed.';

const Subscription: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubModal, setIsSubModal] = useState(false);
  const [isCardModal, setIsCardModal] = useState(false);
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [paymentInActive, setPaymentInActive] = useState(false);
  const [alertInfo, setAlertInfo] = useState<IAlertInfo>({
    type: '',
    title: '',
    text: '',
    buttonText: '',
  });
  const [cardDetails, setCardDetails] = useState<ICardDetails | null>(null);

  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const subscriptionStatus = useSelector<IRootState, ISubscriptionState>(
    state => state.subscription,
  );
  const farmsCount = useSelector<IRootState, number>(
    state => state.farms.farmsData?.length,
  );

  const getSubscriptionStats = async () => {
    const responseData: ISubscriptionState = await composeApi(
      {
        data: {},
        method: 'GET',
        url: 'api/subscription/get-subscription-status',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    const pm = responseData?.payment_method;
    if (pm) {
      setCardDetails({
        cvv: '',
        number: pm.last4,
        brand: pm.brand,
        date:
          pm.month < 10
            ? `0${pm.month} / ${pm.year % 100}`
            : `${pm.month} / ${pm.year}`,
      });
    } else {
      setCardDetails(null);
    }
    if (responseData?.status === 'incomplete_payment') {
      setIsLoaded(false);
      setPaymentInActive(true);
      setTimeout(() => window.location.replace(responseData.url!), 3000);
      return;
    }
    dispatch(setSubscriptionStatus(responseData));
    setIsLoaded(true);
  };

  const showAlertModal = (type: string, msg?: string) => {
    if (type === 'input_card') {
      setAlertInfo({
        type: 'warning',
        title: 'Warning',
        buttonText: 'OK',
        text: APPLY_SUBSCRIBE,
      });
      setIsAlertModal(true);
    }
    if (type === 'cancel_subscribe') {
      setAlertInfo({
        type: 'warning',
        title: 'Warning',
        buttonText: 'Confirm',
        text: CANCEL_SUBSCRIBE,
      });
      setIsAlertModal(true);
    }
    if (type === 'show_msg') {
      setAlertInfo({
        type: 'info',
        title: 'Note',
        buttonText: 'OK',
        hideCancelBtn: true,
        text: msg!,
      });
      setIsAlertModal(true);
    }
  };

  const onSubscribe = async (qty: number) => {
    setIsSubscribing(true);
    const responseData = await composeApi(
      {
        data: {
          card_number: cardDetails?.number,
          cvc: cardDetails?.cvv,
          plan_id: '1',
          expiration_month: cardDetails?.date.slice(0, 2),
          expiration_year: cardDetails?.date.slice(-2),
          quantity: qty,
        },
        method: 'POST',
        url: 'api/subscription/subscription',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.message === 'Successfully subscribed') {
      await getSubscriptionStats();
    } else if (responseData?.message === PAYMENT_INACTIVE) {
      setIsLoaded(false);
      setPaymentInActive(true);
      setIsSubscribing(false);
      setIsSubModal(false);
      await getSubscriptionStats();
    } else if (responseData?.message) {
      setAlertInfo({
        type: 'info',
        title: 'Note',
        buttonText: 'OK',
        hideCancelBtn: true,
        text: responseData.message,
      });
      setIsAlertModal(true);
    }
    setIsSubscribing(false);
    setIsSubModal(false);
  };

  const onUpdateSubscription = async (qty: number) => {
    setIsSubscribing(true);
    const responseData = await composeApi(
      {
        data: {
          plan_id: '1',
          quantity: qty,
        },
        method: 'POST',
        url: 'api/subscription/update-subscription',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.status === 1) {
      await getSubscriptionStats();
    } else if (responseData?.message) {
      setAlertInfo({
        type: 'info',
        title: 'Note',
        buttonText: 'OK',
        hideCancelBtn: true,
        text: responseData.message,
      });
      setIsAlertModal(true);
    }
    setIsSubscribing(false);
    setIsSubModal(false);
  };

  const onTrialSubscribe = async (qty: number, coupon: string) => {
    setIsSubscribing(true);
    const responseData = await composeApi(
      {
        data: {
          quantity: qty,
          coupon,
        },
        method: 'POST',
        url: 'api/subscription/update-trial',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.status === 1) {
      await getSubscriptionStats();
    } else if (responseData?.message) {
      setAlertInfo({
        type: 'warning',
        title: 'Note',
        buttonText: 'OK',
        hideCancelBtn: true,
        text: responseData.message,
      });
      setIsAlertModal(true);
    }
    setIsSubscribing(false);
    setIsSubModal(false);
  };

  const onCancelSubscribe = () => {
    showAlertModal('cancel_subscribe');
  };

  const onResumeSubscribe = async () => {
    setIsLoaded(false);
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/subscription/resume',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.status === '1') {
      await getSubscriptionStats();
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
      showAlertModal('show_msg', responseData?.message);
    }
  };

  const doCancelSubscribe = async () => {
    setIsLoaded(false);
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/subscription/cancel',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.status === '1') {
      await getSubscriptionStats();
    } else {
      showAlertModal('show_msg', responseData?.message);
    }
    setIsLoaded(true);
  };

  const onUpdateCard = async (card: ICardDetails) => {
    setIsCardModal(false);
    setIsLoaded(false);
    const responseData = await composeApi(
      {
        data: {
          card_number: card?.number,
          cvc: card?.cvv,
          expiration_month: card?.date.slice(0, 2),
          expiration_year: card?.date.slice(-2),
        },
        method: 'POST',
        url: 'api/subscription/update-card',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.status === 1) {
      await getSubscriptionStats();
    } else if (responseData?.message) {
      setAlertInfo({
        type: 'info',
        title: 'Note',
        buttonText: 'OK',
        hideCancelBtn: true,
        text: responseData.message,
      });
      setIsAlertModal(true);
      setIsLoaded(true);
    }
  };

  const onRemoveCard = async () => {
    if (subscriptionStatus.status === 'not_subscribe') {
      setCardDetails(null);
      return;
    }
    setIsLoaded(false);
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/subscription/delete-card',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.status === 1) {
      await getSubscriptionStats();
    } else if (responseData?.message) {
      setAlertInfo({
        type: 'info',
        title: 'Note',
        buttonText: 'OK',
        hideCancelBtn: true,
        text: responseData.message,
      });
      setIsAlertModal(true);
      setIsLoaded(true);
    }
  };

  const getMessage = () => {
    switch (subscriptionStatus?.status) {
      case 'not_subscribe':
        return (
          <>
            Your trial has expired and you are not subcribed yet. You need to
            subscribe to continue using the platform.
          </>
        );
      case 'grace':
        return (
          <>
            You cancelled subscription and you are on grace period until
            <span className='font-weight-500'>
              {` ${subscriptionStatus?.plan_data?.expire_at}. `}
            </span>
            Please resume subscription to continue using the platform.
          </>
        );
      case 'cancelled':
        return (
          <>
            Your subscription has expired. You need to re-subscribe to continue
            using the platform.
          </>
        );
      case 'active':
        return (
          <>
            You are subscribed until
            <span className='font-weight-500'>
              {` ${subscriptionStatus?.plan_data?.expire_at}.`}
            </span>
          </>
        );
      case 'trial':
        return (
          <>
            You are on trial period until
            <span className='font-weight-500'>
              {` ${subscriptionStatus?.plan_data?.expire_at}.`}
            </span>
          </>
        );
      default:
        return <></>;
    }
  };

  const getMessageType = () => {
    switch (subscriptionStatus?.status) {
      case 'not_subscribe':
        return 'warning';
      case 'active':
        return 'info';
      default:
        return 'warning';
    }
  };

  const downloadInvoiceFromId = (id: string) => {
    downloadInvoice(id, authStore.access_token);
  };

  useEffect(() => {
    getSubscriptionStats();
  }, []);

  return (
    <div className='content pb-32'>
      <Title
        className='mb-28'
        size={5}
        color='black-3'
        align='default'
        fontWeight={700}
      >
        Plan & billing
      </Title>
      {isLoaded ? (
        <>
          <Feedback
            className='mb-32'
            isWithoutClosable
            theme='light'
            message={getMessage()}
            type={getMessageType()}
          />
          <div>
            <Title
              className='mb-16'
              size={6}
              color='black-3'
              align='default'
              fontWeight={500}
            >
              Active subscription
            </Title>
            <Plan
              info={subscriptionStatus?.plan_data}
              status={subscriptionStatus?.status}
              farmsCount={farmsCount}
              onSubscription={() => {
                if (cardDetails) {
                  setIsSubModal(true);
                } else showAlertModal('input_card');
              }}
              onCancelSubscription={onCancelSubscribe}
              onResumeSubscription={onResumeSubscribe}
              onSubscriptionUpdate={() => {
                setIsSubModal(true);
              }}
              onTrialUpdate={() => {
                setIsSubModal(true);
              }}
            />
          </div>
          {subscriptionStatus.status !== 'trial' && (
            <>
              <div className='sub-min-height'>
                <Title
                  className='mb-16'
                  size={6}
                  color='black-3'
                  align='default'
                  fontWeight={500}
                >
                  Payment method
                </Title>
                {!cardDetails && (
                  <Button
                    className='mb-16'
                    color='blue'
                    size={2}
                    width='default'
                    type='fill'
                    onClick={() => setIsCardModal(true)}
                  >
                    Add Payment method
                  </Button>
                )}
                {cardDetails && (
                  <CreditCard
                    card={cardDetails}
                    planData={subscriptionStatus?.plan_data}
                    status={subscriptionStatus?.status}
                    onChangeCard={() => setIsCardModal(true)}
                    onRemoveCard={onRemoveCard}
                  />
                )}
              </div>
              <div>
                <Title
                  className='mb-16'
                  size={6}
                  color='black-3'
                  align='default'
                  fontWeight={500}
                >
                  Last tansactions
                </Title>
                {subscriptionStatus?.history?.length ? (
                  subscriptionStatus.history.map((e: IInvoice) => (
                    <Transaction
                      className='mb-8'
                      date={e.date}
                      price={e.total}
                      invoiceId={e.id}
                      downloadInvoice={downloadInvoiceFromId}
                      status='Paid'
                      key={e.id}
                    />
                  ))
                ) : (
                  <Subtitle
                    className='mb-10'
                    size={1}
                    color='black-3'
                    align='default'
                    fontWeight={400}
                  >
                    No Transactions yet
                  </Subtitle>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div style={{ marginBottom: 30 }}>
            <Spinner />
          </div>
          {paymentInActive && (
            <Feedback
              className='mb-32'
              isWithoutClosable
              theme='light'
              message={PAYMENT_INACTIVE}
              type='warning'
            />
          )}
        </>
      )}
      <SubscriptionModal
        textButton='Subscribe'
        onSubscribe={(qty, coupon) => {
          if (subscriptionStatus.status === 'trial')
            onTrialSubscribe(qty, coupon);
          if (subscriptionStatus.status === 'active') onUpdateSubscription(qty);
          else onSubscribe(qty);
        }}
        onCancel={() => setIsSubModal(false)}
        visible={isSubModal}
        disabled={isSubscribing}
        subscriptionStatus={subscriptionStatus}
        title='Subscription'
      />
      <CreditCardModal
        textButton={cardDetails ? 'Update card' : 'Add card'}
        onCancel={() => setIsCardModal(false)}
        onAdd={card => {
          if (subscriptionStatus.status !== 'not_subscribe') {
            onUpdateCard(card);
          } else {
            setCardDetails(card);
            setIsCardModal(false);
          }
        }}
        visible={isCardModal}
        title={cardDetails ? 'Update credit card' : 'Add credit card'}
      />
      <ModalComponent
        type={alertInfo?.type}
        visible={isAlertModal}
        title={alertInfo?.title}
        text={alertInfo?.text}
        buttonText={alertInfo?.buttonText}
        hideCancelBtn={alertInfo?.hideCancelBtn}
        onConfirm={() => {
          setIsAlertModal(false);
          if (alertInfo.text === CANCEL_SUBSCRIBE) doCancelSubscribe();
        }}
        onCancel={() => setIsAlertModal(false)}
      />
    </div>
  );
};

export default Subscription;
