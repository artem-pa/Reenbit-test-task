import React, { useContext, useEffect, useMemo, useState } from 'react';

import './style.scss';
import myAvatar from '../../assets/images/my_avatar.jpg';
import { AppContext, ContextType } from '../../context/context';
import { IUser } from '../../interfaces/interface';


const LeftSide = () => {
  const { appData, setAppData, setActiveContact }: ContextType = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  const sortedUsers = useMemo(() => {
    console.log('sorted')
    return [...appData].sort((a, b) => {
      const first = a.messages.slice(-1)[0].time;
      const second = b.messages.slice(-1)[0].time;
      return second - first;
    })
  }, [appData])

  const searchedUsers = useMemo(() => {
    console.log('filterd')
    if (searchQuery === '') return sortedUsers;
    return sortedUsers.filter(user => {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
  }, [sortedUsers, searchQuery])

  const getDate = (dateNum: number): string => {
    return (new Date(dateNum)).toLocaleDateString('en-US', { dateStyle: 'medium' })
  }


  return (
    <div className="left-side">
      <div className="top">
        <div className="user">
          <a href="/" className="user__img">
            <img src={myAvatar} alt="my avatar" />
          </a>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder='Search or start new chat'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bottom">
        <h1 className="title">Chats</h1>
        <ul className="contact-list">
          {searchedUsers.map((user) => (
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
        {searchedUsers.length !== 0
          ? null
          : <p className='no-results'>No results...</p>
        }
      </div>
    </div>
  )
}

export default LeftSide;