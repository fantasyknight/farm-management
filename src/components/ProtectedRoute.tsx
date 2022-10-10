import React, { FC, useEffect, useState } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { logOut } from '../store/auth/auth.actions';
import { getInitialProfile } from '../store/profile/profile.actions';
import { getInitialUser } from '../store/users/users.actions';
import { getInitialBudget } from '../store/budget/budget.action';

const ProtectedRoute: FC<{
  component: FC;
  path: string;
  exact: boolean;
}> = ({ component, path, exact }) => {
  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const [condition, setCondition] = useState<boolean>();

  const checkLogin = async () => {
    if (auth.isAuth) {
      setCondition(true);
    } else if (localStorage.getItem('marine-farm-refresh') !== null) {
      setCondition(true);
    } else {
      setCondition(false);
    }
  };

  useEffect(() => {
    if (
      (query.get('email') && query.get('token')) ||
      path.includes('checked') ||
      path.includes('recover-password/password')
    ) {
      dispatch(getInitialProfile());
      dispatch(getInitialUser());
      dispatch(getInitialBudget());
      dispatch(logOut());
      setCondition(false);
    } else {
      checkLogin();
    }
  }, [component]);

  return (
    <>
      {condition === true && <Redirect to='/' />}
      {condition === false && (
        <Route path={path} exact={exact} component={component} />
      )}
    </>
  );
};
export default ProtectedRoute;
