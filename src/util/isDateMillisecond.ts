import moment from 'moment';

const isDateMillisecond = (date: number | undefined): number => {
  if (date === undefined) {
    return moment().toDate().getTime();
  }

  return date;
};

export default isDateMillisecond;
