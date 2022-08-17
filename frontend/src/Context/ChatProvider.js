import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../config/environmentVar";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedChat, setSelectedChat] = useState();
  const [selectedSetting, setSelectedSetting] = useState();
  const [user, setUser] = useState();
  const [notificationsData, setNotificationsData] = useState({
    notifications: [],
  });
  const [chats, setChats] = useState([]);

  const fetchAndSetNotifications = async (user) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${apiUrl}/api/v1/notification`, config);
      setNotificationsData(data);
    } catch (error) {
      console.error("failed to fetch notificationsData");
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (userInfo && userInfo.token) {
      fetchAndSetNotifications(userInfo);
    }

    if (!userInfo && location.pathname !== "/forgot/password") navigate("/");
  }, [navigate, location.pathname]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notificationsData,
        setNotificationsData,
        chats,
        setChats,
        selectedSetting,
        setSelectedSetting,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
