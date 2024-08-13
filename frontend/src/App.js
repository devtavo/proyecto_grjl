import React from "react";
import { BrowserRouter as Router, Route, HashRouter, Switch, Redirect } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red,lightBlue,green,orange } from '@mui/material/colors';
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Ciudadano from "./pages/Ciudadano/Ciudadano";

import { useUserState } from "./context/UserContext";

const theme = createTheme({
  typography:{
    fontFamily:'Open Sans',
  },
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: orange[900],
    }
  },
});

export function App() {
  var { isAuthenticated,idRol } = useUserState();
  // console.log(isAuthenticated,idRol);
  return (
    <ThemeProvider theme={theme} style={{margin:0}}>
      <HashRouter>
        <Switch>
          {/* <Layout></Layout> */}
          {/* <Login></Login> */}
          {/* <Route exact path="/" render={() => <Redirect to="/app/principal" />} /> */}
          {/* <Route
            exact
            path="/app"
            render={() => <Redirect to="/app/principal" />}
          /> */}
          <PublicRoute path="/login" component={Login} />
          <PrivateRoute path="/" component={Layout} />
        </Switch>
      </HashRouter>
    </ThemeProvider >
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />    
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: idRol>=2 ? "/":"/consultas/1",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
export default App;