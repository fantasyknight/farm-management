import React, { ChangeEvent, FC, useState } from 'react';

import { InputModal, Input, Title, Feedback } from '../shared';

import './styles.scss';
import { useWidth } from '../../util/useWidth';

interface IOwnProps {
  onCancel: () => void;
  onAdd: (data: any) => void;
  visible: boolean;
  title: string;
  textButton: string;
}
const CreditCardModal: FC<IOwnProps> = ({
  textButton,
  title,
  onAdd,
  onCancel,
  visible,
}) => {
  const width = useWidth();
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [validInput, setValidInput] = useState(true);
  const [cvv, setCVV] = useState('');
  const [date, setDate] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const handleOnEmail = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEmail(e.target.value);
  };

  const handleOnCardHolder = (e: string) => {
    setCardHolder(e);
  };

  const handleOnDate = (e: string) => {
    setDate(e);
  };

  const handleOnCardNumber = (e: string) => {
    setCardNumber(e);
  };

  const handleOnCVV = (e: string) => {
    setCVV(e);
  };

  const clearState = () => {
    setCVV('');
    setDate('');
    setCardNumber('');
    setCardHolder('');
    setEmail('');
  };

  const handleOnCancel = () => {
    clearState();
    onCancel();
  };

  const handleOnConfirm = () => {
    if (
      cvv.length === 3 &&
      date.length === 5 &&
      cardNumber.length === 16 &&
      email &&
      cardHolder
    ) {
      clearState();
      onAdd({
        number: cardNumber,
        holder: cardHolder,
        email,
        cvv,
        date,
      });
    } else {
      setValidInput(false);
    }
  };

  return (
    <InputModal
      visible={visible}
      onCancel={handleOnCancel}
      title={title}
      type='confirm'
      confirmNameBtn={textButton}
      onConfirm={handleOnConfirm}
    >
      <div
        className={
          width > 595 ? 'pos-relative pt-8 w-100 pb-21 mb-24' : 'w-100 mb-16'
        }
      >
        <div className='addCard credit-card'>
          <Input
            onValChange={e => handleOnCardNumber(e)}
            type='cardnumber'
            className='mb-20 addCard__cardNumber'
            value={cardNumber}
            label='Card number'
            placeholder='Card number'
            required
          />
          <div className='d-flex justify-content-between card-inputs'>
            <div className='addCard__cardHolder mr-16'>
              <Input
                onChange={e => handleOnCardHolder(e.target.value)}
                type='text'
                value={cardHolder}
                label='Name on card'
                placeholder='John Doe'
                required
              />
            </div>
            <div className='addCard__date'>
              <Input
                className='addCard__expiration'
                onValChange={e => handleOnDate(e)}
                type='expiration'
                value={date}
                label='Expiration'
                placeholder='MM / YY'
                required
              />
              {width < 596 && (
                <Input
                  className='addCard__cvc'
                  onValChange={e => handleOnCVV(e)}
                  type='cvv'
                  value={cvv}
                  label='CVV'
                  placeholder='***'
                  required
                />
              )}
            </div>
          </div>
        </div>
        {width > 595 && (
          <div className='bg-card credit-card'>
            <div className='big-line w-100' />
            <div className='d-flex cvc justify-content-end'>
              <Input
                className='addCard__cvc mr-20'
                onValChange={e => handleOnCVV(e)}
                type='cvv'
                value={cvv}
                label='CVV'
                placeholder='***'
                required
              />
            </div>
          </div>
        )}
      </div>
      <Input
        className='mb-24'
        type='email'
        onChange={handleOnEmail}
        value={email}
        label='Email'
        placeholder='email'
      />
      {!validInput && (
        <Feedback
          isWithoutClosable
          isIcon
          theme='light'
          className='mb-24'
          message='Fill all the fields'
          type='warning'
        />
      )}
    </InputModal>
  );
};

export default CreditCardModal;
