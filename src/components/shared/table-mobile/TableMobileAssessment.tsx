import React, { useState, FC, useRef } from 'react';
import moment from 'moment';
import ImageGallery from 'react-image-gallery';
import { Modal } from 'antd';

import toggleSecondMillisecond from '../../../util/toggleSecondMillisecond';
import ModalComponent from '../modal/Modal';
import Subtitle from '../subtitle/Subtitle';

import './styles.scss';

interface ITableMobileAssessment {
  data?: any;
  dotMenuField?: any;
  hideDots?: boolean | undefined;
}

interface IImage {
  photo: string;
}

interface IGalleryImage {
  original: string;
  thumbnail: string;
}

const TableMobileAssessment: FC<ITableMobileAssessment> = ({
  data,
  dotMenuField,
}) => {
  const infoModalData = useRef('');

  const [infoModal, setInfoModal] = useState(false);
  const [asPhotoModalVisible, setAsPhotoModalVisible] = useState(false);
  const [assessPhotos, setAssessPhotos] = useState<Array<IGalleryImage>>([]);

  const showInfoModal = (d: any, event: any): void => {
    event.stopPropagation();
    if (!d) {
      infoModalData.current = 'No comments yet';
    } else {
      infoModalData.current = d;
    }

    setInfoModal(!infoModal);
  };

  return (
    <div className='table-mobile__card'>
      <div className='table-mobile__card-dots'>{dotMenuField.render(data)}</div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Date of assessment
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {moment(
              data?.date_assessment
                ? toggleSecondMillisecond(data?.date_assessment)
                : toggleSecondMillisecond(0),
            ).format('DD.MM.YYYY')}
          </Subtitle>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Colour
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.color}
          </Subtitle>
        </div>
      </div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Condition min
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.condition_min}
          </Subtitle>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Condition max
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.condition_max}
          </Subtitle>
        </div>
      </div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Condition average
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.condition_avg}
          </Subtitle>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Blues
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.blues}
          </Subtitle>
        </div>
      </div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Tonnes
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.tones}
          </Subtitle>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Planned harvest date
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {moment(toggleSecondMillisecond(data?.planned_date_harvest)).format(
              'DD.MM.YYYY',
            )}
          </Subtitle>
        </div>
      </div>

      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Condition Score
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.condition_score}
          </Subtitle>
        </div>
        <div className='flex-basis-50 ml-24'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Comment
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            <div
              className='btn__modal'
              onKeyDown={() => undefined}
              onClick={() => setInfoModal(prev => !prev)}
            >
              View
            </div>
          </Subtitle>
        </div>
      </div>

      <div className='d-flex'>
        <div className='flex-basis-50'>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            Photo
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data.images.length === 0 && (
              <div
                className='btn__modal'
                onKeyDown={() => undefined}
                onClick={showInfoModal.bind(null, {
                  comment: 'No photos attached',
                  heading: 'Photo',
                })}
              >
                View
              </div>
            )}
            {data.images.length !== 0 && (
              <div
                className='btn__modal'
                onKeyDown={() => undefined}
                onClick={() => {
                  setAsPhotoModalVisible(true);
                  setAssessPhotos(
                    data.images.map((image: IImage) => {
                      return {
                        original: `${process.env.REACT_APP_API_URL}uploads/${image.photo}`,
                        thumbnail: `${process.env.REACT_APP_API_URL}uploads/${image.photo}`,
                      };
                    }),
                  );
                }}
              >
                View
              </div>
            )}
          </Subtitle>
        </div>
      </div>

      {asPhotoModalVisible && (
        <Modal
          title='Assessment Photos'
          visible={asPhotoModalVisible}
          onCancel={() => setAsPhotoModalVisible(false)}
          footer={null}
          width={1000}
        >
          <ImageGallery items={assessPhotos} />
        </Modal>
      )}

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

export default TableMobileAssessment;
