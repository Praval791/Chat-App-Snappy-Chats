import {
  useMediaQuery,
  Button,
  useDisclosure,
  Input,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Tooltip,
  useToast,
  Spinner,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";

import SnappyChatsLogo from "../../assets/SnappyChatsLogo";
import SmallLogo from "../../assets/SmallLogo";
import { apiUrl } from "../../config/environmentVar";

import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notificationsData,
    setNotificationsData,
    chats,
    setChats,
  } = ChatState();

  const [isMobile] = useMediaQuery("(min-width: 550px)");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${apiUrl}/api/v1/user/allUsers?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/v1/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const deleteNotification = async (messages) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/v1/notification`,
        {
          messages,
        },
        config
      );
      setNotificationsData(data);
      if (location.pathname !== "/chats") navigate("/chats");
      setSelectedChat(messages.chat);
    } catch (error) {
      console.error("failed to fetch notificationsData");
      if (location.pathname !== "/chats") navigate("/chats");
      setSelectedChat(messages.chat);
    }
  };

  const handleNotificationClick = async (notification) => {
    let messages = notificationsData.notifications
      .filter((n) => n.chat._id === notification.chat._id)
      .map((n) => n._id);
    if (messages.length > 0) deleteNotification(JSON.stringify(messages));
    // if (location.pathname !== "/chats") navigate("/chats");
    // setSelectedChat(notification.chat);
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {location.pathname === "/settings" ? (
          <Tooltip label="Go To Previous Page" hasArrow placement="bottom-end">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="noOutline"
            >
              <ArrowBackIcon />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen} className="noOutline">
              <SearchIcon />
              <Text d={{ base: "none", md: "flex" }} px={4}>
                Search User
              </Text>
            </Button>
          </Tooltip>
        )}
        <Text fontSize="2xl" fontFamily="Work sans">
          {isMobile ? (
            <SnappyChatsLogo width="100%" height="100%" />
          ) : (
            <SmallLogo />
          )}
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notificationsData?.notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2} maxHeight="40vh" overflowY="scroll">
              {!notificationsData?.notifications.length && "No New Messages"}
              {notificationsData?.notifications.map((notification) => (
                <MenuItem
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.chat.isGroupChat
                    ? `New Message in ${notification.chat.chatName}`
                    : `New Message from ${getSender(
                        user.user,
                        notification.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              className="noOutline"
              as={Button}
              bg="white"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.user.name}
                src={user.user.avatar.url}
              >
                <AvatarBadge
                  boxSize="1.25em"
                  bg={
                    user.user.isVerifiedEmail || user.user.isVerifiedPhoneNumber
                      ? "linear-gradient(315deg, #7cffcb 0%, #74f2ce 74%)"
                      : "linear-gradient(315deg, #a40606 0%, #d98324 74%)"
                  }
                >
                  <CheckIcon color="black" w="100%" h="100%" p={0.5} />
                </AvatarBadge>
              </Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user.user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              {location.pathname === "/settings" ? (
                <MenuItem onClick={() => navigate("/chats")}>My Chats</MenuItem>
              ) : (
                <MenuItem onClick={() => navigate("/settings")}>
                  Settings
                </MenuItem>
              )}
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} className="noOutline">
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
