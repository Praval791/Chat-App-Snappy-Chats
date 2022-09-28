import { EmailIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  PinInput,
  PinInputField,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import SnappyChatsLogo from "../assets/SnappyChatsLogo";
import { apiUrl, emailRegex, passwordRegex } from "../config/environmentVar";

const ForgotPassword = () => {
  const toast = useToast();

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabledSendNewOtp, setIsDisabledSendNewOtp] = useState(false);
  const [isLoadingSendNewOtp, setIsLoadingSendNewOtp] = useState(false);
  const [isDisabledResendOtp, setIsDisabledResendOtp] = useState(false);
  const [isLoadingResendOtp, setIsLoadingResendOtp] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSendNewOtp = async () => {
    setIsLoadingSendNewOtp(true);
    setIsDisabledResendOtp(true);
    setIsDisabled(true);
    if (!emailRegex.test(email)) {
      toast({
        title: "Please Enter a valid Email",
        description:
          "Without spaces and As a valid email address. Eg. guest12@domain.com",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoadingSendNewOtp(false);
      setIsDisabledResendOtp(false);
      setIsDisabled(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/v1/user/password/reset/send`,
        {
          email,
        },
        config
      );

      toast({
        title: "Registration Successful",
        description: `Otp will be expired on ${data.expireAt.date} at ${data.expireAt.time}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoadingSendNewOtp(false);
      setIsDisabledResendOtp(false);
      setIsDisabled(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoadingSendNewOtp(false);
      setIsDisabledResendOtp(false);
      setIsDisabled(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoadingResendOtp(true);
    setIsDisabledSendNewOtp(true);
    setIsDisabled(true);
    if (!emailRegex.test(email)) {
      toast({
        title: "Please Enter a valid Email",
        description:
          "Without spaces and As a valid email address. Eg. guest12@domain.com",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setIsLoadingResendOtp(false);
      setIsDisabledSendNewOtp(false);
      setIsDisabled(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/v1/user/password/reset/resend`,
        {
          email,
        },
        config
      );

      toast({
        title: "Registration Successful",
        description: `Otp will be expired on ${data.expireAt.date} at ${data.expireAt.time}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoadingResendOtp(false);
      setIsDisabledSendNewOtp(false);
      setIsDisabled(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoadingResendOtp(false);
      setIsDisabledSendNewOtp(false);
      setIsDisabled(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setIsDisabledResendOtp(true);
    setIsDisabledSendNewOtp(true);
    if (!emailRegex.test(email)) {
      toast({
        title: "Please Enter a valid Email",
        description:
          "Without spaces and As a valid email address. Eg. guest12@domain.com",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
      setIsDisabledResendOtp(false);
      setIsDisabledSendNewOtp(false);
      return;
    }
    if (token.length !== 6) {
      toast({
        title: "Please Enter a valid token",
        description: "OTP must be of 6 characters and containing only numbers",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
      setIsDisabledResendOtp(false);
      setIsDisabledSendNewOtp(false);
      return;
    }
    if (password.length < 6 || password.length > 20) {
      toast({
        title: "Please Enter a valid Password",
        description: "Password must be 6 to 20 characters long.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setIsLoading(false);
      setIsDisabledResendOtp(false);
      setIsDisabledSendNewOtp(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      toast({
        title: "Please Enter a valid Password",
        description:
          "Password mustn't have white spaces. Eg. vdhavsds132, 17367vu24GF45&6",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setIsLoading(false);
      setIsDisabledResendOtp(false);
      setIsDisabledSendNewOtp(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
      setIsDisabledResendOtp(false);
      setIsDisabledSendNewOtp(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/v1/user/password/reset/verify`,
        {
          email,
          password,
          token,
        },
        config
      );

      setIsLoading(false);
      setIsDisabledResendOtp(false);
      setIsDisabledSendNewOtp(false);
      toast({
        title: data.text,
        description: `Please Navigate to login page.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setIsLoading(false);
      setIsDisabledResendOtp(false);
      setIsDisabledSendNewOtp(false);
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

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="#e9e2e2e6"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          <SnappyChatsLogo width="100%" height="100%" />
        </Text>
      </Box>
      <Box bg="#e9e2e2e6" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab className="noOutline">Forgot Password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form style={{ width: "100%" }}>
                <VStack spacing="1vh">
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <InputGroup size="md">
                      <InputLeftElement
                        pointerEvents="none"
                        children={<EmailIcon color="gray" />}
                      />
                      <Input
                        className="noOutline"
                        value={email}
                        type="email"
                        placeholder="Enter Your Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </FormControl>
                  <ButtonGroup variant="outline" spacing="3" w="100%">
                    <Button
                      isDisabled={isDisabledSendNewOtp}
                      isLoading={isLoadingSendNewOtp}
                      colorScheme="blue"
                      bg="#d5e9f4"
                      w="100%"
                      className="noOutline"
                      onClick={handleSendNewOtp}
                    >
                      Send New OTP
                    </Button>
                    <Button
                      isDisabled={isDisabledResendOtp}
                      isLoading={isLoadingResendOtp}
                      colorScheme="red"
                      bg="#efdcdc"
                      w="100%"
                      className="noOutline"
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </Button>
                  </ButtonGroup>
                  <FormControl isRequired>
                    <FormLabel>Enter OTP</FormLabel>
                    <HStack
                      d="flex"
                      justifyContent={{
                        md: "space-around",
                        base: "space-between",
                      }}
                    >
                      <PinInput
                        type="number"
                        value={token}
                        onChange={(e) => setToken(e)}
                      >
                        <PinInputField
                          className="noOutline"
                          borderColor="gray.300"
                        />
                        <PinInputField
                          className="noOutline"
                          borderColor="gray.300"
                        />
                        <PinInputField
                          className="noOutline"
                          borderColor="gray.300"
                        />
                        <PinInputField
                          className="noOutline"
                          borderColor="gray.300"
                        />
                        <PinInputField
                          className="noOutline"
                          borderColor="gray.300"
                        />
                        <PinInputField
                          className="noOutline"
                          borderColor="gray.300"
                        />
                      </PinInput>
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        value={password}
                        className="noOutline"
                        type={show1 ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={() => setShow1(!show1)}
                          className="noOutline"
                        >
                          {show1 ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        value={confirmPassword}
                        className="noOutline"
                        type={show2 ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={() => setShow2(!show2)}
                          className="noOutline"
                        >
                          {show2 ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    loadingText="Submitting"
                    style={{ marginTop: 15 }}
                    onClick={handleForgotPassword}
                    isLoading={isLoading}
                    isDisabled={isDisabled}
                  >
                    Change Password
                  </Button>
                </VStack>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
