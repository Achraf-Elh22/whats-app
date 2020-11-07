# TODO:

# Front-End

- [x] Sign up page
  - [x] Build the Sign up page "Mobile version"
  - [x] Country code Input
  - [x] build a validator for email
  - [x] build a validator for password
    - At least one digit [0-9]
    - At least one lowercase character [a-z]
    - At least one uppercase character [A-Z]
    - At least 8 characters in length
  - [x] Add password show toogle
  - [x] Build the Sign up page "Desktop version"
- [x] Log In Page
- [x] remove the deplicate code in css
- [x] Build the verify User page
- [x] Build the new password page
  - [x] "Mobile version"
  - [x] "Desktop version"
  - [x] validate the new and confirm password using js
- [x] Build the Contact page
  - [x] "Mobile version"
  - [x] "Desktop version"
- [ ] Build the Contact page Messages side
  - [ ] "Mobile version"
  - [ ] "Desktop version"
- [ ]
- [ ]
- [ ] Add animation to pages
  - [ ] search icon in contact page
  - [ ] add favicon like in the real whatsapp
  - [ ]
- [x] implement parcel html and css and js
- [x] Build the validators of:
  - [x] intl-tel-input
  - [x] Sign up
  - [x] Login
  - [x] Verify
  - [x] reset password
  - [x] add the email and password validator
- [x] Refacture js files to be server from nodejs server
- [x] implement the error and success flags popup
- [ ] Build the Intro
- [ ] implement local storage
- [ ] Performance
- [ ] Accessibility

# Back-End

- [x] implement the basic structure of express app
- [x] Set up the mongodb DB
- [x] Build User Model "basic version"
- [x] refactor the pages to pug
  - [x] signup page
  - [x] login page
  - [ ] Verify
  - [ ] reset password
- Build the logique of API:
  - signup
    - [x] Get Data
    - [x] validate the Data
    - [x] check if the user is already exist
    - [x] Encrypt Inforamtions
    - [x] save User
    - [x] POST the user data from form
    - [x] Send him to the next stage "Verify"
    - [x] Generate Otp and Build the logique behind it
    - [x] Check the OTP
    - [x] send the otp from the front end
    - [x] Send OTP in SMS
    - [x] Protect the verify view
    - [x] Build the error page
    - [x] remove the token from session and replace it with simple property of time
    - [x] Implement the time still for the otp in back and front end
    - [x] implement the feature of send the otp in email if his phone isn't near him
    - [x] Finish building verify process
    - [x] Pass the User to Stage 3
    - [x] Build the Stage 3 UI "Create Profile"
    - [x] Build the overlayout to show the user his contact (ui)
    - [x] Protect the profile route and get the username, photo and description
    - [x] implement the functionality to upload profile image (multer)
    - [x] optimize the picture with (sharp)
    - [x] Save the User Information in Db and destroy session
    - [ ] Send welcome email to the user via Email
    - [ ] Sign in the User using passportjs
    - [ ] redirect the suer every time accessing the signup process (/signup, /verify, /profile)
    - [ ] implement the Create profile api with the UI
    - [ ] Sign in with google, facebook, instagram
    - [ ] Handle the Errors of sign up
    - [ ]
  - Login
    - [ ]
- [ ] Build the view controller:
  - [ ] signup
  - [ ] Login
- [ ] Build error handle controller and handle the message show to the user in more user friendly messages
- [ ] Create a token store it in session and use connect-flash to show flags
- [ ] show the flags in Ui
- [ ] Security
  - [ ] cookies
- [ ] Compare the validation in backend with frontend
- [ ] Performance
- [ ] copyrights

## Error to fix

- fix the bug in profile middleweare

## Errors To handle

- [ ] Mongo DB Errors

TODO: Learning version

- [x] know more about Parcel and @babel/polyfill
- [x] know more about how to create perfict model in mongodb
- [x] Pug
- [ ] Handle Errors
- [ ] Passportjs
- [ ] Learn jquery
- [ ] connect-flash
- [ ] learn more about [Production best practices: performance and reliability]("https://expressjs.com/th/advanced/best-practice-performance.html")
- [ ] session best practices [session best practices]("https://blog.jscrambler.com/best-practices-for-secure-session-management-in-node/")
