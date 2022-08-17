import { Box, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { settingsName } from "../data/settingsName";
import ChatLoading from "./ChatLoading";

const SettingsName = () => {
  const { selectedSetting, setSelectedSetting } = ChatState();
  const breakPoint = useBreakpointValue({
    md: settingsName[0],
  });

  useEffect(() => {
    setSelectedSetting(breakPoint);
  }, [breakPoint]);

  return (
    <Box
      d={{ base: selectedSetting ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "26px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Settings
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {SettingsName ? (
          <Stack overflowY="scroll">
            {settingsName.map((settingName) => (
              <Box
                onClick={() => setSelectedSetting(settingName)}
                cursor="pointer"
                bg={selectedSetting === settingName ? "#38B2AC" : "#E8E8E8"}
                color={selectedSetting === settingName ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={settingName._id}
              >
                <Text fontWeight="500">{settingName.name}</Text>
                <Text fontSize="xs">{settingName.details}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default SettingsName;
