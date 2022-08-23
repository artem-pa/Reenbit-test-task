import React, { useContext, useEffect, useState } from 'react';

import sendIcon from '../../assets/images/send_ico.svg';
import './style.scss';

import { IMessage, IUser } from '../../interfaces/interface';
import { AppContext, ContextType } from '../../context/context';
import { db, answer } from '../../services/services';


const RightSide = () => {
  const { appData, setAppData, activeContact, setActiveContact }: ContextType = useContext(AppContext);

  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);

  useEffect(() => {
    if (activeContact !== null) {
      setMessageList(activeContact.messages);
      setActiveContact(appData[appData.findIndex(user => user.id === activeContact.id)])
    }
  }, [activeContact, appData])

  const sendMessage = () => {
    if (!newMessage) return;
    uploadMessage(newMessage, true);
    getAnswer();
  }

  const uploadMessage = (text: string, isUserMessage?: boolean) => {
    const message = {
      text: text,
      time: Date.now(),
      isUserMessage: isUserMessage
    }
    db.uploadMessage(message, activeContact as IUser, setAppData);
    setNewMessage('');
  }

  const inputKeyHandler = (e: React.KeyboardEvent) => {
    if (e.key != 'Enter') return;
    sendMessage();
  }

  const getAnswer = () => {
    const [minDelay, maxDelay] = [10e3, 15e3];
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    console.log(delay)
    setTimeout(() => answer.loadAnswer(uploadMessage), delay)
  }

  const getDate = (dateNumber: number): string => {
    return (new Date(dateNumber).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'long' }))
  }

  const shouldShowTime = (value: IMessage, index: number): boolean => {
    if (index === messageList.length - 1) return true;
    if (messageList[index + 1].time - value.time > 3.6e6) return true; //3.e6 ms = 1 h
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