import { IUser } from "./interfaces/interface";

export const data: IUser[] = [
  {
    name: 'Alice Freeman',
    id: 'afreeman',
    avatar: 'afreeman.png',
    messages: [
      {
        text: 'Hello)',
        time: 1660991000000,
        isUserMessage: true
      },
      {
        text: 'You are the worst!',
        time: 1660991990000
      }
    ]
  },
  {
    name: 'John Wick',
    id: 'johnw',
    avatar: 'johnw.png',
    messages: [
      {
        text: 'Give me a work',
        time: 1660115100000
      },
      {
        text: 'Somebody please!',
        time: 1660115700000,
        isUserMessage: true
      },
      {
        text: 'give this man a work',
        time: 1660115750000,
        isUserMessage: true
      }
    ]
  },
  {
    name: 'Josefina',
    id: 'josefina',
    avatar: 'josefina.jpg',
    messages: [
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
    ]
  },
  {
    name: 'Barrera',
    id: 'barrera',
    avatar: 'barrera.png',
    messages: [
      {
        text: 'Hi!',
        time: 1660563000000,
        isUserMessage: true
      },
      {
        text: 'Hello)',
        time: 1660568100000
      }
    ]
  },
  {
    name: 'Velazquez',
    id: 'velaz',
    avatar: 'velaz.jpg',
    messages: [
      {
        text: 'Quickly come to the meeting room 1B, we have a big issue',
        time: 1660889400000
      }
    ]
  }
] 