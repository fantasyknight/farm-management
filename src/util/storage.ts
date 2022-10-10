const storageKey = 'redux-local-tab-sync';

export const storageMiddleware = () => {
  return () => (next: any) => (action: any) => {
    if (Object.keys(action).length !== 0 || typeof action === 'function') {
      if (!action.source) {
        const wrappedAction = {
          ...{
            source: 'another tab',
          },
          ...action,
        };

        if (action.type === 'AUTH/LOGOUT') {
          localStorage.setItem(storageKey, JSON.stringify(wrappedAction));
        }
      }

      next(action);
    }
  };
};
