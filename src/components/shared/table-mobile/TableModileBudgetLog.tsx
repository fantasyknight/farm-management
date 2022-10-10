import React, { useState, FC } from 'react';
import moment from 'moment';

import ModalComponent from '../modal/Modal';
import Paragrapgh from '../paragrapgh/Paragrapgh';

import './styles.scss';

interface IOwnProps {
  data?: any;
  dotMenuField?: any;
}

const TableMobileBudgetLog: FC<IOwnProps> = ({ data, dotMenuField }) => {
  const [infoModal, setInfoModal] = useState(false);

  return (
    <div className='table-mobile__card'>
      <div className='table-mobile__card-dots'>{dotMenuField.render(data)}</div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Farm
          </Paragrapgh>
          <Paragrapgh size={2} color='black-5' align='left' fontWeight={400}>
            {data?.farm_name}
          </Paragrapgh>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Line
          </Paragrapgh>
          <Paragrapgh size={2} color='black-5' align='left' fontWeight={400}>
            {data?.line_name}
          </Paragrapgh>
        </div>
      </div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Type
          </Paragrapgh>
          <Paragrapgh size={2} color='black-5' align='left' fontWeight={400}>
            {data?.type_human}
          </Paragrapgh>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Change
          </Paragrapgh>
          <Paragrapgh size={2} color='black-5' align='left' fontWeight={400}>
            <span>
              {data?.change?.old} &#x2192;{' '}
              <span className='font-weight-600'>{data?.change?.new}</span>
            </span>
          </Paragrapgh>
        </div>
      </div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            User
          </Paragrapgh>
          <Paragrapgh size={2} color='black-5' align='left' fontWeight={400}>
            {data?.user_name}
          </Paragrapgh>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Date
          </Paragrapgh>
          <Paragrapgh size={2} color='black-5' align='left' fontWeight={400}>
            {moment(Number(data?.date) * 1000).format('DD.MM.YYYY')}
          </Paragrapgh>
        </div>
      </div>

      <div className='d-flex'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Comment
          </Paragrapgh>
          <Paragrapgh size={2} color='black-5' align='left' fontWeight={400}>
            <span
              className='btn__modal'
              onKeyDown={() => undefined}
              onClick={() => setInfoModal(prev => !prev)}
            >
              View
            </span>
          </Paragrapgh>
        </div>
      </div>

      <ModalComponent
        visible={infoModal}
        onCancel={() => setInfoModal(prev => !prev)}
        type=''
        title='Comment'
        text={data?.comment ? data?.comment : 'No comments yet'}
      />
    </div>
  );
};

export default TableMobileBudgetLog;
