
# CourseExpress Backend Documentation

## Overview
CourseExpress is a backend API for a course-selling platform built using Node.js and Express.js. It provides functionalities for both users and admins, including user authentication, course purchasing, and course management by admins.

## API Endpoints

### User Endpoints

1. **User Signup**
   - **Endpoint**: `POST /api/v1/user/signup`
   - **Description**: Registers a new user on the platform with basic information such as email, password, and name.
   - **Request Body**:
     ```json
     {
       "email": "happy@gmail.com", 
       "password": "123hjghjghj", 
       "firstName": "happy",
       "lastName": "sdjklgj"
     }
     ```

2. **User Signin**
   - **Endpoint**: `POST /api/v1/user/signin`
   - **Description**: Allows an existing user to log in using their email and password to access their account and perform actions such as viewing purchased courses.
   - **Request Body**:
     ```json
     {
       "email": "happy@gmail.com", 
       "password": "123hjghjghj"
     }
     ```

3. **View User Purchases**
   - **Endpoint**: `GET /api/v1/user/purchases`
   - **Description**: Fetches the list of courses that the logged-in user has purchased. This endpoint requires the user to be authenticated.
   - **Response**: List of purchased courses.

### Admin Endpoints

1. **Admin Signup**
   - **Endpoint**: `POST /api/v1/admin/signup`
   - **Description**: Registers a new admin on the platform with details such as email, password, and name.
   - **Request Body**:
     ```json
     {
       "email": "tasrin@gmail.com", 
       "password": "123hjghjghj", 
       "firstName": "Tasrin",
       "lastName": "Sultana"
     }
     ```

2. **Admin Signin**
   - **Endpoint**: `POST /api/v1/admin/signin`
   - **Description**: Allows an admin to log in using their email and password to manage courses and view platform analytics.
   - **Request Body**:
     ```json
     {
       "email": "tasrin@gmail.com", 
       "password": "123hjghjghj"
     }
     ```

3. **Create Course (Admin)**
   - **Endpoint**: `POST /api/v1/admin/course`
   - **Description**: Allows an admin to create a new course by providing details such as title, description, image, and price. The `creatorId` is the admin’s ID who is creating the course.
   - **Request Body**:
     ```json
     {
       "title": "Hello", 
       "description": "description kjlfdlgjh", 
       "imageUrl": "imageUrl", 
       "price": "100", 
       "creatorId": "67335e2d66b9200bf6eb4acd"
     }
     ```

4. **Modify Course (Admin)**
   - **Endpoint**: `PUT /api/v1/admin/course`
   - **Description**: Allows an admin to modify the details of an existing course (e.g., change title, description, price). The `courseId` identifies the course being updated.
   - **Request Body**:
     ```json
     {
       "title": "Hjhjkgh ello", 
       "description": "descripjhjk hjhkj tion", 
       "imageUrl": "imahnjj geUrl", 
       "price": "10000", 
       "courseId": "67335f0b66b9200bf6eb4ad0"
     }
     ```

5. **Get All Courses (Admin)**
   - **Endpoint**: `GET /api/v1/admin/course/bulk`
   - **Description**: Fetches the list of all courses available on the platform, allowing admins to view, update, or delete courses as needed.

### Course Endpoints

1. **Purchase Course**
   - **Endpoint**: `POST /api/v1/course/purchase`
   - **Description**: Allows a user to purchase a course by providing the course ID. The user must be logged in to make a purchase.
   - **Request Body**:
     ```json
     {
       "courseId": "67335f0b66b9200bf6eb4ad0"
     }
     ```

2. **Preview Course**
   - **Endpoint**: `GET /api/v1/course/preview`
   - **Description**: Provides a preview of a course, which may include title, description, image, and other relevant details to give users an overview before purchasing.
   - **Response**: Course preview information.

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TasrinSultana/CourseExpress.git
   ```

2. **Install dependencies**:
   ```bash
   cd CourseExpress
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

## Technology Stack
- Node.js
- Express.js
- MongoDB (for data storage)


