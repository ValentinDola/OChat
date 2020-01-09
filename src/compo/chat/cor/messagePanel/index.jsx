import React from 'react';
import MessageHead from './messageHead/index';
import MessageContent from './messageContent/index';
import MessageForm from './messageForm/index';
import firebase from '../../../../firebase/firebase.js';
import PerfectScrollbar from 'react-perfect-scrollbar';


class MessagePanel extends React.Component {

    state = {
        privateMessagesRef : firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref("messages"),
        channel: this.props.currentChannel,
        privateChannel : this.props.isPrivateChannel,
        user: this.props.currentUser,
        messages : [],
        numUnikUsers : '',
        searchTerm : '',
        searchResults : [],
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if ( channel && user ) {
            this.addListeners(channel.id);
        }
    }

    addListeners = channelId => {
        this.addMessageListeners(channelId);
    }

    countUnikUsers = messages => {
        const unikUsers = messages.reduce(( acc, message ) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, [] );
        const plural = unikUsers.length > 1 || unikUsers.length === 0 ;
        const numUnikUsers = `${unikUsers.length} user${ plural ? 's' : ' ' }`;
        this.setState({ numUnikUsers });
    }

    addMessageListeners = channelId => {
        let loadedMessages = [];
        const ref  = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({ messages : loadedMessages });
            this.countUnikUsers(loadedMessages);
        } )
    }

    getMessagesRef = () => {
        const { messagesRef, privateChannel, privateMessagesRef } = this.state;

        return privateChannel ? privateMessagesRef : messagesRef;

    }

    displayMessages = messages => (
        messages.length > 0 && messages.map( message => (
            <MessageContent 
                key = {message.timestamp}
                message = {message}
                user = {this.state.user}
             />
        ))
    );

    displayChannelName = channel =>{ 
        return channel ? `${this.state.isPrivateChannel ? '@' : '#' } ${channel.name}`
         : ' ';

    }

    handleSearchChange = e => {
        this.setState ({
            searchTerm : e.target.value,
             searchLoading : true,
        }, () => this.handleSearchMessages() );
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp (this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce( (acc, message) => {
            if (message.content.match(regex) || 
            message.user.name.match(regex) ) {
                acc.push(message);
            }
            return acc;
        }, [] );
        this.setState({ searchResults });
    }
    

    render() {

        const { messagesRef, channel, user, messages, 
        numUnikUsers, searchResults,searchTerm, privateChannel } = this.state;

        return (
           <React.Fragment>
                <MessageHead 
                    channelName = {this.displayChannelName(channel)}
                    numUnikUsers = {numUnikUsers}
                    handleSearchChange = {this.handleSearchChange}
                    isPrivateChannel = {privateChannel}
                 />

               
                <div style = {{paddingTop : 70, height: 580, width: "110%"}} >
                 <PerfectScrollbar>
                    <div>
                         { searchTerm ? this.displayMessages(searchResults) :
                          this.displayMessages(messages) }
                    </div>
                        </PerfectScrollbar>
                </div>
               
                
                <MessageForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel = {privateChannel}
                    getMessagesRef = {this.getMessagesRef}
                />
                
                

           </React.Fragment>
        );
    }
}

export default MessagePanel;