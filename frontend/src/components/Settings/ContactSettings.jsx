import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const ContactSettings = () => {
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
  const { user } = ChatState();

  const changeEmail = async () => {};
  const changePhoneNumber = async () => {};

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
