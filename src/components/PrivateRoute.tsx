import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store/rootReducer';
import { AuthState, ISignInPayload } from '../store/auth/auth.type';
import { logOut, updateToken } from '../store/auth/auth.actions';
import {
  getInitialProfile,
  getUserEmail,
  getUserProfile,
} from '../store/profile/profile.actions';
import { getFarmsData } from '../store/farms/farms.actions';
import { getInitialUser } from '../store/users/users.actions';
import { ProfileState } from '../store/profile/profile.type';
import { Spinner } from './shared';
import { getBudget, getInitialBudget } from '../store/budget/budget.action';

const PrivateRoute: FC<{
  component: FC;
  path: string;
  exact: boolean;
  isAdmin?: boolean;
  isFinance?: boolean;
}> = ({ component, path, exact, isAdmin = false, isFinance = false }) => {
  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [condition, setCondition] = useState<boolean | null>();

  const checkToken = async () => {
    let data: ISignInPayload = {};
    if (auth.isAuth) {
      setCondition(true);
    } else if (localStorage.getItem('marine-farm-refresh') !== null) {
      data = {
        access_token: localStorage.getItem('marine-farm') as string,
        refresh_token: localStorage.getItem('marine-farm-refresh') as string,
        id: localStorage.getItem('marine-farm-user_id') as string,
      };
      await dispatch(
        updateToken({
          isAuth: true,
          access_token: data?.access_token,
          refresh_token: data?.refresh_token,
          id: data?.id,
        }),
      );
      await dispatch(getUserEmail(history));
      await dispatch(getFarmsData(history));
      await dispatch(getUserProfile(data?.id as string, history));

      if (history.location.pathname === '/budget/info') {
        await dispatch(getBudget(history));
      }

      if (!isAdmin && !isFinance) {
        setCondition(true);
      }
    } else {
      setCondition(false);
      dispatch(logOut());
      dispatch(getInitialProfile());
      dispatch(getInitialUser());
      dispatch(getInitialBudget());
    }
  };

  useEffect(() => {
    if (profile?.role) {
      if (isAdmin && profile?.role === 'user') {
        history.push('/');
      } else if (
        isFinance &&
        !profile?.permissions?.find(permission => permission.name === 'finance')
      ) {
        history.push('/');
      } else {
        setCondition(true);
      }
    }
  }, [profile.role, profile.permissions]);

  useEffect(() => {
    checkToken();
  }, [history.location.pathname]);

  useLayoutEffect(() => {
    setCondition(null);
  }, [history.location.pathname]);

  return (
    <>
      {condition === false && <Redirect to='/sign-in' />}
      {condition === true && (
        <Route path={path} exact={exact} component={component} />
      )}
      {!(condition === false || condition === true) && (
        <div className='d-flex justify-content-center align-items-center min-height'>
          <Spinner />
        </div>
      )}
    </>
  );
};
export default PrivateRoute;
