import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Tooltip,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const VerificationSettings = () => {
  const { user } = ChatState();
  const [dirRow] = useMediaQuery("(min-width: 600px)");

  const [isDisabledSendNewVerifEmail, setIsDisabledSendNewVerifEmail] =
    useState(false);
  const [isLoadingSendNewVerifEmail, setIsLoadingSendNewVerifEmail] =
    useState(false);
  const [isDisabledResendVerifEmail, setIsDisabledResendVerifEmail] =
    useState(false);
  const [isLoadingResendVerifEmail, setIsLoadingResendVerifEmail] =
    useState(false);
  const [isDisabledSendNewVerifSMS, setIsDisabledSendNewVerifSMS] =
    useState(false);
  const [isLoadingSendNewVerifSMS, setIsLoadingSendNewVerifSMS] =
    useState(false);
  const [isDisabledResendVerifSMS, setIsDisabledResendVerifSMS] =
    useState(false);
  const [isLoadingResendVerifSMS, setIsLoadingResendVerifSMS] = useState(false);

  const sendNewVerifEmail = async () => {};
  const resendVerifEmail = async () => {};
  const sendNewVerifSMS = async () => {};
  const resendVerifSMS = async () => {};

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
            <ButtonGroup
              w="100%"
              flexDir={dirRow ? "row" : "column"}
              gap="1em"
              css={{
                "&>*:not(style)~*:not(style)": {
                  "-webkit-margin-start": "0",
                  "margin-inline-start": "0",
                },
              }}
            >
              <Button
                colorScheme="blue"
                variant="outline"
                width="100%"
                bg="#ebf8ff"
                mt="2vh"
                className="noOutline"
                onClick={sendNewVerifEmail}
                loadingText="Sending..."
                isDisabled={isDisabledSendNewVerifEmail}
                isLoading={isLoadingSendNewVerifEmail}
              >
                Send New Verification Email
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                width="100%"
                bg="#FFF5F5"
                mt={dirRow ? "2vh" : "0"}
                className="noOutline"
                onClick={resendVerifEmail}
                loadingText="Sending..."
                isDisabled={isDisabledResendVerifEmail}
                isLoading={isLoadingResendVerifEmail}
              >
                Resend Verification Email
              </Button>
            </ButtonGroup>
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
            <ButtonGroup
              w="100%"
              flexDir={dirRow ? "row" : "column"}
              gap="1em"
              css={{
                "&>*:not(style)~*:not(style)": {
                  "-webkit-margin-start": "0",
                  "margin-inline-start": "0",
                },
              }}
            >
              <Button
                colorScheme="blue"
                variant="outline"
                width="100%"
                mt="2vh"
                bg="#ebf8ff"
                className="noOutline"
                onClick={sendNewVerifSMS}
                loadingText="Sending..."
                isDisabled={isDisabledSendNewVerifSMS}
                isLoading={isLoadingSendNewVerifSMS}
              >
                Send New Verification SMS
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                width="100%"
                bg="#FFF5F5"
                className="noOutline"
                mt={dirRow ? "2vh" : "0"}
                onClick={resendVerifSMS}
                loadingText="Sending..."
                isDisabled={isDisabledResendVerifSMS}
                isLoading={isLoadingResendVerifSMS}
              >
                Resend Verification SMS
              </Button>
            </ButtonGroup>
          </FormControl>
        )}
      </VStack>
    </form>
  );
};

export default VerificationSettings;
