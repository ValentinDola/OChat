import React from 'react';
import { connect } from 'react-redux'
import SidePanel from './sidePanel/index';
import MessagePanel from './messagePanel/index';
import { Row, Col } from 'antd';

const Chat = ( { currentUser, currentChannel, isPrivateChannel  } ) => (
    
    <React.Fragment>
        <Row>
            <Col span={18} push={4}>
                <MessagePanel 
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    currentUser={currentUser}
                    isPrivateChannel = {isPrivateChannel}
                />
            </Col>
            <Col span={6} pull={18}>
                <SidePanel 
                key = {currentUser && currentUser.uid}
                currentUser = {currentUser} 

                />
            </Col>
        </Row>
    </React.Fragment>
    
)

const mapStateToProps = state =>({
    currentUser : state.user.currentUser,
    currentChannel : state.channel.currentChannel,
    isPrivateChannel : state.channel.isPrivateChannel,
})

export default connect( mapStateToProps )(Chat);
