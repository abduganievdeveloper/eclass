import React,{ Component } from 'react';
import { Route} from 'react-router-dom'
import './App.css';
import { Admin } from './admin/Admin';
import {Provider} from 'react-redux';
import {connect} from 'react-redux';
import {store} from './admin/store.js';
class App extends Component {
 
  render() {
    return (
      <Provider store={store}>
        <Route path="/admin" component={Admins}/>
      </Provider>

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
