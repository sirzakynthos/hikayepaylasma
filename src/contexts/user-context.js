import { createContext, useEffect, useState } from "react";
import { onAuthStateChangedListener, SignOutHelper } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) navigate("/");
      setCurrentUser(user);
      console.log(user);
    });
    return unsubscribe;
  }, []);
  const value = { currentUser, setCurrentUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
