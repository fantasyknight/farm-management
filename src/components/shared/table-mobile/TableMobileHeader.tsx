import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import './styles.scss';
import Subtitle from '../subtitle/Subtitle';
import randomKey from '../../../util/randomKey';

interface ITableMobileHeader {
  data: any;
  dotMenuField: any;
}

const TableMobileHeader: FC<ITableMobileHeader> = ({ data, dotMenuField }) => {
  const history = useHistory();

  const handleCLick = () => {
    const url = data?.id ? `/farms/${data?.id}` : '/farms';
    history.push(url);
  };

  return (
    <div
      className='table-mobile__header'
      onKeyDown={() => undefined}
      onClick={handleCLick}
    >
      <div className='d-flex justify-content-between pl-48'>
        <div>
          <Subtitle
            size={5}
            color='black-3'
            align='left'
            fontWeight={600}
            className='mb-4'
          >
            {data?.name}
          </Subtitle>
          <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
            <span className='pr-6'>{data?.location?.lat}</span>
            <span>{data?.location?.lng}</span>
          </Subtitle>
        </div>
        <div>{dotMenuField.render(data)}</div>
      </div>
      <div className='d-flex pt-16'>
        <div className='flex-basis-50'>
          <Subtitle size={5} color='black-2' align='left' fontWeight={400}>
            Area
          </Subtitle>
          <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
            {data?.area}ha
          </Subtitle>
        </div>
        <div className='flex-basis-50'>
          <Subtitle size={5} color='black-2' align='left' fontWeight={400}>
            Owner
          </Subtitle>

          <div className='d-flex flex-wrap'>
            {data?.owners.map((owner: any) => {
              return (
                <Subtitle
                  size={5}
                  color='black-5'
                  align='left'
                  fontWeight={400}
                  className='pr-4'
                  key={randomKey()}
                >
                  {owner?.title}
                </Subtitle>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableMobileHeader;
