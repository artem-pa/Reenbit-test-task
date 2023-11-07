import React, { useRef, useContext, useEffect, useState } from 'react';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';

import { IMessage, IUser } from '../../interfaces/interface';
import { AppContext, ContextType } from '../../context/context';
import { db, answer } from '../../services/services';


const RightSide = () => {
  const { appData, setAppData, activeContact, setActiveContact, loadingContacts, setLoadingContacts }: ContextType = useContext(AppContext);

  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [localContact, setLocalContact] = useState<IUser | null>(null);

  const sendIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M440 6.5L24 246.4c-34.4 19.9-31.1 70.8 5.7 85.9L144 379.6V464c0 46.4 59.2 65.5 86.6 28.6l43.8-59.1 111.9 46.2c5.9 2.4 12.1 3.6 18.3 3.6 8.2 0 16.3-2.1 23.6-6.2 12.8-7.2 21.6-20 23.9-34.5l59.4-387.2c6.1-40.1-36.9-68.8-71.5-48.9zM192 464v-64.6l36.6 15.1L192 464zm212.6-28.7l-153.8-63.5L391 169.5c10.7-15.5-9.5-33.5-23.7-21.2L155.8 332.6 48 288 464 48l-59.4 387.3z'/%3E%3C/svg%3E";
  const backArrow = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3C!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --%3E%3Cpath d='M9.375 233.4l128-128c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H480c17.69 0 32 14.31 32 32s-14.31 32-32 32H109.3l73.38 73.38c12.5 12.5 12.5 32.75 0 45.25c-12.49 12.49-32.74 12.51-45.25 0l-128-128C-3.125 266.1-3.125 245.9 9.375 233.4z'/%3E%3C/svg%3E";

  useEffect(() => {
    if (activeContact !== null) {
      setLocalContact(activeContact);
      setActiveContact(appData[appData.findIndex(user => user.id === activeContact.id)]);
    }
  }, [appData, activeContact])

  useEffect(() => {
    if (localContact !== null) {
      setMessageList(localContact.messages);
      scrollDown();
    }
  }, [localContact])

  const mainRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(loadingContacts);
  loadingRef.current = loadingContacts;

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
    db.uploadMessage(message, localContact as IUser, setAppData);
    if (!isUserMessage) notify(localContact as IUser, message)
    setNewMessage('');
  }

  const inputKeyHandler = (e: React.KeyboardEvent) => {
    if (e.key != 'Enter') return;
    sendMessage();
  }

  const getAnswer = () => {
    const [minDelay, maxDelay] = [10e3, 15e3];
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    const loadingContact = { ...localContact } as IUser;

    updateLoadingContacts('add', loadingContact);
    setTimeout(() => {
      answer.loadAnswer(uploadMessage);
      updateLoadingContacts('remove', loadingContact);
    }, delay)
  }

  const notify = (contact: IUser, message: IMessage) => {
    const toastBody = () => (
      <div className='toast'>
        <div className='toast__avatar'>
          <img
            src={require(`../../assets/images/${contact.avatar}`)}
            alt="avatar"
          />
        </div>
        <p className='toast__name'>{contact.name}</p>
        <p className='toast__text'>{message.text}</p>
      </div>
    )

    toast.info(toastBody, {
      position: 'top-right',
      autoClose: 3000,
      transition: Zoom,
      icon: false,
      closeButton: false,
      draggable: false,
    })


  }

  const getDate = (dateNumber: number): string => {
    return (new Date(dateNumber).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }))
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

  const updateLoadingContacts = (status: 'add' | 'remove', contact: IUser) => {
    switch (status) {
      case 'add':
        setLoadingContacts([...loadingContacts, contact.id]);
        return;
      case 'remove':
        const index = loadingRef.current.indexOf(contact.id)
        if (index === -1) return;
        const newArr = loadingRef.current;
        newArr.splice(index, 1);
        setLoadingContacts(newArr);
        return;
    }
  }

  const isLoader = () => {
    return loadingContacts.includes((localContact as IUser).id)
  }

  const scrollDown = () => {
    setTimeout(() => {
      (mainRef.current as HTMLDivElement).scrollTo({
        top: (mainRef.current as HTMLDivElement).scrollHeight,
        behavior: 'auto'
      })
    }, 5);
  }


  return (
    <div className ={!activeContact ? 'right-side' : 'right-side slide-left'}>
      {!localContact
        ?
        <div className="placeholder">
          <span>Select a chat to start messaging</span>
        </div>
        :
        <>
          <div className="top">
            <div className="arrow-back ico-btn" onClick={() => setActiveContact(null)}>
              <img src={backArrow} />
            </div>
            <div className="img">
              <img src={require(`../../assets/images/${localContact.avatar}`)} alt="avatar" />
            </div>
            <p className="name">{localContact.name}</p>
          </div>
          <div className="main" ref={mainRef}>
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
            {
              isLoader()
                ?
                <div className='message__loader'>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                : null
            }
          </div>
          <div className="bottom ico-btn">
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
      <ToastContainer limit={5} />
    </div>
  )
}

export default RightSide