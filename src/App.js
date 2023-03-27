import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Routes/PrivateRoute";
import Login from "./Pages/Auth/Login";
import Register from "Pages/Auth/Register";
import Index from "Pages/Home";
import { useUserContext } from "./Context/UserContext";
import Api from "Api";
function App() {
  const { token } = useUserContext();
  let tokenn = token();
  Api.defaults.headers.common['Authorization'] = `Bearer ${tokenn}`;
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <PrivateRoute path="/articles" exact>
            <Index />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
