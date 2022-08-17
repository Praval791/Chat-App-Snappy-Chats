import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import AllSettings from "./Settings";

const IndividualSettingBox = () => {
  const { selectedSetting, setSelectedSetting } = ChatState();
  return (
    <Box
      d={{ base: selectedSetting ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {selectedSetting ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              className="noOutline"
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedSetting("")}
            />
            <Text
              position="relative"
              fontSize={{ md: "26px", base: "0.7em" }}
              fontWeight="400"
              _before={{
                content: `""`,
                position: "absolute",
                bottom: "0",
                left: "1px",
                height: "1px",
                width: "100%",
                borderRadius: "2px",
                backgroundImage: "linear-gradient(to right, #38B2AC, #3182ce)",
              }}
            >
              {selectedSetting?.name}
            </Text>
          </Box>
          <Box
            d="flex"
            flexDir="column"
            p={3}
            // bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            <Box
              d="flex"
              flexDir={"column"}
              overflowY="scroll"
              css={{
                "&::-webkit-scrollbar": {
                  width: 0,
                },
              }}
            >
              {selectedSetting && <AllSettings name={selectedSetting.name} />}
            </Box>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a setting name to change your details
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default IndividualSettingBox;
