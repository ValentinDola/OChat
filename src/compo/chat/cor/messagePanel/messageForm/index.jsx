import React from 'react';
import { Form, Input, Button } from 'antd';
import firebase from '../../../../../firebase/firebase.js';


const { TextArea } = Input;


class MessageForm extends React.Component {

    state = {
        message : ' ',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
    }

    sendMessage = e => {
    const { getMessagesRef } = this.props;
    const { message , channel} = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        if (message) {
            getMessagesRef()
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then( () => {
                    this.setState({ message : '' });
                } )
                .catch ( err => {
                    console.error(err);
                    
                } )

        }
      }
    });
  };

  createMessage =() => {
     const message = {
         timestamp : firebase.database.ServerValue.TIMESTAMP,
         user : {
             id : this.state.user.uid,
             name : this.state.user.displayName,
             avatar : this.state.user.photoURL,
         },
        content : this.state.message,
     }
     return message;
  }

  handleChange = e => {
      this.setState({ [ e.target.name] : e.target.value });
  }

    render() {
        const { message } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className = 'message__form' onSubmit={this.sendMessage} >

            <Form.Item >
          {getFieldDecorator('message', {
            rules: [
              {
                required: true,
              },
            ],
          })(<TextArea name = 'message' setfieldsvalue = { message || '' }
          rows = {3} placeholder="Write Your Message" 
          onPressEnter = {this.sendMessage}
          allowClear onChange={this.handleChange} />)}
            </Form.Item>
        </Form>
            
        )
    }
}

const WrappedMessageForm = Form.create({ name: 'register' })(MessageForm);

export default WrappedMessageForm;