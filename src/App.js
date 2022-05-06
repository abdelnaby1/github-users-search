import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  console.log(process.env.AUTH0_DOMAIN);
  return (
    <AuthWrapper>
      <Router>
        {/* Switch renders the first child <Route> that matches */}
        <Switch>
          <PrivateRoute path="/" exact>
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
    </AuthWrapper>
  );
}

export default App;
