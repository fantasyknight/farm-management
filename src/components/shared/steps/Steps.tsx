import React, { useMemo, FC } from 'react';
import { Steps } from 'antd';

import { IList } from '../../../types/basicComponentsTypes';

import './styles.scss';

interface IOwnProps {
  current: number;
  direction: 'horizontal' | 'vertical' | undefined;
  items: IList[];
  className?: string;
  onChange?: (event: number) => void;
}

const StepsComponent: FC<IOwnProps> = ({
  current,
  direction,
  items,
  onChange,
  className,
}) => {
  const { Step } = useMemo(() => Steps, []);

  return (
    <Steps
      className={className}
      current={current}
      onChange={onChange}
      direction={direction}
    >
      {items.map(item => (
        <Step title={item.title} key={item.id} />
      ))}
    </Steps>
  );
};

export default StepsComponent;
