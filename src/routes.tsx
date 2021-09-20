import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";


function Routes() {
  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact component={SignIn}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;