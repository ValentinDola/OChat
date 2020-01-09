import React from 'react';
import { Menu, Dropdown, Icon, Button, Avatar } from 'antd';
import firebase from '../../../../../firebase/firebase.js';

class UserPanel extends React.Component {

    state = {
        user : this.props.currentUser,
    }
    
    

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('SignouT'));
    }

    render() {

        const { user } = this.state;

        return (
           
            <Dropdown overlay={ <Menu 
                style = {{marginLeft : 45, marginTop : 2, width : 200}} >
                    <Menu.Item disabled key="0">
                    Signed as { user.displayName}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="1">
                        Change Avatar
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onClick = {this.handleSignOut} 
                    key="3">Log Out</Menu.Item>
                </Menu>} trigger={['click']}>
                <div>
                    <Avatar src = {user.photoURL} style = {{marginLeft : 15, marginTop : -3}} />
                    <Button  
                    style = {{color : 'white', marginTop : 20, fontSize : 18 }} 
                    type = 'link' >
                     { user.displayName} <Icon type="arrow-down" />
                    </Button>
               
                </div>
                 </Dropdown>
        );
    }
}


export default UserPanel;