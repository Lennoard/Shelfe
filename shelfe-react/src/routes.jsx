import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Book from "./pages/Book";
import UserSettings from "./pages/Settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" exact element={<SignIn />}></Route>
          <Route path="/dashboard/:sortBy?/:orderBy?" element={<Dashboard />}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/book">
            <Route index element={<Book />} />
            <Route path=":id" element={<Book />} />
          </Route>
          <Route path="/settings" element={<UserSettings/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;