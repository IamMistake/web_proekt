import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && role !== "guest" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default PrivateRoute;
