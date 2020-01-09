import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import WrappedRegistrationForm from './auht/cor/SignUp';
import WrappedLoginForm from './auht/cor/Login';
import Chat from './chat/cor/index';
import firebase from '../firebase/firebase.js';
import { connect } from 'react-redux';
import { setUser, clearUser } from './actions';
import { Spin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 70, paddingTop : 200,  marginLeft : 650 }} spin />;

class IndexApp extends React.Component {

    componentDidMount() {
        firebase
            .auth()
            .onAuthStateChanged( user => {
                if ( user ) {
                    this.props.setUser(user);
                    this.props.history.push('/core/chat');
                }else{
                    this.props.history.push('/auth/login');
                    this.props.clearUser(user);
                }
            } )
    }
    

  render() {
  return this.props.isLoading ? <Spin indicator={antIcon} /> : ( 
        <Switch>
                <Route exact path = '/' component = {WrappedRegistrationForm} /> 
                <Route exact path = '/auth/login' component = {WrappedLoginForm} /> 
                <Route exact path = '/core/chat' component = {Chat} /> 
        </Switch>
   );
  }
}

const mapStateFromProps = state => ({
    isLoading : state.user.isLoading
})

const IndexAppWithAuth = withRouter( connect ( mapStateFromProps,
 { setUser, clearUser })
 (IndexApp));
 
export default IndexAppWithAuth;