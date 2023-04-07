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
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiUrl,
  emailRegex,
  passwordRegex,
  phoneNumberRegex,
} from "../../config/environmentVar";

const SignUp = () => {
  const inputsRef = useRef([]);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    const currEleIndex = inputsRef.current.indexOf(e.target);
    switch (e.keyCode) {
      case 13: // Enter
        if (currEleIndex + 1 < inputsRef.current.length)
          inputsRef.current[currEleIndex + 1].focus();
        else submitHandler();
        break;
      case 38: // up
        if (currEleIndex - 1 >= 0) inputsRef.current[currEleIndex - 1].focus();
        break;
      case 40: // down
        if (currEleIndex + 1 < inputsRef.current.length)
          inputsRef.current[currEleIndex + 1].focus();
        break;
      default:
        break;
    }
  };

  const postDetails = (e) => {
    setLoading(true);
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
      e.target.value = null;
    }
    setLoading(false);
  };

  const submitHandler = async () => {
    setLoading(true);
    setName(name.trim());
    setEmail(email.trim());
    setPhoneNumber(phoneNumber.trim());
    if (!name || !email || !password || !confirmPassword) {
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
    if (name.trim().length < 3 || name.trim().length > 50) {
      toast({
        title: "Please Enter a valid name",
        description:
          "Name must not contain any leading or trailing spaces and must be 3 to 50 characters long.",
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
    if (!phoneNumberRegex.test(phoneNumber)) {
      toast({
        title: "Please Enter a valid Phone Number",
        description:
          "starting with country code and then 10 digit number separated by space. Eg. +91 xxxxxxxxxx",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
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
      setLoading(false);
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
      setLoading(false);
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
        `${apiUrl}/api/v1/user/signup`,
        {
          name: name.trim(),
          email,
          password,
          phoneNumber: phoneNumber.trim(),
          avatar,
        },
        config
      );
      // console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
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

  return (
    <form style={{ width: "100%" }}>
      <VStack spacing="5px">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            onKeyDown={handleKeyDown}
            id="signup__name"
            ref={(el) => (inputsRef.current[0] = el)}
            className="noOutline"
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <InputGroup size="md">
            <InputLeftElement
              pointerEvents="none"
              children={<EmailIcon color="gray" />}
            />
            <Input
              onKeyDown={handleKeyDown}
              id="signup__email"
              ref={(el) => (inputsRef.current[1] = el)}
              className="noOutline"
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <InputGroup size="md">
            <InputLeftElement
              pointerEvents="none"
              children={<PhoneIcon color="gray" />}
            />
            <Input
              ref={(el) => (inputsRef.current[2] = el)}
              onKeyDown={handleKeyDown}
              id="signup__phone_number"
              className="noOutline"
              type="text"
              placeholder="Enter Your Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              onKeyDown={handleKeyDown}
              id="signup__password"
              ref={(el) => (inputsRef.current[3] = el)}
              className="noOutline"
              type={show1 ? "text" : "password"}
              autoComplete="on"
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
              onKeyDown={handleKeyDown}
              id="signup__confirm_password"
              ref={(el) => (inputsRef.current[4] = el)}
              className="noOutline"
              type={show2 ? "text" : "password"}
              autoComplete="on"
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
        <FormControl>
          <FormLabel>Upload Your Picture</FormLabel>
          <Input
            onKeyDown={handleKeyDown}
            id="signup__avatar"
            ref={(el) => (inputsRef.current[5] = el)}
            className="noOutline"
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e)}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default SignUp;
