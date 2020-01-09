import React from 'react';
import mime from 'mime-types'
import { Layout, Input ,Icon, Row, Col, Dropdown, Menu } from 'antd';
import { Uploader, Modal, Button, ButtonToolbar } from 'rsuite';

const { Header : HeaderComponent } = Layout;
const { Search } = Input;

class MessageHead extends React.Component {


    state = {
      show: false,
      value: [],
      authorized : [ 'image/jpeg', 'image/png', 'image/pdf' ],
    };


  close = () => {
    this.setState({ show : false });
  }
  open = () => {
    this.setState({ show : true });
  }

  handleChange = (value ) => {
      if ( value ) {
          this.setState({ value });
        console.log(value['0'].blobFile);
    }
  }

  handleSearch = value => {
    console.log(value)
    this.setState({searchTerm : value,
     searchLoading : true});
  }
    
  handleUpload = () => {
    this.uploader.start();
  }
  handleReupload = (file) => {
    this.uploader.start(file);
  }

   sendFile = (value) => {
        if ( value ) {
            if (this.isAuthorize(value.name)) {
                const metadata = {
                    contentType : mime.lookup((value['0'].blobFile.name))
                };
                this.handleUpload(value['0'], metadata);
                this.close();
                this.clearFile();

            }
        }
    }

    isAuthorize = value => this.state.authorized.includes(
        mime.lookup(value['0'].blobFile.name)
    );

    clearFile = () => this.setState({ value : [] });

    render () {

        const { channelName, numUnikUsers, handleSearchChange, searchLoading } = this.props;
        const { searchTerm } = this.state;

        return (
           <HeaderComponent  style={{
                    // boxShadow: 'rgb(240, 241, 242) 0px 2px 8px 0px',
                    background: '#fff',
                    padding: 0,
                    position: 'fixed',
                    zIndex: 1,
                    width: 'calc(100% - 200px)',}} >
                <div style={{
                    width: "100%",
                    height: "100%",
                    padding: "0 8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"}} >
                    
                    {/* <Row >
                        <Col span={12} > */}
                            <span style = {{fontSize : 20, color : 'black'}} >
                        {channelName}
                    </span>
                    <span>{numUnikUsers}</span>
                    

                     <Button appearance="link" style = {{ color : 'black'}} > 
                    <Icon type = 'star' /></Button>

                    
                       
                        <div>
                       <Dropdown placement="bottomCenter" overlay={ <Menu 
                       style = {{width : 220, marginTop : 2 }}>
                            <Menu.Item  key="0">
                            Signed as 
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="1">
                                Change Avatar
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                key="3">Log Out
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                key="3">Log Out
                            </Menu.Item>
                </Menu>} trigger={['click']}>
                <div>
                    <Button style = {{ color : '#F85C50', }} 
                    appearance="link" >
                     <Icon type = 'setting' /></Button>
               
                </div>
                 </Dropdown>
                   </div>
                             

                    <Button style = {{ color : '#F85C50', }} 
                    appearance="link" disabled onClick={this.open}> 
                    <Icon type = 'paper-clip' /></Button>

                    <Input
                    placeholder="input search text"
                    onChange={handleSearchChange}
                    allowClear
                    style={{ width: 250 }}
                    />
                   
            
                   

                   <div className="modal-container">

                    <Modal style = {{ marginTop : 50 }} show={this.state.show} onHide={this.close}>
                        <Modal.Header>
                            <Modal.Title>Send Picture Or PDF</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Uploader
                                autoUpload={false}
                                action="//jsonplaceholder.typicode.com/posts/"
                                onChange={this.handleChange}
                                ref={ref => {
                                    this.uploader = ref;
                                }}
                                />
                                <hr />
                                <Button disabled={!this.state.value.length} onClick={this.handleUpload}>
                                Start Upload
                                </Button>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.sendFile} appearance="primary">
                            Send
                            </Button>
                            <Button onClick={this.close} appearance="subtle">
                            Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
           </HeaderComponent>
           
        );
    }
}

export default MessageHead;