const apiUrl = process.env.REACT_APP_API_URL;
const emailRegex = new RegExp(`${process.env.REACT_APP_EMAIL_REGEX}$`);
const phoneNumberRegex = new RegExp(
  `${process.env.REACT_APP_PHONE_NUMBER_REGEX}$`
);
const passwordRegex = new RegExp(`${process.env.REACT_APP_PASSWORD_REGEX}$`);
export { apiUrl, emailRegex, phoneNumberRegex, passwordRegex };
