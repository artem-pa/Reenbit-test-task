import { createContext } from "react";
import { IUser } from "../interfaces/interface";

export type ContextType = {
  appData: IUser[],
  setAppData: React.Dispatch<React.SetStateAction<IUser[]>>,
  activeContact: IUser | null, 
  setActiveContact: React.Dispatch<React.SetStateAction<IUser | null>>,
  loadingContacts: string[],
  setLoadingContacts: React.Dispatch<React.SetStateAction<string[]>>
}

export const AppContext = createContext<any>(null);