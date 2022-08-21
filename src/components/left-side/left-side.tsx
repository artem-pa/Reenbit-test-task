import { useContext, useEffect } from 'react';

import './style.scss';
import myAvatar from '../../assets/images/my_avatar.jpg';
import { AppContext, ContextType } from '../../context/context';


const LeftSide = () => {
  const { appData, setAppData, activeContact, setActiveContact }: ContextType = useContext(AppContext);

  const getDate = (dateNum: number): string => {
    return (new Date(dateNum)).toLocaleDateString('en-US', { dateStyle: 'medium' })
  }


  return (
    <div className="left-side">
      <div className="top">
        <div className="user">
          <a href="/" className="user__img">
            <img src={myAvatar} alt="" />
          </a>
        </div>
        <div className="search">
          <input type="text" placeholder='Search or start new chat' />
        </div>
      </div>

      <div className="bottom">
        <h1 className="title">Chats</h1>
        <ul className="contact-list">
          {appData.map((user) => (
            <li
              className="contact"
              key={user.id}
              onClick={() => setActiveContact(user)}
            >
              <div className="contact__img">
                <img src={require(`../../assets/images/${user.avatar}`)} alt="" />
              </div>
              <p className="contact__name">{user.name}</p>
              <p className="contact__message">
                {user.messages.slice(-1)[0].text}
              </p>
              <div className="contact__time">
                {getDate(user.messages.slice(-1)[0].time)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LeftSide;