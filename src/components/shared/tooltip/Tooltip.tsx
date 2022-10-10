import React, { FC, ReactNode } from 'react';
import { Popover } from 'antd';

import { IList } from '../../../types/basicComponentsTypes';

import './styles.scss';
import randomKey from '../../../util/randomKey';

interface IOwnProps {
  children: ReactNode;
  content: IList[];
  position:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | undefined;
  className?: string;
}

const Tooltip: FC<IOwnProps> = ({
  content = [],
  position,
  className,
  children,
}) => {
  return (
    <Popover
      className='ant-popover'
      overlayClassName={className}
      placement={position}
      content={
        <div>
          {content.map(item => {
            const key = randomKey();
            return (
              <p key={key} className='ant-popover-item'>
                {item.title}
              </p>
            );
          })}
        </div>
      }
      trigger='hover'
    >
      {children}
    </Popover>
  );
};

export default Tooltip;
