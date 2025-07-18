// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const HackathonParticipant = require("../models/HackathonParticipant");
const ManageHackathon = require("../models/ManageHackathon");
const HACKONXJudge = require("../models/HackOnXJudge");
// Middleware for Student authentication

// Combined middleware that checks for either student or university token
const protectAny = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Try to find either a student or university
    let user = await Student.findById(decoded.id).select("-password");
    let userType = "student";

    if (!user) {
      user = await University.findById(decoded.id).select("-password");
      userType = "university";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add user to request object
    req.user = user;
    req.userType = userType;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
const protectHackathonParticipant = async (req, res, next) => {
  try {
    let token;

    // Check header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Get participant from token
    const participant = await HackathonParticipant.findById(decoded.id).select(
      "-password"
    );
    if (!participant) {
      return res.status(401).json({ message: "Participant not found" });
    }

    // Add participant to request object
    req.user = participant;
    req.userType = "HACKONXUser";
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const protectHackathonManager = async (req, res, next) => {
  console.log("this is the manageAdmin");
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Get admin from token
    const manageAdmin = await ManageHackathon.findById(decoded.id);
    if (!manageAdmin) {
      return res.status(401).json({ message: "manageAdmin not found" });
    }

    // Add admin to request object
    req.user = manageAdmin;
    req.userType = "HACKONXManager";
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const protectJudge = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Get admin from token
    const manageJudge = await HACKONXJudge.findById(decoded.id);

    if (!manageJudge) {
      return res.status(401).json({ message: "manageAdmin not found" });
    }
    req.user = manageJudge;
    req.userType = "HACKONXJudge";
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// const protect = async (req, res, next) => {
//   try {
//       const token = req.cookies.token;

//       if (!token) {
//           return res.status(401).json({
//               success: false,
//               message: 'Not authorized, no token'
//           });
//       }

//       // Verify token using your JWT_KEY
//       const decoded = jwt.verify(token, process.env.JWT_KEY);

//       // Log for debugging
//       console.log('Decoded token:', decoded);

//       if (!decoded.id) {
//           return res.status(401).json({
//               success: false,
//               message: 'Invalid token format'
//           });
//       }

//       // Get university from database
//       const university = await University.findById(decoded.id);

//       if (!university) {
//           return res.status(401).json({
//               success: false,
//               message: 'University not found'
//           });
//       }

//       // Set university in request object
//       req.university = university;

//       // Log for debugging
//       console.log('University set in request:', req.university._id);

//       next();
//   } catch (error) {
//       console.error('Auth middleware error:', error);
//       res.status(401).json({
//           success: false,
//           message: 'Not authorized, token failed',
//           error: error.message
//       });
//   }
// };

module.exports = {
  protectAny,
  protectHackathonParticipant,
  protectHackathonManager,
  protectJudge,
};
