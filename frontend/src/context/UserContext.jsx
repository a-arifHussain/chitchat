import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Create the context
export const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chatFriend, setChatFriend] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getLogedInUser() {
      try {
        const res = await axios.get("http://localhost:5001/user/logedInUser", {
          withCredentials: true,
        });
        setUser(res.data);
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
    getLogedInUser();
  }, [chatFriend]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        chatFriend,
        setChatFriend,
        messageList,
        setMessageList,
        newMessage,
        setNewMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const {
    user,
    setUser,
    chatFriend,
    setChatFriend,
    messageList,
    setMessageList,
    newMessage,
    setNewMessage,
  } = useContext(UserContext);
  return {
    user,
    setUser,
    chatFriend,
    setChatFriend,
    messageList,
    setMessageList,
    newMessage,
    setNewMessage,
  };
}
