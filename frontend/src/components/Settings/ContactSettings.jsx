import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  apiUrl,
  emailRegex,
  phoneNumberRegex,
} from "../../config/environmentVar";
import { ChatState } from "../../Context/ChatProvider";

const ContactSettings = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [disabledChangeEmail, setDisabledChangeEmail] = useState(false);
  const [loadingChangeEmail, setLoadingChangeEmail] = useState(false);
  const [disabledChangePhoneNumber, setDisabledChangePhoneNumber] =
    useState(false);
  const [loadingChangePhoneNumber, setLoadingChangePhoneNumber] =
    useState(false);
  const [width, setWidth] = useState();
  const elementRef = useRef(null);
  const { user, updateUser } = ChatState();

  const changeEmail = async () => {
    setLoadingChangeEmail(true);
    setDisabledChangePhoneNumber(true);
    let checkEmail = email.trim();
    setEmail(checkEmail);
    if (!emailRegex.test(checkEmail)) {
      toast({
        title: "Please Enter a valid Email",
        description:
          "Without spaces and As a valid email address. Eg. guest12@domain.com",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChangeEmail(false);
      setDisabledChangePhoneNumber(false);
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
        `${apiUrl}/api/v1/user/update/email`,
        {
          email: checkEmail,
        },
        config
      );
      if (data.status === "success") {
        updateUser(
          ["email", "isVerifiedEmail"],
          [data.email, data.isVerifiedEmail],
          { multiple: true }
        );
        toast({
          title: "Email updated successfully",
          description: "Please validate your email again.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Email updation failed!",
          description: "try again later",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoadingChangeEmail(false);
      setDisabledChangePhoneNumber(false);
    } catch (error) {
      toast({
        title: "Email updation failed!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChangeEmail(false);
      setDisabledChangePhoneNumber(false);
    }
  };

  const changePhoneNumber = async () => {
    setLoadingChangePhoneNumber(true);
    setDisabledChangeEmail(true);
    let checkPhoneNumber = phoneNumber.trim();
    setPhoneNumber(checkPhoneNumber);

    if (!phoneNumberRegex.test(checkPhoneNumber)) {
      toast({
        title: "Please Enter a valid Phone Number",
        description:
          "starting with country code and then 10 digit number separated by space. Eg. +91 xxxxxxxxxx",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChangePhoneNumber(false);
      setDisabledChangeEmail(false);
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
        `${apiUrl}/api/v1/user/update/phoneNumber`,
        {
          phoneNumber: checkPhoneNumber,
        },
        config
      );
      if (data.status === "success") {
        updateUser(
          ["phoneNumber", "isVerifiedPhoneNumber"],
          [data.phoneNumber, data.isVerifiedPhoneNumber],
          { multiple: true }
        );
        toast({
          title: "Phone Number updated successfully",
          description: "Please validate your phone number again.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Phone Number updation failed!",
          description: "try again later",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoadingChangePhoneNumber(false);
      setDisabledChangeEmail(false);
    } catch (error) {
      toast({
        title: "Phone Number updation failed!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChangePhoneNumber(false);
      setDisabledChangeEmail(false);
    }
  };

  useEffect(() => {
    setWidth(elementRef.current.getBoundingClientRect().width);
  }, []);
  return (
    <form style={{ width: "100%" }}>
      <VStack maxWidth={"60em"} gap="1vh">
        <FormControl
          d="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexDir={"column"}
        >
          <FormLabel>Email</FormLabel>
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
                value={user.user.email}
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
                placeholder="Enter New Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Box>
          <Button
            colorScheme="blue"
            variant="outline"
            width="100%"
            bg="#ebf8ff"
            mt="2vh"
            className="noOutline"
            onClick={changeEmail}
            loadingText="Changing..."
            isDisabled={disabledChangeEmail}
            isLoading={loadingChangeEmail}
          >
            Change Email
          </Button>
        </FormControl>
        <FormControl
          d="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexDir={"column"}
        >
          <FormLabel>Phone Number</FormLabel>
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
                value={user.user.phoneNumber}
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
                placeholder="Enter New Phone Number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
            onClick={changePhoneNumber}
            loadingText="Changing..."
            isDisabled={disabledChangePhoneNumber}
            isLoading={loadingChangePhoneNumber}
          >
            Change Phone Number
          </Button>
        </FormControl>
      </VStack>
    </form>
  );
};

export default ContactSettings;
