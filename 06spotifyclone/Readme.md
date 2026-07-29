# Spotify Clone Backend - Development Flow

This README tracks the backend in development order: what was built, how requests flow, current problems, and what comes next.

## Project goal

Build a Spotify-style backend with JWT authentication, role-based authorization, users, artists, songs, albums, and playlists.

Current roles are `user` and `artist`.

## Step 1: Initialize the backend

- Create the Node.js project and enable ES modules with `type: module`.
- Install Express, Mongoose, dotenv, cookie-parser, and jsonwebtoken.
- Organize the source into application, database, model, controller, and route layers.

## Step 2: Configure environment variables

Create `06spotifyclone/.env` and keep it ignored by Git.

```env
MONGODB_URI=<private MongoDB Atlas URI>
JWT_SECRET=<private random signing secret>
```

- Reuse the Atlas cluster URI from `05authenticate`.
- Change the database path to `spotifyclone` so this app has separate collections.
- Never commit credentials or secrets.

## Step 3: Connect MongoDB

File: `src/db/db.js`

- Read `process.env.MONGODB_URI`.
- Connect through `mongoose.connect()`.
- Log success and stop the process on failure.
- If Atlas reports an IP whitelist error, allow the current development IP under Atlas Network Access.

## Step 4: Start the server after MongoDB

File: `server.js`

```js
await connectDB();
app.listen(3000);
```

The API opens port `3000` only after MongoDB connects.

## Step 5: Configure Express middleware

File: `src/app.js`

- `express.json()` converts incoming JSON into `req.body`.
- `cookieParser()` exposes cookies through `req.cookies`.
- `cors()` controls requests from a frontend on another origin.
- The authentication router is mounted at `/api/auth`.

## Step 6: Create the user model

File: `src/models/userModel.js`

The schema contains:

- `username`: required and unique.
- `email`: required and unique.
- `password`: required.
- `role`: either `artist` or `user`; the default is `user`.

## Step 7: Create the registration controller

File: `src/controllers/auth.controller.js`

The `registerUser` controller:

1. Reads `username`, `email`, `password`, and `role` from `req.body`.
2. Uses `user` as the default role.
3. Rejects missing fields with status `400`.
4. Uses a MongoDB `$or` query to detect an existing username or email.
5. Creates the user with `UserModel.create()`.
6. Signs a JWT containing `{ id: user._id }` with a one-hour expiry.
7. Places the JWT in an HTTP-only cookie named `token`.
8. Returns status `201` after registration.

> [!IMPORTANT]
> **Security Note: Password Hashing**
> Passwords should never be stored in plain text. Simple deterministic hashing algorithms (like MD5 or SHA-256 without a salt) are also vulnerable to brute-force and pre-computed lookup tables (Rainbow Tables), because the same plain text always produces the same hash. 
> To prevent this, we use `bcrypt` (via `bcryptjs`), which:
> 1. Generates a unique, random **salt** for every hash, ensuring that identical passwords result in completely different hashes.
> 2. Implements **key stretching** (with a configurable work factor/rounds) to make brute-forcing computationally expensive.

## Step 8: Create and mount the authentication router

Route file: `src/routes/auth.routes.js`

```js
router.post('/register', registerUser);
```

Mount path in `src/app.js`:

```js
app.use('/api/auth', authRoutes);
```

Final endpoint:

```text
/api/auth + /register = POST /api/auth/register
```

## Registration request flow

```text
Client JSON request
        ↓
express.json()
        ↓
/api/auth router mount
        ↓
POST /register route
        ↓
registerUser controller
        ↓
UserModel and MongoDB
        ↓
JWT stored in HTTP-only cookie
        ↓
JSON response returned
```

## Postman Testing

To test the registration endpoint, configure your request in Postman as follows:

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:** Select `raw` and choose `JSON` from the dropdown.

### Example Request Body (Payload)
```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

### Example Success Response (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64c3bc1e09c85a21e4c9e102",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "role": "user"
  }
}
```

---

## Current blockers and security work

- [x] `src/app.js` imports `cors`, but `cors` is not listed in `package.json` (Resolved: Installed `cors`)
- [x] `src/app.js` points to incorrect path `../routes/...` (Resolved: Corrected import to `./routes/auth.routes.js`)
- [x] Passwords are stored as plain text (Resolved: Hashed passwords with `bcryptjs` before saving)
- [x] Registration returns the user document including password (Resolved: Returning only safe user fields)
- [ ] Cookies with `secure: true` require HTTPS. Make this environment-aware during local development.
- [ ] Add stronger email, password, and role validation.

## Next development steps

- [x] Fix the CORS dependency and router import path.
- [x] Hash passwords during registration.
- [x] Return a safe user response without the password.
- [ ] Add login endpoint (`POST /api/auth/login`).
- [ ] Add middleware that verifies the JWT cookie.
- [ ] Add artist-only authorization.
- [ ] Build song, album, and playlist models and routes.
