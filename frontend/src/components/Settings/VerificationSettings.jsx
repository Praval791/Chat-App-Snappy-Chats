import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const VerificationSettings = () => {
  const { user } = ChatState();

  const [disabledVerifyEmail, setDisabledVerifyEmail] = useState(false);
  const [loadingVerifyEmail, setLoadingVerifyEmail] = useState(false);
  const [disabledVerifyPhoneNumber, setDisabledVerifyPhoneNumber] =
    useState(false);
  const [loadingVerifyPhoneNumber, setLoadingVerifyPhoneNumber] =
    useState(false);

  const verifyEmail = async () => {};
  const verifyPhoneNumber = async () => {};

  // useEffect(() => {
  //   if (user.user.isVerified) {
  //     setDisabledVerifyEmail(true);
  //     setDisabledVerifyPhoneNumber(true);
  //   }
  // }, [user.user.phoneNumber, user.user.email, user.user.isVerified]);

  return (
    <form style={{ width: "100%" }}>
      <VStack maxWidth={"60em"} gap="1vh">
        {user.user.isVerifiedEmail ? (
          <Tooltip
            label="Email is already verified"
            placement="bottom"
            hasArrow
          >
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
                  <InputLeftAddon pointerEvents="none" children="Current" />
                  <Input
                    className="noOutline noBorderVerify"
                    type="text"
                    color="rgb(66, 153, 225)"
                    value={user.user.email}
                    isDisabled={true}
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
                isDisabled={true}
              >
                Get Verification link
              </Button>
            </FormControl>
          </Tooltip>
        ) : (
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
                <InputLeftAddon pointerEvents="none" children="Current" />
                <Input
                  className="noOutline noBorderVerify"
                  type="text"
                  color="rgb(66, 153, 225)"
                  value={user.user.email}
                  isDisabled={true}
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
              onClick={verifyEmail}
              loadingText="Sending..."
              isDisabled={disabledVerifyEmail}
              isLoading={loadingVerifyEmail}
            >
              Get Verification link
            </Button>
          </FormControl>
        )}
        {user.user.isVerifiedPhoneNumber ? (
          <Tooltip
            label="Phone Number is already verified"
            placement="bottom"
            hasArrow
          >
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
                  <InputLeftAddon pointerEvents="none" children="Current" />
                  <Input
                    className="noOutline noBorderVerify"
                    type="text"
                    color="rgb(66, 153, 225)"
                    value={user.user.phoneNumber}
                    isDisabled={true}
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
                isDisabled={true}
              >
                Get Verification link
              </Button>
            </FormControl>
          </Tooltip>
        ) : (
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
                <InputLeftAddon pointerEvents="none" children="Current" />
                <Input
                  className="noOutline noBorderVerify"
                  type="text"
                  color="rgb(66, 153, 225)"
                  value={user.user.phoneNumber}
                  isDisabled={true}
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
              onClick={verifyPhoneNumber}
              loadingText="Sending..."
              isDisabled={disabledVerifyPhoneNumber}
              isLoading={loadingVerifyPhoneNumber}
            >
              Get Verification link
            </Button>
          </FormControl>
        )}
      </VStack>
    </form>
  );
};

export default VerificationSettings;
