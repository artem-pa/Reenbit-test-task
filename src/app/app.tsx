import { useEffect, useState } from "react";

import LeftSide from "../components/left-side/left-side";
import RightSide from "../components/right-side/right-side";

import "../assets/styles/style.scss";
import { db } from "../services/services";
import { AppContext } from "../context/context";
import { IUser } from "../interfaces/interface";

const App = () => {

  const [appData, setAppData] = useState<IUser[]>([]);
  const [activeContact, setActiveContact] = useState<IUser | null>(null);
  const [loadingContacts, setLoadingContacts] = useState<string[]>([]);

  useEffect(() => {
    db.setMockupData();
    setAppData(db.getFullData())
  }, [])


  return (
    <AppContext.Provider value={{
      appData, setAppData,
      activeContact, setActiveContact,
      loadingContacts, setLoadingContacts
    }}>
      <LeftSide></LeftSide>
      <RightSide></RightSide>
    </AppContext.Provider>
  )
}

export default App