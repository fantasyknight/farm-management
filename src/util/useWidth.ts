import { useState, useLayoutEffect } from 'react';

export const useWidth = () => {
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    setWidth(window.innerWidth);
    const widthCallback = () => setWidth(window.innerWidth);
    window.addEventListener('resize', widthCallback);

    return () => {
      window.removeEventListener('resize', widthCallback);
    };
  }, []);

  return width;
};
