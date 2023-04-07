import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  useToast,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  InputLeftElement,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { EmailIcon } from "@chakra-ui/icons";
import { apiUrl, emailRegex } from "../../config/environmentVar";

const Login = () => {
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
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
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/v1/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error, error?.response);
      toast({
        title: "Error Occurred!",
        description: error.response.data.msg.text || "Try again later!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  return (
    <form style={{ width: "100%" }}>
      <VStack spacing="10px">
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <InputGroup size="md">
            <InputLeftElement
              pointerEvents="none"
              children={<EmailIcon color="gray" />}
            />
            <Input
              id="login__email"
              className="noOutline"
              value={email}
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              ref={emailInputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "ArrowDown")
                  passwordInputRef.current.focus();
              }}
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              className="noOutline"
              id="login__password"
              value={password}
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="Enter password"
              ref={passwordInputRef}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") emailInputRef.current.focus();
                if (e.key === "Enter") submitHandler();
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShow(!show)}
                className="noOutline"
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          variant="solid"
          colorScheme="red"
          width="100%"
          className="redOutline"
          onClick={() => {
            navigate("/forgot/password");
          }}
        >
          Forgot Password
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
