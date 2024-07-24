import path from "path"; // builtin node module
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from "cloudinary";
import {app, server} from "./socket/socket.js"

dotenv.config();   //to be able to read the content of .env file 
connectDB(); 
 

// 10:01  const app = express();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
 });



// ____________________Middleware ________________

app.use(express.json({ limit: '50mb' })); //it allows you to parse JSON data in the req.body  the incoming data from the request.body // or it parse JSON data in the req.body
// when payload is too large like image i.e we increase the limit i.e 10mb
app.use(express.urlencoded({ extended:true})); //it allows you to parse data the incoming data from the request.body or to parse form data in the req.body

app.use(cookieParser()); //it allows you to get the cookies from the request.body and set the cookie inside the response
// to access the cookie from both req and res so we use cookieParser()


// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


// ________________________________________________



// Routes
app.use("/api/users",userRoutes);  //it create http://localhost:5000/api/users/signup
app.use("/api/posts",postRoutes);
app.use("/api/messages",messageRoutes);

// http://localhost:5000 => backend
// http://localhost:3000 => frontend
// into
// http://localhost:5000 => backend,frontend

if (process.env.NODE_ENV === "production") 
{
    // middleware
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // react app home page 12:09 we render the index.html in *
    app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}  //now we convert our frontend and backend to same url because we don't want to CORS error that's why we do this


// 10:01 app.listen(PORT,()=> console.log(`Server Started at http://localhost:${PORT}`));   
// instead of listening express app listen from http server i.e server
server.listen(PORT,()=> console.log(`Server Started at http://localhost:${PORT}`));   
// now we are able to handle socket related thing and also http requests

                       