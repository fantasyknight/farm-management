import React, { FC, ReactNode } from 'react';

import './styles.scss';

interface IOwnProps {
  icon: ReactNode;
  color: string;
}

const BgIcon: FC<IOwnProps> = ({ icon, color }) => {
  return <div className={`icon-space icon-space--${color}`}>{icon}</div>;
};

export default BgIcon;
