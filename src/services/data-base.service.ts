import { API_DB } from '../helpers/constants';
import { IMessage, IUser } from '../interfaces/interface';
import { data } from '../mockup-data';

class DataBase {
  public setMockupData(): void {
    if (this.checkStorage()) return;
    localStorage.setItem(API_DB, JSON.stringify(data));
  }

  public getFullData(): IUser[] {
    return JSON.parse(localStorage.getItem(API_DB) as string);
  }

  public uploadMessage(message: IMessage, activeUser: IUser, callback: (str: IUser[]) => void) {
    try {
      const data = this.getFullData();
      const index = data.findIndex(value => value.id === activeUser.id);
      data[index].messages.push(message);
      localStorage.setItem(API_DB, JSON.stringify(data))
    }
    finally {
      callback(this.getFullData());
    }
  }

  private loadData(): string | null {
    return localStorage.getItem(API_DB);
  }

  private checkStorage(): boolean {
    return !!this.loadData();
  }
}

export default DataBase