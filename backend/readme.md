# BackEnd

#### Setup

```bash
npm install && npm start
```

## **Host** `[domain-name]/api/v1`

### Models
1. User : Stores user information
2. Chat : Stores all chats (one to one and group)
3. Otp : Stores other otp (numeric)
4. Message : Stores the messages
5. Notifications : Stores the notification
6. Verification-Email-Token : Store the token for verification of email (random string)
### Routes
1. `/user` : Authentication and user related
2. `/chat` : Chat related
3. `/messages` : messages related
4. `/notification` : notification related
### The necessary environment variables in FrontEnd
* MONGO_URI
* JWT_SECRET
* JET_LIFETIME
* PORT
* DEFAULT_AVATAR
* DEFAULT_AVATAR_ID
* CLOUDINARY_CLOUD_NAME
* CLOUDINARY_API_KEY
* CLOUDINARY_API_SECRET
* ADMIN_EMAIL
* ADMIN_EMAIL_PASSWORD

### Features
* Proper validation of details
* Hashed password 
* Jwt authentication
* Proper Error handling with custom classes 
* Mail transmission 
* Stores user avatars on cloud
* Socket.io for real time messages and notifications
* Forgot Password will only work for verified users.
### In Group chat
* #### Admins Power
  - There is only single Group Admin
  - If he wants to leave the group then either he/she will have to provide a id to make that user after them or if he/she didn't Provide the id them the group will be deleted from DataBase
  - Group admin can add or remove users and subAdmins
  - Group admin can change the groupName
* #### Sub-Admins Power
  - There can be multiple subAdmins in a group they all must be part of the group
  - Sub-Admins can remove and add users.
  - Sub-Admins can also make users a sub admin
  
### TODO:
* Adding routes for updating user information.
* Adding multicast the updating details to required users.
* Adding a swagger Ui
