export interface IMessage {
  text: string,
  time: number,
  isUserMessage?: boolean
}

export interface IUser {
  name: string,
  id: string,
  avatar: string,
  messages: IMessage[]
}