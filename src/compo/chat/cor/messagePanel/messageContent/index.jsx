import React from 'react';
import { Comment, Icon, Tooltip, Avatar } from 'antd';
import moment from 'moment';

const MessageContent = ({ message, user }) => (
            <Comment
            author= <a>{message.user.name}</a>
            avatar={
          <Avatar
            src={message.user.avatar}
          />
        }
        content={ message.content }
        datetime={
          <Tooltip title={moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(message.timestamp).fromNow()}</span>
          </Tooltip>
        }
      />
)

export default MessageContent;