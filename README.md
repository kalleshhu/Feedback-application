# Feedback System
This is a simple web application that can used as a feedback system for any group/organisation.

# Features
1. Students are able to create an account and log in. Password are hashed using bycrypt and it is a JWT-based authentication.
2. Implemented Role-based access controll where Admin login is handled through a protected route.
   
3. 2 roles are implemented with different administrative rights
    * Regular Student: Can rate and leave a comment for a course,
        students can View a paginated list of their feedback,
        can edit or delete their own feedback.
        
    * Admin: View all feedbacks, Admin can view feedbacks by Filter by course, rating, or student,
    *   Admin can Export feedback data to CSV,
    *   Can edit/delete all users, courses, comments, and reviews

4. Profile Page
   * Students can : View and Update their fields like:
     Name, E-mail(read only), Phone Number, Date of birth, Adress, Profile Picture
   * students can Change thier password.

6. Feedbacks have:
    * Select course from the dropdown
    *  A 5 star based rate
    * Comment


# SetUp
To set up the development environment, you need to follow the following steps
1. Download npm and nodeJs.
2. Download and install MongoDB on your system.

# Running the Project
To run the project on local server, first navigate to the project directory in your filesystem.
1. Now create a directory /data/db in the location where your project folder resides.
2. run cd to your backend and run "mongod" to start your database.
3. Now open new terminal or split your terminal and run "npm install" after completion of install,
in "src/server.js" file only keep this url       "http://localhost:3000" to run in local host.
then run "npm start" to your backend server
4. Now open new terminal or split your terminal and run cd frontend,
in the "./src/api/axios.js" file change the  baseURL to  baseURL: "/api",
then run "npm install" after completion run "npm run dev" it will start your server.
  
5. Open localhost:3000 from your favourite browser.


6. MangoDB and Coludiinary setup instructions :
* i have added the sample .env file replace your credentials there,
* to get get the Coludinary credentials, you can visit this website "https://cloudinary.com/" create your account there. 


7. Login and signup instructions
   * first go to the signup
   * you can select the role from the dropdown
   * i have put the admin user capacity to 2, only two users can signup as admin
   * students can signup using their name, email and password.
   * registered students can login to the application.
