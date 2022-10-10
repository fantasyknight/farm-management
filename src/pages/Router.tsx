import React from 'react';
import { Switch } from 'react-router-dom';

import ProfileRouter from './ProfileRouter';
import AddUsers from './AddUsers';
import FarmsRouter from './FarmsRouter';
import Notifications from './Notifications';
import ToDo from './ToDo';
import Automation from './Automation';
import Overview from './Overview';
import Users from './Users';
import PrivateRoute from '../components/PrivateRoute';
import Budget from './Budget';
import BudgetLine from './BudgetLine';
import Header from '../components/header/Header';
import BudgetLog from './BudgetLog';
import Loading from './Loading';
import NotFound from './NotFound';

const Router = () => {
  return (
    <div>
      <Header />
      <Switch>
        <PrivateRoute path='/' component={Overview} exact />
        <PrivateRoute
          path='/profile/:id?'
          component={ProfileRouter}
          exact={false}
        />
        <PrivateRoute
          path='/users/add-user'
          component={AddUsers}
          exact
          isAdmin
        />
        <PrivateRoute
          path='/users/edit-user/:id'
          component={AddUsers}
          exact={false}
          isAdmin
        />
        <PrivateRoute path='/users' component={Users} exact />
        <PrivateRoute path='/farms' component={FarmsRouter} exact={false} />
        <PrivateRoute path='/budget' component={Budget} exact isFinance />
        <PrivateRoute
          path='/budget/info'
          component={BudgetLine}
          exact
          isFinance
        />
        <PrivateRoute
          path='/budget-log'
          component={BudgetLog}
          exact
          isFinance
        />
        <PrivateRoute path='/to-do' component={ToDo} exact={false} />
        <PrivateRoute path='/automation' component={Automation} exact={false} />
        <PrivateRoute path='/notifications' component={Notifications} exact />
        <PrivateRoute path='/loading/:type' component={Loading} exact />
        <PrivateRoute path='*' component={NotFound} exact={false} />
      </Switch>
    </div>
  );
};

export default Router;
