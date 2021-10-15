import { Switch, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact component={SignIn}></Route>
          <Route path="/dashboard" component={Dashboard}></Route>
          <Route path="/search" component={Search}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;