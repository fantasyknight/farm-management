import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumb } from 'antd';
import CaretRight from '../CaretRight';

import Paragrapgh from '../paragrapgh/Paragrapgh';
import { IBreadcrumb } from '../../../types/basicComponentsTypes';

import './styles.scss';

interface IOwnProps {
  items: IBreadcrumb[];
}

const BreadcrumbComponent: FC<IOwnProps> = ({ items }) => {
  return (
    <Breadcrumb separator={<CaretRight color='#5A607F' />}>
      {items.map(item => (
        <Breadcrumb.Item key={item.id}>
          <Link to={item.link}>
            <Paragrapgh
              size={1}
              fontWeight={400}
              color='black-2'
              align='default'
            >
              {item.linkName}
            </Paragrapgh>
          </Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
