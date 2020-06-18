import React from 'react';
import { Switch, BrowserRouter, Redirect, Route} from 'react-router-dom';

import Login from './pages/Login';
import Calendar from './pages/Calendar';
import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props => 
        isAuthenticated() ? (
            <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);



const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute path="/calendar" component={Calendar} />
            <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;

