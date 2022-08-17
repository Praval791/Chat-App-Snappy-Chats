import { Box } from "@chakra-ui/react";
import React from "react";
import IndividualSettingBox from "../components/IndividualSettingBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import SettingsName from "../components/SettingsName";
import { ChatState } from "../Context/ChatProvider";

const SettingsPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <SettingsName />}
        {user && <IndividualSettingBox />}
      </Box>
    </div>
  );
};

export default SettingsPage;
