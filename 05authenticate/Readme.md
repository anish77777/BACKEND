# Authentication Backend - Step-by-Step Learning Log

This file records the project work in the order it was completed. Add new work as the next numbered step instead of replacing the earlier steps.

## Step 1: Create the Node.js project

- Initialize the project with `package.json`.
- Set `type` to `module` so the project can use `import` and `export`.
- Install Express, Mongoose, and dotenv.

## Step 2: Configure environment variables

- Create `.env` in the project root.
- Add `MONGODB_URI` to `.env`.
- Keep `.env` inside `.gitignore` because it contains private credentials.

## Step 3: Create the Express application

File: `src/app.js`

- Create the application with `express()`.
- Add `express.json()` so Express converts incoming JSON into `req.body`.
- Export `app` so `server.js` can start it.

## Step 4: Connect MongoDB

File: `src/db/db.js`

- Import Mongoose.
- Read `MONGODB_URI` from the environment.
- Call `mongoose.connect()` to connect the backend to MongoDB Atlas.
- Log whether the database connection succeeds or fails.

## Step 5: Create the user model

File: `src/models/user.model.js`

- Create `userSchema` with `username`, `email`, and `password` fields.
- Create the `user` Mongoose model from that schema.
- Export the model so controllers can create and query users.

The password is currently stored as plain text. Password hashing must be added before this is used as a real authentication system.

## Step 6: Create the authentication controller

File: `src/controllers/auth.controller.js`

- Read `username`, `email`, and `password` from `req.body`.
- Use `userModel.create()` to save the user in MongoDB.
- Return a JSON response to the client.
- Catch database errors so the request receives an error response.

## Step 7: Create the authentication router

File: `src/routes/auth.route.js`

- Create a mini Express router with `express.Router()`.
- Define `router.post('/register', authController.registerUser)`.
- Export the router so it can be mounted in `app.js`.

## Step 8: Mount the router

In `src/app.js`, the router is mounted with:

```js
app.use('/api/auth', authRoutes);
```

Express combines the mount path and router path:

```text
/api/auth + /register = POST /api/auth/register
```

## Step 9: Start the server

File: `server.js`

- Import the Express app and MongoDB connection function.
- Call `connectDB()`.
- Listen for HTTP requests on port `3000`.

## Step 10: Understand the registration request flow

When a client sends `POST /api/auth/register`:

1. `server.js` runs the application.
2. `express.json()` parses the JSON request body.
3. `app.use('/api/auth', authRoutes)` forwards the request to the authentication router.
4. `router.post('/register', ...)` matches the remaining `/register` path.
5. `authController.registerUser` handles the request.
6. `userModel.create()` saves the user to MongoDB.
7. The controller sends a JSON response to the client.

## Next steps

- Validate registration input.
- Prevent duplicate email addresses and usernames.
- Hash passwords with bcrypt before saving them.
- Add login functionality.
- Add JSON Web Tokens after login works.

## Step 11: Start the API only after MongoDB connects

- Make `server.js` wait for `connectDB()` before opening port `3000`.
- Stop startup when MongoDB fails instead of running an API without its database.
- Print the project name and complete registration URL at startup.
- This makes it easy to confirm that Postman is talking to the `05authenticate` server instead of another project using port `3000`.

## Step 12: Avoid a port collision with older projects

- Change the default port from `3000` to `5000` because several earlier backend projects also listen on port `3000`.
- Add `GET /api/health` to identify the running application.
- The registration endpoint is now `POST http://localhost:5000/api/auth/register`.

## Step 13: Create a JSON Web Token

After MongoDB creates the user, `user._id` is available as that user unique database identifier.

```js
const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
);
```

The first argument is the payload. It stores the user ID inside the token so a later authenticated request can identify which user sent it.

The second argument is the private secret used to sign the token. The backend later uses the same secret with `jwt.verify()` to confirm that the token is genuine and was not changed.

The third argument contains token settings. `expiresIn: '1d'` makes the token expire after one day.

JWT payloads are encoded, not encrypted. Never put a password, JWT secret, or other sensitive information in the payload.

## Step 14: Send the JWT as a cookie

After signing the token, it is sent to the client as an HTTP cookie using `res.cookie()`.

```js
res.cookie("token", token)
// res.cookie(name, value, options)
// useful options: httpOnly, secure, sameSite, maxAge
```

The browser stores this cookie automatically. On every subsequent request to the same server, the browser sends it back in the request headers without any extra code on the frontend.

## Step 15: Install and register cookie-parser

To read incoming cookies in `req.cookies`, the `cookie-parser` middleware must be installed and registered.

```bash
npm i cookie-parser
```

In `src/app.js`:

```js
import cookieParser from "cookie-parser";

app.use(cookieParser()); // parses cookies from req headers into req.cookies
```

Without `app.use(cookieParser())`, `req.cookies` is `undefined` even if the package is imported.

## Step 16: Understand how cookies flow

```
Step 1: POST /api/auth/register
        → server creates user, signs JWT
        → server calls res.cookie("token", token)
        → browser/Postman stores the cookie

Step 2: GET /api/auth/test
        → browser/Postman automatically sends the cookie back
        → cookie-parser reads it into req.cookies
        → req.cookies.token contains the JWT
```

`console.log(req.cookies)` inside a route handler prints to the **server terminal**, not the browser. It only runs when that specific route is called.

## Step 17: MongoDB Atlas creates the database in the cloud, not locally

`userModel.create()` does not write anything to the local machine. It sends a write command to MongoDB Atlas through the connection string in `.env`.

```
userModel.create({ username, email, password })
    │
    ▼
mongoose.connect(MONGODB_URI)   ← db.js
    │
    ▼
mongodb+srv://...@cluster0.../pluto   ← .env
    │
    ▼
☁️ MongoDB Atlas → database: "pluto" → collection: "users"
```

MongoDB only creates the database and collection when the first document is inserted. An empty database does not appear in Atlas. After the first `POST /api/auth/register` call, the `pluto` database and `users` collection become visible in Atlas under Browse Collections.

## Step 18: Unique fields to prevent duplicate users

One user should not be able to register twice with the same username or email. Adding `unique: true` to the schema field tells MongoDB to reject a second document with the same value.

```js
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
```

MongoDB enforces this at the database level by creating a unique index on that field automatically.

## Step 19: Create a protected post route

File: `src/routes/post.routes.js`

A protected route only allows requests that carry a valid JWT cookie. The route is mounted at `/api/post`.

```js
app.use("/api/post", postRoutes);
```

The full endpoint is:

```
POST /api/post/createpost
GET  /api/post/getallposts
```

## Step 20: Verify the token before allowing the action

Inside the route handler, three things happen in order:

1. Read the token from `req.cookies.token`.
2. Return 401 immediately if the token is missing.
3. Call `jwt.verify()` to confirm the token is genuine and was signed with the correct secret.

```js
const token = req.cookies.token
// ❌ Wrong: const {token} = req.cookies.token
// req.cookies.token is already a string. Destructuring it gives undefined.

if (!token) {
    return res.status(401).json({ message: "You are not authorized" });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded = { id: "...", iat: ..., exp: ... }
    // these are the same values that were put in the token during registration
} catch (error) {
    return res.status(500).json({ message: "token is not verified" });
}
```

`jwt.verify()` throws if the token is expired, tampered with, or signed with a different secret. The catch block handles all of these cases.

## Step 21: Fetch the user from the decoded token

The decoded payload contains the user ID that was stored when the token was created.

```js
const { id } = decoded
const user = await userModel.findById(id)
console.log(user)
```

This confirms which user made the request without them sending their username or password again. The token acts as proof of identity.

## Step 22: Common bug — wrong cookie destructuring

```js
// ❌ Bug
const { token } = req.cookies.token
// req.cookies.token is a JWT string like "eyJhbGci..."
// Destructuring { token } from a string gives undefined
// undefined fails the if(token) check → returns "You are not authorized"

// ✅ Fix
const token = req.cookies.token
```

Also remember to import `jwt` in every file that calls `jwt.verify()` or `jwt.sign()`.

```js
import jwt from "jsonwebtoken"
```

## Next steps

- Move token verification logic into a reusable middleware function so it does not have to be repeated in every protected route.
- Hash passwords with bcrypt before saving them.
- Add a login route that verifies the password and issues a new token.
- Build a real post model and save posts to MongoDB.
