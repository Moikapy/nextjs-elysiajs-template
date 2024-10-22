
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors, HTTPMethod } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
// MongoDB connection setup
let init = false
const MONGO_URI = "mongodb://mongo:27017";
const DATABASE_NAME = "elysiaApp";
let db: any;
let usersCollection: any;
let blogsCollection: any;

async function connectToDatabase() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DATABASE_NAME);
  usersCollection = db.collection("users");
  blogsCollection = db.collection("blogs");
}

const validate_auth = async ({ headers, jwt }) => {

    // 1. Extract the 'Authorization' header from the incoming request
    const auth = headers['authorization']
    console.log(auth);
    
    // 2. Check if the 'Authorization' header contains a Bearer token
    //    If it starts with 'Bearer ', extract the token string after 'Bearer '
    //    Otherwise, set token to null indicating no valid token is present
    const token = auth && auth.startsWith('Bearer ') ? auth.split(" ")[1]: null

    // 3. If no token is found, return an object with user set to null
    if (!token) return { user: null }

    // 4. Verify the JWT token using the jwt_auth module
    //    This step authenticates the token and retrieves the user information
    const user = await jwt.verify(token)

    // 5. Return an object containing the authenticated user information
    //    This will be available inside de request object
    return { user }
  }

const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] as HTTPMethod[],
  allowedHeaders: "*",
  exposedHeaders: "*",
  maxAge: 5,
};

const swaggerConfig = {
  documentation: {
    info: {
      title: "API Documentation",
      version: "0.0.0",
    },
  },
};

const SECRET_KEY = "your_secret_key_here";

const app = new Elysia({ prefix: "/api" })
  .use(cors(corsConfig))
  .use(swagger(swaggerConfig))
  .use(
    jwt({
      secret: SECRET_KEY,
      algorithm: "HS256",
    })
  )
  .onBeforeHandle(async () => {
    if(!init){
     console.log('Connecting')
      await connectToDatabase();}else{
    console.log("Connected to MongoDB");}
    init = true
  })
  // Auth routes
  .post("/signup", async ({ body }) => {
   try {
        const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return { status: 400, body: { message: "Username and password are required" } };
    }

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return { status: 400, body: { message: "User already exists" } };
    }
     // Hash the password before storing
  const hashedPassword = await Bun.password.hash(password, {
  memoryCost: 4, // memory usage in kibibytes
  timeCost: 3, // the number of iterations
algorithm: "argon2id",
});
    await usersCollection.insertOne({ username, password:hashedPassword });
    return { status: 201, body: { message: "User registered successfully" } };
   } catch (error) {
    console.log('Error Message - Signup: ', error.message)
    return {status:500, body:{message:error.message}}
   } 
  })
  .post("/login", async ({ body, jwt }) => {
    try {
          const { username, password } = body as { username: string; password: string };

    const user = await usersCollection.findOne({ username });
      
  // Compare the provided password with the hashed password
  const isPasswordValid = await Bun.password.verify(password, user.password);
  if (!isPasswordValid) {
    return { status: 401, body: { message: "Invalid username or password" } };
  }

    const token = await jwt.sign({ username });
    return { status: 200, body: { message: "Login successful", token } };

    } catch (error) {
     console.log('Error Message - Login: ', error.message);
      return {status:500,body:{message:error.message
      }}
    }
  })
  // Protected profile route
   // ℹ️ Designed to append new value to context directly before validation
  .derive(validate_auth)
  .get("/profile", async ({ user, request }) => {

    if (!user) {
      return { status: 401, body: { message: "Not Authorized" } };
    }
    try {
     
      const _user = await usersCollection.findOne({ username: user.username });
      if (!_user) {
        return { status: 404, body: { message: "User not found" } };
      }

      return { status: 200, body: { user:_user } };
    } catch (error) {
      console.log(error.message)
      return { status: 401, body: { message: "Invalid or expired token" } };
    }
  })
  // Blog CRUD routes
    // ℹ️ Designed to append new value to context directly before validation
 
  .post("/blogs/create", async ({ body, user, request }) => {
    const { title, content } = body as { title: string; content: string };
    
    if (!user) {
      return { status: 401, body: { message: "Not Authorized" } };
    }


    try {
      const blog = { title, content, author: user.username, createdAt: new Date() };
      
      await blogsCollection.insertOne(blog);
      return { status: 201, body: { message: "Blog created successfully", blog } };
    } catch (error) {
      console.log(error.message)
      return { status: 401, body: { message: "Invalid or expired token" } };
    }
  })
  .get("/blogs", async () => {
    const blogs = await blogsCollection.find().toArray();
    console.log("BLOGS",blogs);
    
    return { status: 200, body: { blogs:blogs } };
  })
  .get("/blogs/:id", async ({ params }) => {
    const { id } = params;
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return { status: 404, body: { message: "Blog not found" } };
    }

    return { status: 200, body: { blog } };
  })
     // ℹ️ Designed to append new value to context directly before validation
  .derive(validate_auth)
  .patch("/blogs/:id", async ({ params, body, user, request }) => {
    const { id } = params;
    const { title, content } = body as { title?: string; content?: string };
    if (!user) {
      return { status: 401, body: { message: "Not Authorized" } };
    }


    try {
      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

      if (!blog) {
        return { status: 404, body: { message: "Blog not found" } };
      }

      if (blog.author !== payload.username) {
        return { status: 403, body: { message: "Unauthorized" } };
      }

      await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, content, updatedAt: new Date() } }
      );
      return { status: 200, body: { message: "Blog updated successfully" } };
    } catch (error) {
      return { status: 401, body: { message: "Invalid or expired token" } };
    }
  })
     // ℹ️ Designed to append new value to context directly before validation
  .derive(validate_auth)
  .delete("/blogs/:id", async ({ params, user, request }) => {
    const { id } = params;
    if (!user) {
      return { status: 401, body: { message: "Authorize User" } };
    }


    try {
      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

      if (!blog) {
        return { status: 404, body: { message: "Blog not found" } };
      }

      if (blog.author !== payload.username) {
        return { status: 403, body: { message: "Unauthorized" } };
      }

      await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      return { status: 200, body: { message: "Blog deleted successfully" } };
    } catch (error) {
      return { status: 401, body: { message: "Invalid or expired token" } };
    }
  })
  .get("/", () => "Hello from Elysia!");

// Expose methods
export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const PUT = app.handle;

export type API = typeof app;

