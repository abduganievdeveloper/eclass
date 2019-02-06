import React,{ Component } from 'react';
import { Route} from 'react-router-dom'
import './App.css';
import { Admin } from './admin/Admin';
import {Provider} from 'react-redux';
import {connect} from 'react-redux';
import {store} from './admin/store.js';
import {BrowserRouter} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
class App extends Component {
 
  render() {
    const hashHistory = createHashHistory({ basename: process.env.PUBLIC_URL });
    return (
      <div>
      <Provider store={store}>
      <Router history={hashHistory}>
      
        <Route path="/admin" component={Admins}/>
      </Router>
      </Provider>
      <p>your app is working</p>  
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
          login:state.lr.login        
  }
};


const Admins = connect(mapStateToProps, null)(Admin);
export default App;
