export const createStorageListener = (store: any) => {
  return () => {
    const wrappedAction = JSON.parse(
      localStorage.getItem('redux-local-tab-sync') as string,
    );

    delete wrappedAction.source;

    store.dispatch(wrappedAction);
  };
};
