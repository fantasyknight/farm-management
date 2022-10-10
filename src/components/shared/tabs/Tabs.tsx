import React, { FC, FormEvent, useMemo } from 'react';
import { Tabs } from 'antd';

import { ITab } from '../../../types/basicComponentsTypes';

import './styles.scss';

interface IOwnProps {
  items: ITab[];
  defaultActiveKey?: string;
  onChange?: (event: string) => void;
}

const TabsComponent: FC<IOwnProps> = ({
  items,
  defaultActiveKey,
  onChange,
}) => {
  const { TabPane } = useMemo(() => Tabs, []);

  return (
    <Tabs onChange={onChange} defaultActiveKey={defaultActiveKey}>
      {items.map((tab, i) => (
        <TabPane tab={tab.title} key={tab.id}>
          {tab.content}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default TabsComponent;
