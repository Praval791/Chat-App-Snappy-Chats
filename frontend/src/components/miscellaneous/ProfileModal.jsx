import { CheckIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Box,
  Badge,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: currUser } = ChatState();
  // console.log(user._id);
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          className="noOutline"
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        motionPreset="slideInRight"
        w="70%"
      >
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            alignContent="center"
            paddingBottom={0}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton className="noOutline" />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {user._id === currUser.user._id &&
              (user.isVerifiedEmail || user.isVerifiedPhoneNumber ? (
                <Tooltip
                  label={
                    user.isVerifiedEmail && user.isVerifiedPhoneNumber
                      ? "Email and Phone Number Verified"
                      : user.isVerifiedEmail
                      ? "Email Verified"
                      : "Phone Number Verified"
                  }
                  hasArrow
                  placement="bottom-end"
                >
                  <Box d="flex" alignItems="center" justifyContent="center">
                    <Text>Verified</Text>
                    <Badge
                      d="flex"
                      backgroundClip="#7cffcb"
                      backgroundImage="linear-gradient(315deg, #7cffcb 0%, #74f2ce 74%)"
                      ml="1"
                      w="20px"
                      height="20px"
                      borderRadius="50%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CheckIcon />
                    </Badge>
                  </Box>
                </Tooltip>
              ) : (
                <Tooltip
                  label="Verify your email address"
                  hasArrow
                  placement="auto"
                >
                  <Box d="flex" alignItems="center" justifyContent="center">
                    <Text>Not Verified</Text>
                    <Badge
                      d="flex"
                      backgroundClip="#a40606"
                      backgroundImage="linear-gradient(315deg, #a40606 0%, #d98324 74%)"
                      ml="1"
                      w="20px"
                      height="20px"
                      borderRadius="50%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CheckIcon />
                    </Badge>
                  </Box>
                </Tooltip>
              ))}

            <Image
              borderRadius="full"
              boxSize="150px"
              objectFit="cover"
              src={user.avatar.url}
              alt={user.name}
            />
            <Box
              fontFamily="Work sans"
              d="flex"
              alignItems="center"
              gap="0.5rem"
            >
              <Heading as="h5" size={{ md: "md", sm: "xs" }}>
                Email:
              </Heading>
              {user.email}
            </Box>
            <Box
              fontFamily="Work sans"
              d="flex"
              alignItems="center"
              gap="0.5rem"
            >
              <Heading as="h5" size={{ md: "md", sm: "xs" }}>
                Phone Number:
              </Heading>
              {user.phoneNumber}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button className="noOutline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
