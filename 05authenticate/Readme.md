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
