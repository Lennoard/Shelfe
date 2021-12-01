import { Switch, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Book from "./pages/Book";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact component={SignIn}></Route>
          <Route path="/dashboard/:sortBy?/:orderBy?" component={Dashboard}></Route>
          <Route path="/search" component={Search}></Route>
          <Route path="/book:id?" component={Book}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;