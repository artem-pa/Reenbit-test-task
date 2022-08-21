import React, { useContext, useEffect, useRef, useState } from 'react';

import './style.scss';
import sendIcon from '../../assets/images/send_ico.svg';
import { IMessage } from '../../interfaces/interface';
import { AppContext, ContextType } from '../../context/context';

const RightSide = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const listRef = useRef(messageList);
  listRef.current = messageList;

  const { appData, setAppData, activeContact }: ContextType = useContext(AppContext);

  useEffect(() => {
    if (activeContact !== null) {
      setMessageList(activeContact.messages);
    }
  }, [activeContact])

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
    return (new Date(dateNumber).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }))
  }


  return (
    <div className="right-side">
      {!activeContact
        ?
        <div className="placeholder">
          <span>Select a chat to start messaging</span>
        </div>
        :
        <>
          <div className="top">
            <div className="img">
              <img src={require(`../../assets/images/${activeContact.avatar}`)} alt="avatar" />
            </div>
            <p className="name">{activeContact.name}</p>
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
        </>
      }
    </div>
  )
}

export default RightSide