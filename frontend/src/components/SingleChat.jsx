import { useEffect, useState } from "react";
import "./styles.css";
import {
  IconButton,
  Spinner,
  Textarea,
  useToast,
  FormControl,
  Box,
  Text,
  Container,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import axios from "axios";
import Lottie from "react-lottie";
import { io } from "socket.io-client";

import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { apiUrl } from "../config/environmentVar";

import { getSender, getSenderFull } from "../config/ChatLogics";
import { useRef } from "react";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [textareaDisable, setTextareaDisable] = useState(false);
  // const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // const[notificationsEditLoading,setNotificationsEditLoading] = useState(false);
  const ref = useRef({
    notificationsEditLoading: false,
    typing: false,
  });
  const toast = useToast();

  const {
    selectedChat,
    setSelectedChat,
    user,
    notificationsData,
    setNotificationsData,
  } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${apiUrl}/api/v1/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && !event.shiftKey && newMessage) {
      setNewMessage((message) => message.trim());
      socket.emit("stop typing", selectedChat._id);
      setTextareaDisable(true);
      let sendableMessage = newMessage.trim();
      if (sendableMessage.length === 0) {
        toast({
          title: "Error Occurred!",
          description: "can't send empty message",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setTextareaDisable(false);
        return;
      }
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${apiUrl}/api/v1/message/`,
          {
            content: sendableMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setTextareaDisable(false);
        setNewMessage("");
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        setTextareaDisable(false);
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const addNewNotifications = async (messages) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${apiUrl}/api/v1/notification`,
        {
          messages,
        },
        config
      );
      ref.current.notificationsEditLoading = false;

      setNotificationsData(data);
    } catch (error) {
      console.error("failed to fetch notificationsData");
    }
  };

  useEffect(() => {
    socket = io(apiUrl);
    socket.emit("setup", user.user._id);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", ({ room, userId }) => {
      // console.log("stop typing", room, userId);
      if (selectedChatCompare._id === room && userId !== user.user._id)
        setIsTyping(true);
      else setIsTyping(false);
    });
    socket.on("stop typing", ({ room, userId }) => {
      // console.log("stop typing", room, userId);
      if (selectedChatCompare._id === room && userId !== user.user._id)
        setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const onMessageReceived = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (
          !notificationsData.notifications.find(
            (notification) => notification._id === newMessageReceived._id
          ) &&
          !ref.current.notificationsEditLoading
        ) {
          ref.current.notificationsEditLoading = true;

          addNewNotifications(JSON.stringify([newMessageReceived._id]));
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    };
    socket.on("message received", onMessageReceived);
    return () => {
      socket.off("message received", onMessageReceived);
    };
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!ref.current.typing) {
      ref.current.typing = true;
      // console.log(selectedChat._id, user.user._id);
      socket.emit("typing", { room: selectedChat._id, userId: user.user._id });
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && ref.current.typing) {
        socket.emit("stop typing", {
          room: selectedChat._id,
          userId: user.user._id,
        });
        ref.current.typing = false;
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              className="noOutline"
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <Text fontSize={{ md: "26px", base: "0.7em" }}>
                    {getSender(user.user, selectedChat.users)}
                  </Text>
                  <ProfileModal
                    user={getSenderFull(user.user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  <Text fontSize={{ md: "26px", base: "0.7em" }}>
                    {selectedChat.chatName}
                  </Text>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Box>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Container display="grid">
                <Spinner
                  size="xl"
                  gridColumn="1"
                  thickness={{ md: "4px", base: "2px" }}
                  gridRow="1"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                  color="blue.500"
                />
                <Spinner
                  size="xl"
                  thickness={{ md: "4px", base: "2px" }}
                  gridColumn="1"
                  gridRow="1"
                  w={20}
                  h={20}
                  speed="0.75s"
                  alignSelf="center"
                  margin="auto"
                  color="#38B2AC"
                />
              </Container>
            ) : (
              <Box
                d="flex"
                flexDir={"column"}
                overflowY="scroll"
                css={{
                  "&::-webkit-scrollbar": {
                    width: 0,
                  },
                }}
              >
                <ScrollableChat messages={messages} isTyping={isTyping} />
              </Box>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              <Textarea
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                isDisabled={textareaDisable}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
