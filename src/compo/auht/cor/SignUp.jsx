import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  message,
} from 'antd';
import md5 from "md5";
import firebase from '../../../firebase/firebase.js';

class SignUp extends React.Component {

    state = {
    loading : false,
    username : '',
    email : '',
    password : '',
    confirm : '',
    usersRef: firebase.database().ref("users")
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          this.setState({ loading : true })
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( createdUser => {
                console.log(createdUser);
                message.success('Account created');
                this.setState({ loading : false });
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                photoURL: `http://gravatar.com/avatar/${md5(
                    createdUser.user.email
                    )}?d=identicon`
             })
            .then(() => {
                this.saveUser(createdUser).then(() => {
                    message.success('User saved');
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    loading: false
                });
            });
                
            } )
            .catch( err => {
                console.error(err);
                message.error('We have some Error')
                this.setState({ loading : false });
            } )
      }
    });
  };

   saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleChange = e => {
      this.setState({ [e.target.name] : e.target.value });
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

    render() {

       const { getFieldDecorator } = this.props.form;
       const { username, password, email, confirm, loading } = this.state;

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

            <Form style = {{width : 550, paddingTop : 150, marginLeft : 300 }} {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="Username">
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Please input your Usename',
              },
            ],
          })(<Input  
          name = 'username' 
              setfieldsvalue = {username || ' ' }
              onChange = {this.handleChange}
          />)}
          </Form.Item>
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input 
          name = 'email'
          setfieldsvalue = {email || ' '} 
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
          })(<Input.Password  name = 'password'
          setfieldsvalue = {password || ' '}  
          onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password 
          name = 'confirm'
          setfieldsvalue = {confirm || ' '}
           onBlur={this.handleConfirmBlur} 
           onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
            <span>Already have an Account 
            <NavLink to = '/auth/login' >  Login </NavLink> 
            </span>
            <br/>
          <Button disabled = {loading} 
          loading = {loading ? ' ' : loading}
           type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
        </Form>
             
        );
    }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(SignUp);

export default WrappedRegistrationForm;