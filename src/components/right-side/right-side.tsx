import './style.scss';
import sendIcon from '../../assets/images/send_ico.svg';

const RightSide = () => {
  return (
    <div className="right-side">
      <div className="top">
        <div className="img">
          <div className="fake-avatar">J</div>
        </div>
        <p className="name">Josefina</p>
      </div>
      <div className="main">
        <div className="message input">
          <p className="text">
            Quickly come to the meeting room 18, we have a big issue
          </p>
          <p className="time">4/22/17, 4:00 AM</p>
        </div>
        <div className="message output">
          <p className="text">
            I'm having breakfast right now, can't you wait for 10 minutes?
          </p>
          <p className="time">4/22/17, 4:01 AM</p>
        </div>
        <div className="message input">
          <p className="text">
            We are losing money! Quick!
          </p>
          <p className="time">4/22/17, 4:10 AM</p>
        </div>
      </div>
      <div className="bottom">
        <input type="text" placeholder='Type your message'/>
        <img src={sendIcon} alt="d"/>
      </div>
    </div>
  )
}

export default RightSide