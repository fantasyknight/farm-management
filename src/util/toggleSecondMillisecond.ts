import moment from 'moment';

const toggleSecondMillisecond = (date: string | number): number => {
  if (date) {
    if (date.toString().length === 10) {
      const millisecond = (Number(date) * 1000).toFixed();
      return Number(millisecond);
    }

    if (date.toString().length === 13) {
      const second = (Number(date) / 1000).toFixed();
      return Number(second);
    }
  }

  return moment().toDate().getTime();
};

export default toggleSecondMillisecond;
