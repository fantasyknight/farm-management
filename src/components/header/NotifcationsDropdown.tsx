import React from 'react';

import './styles.scss';
import { Link } from 'react-router-dom';
import { Button, Paragrapgh, Title } from '../shared';
import { INotification } from '../../types/basicComponentsTypes';

const NotificationsDropdown = () => {
  const notifications: INotification[] = [
    {
      title: 'System Notification',
      text:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      date: '02.11.2020',
    },
    {
      title: 'System Notification',
      text:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      date: '02.11.2020',
    },
    {
      title: 'System Notification',
      text:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      date: '02.11.2020',
    },
  ];
  return (
    <div className='header-dropdown'>
      <div className='pl-20 pr-4 mb-10 d-flex align-items-center justify-content-between'>
        <Title size={6} color='default' align='default' fontWeight={500}>
          Notification
        </Title>

        <Button
          color='blue'
          size={3}
          width='default'
          isNoneBorder
          type='transparent'
        >
          Marks all read
        </Button>
      </div>
      {notifications &&
        notifications.map(notification => (
          <div className='header-dropdown__card'>
            <Paragrapgh
              className='mb-4'
              size={2}
              color='default'
              align='left'
              fontWeight={500}
            >
              {notification.title}
            </Paragrapgh>
            <Paragrapgh
              className='mb-8'
              size={2}
              color='default'
              align='left'
              fontWeight={400}
            >
              {notification.text}
            </Paragrapgh>
            <Paragrapgh size={2} color='black-2' align='left' fontWeight={400}>
              {notification.date}
            </Paragrapgh>
          </div>
        ))}
      <div className='header-dropdown__link'>
        <Link to='/notifications'>
          <Button
            className='text-center'
            color='blue'
            size={3}
            width='default'
            isNoneBorder
            type='bordered'
          >
            View all
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
