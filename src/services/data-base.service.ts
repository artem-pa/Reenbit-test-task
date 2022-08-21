import { get } from 'https';
import { API_URL } from '../helpers/constants';
import { IUser } from '../interfaces/interface';
import { data } from '../mockup-data';

class DataBase {
  public setMockupData (): void {
    if (this.checkStorage()) return;
    localStorage.setItem(API_URL, JSON.stringify(data));
  }

  public getFullData (): IUser[] {
    return JSON.parse(localStorage.getItem(API_URL) as string);
  }

  private loadData(): string | null {
    return localStorage.getItem(API_URL);
  }

  private checkStorage (): boolean {
    return !!this.loadData();
  }
}

export default DataBase