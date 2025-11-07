# Sprint 2: Authentication & Users - API Documentation

## 🎉 Sprint 2 Complete!

### Environment Setup

1. Copy `.env.example` to `.env`
2. Update the values with your configuration
3. Make sure `JWT_SECRET` is a strong secret key

### API Endpoints

#### Authentication Routes (`/api/auth`)

**1. Register User**

```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "reviewer",  // or "submitter"
  "profile_picture": "url_to_image" // optional
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reviewer",
    "profile_picture": null
  }
}
```

**2. Login**

```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "reviewer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**3. Get Current User** (Protected)

```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reviewer"
  }
}
```

#### User Routes (`/api/users`) - All Protected

**1. Get All Users**

```
GET /api/users
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

**2. Get Users by Role**

```
GET /api/users/role/:role
Authorization: Bearer <token>

Example: GET /api/users/role/reviewer
```

**3. Get User by ID**

```
GET /api/users/:id
Authorization: Bearer <token>

Example: GET /api/users/1
```

**4. Update User** (Only own profile)

```
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword",  // optional
  "profile_picture": "new_url"  // optional
}
```

**5. Delete User** (Only own profile)

```
DELETE /api/users/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Authentication Flow

1. Register a new user via `/api/auth/register`
2. Login via `/api/auth/login` to get JWT token
3. Include token in Authorization header: `Bearer <token>`
4. Access protected routes with the token

### Features Implemented

✅ User registration with password hashing (bcrypt)
✅ JWT-based authentication
✅ Login with token generation
✅ Authentication middleware
✅ Authorization middleware (role-based)
✅ Ownership check (users can only modify their own profiles)
✅ Input validation
✅ Error handling
✅ CRUD operations for user profiles

### Testing with Postman/Thunder Client

1. Register a user
2. Login to get token
3. Copy the token
4. Add Authorization header: `Bearer <your_token>`
5. Test protected routes

---

**Next Sprint**: Projects & Submissions
