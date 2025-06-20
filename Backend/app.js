require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const connectDB = require('./config/db');
const cors = require("cors")
const cookieParser = require("cookie-parser")
const expressSession = require("express-session")
const PORT = process.env.PORT||5000;

const hackathonRoutes = require("./routes/hackathonRoutes")

// const TestRoute = require("./routes/testRoute")
// const workshopRoutes = require("./routes/workshopRoutes")
connectDB();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://magnificent-bublanina-c141eb.netlify.app",
      "https://amazing-starburst-efa549.netlify.app",
      "https://illustrious-jelly-cb5062.netlify.app/"
      
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With', 'Accept']
   
   
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use(cookieParser());
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret: "secret",
}))

app.use("/hackathon",hackathonRoutes)

// app.use("/send",TestRoute)
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
