const HackathonParticipant = require("../models/HackathonParticipant");
const { generateToken } = require("../utils/generateToken");
const ManageHackathon = require("../models/ManageHackathon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const {
  sendHackathonRegistrationEmail,
  sendHackathonStatusEmail,
  sendHackathonProposalConfirmationEmail,
  sendTeamMemberRegistrationEmail,
} = require("../config/emailConfig");
const upload = multer({
  // Use memory storage to keep files in buffer
  storage: multer.memoryStorage(),

  // File filter for validation
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."),
        false
      );
    }
  },

  // File size limit (10MB)
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Middleware for multiple file uploads as buffers
const multiUpload = upload.fields([
  { name: "idCard", maxCount: 1 },
  { name: "proposalFile", maxCount: 1 },
]);

// Registration Controller

module.exports.register = async (req, res) => {
  try {
    // Wrap Multer middleware in a promise to handle async operations
    await new Promise((resolve, reject) => {
      multiUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // Multer error (e.g., file too large)
          return reject({
            status: 400,
            message: "File upload error",
            error: err.message,
          });
        } else if (err) {
          // Other errors
          return reject({
            status: 500,
            message: "Upload error",
            error: err.message,
          });
        }
        resolve();
      });
    });

    // Destructure form fields
    const {
      email,
      password,
      fullName,
      contactNumber,
      institution,
      tShirtSize,
      teamType,
      memberCount,
      teamMembers: teamMembersString,
      domain,
    } = req.body;
    let teamName = req.body.teamName;
    // If teamName is an array, convert it to a string
    if (Array.isArray(teamName)) {
      console.warn(
        "Warning: teamName was received as an array. Converting to string."
      );
      teamName = teamName.join(", "); // or take just the first element with teamName[0]
    }
    let teamMembers = [];
    if (teamType === "team" && teamMembersString) {
      try {
        teamMembers = JSON.parse(teamMembersString);
      } catch (error) {
        console.error("Error parsing team members:", error);
        // Provide a default structure or leave as empty array
      }
    }
    // Check if user already exists
    const existingUser = await HackathonParticipant.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // // Hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const plainPassword = password;

    // Prepare file buffer data
    const idCardData =
      req.files && req.files.idCard
        ? {
            data: req.files.idCard[0].buffer,
            contentType: req.files.idCard[0].mimetype,
            fileName: req.files.idCard[0].originalname,
            fileSize: req.files.idCard[0].size,
          }
        : null;

    // For proposal file - now optional
    const proposalFileData =
      req.files && req.files.proposalFile
        ? {
            data: req.files.proposalFile[0].buffer,
            contentType: req.files.proposalFile[0].mimetype,
            fileName: req.files.proposalFile[0].originalname,
            fileSize: req.files.proposalFile[0].size,
          }
        : null;

    // Set application status based on proposal existence
    const applicationStatus = proposalFileData ? "pending" : "pending_proposal";

    // Create new participant
    const newParticipant = new HackathonParticipant({
      email,
      password: plainPassword,
      fullName,
      contactNumber,
      institution,
      idCard: idCardData,
      teamType,
      teamName,
      tShirtSize,
      memberCount: teamType === "team" ? memberCount : 1,
      teamMembers: teamMembers, // Use the parsed array here
      domain,
      proposalFile: proposalFileData,
      isProposal: !!proposalFileData,
      applicationStatus: applicationStatus,
      userType: "HackOnXUser",
    });

    // Save to database
    await newParticipant.save();
    await sendHackathonRegistrationEmail(
      email,
      fullName,
      domain,
      !!proposalFileData // Boolean indicating if proposal was submitted
    );
    let teamEmailResults = null;
    if (teamType === "team" && teamMembers && teamMembers.length > 0) {
      teamEmailResults = await sendTeamMemberRegistrationEmail(
        teamMembers,
        teamName,
        fullName,
        domain
      );
      console.log("Team member email results:", teamEmailResults);
    }
    // Generate JWT token
    const token = generateToken(newParticipant);

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      participant: {
        id: newParticipant._id,
        email: newParticipant.email,
        fullName: newParticipant.fullName,
        applicationStatus: newParticipant.applicationStatus,
        hasProposal: !!proposalFileData,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle different types of errors
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "An error occurred during registration",
      error: error.error || error.message,
    });
  }
};
// Login Controller for Hackathon Participants
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find the participant by email
    const participant = await HackathonParticipant.findOne({ email });

    // Check if participant exists
    if (!participant) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = password === participant.password;

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // Generate JWT token
    const token = generateToken(participant);

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      participant: {
        id: participant._id,
        email: participant.email,
        fullName: participant.fullName,
        applicationStatus: participant.applicationStatus,
        userType: participant.userType,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message,
    });
  }
};
module.exports.resetParticipantPassword = async (req, res) => {
  try {
    const { participantId } = req.params;
    const { newPassword } = req.body;

    // Validation
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find the participant by ID
    const participant = await HackathonParticipant.findById(participantId);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    // Update password (we're storing as plain text as requested)
    participant.password = newPassword;

    // Save the updated participant
    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Participant password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset participant password error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password",
      error: error.message,
    });
  }
};
module.exports.deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the participant
    const deletedParticipant = await HackathonParticipant.findByIdAndDelete(id);
    
    if (!deletedParticipant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Participant deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the participant",
      error: error.message
    });
  }
};
// In your hackathon controller
module.exports.getParticipantDetails = async (req, res) => {
  try {
    // The user is already authenticated via middleware
    const participant = await HackathonParticipant.findById(req.user._id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }
    const hasPaymentProof =
      !!participant.paymentProof &&
      !!participant.paymentProof.data &&
      participant.paymentProof.data.length > 0;
    // Return participant details
    return res.status(200).json({
      success: true,
      participant: {
        id: participant._id,
        email: participant.email,
        fullName: participant.fullName,
        contactNumber: participant.contactNumber,
        institution: participant.institution,
        teamType: participant.teamType,
        teamName: participant.teamName,
        memberCount: participant.memberCount,
        domain: participant.domain,
        applicationStatus: participant.applicationStatus,
        createdAt: participant.createdAt,
        userType: participant.userType,
        isProposal: participant.isProposal,
        paymentStatus: participant.paymentStatus,
        hasPaymentProof: hasPaymentProof,
      },
    });
  } catch (error) {
    console.error("Error fetching participant details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching participant details",
      error: error.message,
    });
  }
};

module.exports.createAdminHackathon = async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Log the setup process
    console.log("Starting admin creation process...");
    console.log("Setup key received:", setupKey);
    console.log("Environment setup key:", "this-is-secret");

    // Verify setup key
    if (setupKey !== "this-is-secret") {
      console.log("Setup key verification failed");
      return res.status(401).json({
        success: false,
        message: "Invalid setup key",
      });
    }

    // Check if admin already exists
    const existingManageAdmin = await ManageHackathon.findOne({
      role: "HackOnXManager",
    });
    if (existingManageAdmin) {
      console.log("existingManageAdmin already exists");
      return res.status(400).json({
        success: false,
        message: "existingManageAdmin already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const manageAdmin = new ManageHackathon({
      email,
      password: hashedPassword,
      role: "HackOnXManager",
    });

    await manageAdmin.save();
    console.log("manageAdmin created successfully");

    res.status(201).json({
      success: true,
      message: "manageAdmin created successfully",
    });
  } catch (error) {
    console.error("manageAdmin creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating manageAdmin",
    });
  }
};
module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const manageAdmin = await ManageHackathon.findOne({ email }).select(
      "+password"
    );
    if (!manageAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    console.log(manageAdmin);
    // Verify password
    const isMatch = await bcrypt.compare(password, manageAdmin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: manageAdmin._id, role: "HackOnXManager" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: manageAdmin._id,
        email: manageAdmin.email,
        role: "HackOnXManager",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};

// Optimized version of getAllApplications controller
module.exports.getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;
    const skip = (page - 1) * limit;

    // Add timeouts and optimize the query
    const applicationsQuery = HackathonParticipant.find()
      .select("-password -idCard.data -proposalFile.data -paymentProof.data") // Don't fetch large binary data
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Set a timeout for the query
    applicationsQuery.maxTimeMS(30000); // 30 seconds timeout
    
    // Execute the query
    const applications = await applicationsQuery;
    
    // Add a lightweight flag to indicate if files exist
    const enhancedApplications = applications.map(app => {
      const appObj = app.toObject();
      
      // Add flags for file existence instead of returning the full binary data
      appObj.hasIdCard = !!app.idCard && !!app.idCard.data;
      appObj.hasProposalFile = !!app.proposalFile && !!app.proposalFile.data;
      appObj.hasPaymentProof = !!app.paymentProof && !!app.paymentProof.data;
      
      return appObj;
    });
    
    // Use countDocuments with a timeout
    const totalQuery = HackathonParticipant.countDocuments();
    totalQuery.maxTimeMS(10000); // 10 seconds timeout
    const total = await totalQuery;

    return res.status(200).json({
      success: true,
      applications: enhancedApplications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    
    // Specific error handling for common MongoDB issues
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: "Database service temporarily unavailable. Please try again.",
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching applications",
      error: error.message
    });
  }
};

// Update application status
module.exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status against the updated enum values
    if (
      ![
        "pending_proposal",
        "pending",
        "under_review",
        "shortlisted",
        "rejected",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be pending_proposal, pending, under_review, shortlisted, or rejected.",
      });
    }

    // Find and update the application
    const application = await HackathonParticipant.findByIdAndUpdate(
      id,
      { applicationStatus: status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    await sendHackathonStatusEmail(
      application.email,
      application.fullName,
      status,
      application.domain,
      req.body.remarks || "" // Optional remarks from admin
    );
    // TODO: Send email notification to participant about status change

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating application status",
      error: error.message,
    });
  }
};
const proposalUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Allow only PDF files for proposals
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF files are allowed for proposals."
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("proposalFile");

// Controller to submit/update proposal after registration
module.exports.submitProposal = async (req, res) => {
  try {
    // Process file upload
    await new Promise((resolve, reject) => {
      proposalUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return reject({
            status: 400,
            message: "File upload error",
            error: err.message,
          });
        } else if (err) {
          return reject({
            status: 500,
            message: "Upload error",
            error: err.message,
          });
        }
        resolve();
      });
    });

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No proposal file was uploaded",
      });
    }

    // Get user ID from authenticated token
    const userId = req.user.id;

    // Find participant by ID
    const participant = await HackathonParticipant.findById(userId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    // Update the proposal file
    participant.proposalFile = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    };
    participant.isProposal = true;

    // If the status was "pending_proposal", update it to "pending"
    if (participant.applicationStatus === "pending_proposal") {
      participant.applicationStatus = "pending";
    }

    // Save the updated participant
    await participant.save();
    // In the submitProposal controller after participant.save()
    await sendHackathonProposalConfirmationEmail(
      participant.email,
      participant.fullName,
      participant.teamName,
      new Date().toLocaleDateString()
    );
    return res.status(200).json({
      success: true,
      message: "Proposal submitted successfully",
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("Proposal submission error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "An error occurred during proposal submission",
      error: error.error || error.message,
    });
  }
};

// Controller to get participant's proposal status
module.exports.getProposalStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const participant = await HackathonParticipant.findById(userId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    // Return proposal status information
    return res.status(200).json({
      success: true,
      hasProposal: !!participant.proposalFile,
      proposalName: participant.proposalFile
        ? participant.proposalFile.fileName
        : null,
      applicationStatus: participant.applicationStatus,
      domain: participant.domain,
    });
  } catch (error) {
    console.error("Error fetching proposal status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve proposal status",
      error: error.message,
    });
  }
};
// Backend controller
exports.downloadFile = async (req, res) => {
  try {
    const { id, fileType } = req.params;

    // Validate file type
    if (!["idCard", "proposalFile"].includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Must be idCard or proposalFile.",
      });
    }

    // Find the application
    const application = await HackathonParticipant.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if the file exists
    if (!application[fileType] || !application[fileType].data) {
      return res.status(404).json({
        success: false,
        message: `No ${fileType} file found for this application`,
      });
    }

    // Set content type based on the file's stored contentType
    res.set("Content-Type", application[fileType].contentType);
    res.set(
      "Content-Disposition",
      `attachment; filename="${application[fileType].fileName}"`
    );

    // Send the file data
    res.send(application[fileType].data);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while downloading the file",
      error: error.message,
    });
  }
};

const paymentUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Allow only image and PDF files
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."),
        false
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("paymentFile");
module.exports.submitPayment = async (req, res) => {
  try {
    // Process file upload
    await new Promise((resolve, reject) => {
      paymentUpload(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No payment screenshot was uploaded",
      });
    }

    // Get user ID from authenticated token
    const userId = req.user._id;

    // Find participant by ID
    const participant = await HackathonParticipant.findById(userId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    // Update the payment proof file
    participant.paymentProof = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      fileName: req.file.originalname,
    };

    // Set payment status to pending
    participant.paymentStatus = "pending";

    // Save the updated participant
    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Payment screenshot submitted successfully",
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during payment submission",
      error: error.message,
    });
  }
};

module.exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be approved or rejected.",
      });
    }

    // Find and update the application
    const application = await HackathonParticipant.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${status}`,
      application,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating payment status",
      error: error.message,
    });
  }
};

module.exports.getPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the participant
    const participant = await HackathonParticipant.findById(id);
    if (
      !participant ||
      !participant.paymentProof ||
      !participant.paymentProof.data
    ) {
      return res.status(404).json({
        success: false,
        message: "Payment proof not found",
      });
    }

    // Set the content type header based on the stored content type
    res.set(
      "Content-Type",
      participant.paymentProof.contentType || "image/jpeg"
    );

    // Send the binary data
    return res.send(participant.paymentProof.data);
  } catch (error) {
    console.error("Error retrieving payment proof:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving payment proof",
      error: error.message,
    });
  }
};
