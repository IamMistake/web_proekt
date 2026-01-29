import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthScreen from "../../screens/auth/AuthScreen";

const AuthRoutes = () => (
  <Switch>
    <Route exact path="/auth" component={AuthScreen} />
  </Switch>
);

export default AuthRoutes;
