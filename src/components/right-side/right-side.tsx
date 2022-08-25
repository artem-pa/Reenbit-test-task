import React, { useRef, useContext, useEffect, useState } from 'react';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import sendIcon from '../../assets/images/send_ico.svg';
import backArrow from '../../assets/images/arrow.svg';
import './style.scss';

import { IMessage, IUser } from '../../interfaces/interface';
import { AppContext, ContextType } from '../../context/context';
import { db, answer } from '../../services/services';


const RightSide = () => {
  const { appData, setAppData, activeContact, setActiveContact, loadingContacts, setLoadingContacts }: ContextType = useContext(AppContext);

  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [localContact, setLocalContact] = useState<IUser | null>(null);

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