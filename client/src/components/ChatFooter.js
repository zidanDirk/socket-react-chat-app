import React, { useState } from 'react';

const ChatFooter = ({socket}) => {
  const [message, setMessage] = useState('');

  const handleTyping = () =>
    socket.emit('typing', `${localStorage.getItem('userName')} 正在输入`);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName')) {
        socket.emit('message', {
          text: message,
          name: localStorage.getItem('userName'),
          id: `${socket.id}${Math.random()}`,
          socketID: socket.id,
        });
      }
    setMessage('');
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="编写消息"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}

        />
        <button className="sendBtn">发送</button>
      </form>
    </div>
  );
};

export default ChatFooter;