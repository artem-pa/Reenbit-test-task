import './style.scss';

const arr = Array.from(Array(15).keys()); 

const LeftSide = () => {
  return (
    <div className="left-side">
      <div className="top">
        <div className="user">
          <a href="/" className="user__img"></a>
        </div>
        <div className="search">
          <input type="text" placeholder='Search or start new chat'/>
        </div>
      </div>

      <div className="bottom">
        <h1 className="title">Chats</h1>
        <ul className="contact-list">
          {arr.map((num,i) => (
            <li className="contact" key={i}>
            <div className="contact__img">
              <div className="fake-avatar">{num}</div>
            </div>
            <p className="contact__name">Alice Freeman</p>
            <p className="contact__message">You are the worst!</p>
            <div className="contact__time">Aug 20, 2022</div>
          </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LeftSide;