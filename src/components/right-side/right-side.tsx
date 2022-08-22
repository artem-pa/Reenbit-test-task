import React, { useContext, useEffect, useRef, useState } from 'react';

import './style.scss';
import sendIcon from '../../assets/images/send_ico.svg';
import { IMessage, IUser } from '../../interfaces/interface';
import { AppContext, ContextType } from '../../context/context';
import { db } from '../../services/services';

const RightSide = () => {
  const { appData, setAppData, activeContact, setActiveContact }: ContextType = useContext(AppContext);

  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  // const listRef = useRef(messageList);
  // listRef.current = messageList;

  useEffect(() => {
    if (activeContact !== null) {
      setMessageList(activeContact.messages);
      setActiveContact(appData[appData.findIndex(user => user.id === activeContact.id)])
    }
  }, [activeContact, appData])

  const sendMessage = () => {
    if (!newMessage) return;
    const message: IMessage = {
      text: newMessage,
      time: Date.now(),
      isUserMessage: true
    };
    uploadMessage(message);
    // getAnswer();
  }

  const uploadMessage = (message: IMessage) => {
    db.uploadMessage(message, activeContact as IUser, setAppData);
    setNewMessage('');
  }

  const inputKeyHandler = (e: React.KeyboardEvent) => {
    if (e.key != 'Enter') return;
    sendMessage();
  }

  const getAnswer = () => {
    fetch('https://api.chucknorris.io/jokes/random')
      .then(res => res.json())
      .then((res: any) => {
        const message: IMessage = {
          text: res.value,
          time: Date.now() + 1e4
        }
        // setTimeout(() => setMessageList([...listRef.current, message]), 1e4);
      })
  }

  const getDate = (dateNumber: number): string => {
    return (new Date(dateNumber).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }))
  }

  const shouldShowTime = (value: IMessage, index: number): boolean => {
    if (index === messageList.length - 1) return true;
    if (messageList[index+1].time - value.time > 3.6e6) return true; //3.e6 ms = 1 h
    if (
      (value.isUserMessage && !messageList[index + 1].isUserMessage) ||
      (!value.isUserMessage && messageList[index + 1].isUserMessage)
    ) return true;
    return false;
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
            {messageList.map((msg, i) => (
              <div key={msg.time} className={msg.isUserMessage ? 'message output' : 'message input'}>
                <p className="text">{msg.text}</p>
                {
                  shouldShowTime(msg, i)
                    ? <p className="time">{getDate(msg.time)}</p>
                    : null
                }
              </div>
            ))}
          </div>
          <div className="bottom">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
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