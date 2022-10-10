import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Router from './pages/Router';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import RecoverPassword from './pages/RecoverPassword';
import RegistrationMessage from './components/sign-up/RegistrationMessage';
import PasswordMessage from './components/recover-password/PasswordMessage';
import UiPage from './pages/Ui';
import SecondRecoverPassword from './pages/SecondRecoverPassword';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div className='app'>
      <BrowserRouter>
        <Switch>
          <ProtectedRoute path='/ui' component={UiPage} exact />
          <ProtectedRoute path='/sign-in/:checked?' component={SignIn} exact />
          <ProtectedRoute path='/sign-up' component={SignUp} exact />
          <ProtectedRoute
            path='/recover-password/email'
            component={RecoverPassword}
            exact
          />
          <ProtectedRoute
            path='/recover-password/password/:token/:email'
            component={SecondRecoverPassword}
            exact
          />
          <ProtectedRoute
            path='/message-registration'
            component={RegistrationMessage}
            exact
          />
          <ProtectedRoute
            path='/message-password'
            component={PasswordMessage}
            exact
          />
          <Route path='/'>
            <Router />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
