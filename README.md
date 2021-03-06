# TODO:

## information's:

- link to the Db model design [link](https://drawsql.app/aa-12/diagrams/whatsapp)

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
  - [x] Add password show toggle
  - [x] Build the Sign up page "Desktop version"
- [x] Log In Page
- [x] remove the duplicated code in css
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
- [x] Refactors js files to be server from nodejs server
- [x] implement the error and success flags popup
- [ ] Build the Intro
- [ ] implement local storage
- [ ] Performance
- [ ] Accessibility

# Back-End

- [x] implement the basic structure of express app
- [x] Set up the mongodb DB
- [x] Build User Model "basic version"
- refactor the pages to pug
  - [x] sign up page
  - [x] login page
  - [x] Verify
  - [x] reset password
- Build the view controller:
  - [x] sign up
  - [x] Login
- Build the logic of API:

  - sign up
    - [x] Get Data
    - [x] validate the Data
    - [x] check if the user is already exist
    - [x] Encrypt information's
    - [x] save User
    - [x] POST the user data from form
    - [x] Send him to the next stage "Verify"
    - [x] Generate Otp and Build the logic behind it
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
    - [x] Build the over layout to show the user his contact (ui)
    - [x] Protect the profile route and get the username, photo and description
    - [x] implement the functionality to upload profile image (multer)
    - [x] optimize the picture with (sharp)
    - [x] Save the User Information in Db and destroy session
    - [x] Send welcome email to the user via Email
    - [x] Sign in the User using passport js and protect the contact route
    - [x] redirect the user every time accessing the sign up process (/sign up, /verify, /profile)
    - [x] implement the Create profile api with the UI
    - [x] implement flash in the UI
  - Login
    - [x] local strategy
    - [ ] login in with:
      - [x] google
      - [ ] facebook
      - [ ] instagram
  - Contact:

    - [x] Build the UI
    - [x] Refactor to Pug
    - [x] build the import-dev-data for development purposes ( import fake users to db)
    - [x] Create functionality to handle and deliver the init data need for the user when they enter the /Contact route (utility function)
    - [ ] Build automation script for import Development data
    - [ ] Build automation script for push the project to repository data inspired from https://github.com/franciscop/happy/
    - [x] show all init data coming from the /contact route a show them in Ui
    - [ ] Sort the contact by the time of lastMsg
    - [ ] add functionality of search of users
    - [ ] Enhance the performance of Db (read this article => https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382)

  - [x] show the flags in Ui
  - [ ] Build error handle controller and handle the message show to the user in more user friendly messages
  - [ ] Security
    - [ ] cookies
  - [ ] Compare the validation in backend with frontend
  - [ ] Performance

- [ ] copyrights

## Error to fix

- fix the bug in profile middleware

## Errors To handle

- [ ] Mongo DB Errors

TODO: Learning version

- [x] know more about Parcel and @babel/polyfill
- [x] know more about how to create perfect model in mongodb
- [x] Pug
- [ ] Handle Errors
- [ ] Passport js
- [ ] Learn jquery
- [ ] connect-flash
- [ ] learn more about [Production best practices: performance and reliability]("https://expressjs.com/th/advanced/best-practice-performance.html")
- [ ] session best practices [session best practices]("https://blog.jscrambler.com/best-practices-for-secure-session-management-in-node/")
