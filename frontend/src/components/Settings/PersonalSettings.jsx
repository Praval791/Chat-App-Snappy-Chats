import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/media-query";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import CLICK_TO_EDIT from "../../assets/ClicktoEdit.png";
import axios from "axios";
import { apiUrl } from "../../config/environmentVar";

const PersonalSettings = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(CLICK_TO_EDIT);
  const [width, setWidth] = useState();
  const [loadingChangeAvatar, setLoadingChangeAvatar] = useState(false);
  const [loadingChangeName, setLoadingChangeName] = useState(false);
  const [disabledChangeName, setDisabledChangeName] = useState(false);
  const [disabledChangeAvatar, setDisabledChangeAvatar] = useState(false);
  const toast = useToast();
  const avatarSize = useBreakpointValue({ base: "md", sm: "xl", md: "2xl" });
  const elementRef = useRef(null);
  const { user, updateUser } = ChatState();

  const postAvatar = (e) => {
    setDisabledChangeName(true);

    const avatars = e.target.files[0];
    if (
      avatars.type === "image/jpeg" ||
      avatars.type === "image/png" ||
      avatars.type === "image/jpg"
    ) {
      const Reader = new FileReader();

      Reader.readAsDataURL(avatars);
      Reader.onload = () => {
        if (Reader.readyState === 2) {
          setAvatar(Reader.result);
        }
      };
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      e.target.value = CLICK_TO_EDIT;
    }
    setDisabledChangeName(false);
  };

  useEffect(() => {
    setWidth(elementRef.current.getBoundingClientRect().width);
  }, []);

  const changeAvatar = async () => {
    setDisabledChangeName(true);
    setLoadingChangeAvatar(true);
    if (avatar === CLICK_TO_EDIT) {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChangeAvatar(false);
      setDisabledChangeName(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `${apiUrl}/api/v1/user/update/avatar`,
        {
          avatar: {
            url: avatar,
            public_id: user.user.avatar.public_id,
          },
        },
        config
      );
      if (data.status === "success") {
        updateUser("avatar", data.avatar);
        toast({
          title: "Avatar updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Avatar updation failed!",
          description: "try again later",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoadingChangeAvatar(false);
      setDisabledChangeName(false);
    } catch (error) {
      setLoadingChangeAvatar(false);
      setDisabledChangeName(false);
      toast({
        title: "Avatar updation failed!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const changeName = async () => {
    setLoadingChangeName(true);
    setDisabledChangeAvatar(true);

    let checkName = name.trim();
    setName(checkName);
    if (checkName.length < 3 || checkName.length > 50) {
      toast({
        title: "Please Enter a valid name",
        description:
          "Name must not contain any leading or trailing spaces and must be 3 to 50 characters long.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChangeName(false);
      setDisabledChangeAvatar(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `${apiUrl}/api/v1/user/update/name`,
        {
          name: checkName,
        },
        config
      );
      if (data.status === "success") {
        updateUser("name", data.name);
        toast({
          title: "Name updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Name updation failed!",
          description: "try again later",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoadingChangeName(false);
      setDisabledChangeAvatar(false);
    } catch (error) {
      toast({
        title: "Name updation failed!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChangeName(false);
      setDisabledChangeAvatar(false);
    }
  };

  return (
    <form style={{ width: "100%" }}>
      <VStack maxWidth={"60em"} gap="1vh">
        <FormControl d="flex" flexDir="column">
          <FormLabel>Avatar</FormLabel>
          <Box d="flex" alignItems="center" justifyContent="space-around">
            <Box
              d="flex"
              justifyContent="center"
              alignItems="center"
              flexDir={"column"}
            >
              <Avatar src={user.user?.avatar?.url} size={avatarSize}></Avatar>
              <Text>Current</Text>
            </Box>
            <ArrowRightIcon />
            <Box
              d="flex"
              justifyContent="center"
              alignItems="center"
              flexDir={"column"}
            >
              <Avatar src={avatar} size={avatarSize} position="relative">
                <Input
                  w="100%"
                  h="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity={0}
                  type="file"
                  accept="image/*"
                  onChange={(e) => postAvatar(e)}
                />
              </Avatar>
              <Text>New</Text>
            </Box>
          </Box>
          <Button
            colorScheme="blue"
            variant="outline"
            width="100%"
            mt="2vh"
            bg="#ebf8ff"
            className="noOutline"
            onClick={changeAvatar}
            loadingText="Changing..."
            isDisabled={disabledChangeAvatar}
            isLoading={loadingChangeAvatar}
          >
            Change Avatar
          </Button>
        </FormControl>
        <FormControl
          d="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexDir={"column"}
        >
          <FormLabel>Name</FormLabel>
          <Box
            w="100%"
            d="flex"
            justifyContent="center"
            alignItems="flex-start"
            flexDir={"column"}
            gap="2vh"
          >
            <InputGroup borderColor="#CBD5E0" cursor="not-allowed">
              <InputLeftAddon
                pointerEvents="none"
                ref={elementRef}
                children="Current"
              />
              <Input
                className="noOutline noBorderChange"
                type="text"
                color="rgb(66, 153, 225)"
                value={user.user.name}
                isDisabled={true}
              />
            </InputGroup>
            <InputGroup borderColor="#CBD5E0">
              <InputLeftAddon
                pointerEvents="none"
                d="flex"
                justifyContent="center"
                width={width}
                children={"New"}
              />
              <Input
                className="noOutline noBorderChange"
                placeholder="Enter New Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </Box>
          <Button
            colorScheme="blue"
            variant="outline"
            width="100%"
            mt="2vh"
            bg="#ebf8ff"
            className="noOutline"
            onClick={changeName}
            loadingText="Changing..."
            isDisabled={disabledChangeName}
            isLoading={loadingChangeName}
          >
            Change Name
          </Button>
        </FormControl>
      </VStack>
    </form>
  );
};

export default PersonalSettings;
