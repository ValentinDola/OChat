import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Form,
  Input,
    Button,
    message
} from 'antd';
import firebase from '../../../firebase/firebase.js';

class LogIn extends React.Component {

    state = {
        email : '',
        password : '' ,
        loading : false,
    };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading : true })
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then( signedInUser => {
                console.log(signedInUser);
                message.success('You Signed In');
                this.setState({ loading : false });
            }).catch((err) => {
                console.error(err);
                this.setState({ loading : false });
                message.error('We Have an error')
            });
      }
    });
  };

  handleChange = e => {
      this.setState({ [e.target.name] : e.target.value });
  }

  

    render() {

       const { getFieldDecorator } = this.props.form;
       const { email, password, loading } = this.state;

       const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
        return (

            <Form style = {{width : 550, paddingTop : 170, marginLeft : 300 }} 
            {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [
                 {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your Email',
              },
            ],
          })(<Input name = 'email' 
              setfieldsvalue = {email || ' ' }
              onChange = {this.handleChange} />)}
          </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password name = 'password' 
              setfieldsvalue = {password || ' ' }
              onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
        <span>Don't have an Account yet?? 
        <NavLink to = '/' >   Register</NavLink> </span>
        <br/>
          <Button disabled = {loading} 
          loading = {loading ? ' ' : loading}
           type="primary" htmlType="submit">
            LogIn
          </Button>
        </Form.Item>
        </Form>
             
        );
    }
}

const WrappedLoginForm = Form.create({ name: 'register' })(LogIn);

export default WrappedLoginForm;