# Gramly – Mini Social Media App

Gramly is a full-stack mini social media web application inspired by modern social platforms. Users can create profiles, create posts, like posts, comment on posts, and follow other users.

The project uses a **vanilla HTML, CSS, and JavaScript frontend** with an **Express.js + MongoDB backend**.

---

## 🚀 Features

### 👤 User Authentication
- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes

### 👤 User Profiles
- View user profiles
- Edit name, bio, and avatar
- Followers count
- Following count

### 📝 Posts
- Create posts
- View posts
- Delete posts
- View user's posts

### ❤️ Likes
- Like posts
- Unlike posts
- Like count

### 💬 Comments
- Add comments
- View comments
- Delete your own comments

### 👥 Follow System
- Follow users
- Unfollow users
- Followers and following data stored in MongoDB

### 🎨 Frontend
- Responsive interface
- Light/dark theme
- Profile pages
- Post feed
- Comments and likes
- User interactions

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- LocalStorage
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Deployment
- Vercel
- GitHub

---

## 📁 Project Structure

```text
Gramly/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── vercel.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── api.js
│
├── .gitignore
└── README.md
```

---

## 🔗 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Users

```text
GET    /api/users
GET    /api/users/:id
PUT    /api/users/profile/update
POST   /api/users/:id/follow
DELETE /api/users/:id/follow
```

### Posts

```text
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
DELETE /api/posts/:id
POST   /api/posts/:id/like
DELETE /api/posts/:id/like
```

### Comments

```text
GET    /api/comments/post/:postId
POST   /api/comments/post/:postId
DELETE /api/comments/:id
```

---

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/raamna54-collab/Gramly.git
```

### 2. Open the project

```bash
cd Gramly
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Create `.env`

Inside the `backend` folder, create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 5. Start the backend

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Run the frontend

Open:

```text
frontend/index.html
```

in your browser, or use a local development server such as VS Code Live Server.

---

## 🌐 Live Backend

```text
https://backend-ten-gamma-41.vercel.app
```

---

## 🔐 Environment Variables

The backend requires:

| Variable | Description |
|---|---|
| `PORT` | Port used by the backend |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to create and verify JWT tokens |

**Never upload `.env` to GitHub.**

---

## 🔄 Application Flow

```text
Frontend
   │
   │ Fetch API
   ▼
Express.js Backend
   │
   │ Mongoose
   ▼
MongoDB
```

Authentication works using:

```text
Register
   ↓
Password hashed with bcrypt
   ↓
User stored in MongoDB
   ↓
Login
   ↓
JWT token generated
   ↓
Token stored in browser
   ↓
Protected API requests
```

---

## 👥 Follow System

When a user follows another user:

```text
Current User
     │
     └── following → Target User ID

Target User
     │
     └── followers → Current User ID
```

Both users' records are updated in MongoDB.

---

## ❤️ Like System

Users can like and unlike posts.

The backend stores the user IDs associated with the post's likes and prevents duplicate likes.

---

## 💬 Comment System

Users can:

- Add comments to posts
- View comments
- Delete their own comments

Comments are connected to both the user and the post through MongoDB references.

---

## 🔒 Security

The project includes:

- Password hashing using bcrypt
- JWT authentication
- Protected routes
- Authorization checks
- Environment variables for secrets
- `.env` excluded from Git

---

## 📌 Future Improvements

Possible future features include:

- Image uploads
- Profile picture uploads
- Post image uploads
- Notifications
- Search
- Direct messaging
- Stories
- Pagination
- Improved error handling
- Admin dashboard

---

## 👩‍💻 Author

**Aamna Rana**

Gramly – Full-Stack Mini Social Media Application

---

## 📄 License

This project is created for educational and development purposes.