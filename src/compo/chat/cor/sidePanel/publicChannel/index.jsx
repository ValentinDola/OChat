import React from 'react';
import firebase from '../../../../../firebase/firebase.js';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../../../actions';
import {  Input, Form, Button, Badge } from 'antd';
import { Modal  } from 'rsuite';
import { Menu } from 'evergreen-ui';
import PerfectScrollbar from 'react-perfect-scrollbar';


class PublicChannel extends React.Component {

    state = { 
        visible: false,
        user : this.props.currentUser,
        channelName : '',
        channelDescription : '',
        channel : null,
        channels : [],
        channelsRef : firebase.database().ref('channels'),
        messagesRef : firebase.database().ref('messages'),
        notifications : [],
        firstLoad : true,
        activeChannel : ' ',
        show: false,
    };

    

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    
  close = () => {
    this.setState({ show: false });
  }
  open = () => {
    this.setState({ show: true });
  }

    addListeners = () => {
        let loadedChannels = [];

        this.state.channelsRef.on('child_added' , snap => {
            loadedChannels.push( snap.val() );
            this.setState({ channels : loadedChannels }, () => 
            this.setFirstChannel() );
            this.addNotificationListener(snap.key)
        } )
    }

    addNotificationListener = channelId => {
      this.state.messagesRef.child(channelId).on( 'value' , snap => {
        if (this.state.channel) {
          this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
        }
      } )
    }

    handleNotifications = ( channelId, currentChannelId, notifications, snap ) => {
      let lastTotal = 0;

      let index = notifications.findIndex(notification => notification.id === channelId);

      if (index !== -1 ) {
        if (channelId !== currentChannelId) {
          lastTotal = notifications[index].total;

          if(snap.numChildren() - lastTotal > 0  ) {
            notifications[index].count = snap.numChildren() - lastTotal;
          }
        }
        notifications[index].lastKnownTotal = snap.numChildren();
      }else {
        notifications.push({
          id : channelId,
          total : snap.numChildren(),
          lastKnownTotal : snap.numChildren(),
          count : 0,
        })
      }
      this.setState({ notifications });
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel =() => {
        const firstChannel = this.state.channels[0]
        if (this.state.firstLoad && this.state.channels.length > 0 ) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({ channel : firstChannel });
        }
        this.setState({ firstLoad : false });
    }
    

handleChange = e => {
      this.setState({ [e.target.name] : e.target.value });
  }

changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
}

clearNotifications = () => {
  let index = this.state.notifications.findIndex(notification => 
  notification.id === this.state.channel.id);

  if (index !== -1 ) {
    let updateNotifications = [...this.state.notifications];

    updateNotifications[index].total = this.state.notifications[index].lastKnownTotal;

    updateNotifications[index].count = 0;

    this.setState({ notifications : updateNotifications });
  }

  


}

getNotificationCount = channel => {

  let count = 0;

  this.state.notifications.forEach(notification => {
    if (notification.id === channel.id) {
      count = notification.count;
      console.log(notification.count);
    }
  })

  if (count > 0) return count;
  
}

setActiveChannel = channel => {
    this.setState({ activeChannel : channel.id });
}

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      visible: false,
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.addChannel();
      }
    });
  };

  addChannel = () => {
        const { channelsRef, channelName,channelDescription, user  } = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id : key,
            name : channelName,
            details : channelDescription,
            createdBy : {
                name : user.displayName,
                avatar : user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then( ( )=> {
                this.setState({ channelName : ' ', channelDescription : ' ' });
                this.close();
                console.log('channel added');
            })
            .catch( err => {
                console.error(err);
                
            } )
    }

  displayChannels = channels => 
      channels.length > 0 && channels.map( channel => (
        <Menu.Item 
            key={channel.id}
            onSelect = {() => this.changeChannel(channel)}
            name={channel.name}
            active = { channel.id  }
            ># {channel.name}
        </Menu.Item>
       ))

    render() {

       const { getFieldDecorator} = this.props.form;
       const { channelName , channelDescription, channels, channel } = this.state;

        return (
            <div>

                <div  >
                    <Button style = {{ marginTop : 25, color : 'white' }}
                     type = 'link' >
                        # {' '} Channel {' '} ({ channels.length })
                    </Button>
                    <Button  onClick={this.open}
                    style = {{color : 'white', marginLeft : 20}} 
                    type="link" icon="plus"  />
                    
                </div>
                <PerfectScrollbar>
                    <div style = {{marginTop : 10, color : 'white', height: 150, width : 'auto'}} >
                    { this.getNotificationCount(channel) && (
                        <Badge count={this.getNotificationCount(channel)} />
                    ) }
                        {this.displayChannels(channels)}
                        
                    </div>
                </PerfectScrollbar>
                <div className="modal-container">
        

        <Modal style = {{marginTop : 50}} show={this.state.show} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>Create Channel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form style = {{width : 'auto' }}  onSubmit={this.handleSubmit}>
                        <Form.Item >
                        {getFieldDecorator('name', {
                        rules: [
                        {
                            required: true,
                            message: 'Please input the name',
                        },
                        ],
                    })(<Input name = 'channelName'  placeholder = 'Channel Name'
                        setfieldsvalue = {channelName || ' ' }
                        onChange = {this.handleChange} />)}
                    </Form.Item>
                    <Form.Item>
                    {getFieldDecorator('description', {
                        rules: [
                        {
                            required: true,
                            message: 'Please input the description!',
                        },
                        ],
                    })(<Input name = 'channelDescription'  placeholder = 'Channel Description'
                        setfieldsvalue = {channelDescription || ' ' }
                        onChange = {this.handleChange} />)}
                    </Form.Item>
                </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button style = {{ marginRight : 20 }} onClick={this.handleSubmit} type="primary">
              Create
            </Button>
            <Button  onClick={this.close} type = 'dashed' >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
        )
    }
}

const WrappedPublicChannelForm = Form.create({ name: 'register' })(PublicChannel);

export default connect( null, { setCurrentChannel, setPrivateChannel } )(WrappedPublicChannelForm);