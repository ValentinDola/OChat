import React from 'react';
import { Layout, Menu, Dropdown, Icon, Button, Avatar } from 'antd';
import firebase from '../../../../firebase/firebase.js';
import UserPanel from './userPanel/index';
import PublicChannel from './publicChannel/index';
import DirectMessage from './directMessage/index'

const { Sider } = Layout;

class SidePanel extends React.Component {


    render() {

        const { currentUser } = this.props;

        return (
           <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }}>
               <UserPanel currentUser = {currentUser} />
                <PublicChannel currentUser = {currentUser} />
                <DirectMessage currentUser = {currentUser}  />
            </Sider>
        );
    }
}

export default SidePanel;