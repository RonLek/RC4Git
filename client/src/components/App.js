import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import {
  Login,
  SignedLeftSidebar,
  AnonymousModeLeftSidebar,
  LoginRedirect,
  MainLayout,
} from "./";

function RestrictedRoute(restrictedRouteProps) {
  const { authState } = restrictedRouteProps;
  return (
    <>
      {authState.isLoggedIn ? (
        <SignedLeftSidebar user={authState.user}/>
      ) : (
        <AnonymousModeLeftSidebar />
      )}
      <MainLayout {...restrictedRouteProps} />
    </>
  );
}

const checkAuth = () => {
  if (
    Cookies.get("rc4git_token") &&
    Cookies.get("rc_token") &&
    Cookies.get("rc_uid")
  ) {
    return {
      user: jwt_decode(Cookies.get("rc4git_token")),
      isLoggedIn: true,
      inProgress: false,
    };
  }
  return {
    user: {},
    isLoggedIn: false,
    inProgress: false,
  };
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: checkAuth(),
    };
  }

  setAuthState = (auth) => {
    return this.setState({
      auth,
    });
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/login"
            render={() => (
              <Login
                authState={this.state.auth}
                setAuthState={this.setAuthState}
              ></Login>
            )}
          />
          <Route
            path="/redirect/login"
            component={LoginRedirect}
          />
          <RestrictedRoute
            path={"/"}
            authState={this.state.auth}
          />
        </Switch>
      </Router>
    );
  }
}
