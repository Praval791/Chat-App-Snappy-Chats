import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  PinInput,
  PinInputField,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import OrDivider from "../miscellaneous/OrDivider";

const PasswordSettings = () => {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [loadingViaEmailSendNewOtp, setLoadingViaEmailSendNewOtp] =
    useState(false);
  const [loadingViaEmailResendOtp, setLoadingViaEmailResendOtp] =
    useState(false);
  const [loadingViaPhoneNumberSendNewOtp, setLoadingViaPhoneNumberSendNewOtp] =
    useState(false);
  const [loadingViaPhoneNumberResendOtp, setLoadingViaPhoneNumberResendOtp] =
    useState(false);

  const [disabledViaEmailSendNewOtp, setDisabledViaEmailSendNewOtp] =
    useState(false);
  const [disabledViaEmailResendOtp, setDisabledViaEmailResendOtp] =
    useState(false);
  const [
    disabledViaPhoneNumberSendNewOtp,
    setDisabledViaPhoneNumberSendNewOtp,
  ] = useState(false);
  const [disabledViaPhoneNumberResendOtp, setDisabledViaPhoneNumberResendOtp] =
    useState(false);

  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  const [disabledChangePassword, setDisabledChangePassword] = useState(false);

  const [FormOtpDir] = useMediaQuery("(min-width: 1050px)");
  const [width, setWidth] = useState();
  const elementRef = useRef(null);
  const viaEmailSendNewOtp = async () => {};
  const viaEmailResendOtp = async () => {};
  const viaPhoneNumberSendNewOtp = async () => {};
  const viaPhoneNumberResendOtp = async () => {};

  const changePassword = async () => {};

  useEffect(() => {
    setWidth(elementRef.current.getBoundingClientRect().width);
  }, [window.innerWidth]);

  return (
    <form style={{ width: "100%" }}>
      <VStack maxWidth={"60em"} gap="1vh">
        <FormControl
          d="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexDir="column"
        >
          <FormLabel>Change Password</FormLabel>
          <Box
            w="100%"
            d="flex"
            justifyContent="center"
            alignItems="flex-start"
            flexDir="column"
            gap="2vh"
          >
            <InputGroup borderColor="#CBD5E0" cursor="not-allowed">
              <InputLeftAddon
                d="flex"
                justifyContent="center"
                width={width}
                pointerEvents="none"
                children="Current"
              />
              <Input
                className="noOutline noBorderChange"
                placeholder="Enter Current Password"
                type={show ? "text" : "password"}
                _placeholder={{ color: "rgba(66, 153, 225,0.6)" }}
                color="rgba(66, 153, 225,0.6)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShow((show) => !show)}
                  className="noOutline"
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </FormControl>
        <OrDivider />
        <VStack gap="1vh" w="100%" alignItems={"flex-start"}>
          <FormLabel marginBottom="-0.5vh">Forgot Password</FormLabel>

          <FormControl
            d="flex"
            justifyContent="center"
            alignItems="center"
            flexDir={FormOtpDir ? "row" : "column"}
            flexWrap="wrap"
          >
            <FormLabel
              flex="2"
              paddingLeft="1vw"
              alignSelf="flex-start"
              color="#4A5568"
            >
              Enter OTP :
            </FormLabel>
            <HStack
              paddingLeft="1vw"
              flex="6"
              d="flex"
              w="100%"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <PinInput
                type="number"
                value={token}
                onChange={(e) => setToken(e)}
              >
                <PinInputField className="noOutline" borderColor="gray.300" />
                <PinInputField className="noOutline" borderColor="gray.300" />
                <PinInputField className="noOutline" borderColor="gray.300" />
                <PinInputField className="noOutline" borderColor="gray.300" />
                <PinInputField className="noOutline" borderColor="gray.300" />
                <PinInputField className="noOutline" borderColor="gray.300" />
              </PinInput>
            </HStack>
          </FormControl>
          <FormControl
            d="flex"
            justifyContent="center"
            alignItems="center"
            flexDir={FormOtpDir ? "row" : "column"}
            flexWrap="wrap"
          >
            <FormLabel
              flex="2"
              paddingLeft="1vw"
              alignSelf="flex-start"
              color="#4A5568"
            >
              Via Phone Number :
            </FormLabel>
            <ButtonGroup flex="6" w="100%" gap="1vw" paddingLeft="1vw">
              <Button
                colorScheme="blue"
                variant="ghost"
                w="100%"
                bg="#ebf8ff"
                className="noOutline"
                loadingText="Sending..."
                isDisabled={disabledViaPhoneNumberSendNewOtp}
                isLoading={loadingViaPhoneNumberSendNewOtp}
                onClick={viaEmailSendNewOtp}
              >
                Send New OTP
              </Button>
              <Button
                colorScheme="red"
                variant="ghost"
                w="100%"
                bg="#FFF5F5"
                className="noOutline"
                loadingText="Sending..."
                isDisabled={disabledViaPhoneNumberResendOtp}
                isLoading={loadingViaPhoneNumberResendOtp}
                onClick={viaEmailResendOtp}
              >
                Resend OTP
              </Button>
            </ButtonGroup>
          </FormControl>
          <FormControl
            d="flex"
            justifyContent="center"
            alignItems="center"
            flexDir={FormOtpDir ? "row" : "column"}
            flexWrap="wrap"
          >
            <FormLabel
              flex="2"
              paddingLeft="1vw"
              alignSelf="flex-start"
              color="#4A5568"
            >
              Via Email :
            </FormLabel>
            <ButtonGroup flex="6" w="100%" gap="1vw" paddingLeft="1vw">
              <Button
                colorScheme="blue"
                variant="ghost"
                w="100%"
                bg="#ebf8ff"
                className="noOutline"
                loadingText="Sending..."
                isDisabled={disabledViaEmailSendNewOtp}
                isLoading={loadingViaEmailSendNewOtp}
                onClick={viaPhoneNumberSendNewOtp}
              >
                Send New OTP
              </Button>
              <Button
                colorScheme="red"
                variant="ghost"
                w="100%"
                bg="#FFF5F5"
                className="noOutline"
                loadingText="Sending..."
                isDisabled={disabledViaEmailResendOtp}
                isLoading={loadingViaEmailResendOtp}
                onClick={viaPhoneNumberResendOtp}
              >
                Resend OTP
              </Button>
            </ButtonGroup>
          </FormControl>
        </VStack>
        <Divider opacity="1" />
        <FormControl
          d="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexDir={"column"}
        >
          <FormLabel>New Password</FormLabel>
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
                d="flex"
                justifyContent="center"
                width={width}
                pointerEvents="none"
                children="New"
              />
              <Input
                className="noOutline noBorderChange"
                placeholder="Enter New Password"
                type={show1 ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShow1((show1) => !show1)}
                  className="noOutline"
                >
                  {show1 ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <InputGroup borderColor="#CBD5E0">
              <InputLeftAddon
                pointerEvents="none"
                ref={elementRef}
                d="flex"
                justifyContent="center"
                children={"Confirm"}
              />
              <Input
                className="noOutline noBorderChange"
                placeholder="Confirm New Password"
                type={show2 ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShow2((show2) => !show2)}
                  className="noOutline"
                >
                  {show2 ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
          <Button
            colorScheme="blue"
            variant="outline"
            width="100%"
            bg="#ebf8ff"
            mt="2vh"
            className="noOutline"
            onClick={changePassword}
            loadingText="Changing..."
            isDisabled={disabledChangePassword}
            isLoading={loadingChangePassword}
          >
            Change Password
          </Button>
        </FormControl>
      </VStack>
    </form>
  );
};

export default PasswordSettings;
