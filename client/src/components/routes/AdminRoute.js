import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && role === "admin" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default AdminRoute;
