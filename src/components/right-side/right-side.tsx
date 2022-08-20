import React, { useEffect, useRef, useState } from 'react';

import './style.scss';
import sendIcon from '../../assets/images/send_ico.svg';


interface IMessage {
  text: string,
  time: number,
  isUserMessage?: boolean
}

const RightSide = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const listRef = useRef(messageList);
  listRef.current = messageList;

  useEffect(() => {
    setMessageList([
      {
        text: 'Quickly come to the meeting room 18, we have a big issue',
        time: 1660991430000
      },
      {
        text: `I'm having breakfast right now, can't you wait for 10 minutes?`,
        time: 1660991730000,
        isUserMessage: true
      },
      {
        text: `We are losing money! Quick!`,
        time: 1660991790000
      }
    ])
  }, [])

  const inputClickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  }

  const inputKeyHandler = (e: React.KeyboardEvent) => {
    if (e.key != 'Enter') return;
    sendMessage();
  }

  const addMessage = (message: IMessage) => {
    messageList.push(message);
    setNewMessage('');
  }

  const sendMessage = () => {
    if (!newMessage) return;
    const message: IMessage = {
      text: newMessage,
      time: Date.now(),
      isUserMessage: true
    };
    addMessage(message);
    getAnswer();
  }

  const getAnswer = () => {
    fetch('https://api.chucknorris.io/jokes/random')
      .then(res => res.json())
      .then((res: any) => {
        const message: IMessage = {
          text: res.value,
          time: Date.now() + 1e4
        }
        setTimeout(() => setMessageList([...listRef.current, message]), 1e4);
      })
  }

  const getDate = (dateNumber: number): string => {
    return (new Date(dateNumber).toLocaleString('en-US'))
  }


  return (
    <div className="right-side">
      <div className="top">
        <div className="img">
          <div className="fake-avatar">J</div>
        </div>
        <p className="name">Josefina</p>
      </div>
      <div className="main">
        {messageList.map(msg => (
          <div key={msg.time} className={msg.isUserMessage ? 'message output' : 'message input'}>
            <p className="text">{msg.text}</p>
            <p className="time">{getDate(msg.time)}</p>
          </div>
        ))}
      </div>
      <div className="bottom">
        <input
          type="text"
          value={newMessage}
          onChange={inputClickHandler}
          onKeyDown={inputKeyHandler}
          placeholder='Type your message' />
        <img src={sendIcon} onClick={sendMessage} />
      </div>
    </div>
  )
}

export default RightSide