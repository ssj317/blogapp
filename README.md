# Blogify

---

## Introduction
The **Blog App** is a full-stack web application where users can create, edit, and manage their blog posts. It features user authentication, profile management, and a clean, responsive user interface.

---

## Features
- User Authentication (Sign up, Log in, Log out)
- Profile management with profile picture upload
- Create, Read, Update, and Delete (CRUD) functionality for blog posts
- View other users' blogs
- Commenting functionality
- Responsive design

---

## Technologies Used

### Frontend:
- HTML, CSS, JavaScript
- Bootstrap/TailwindCSS (optional for styling)

### Backend:
- Node.js
- Express.js

### Database:
- MongoDB

### Other:
- Mongoose (for MongoDB integration)
- Multer (for file uploads)
- bcrypt (for password hashing)


---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blog-app.git
   cd blog-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Make sure you have MongoDB installed and running on your system.
   - Update the MongoDB connection string in `config/database.js` or equivalent.

4. Run the application:
   ```bash
   npm start
   ```

5. Open the app in your browser at `http://localhost:8000`.

---

## Usage

### Sign up and Log in
- Create a user account or log in to an existing account.

### Create a Blog Post
- After logging in, navigate to the "Create Blog" section to write and publish a blog post.

### Manage Blogs
- View your published blogs under your profile.

### Upload Profile Picture
- Navigate to your profile settings to upload a profile picture using the upload feature powered by Multer.

### Comment
- You can leave a comment under a blog and edit it also

---

## API Endpoints

### Authentication
- `POST /user/signup` - Register a new user
- `POST /user/login` - Log in
- `GET /user/logout` - Log out

### Blogs
- `GET user/blogs` - Get all blogs
- `POST user/blogs` - Create a new blog
- `GET user/blogs/:id` - Get a specific blog by ID
- `PUT user/blogs/:id` - Update a specific blog by ID
- `DELETE user/blogs/:id` - Delete a specific blog by ID

### Comments
- `POST user/blogs/:id/comments` - Add a comment to a blog
- `GET user/blogs/:id/comments` - Get all comments for a blog

---

## Folder Structure
```
blog-app/
├── public/                # Static files (CSS, JS, Images)
├── routes/                # Route handlers
├── controllers/           # Controllers for route logic
├── models/                # Mongoose models
├── config/                # Configuration files
├── views/                 # Frontend templates (if using a template engine like EJS)
├── app.js                 # Entry point of the app
└── package.json           # Project metadata and dependencies
```

---


