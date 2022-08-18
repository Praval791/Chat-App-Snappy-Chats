import { Box, Divider, Text } from "@chakra-ui/react";
import React from "react";

const OrDivider = () => {
  return (
    <Box
      w="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDir="row"
    >
      <Divider w="100%" opacity="1" />
      <Text width="10%" textAlign="center" color="#718096">
        OR
      </Text>
      <Divider w="100%" opacity="1" />
    </Box>
  );
};

export default OrDivider;
