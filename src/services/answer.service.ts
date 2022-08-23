import { API_ANSWER } from "../helpers/constants";

type AnswerType = {
  value: string;
  [key: string]: any;
}

class Answer {
  public loadAnswer = async (callback: (text: string) => void) => {
    return fetch(API_ANSWER)
      .then((res) => {
        if (res.status !== 200) throw new Error('Something went wrong');
        return res.json() as Promise<AnswerType>;
      })
      .then(res => callback(res.value))
      .catch(this.errorHandler)
  }

  private errorHandler (err: Error) {
    alert(err.message)
  }
}

export default Answer