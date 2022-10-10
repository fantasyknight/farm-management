import React from 'react';

import { Button, Paragrapgh, Title } from '../components/shared';
import { INotification } from '../types/basicComponentsTypes';

const Notifications = () => {
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
    {
      title: 'System Notification',
      text:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      date: '02.11.2020',
    },
  ];

  return (
    <>
      <div className='container w-100'>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='notifications mt-22'>
            <div className='mb-16 d-flex align-items-center justify-content-between'>
              <Title size={5} color='black-3' align='default' fontWeight={700}>
                Notification
              </Title>
              <Button
                color='blue'
                size={1}
                width='default'
                type='bordered'
                isNoneBorder
              >
                Clear history
              </Button>
            </div>
            {notifications &&
              notifications.map(notification => (
                <div className='notifications__card'>
                  <Paragrapgh
                    className='mb-4'
                    size={1}
                    color='black-3'
                    align='left'
                    fontWeight={600}
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
                  <Paragrapgh
                    size={2}
                    color='black-2'
                    align='left'
                    fontWeight={400}
                  >
                    {notification.date}
                  </Paragrapgh>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
