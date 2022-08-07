
import {BrowserRouter as Router, Switch , Redirect, Route} from 'react-router-dom';
import Home from './components/dashboard/Home';
import Forgot from './components/forgot/Forgot';
import Login from './components/login/Login';
import Settings from './components/settings/Settings';
import { AuthProvider, Auth } from './context';

function App() {
  return (
    <>
    <Router>
    
      <AuthProvider>
        <Switch>
          <FadingRoute exact path="/" component={Home} access={true} />
          
          <FadingRoute exact path="/login" component={Login} access={false} />
          <FadingRoute exact path="/forgot" component={Forgot} access={false} />
          <FadingRoute exact path="/user/:username" component={Settings} access={true} />
          
          
        </Switch>      

      </AuthProvider>
      
    </Router>
    </>
  );
}


function FadingRoute({ component: Component, access,  ...rest }) {
  const {user} = Auth();
  if( user && !access ) return <Redirect to="/" />
  if( !user && access) return  <Redirect to="/login" />
  return (
    <Route
      {...rest}
      render={ routeProps => ( <Component {...routeProps} />) }
    />
  );
}

export default App;
