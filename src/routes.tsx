import { Switch, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import { createBrowserHistory } from "history";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact component={SignIn}></Route>
          <Route path="/dashboard" component={Dashboard}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
export const history = createBrowserHistory();