import React from "react";
import PersonalSettings from "./PersonalSettings";
import PasswordSettings from "./PasswordSettings";
import ContactSettings from "./ContactSettings";
import VerificationSettings from "./VerificationSettings";
const allSettings = {
  Personal: <PersonalSettings />,
  Contact: <ContactSettings />,
  Verification: <VerificationSettings />,
  Password: <PasswordSettings />,
};

const AllSettings = ({ name }) => allSettings[name];

export default AllSettings;
