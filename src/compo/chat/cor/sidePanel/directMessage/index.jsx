import React from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../../../actions';
import { Button } from 'antd';
import { Menu, Icon } from 'evergreen-ui';
import firebase from '../../../../../firebase/firebase.js';
import PerfectScrollbar from 'react-perfect-scrollbar';

class DirectMessage extends React.Component {

    state = {
        activeChannel : '',
        user : this.props.currentUser,
        users : [ ],
        usersRef : firebase.database().ref('users'),
        connectedRef : firebase.database().ref('.info/connected'),
        presenceRef : firebase.database().ref('presence'),

    }

    componentDidMount() {
        if(this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = currentUserUid => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added' , snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({ users : loadedUsers });
            }
        });
        this.state.connectedRef.on( 'value' , snap => {
            if (snap.val() === true) {
                const  ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);
                        
                    }
                })
            }
        } );

        this.state.presenceRef.on( 'child_added', snap => {
            if ( currentUserUid !== snap.key ) {
                this.addStatusToUser(snap.key);
            }
        } );

        this.state.presenceRef.on( 'child_removed', snap => {
            if ( currentUserUid !== snap.key ) {
                this.addStatusToUser(snap.key, false);
            }
        } );
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUser = this.state.users.reduce(( acc, user ) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline' }`
            }
            return acc.concat(user);
        }, []);
        this.setState({ users : updatedUser })
    }

    userOnline = user => user.status === 'online';

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id : channelId,
            name : user.name
        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
        this.setActiveChannel(user.uid);
    }

    setActiveChannel = userId => {
        this.setState({ activeChannel : userId });
    }

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;
        return userId < currentUserId ? 
        `${userId} / ${currentUserId} ` :
        `${currentUserId} / ${userId}`;
    }
    

    render() {

        const {users, activeChannel} = this.state;

        return (

            <div style = {{marginTop : 20}} >
            <Button type = 'link' style = {{color : 'white'}} >

                DirectMessage {' '} ({users.length})
            </Button>
            <PerfectScrollbar>
                
            <div style = {{marginTop : 5, height: 150, width : 'auto'}} >
                {users.map(user => (
            <Menu.Item style = {{color : 'white'}} 
                active = {activeChannel}
                key = {user.uid} 
                onSelect = { () => this.changeChannel(user) } >
                @{user.name}
               <Icon icon = 'symbol-circle' style = {{float : 'right', marginTop : 3}}
               color = { this.userOnline(user) ? 'success' : 'danger' } />
            </Menu.Item>

                ) )}
            </div>
            </PerfectScrollbar>
            </div>
        )
    }
}

export default connect( null, {setCurrentChannel, setPrivateChannel})
 (DirectMessage);