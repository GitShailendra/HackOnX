const HackathonParticipant = require("../models/HackathonParticipant");
const { generateToken } = require("../utils/generateToken");
const ManageHackathon = require("../models/ManageHackathon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const HACKONXJudge = require("../models/HackOnXJudge");
const {
  sendHackathonRegistrationEmail,
  sendHackathonStatusEmail,
  sendHackathonProposalConfirmationEmail,
  sendTeamMemberRegistrationEmail,
} = require("../config/emailConfig");
module.exports.createJudge = async (req, res) => {
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
    const existingAdmin = await InnovvietJudge.findOne({
      role: "HACKONXJudge",
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new InnovvietJudge({
      email,
      password: hashedPassword,
      role: "HACKONXJudge",
    });

    await admin.save();
    console.log("Admin created successfully");

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: "Error creating judge",
    });
  }
};

module.exports.judgeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Judge login attempt with email:", email);
    console.log(
      "Judge login attempt with password:",
      password ? password : "No password provided"
    );
    const admin = await HACKONXJudge.findOne({ email }).select("+password");
    console.log("Admin found:", admin ? "Yes" : "No");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      { id: admin._id, role: "HACKONXJudge" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: "HACKONXJudge",
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "Error logging in judge",
    });
  }
};

module.exports.getShortlistedParticipants = async (req, res) => {
  try {
    const shortlistedApplications = await HackathonParticipant.find(
      { applicationStatus: "shortlisted" },
      { password: 0, idCard: 0, proposalFile: 0, paymentProof: 0 }
    );

    res.status(200).json({
      success: true,
      count: shortlistedApplications.length,
      data: shortlistedApplications,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error fetching shortlisted participants",
    });
  }
};

module.exports.submitRating = async (req, res) => {
  try {
    const { teamId } = req.params;
    const {
      innovation,
      technicality,
      presentation,
      feasibility,
      impact,
      comments,
    } = req.body;

    // Validate input
    if (
      !innovation ||
      !technicality ||
      !presentation ||
      !feasibility ||
      !impact
    ) {
      return res.status(400).json({
        success: false,
        message: "All rating criteria are required",
      });
    }

    const judgeId = req.user._id;

    // Find the team/participant
    const participant = await HackathonParticipant.findById(teamId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    // Calculate total score
    const totalScore =
      (innovation + technicality + presentation + feasibility + impact) / 5;

    // Add new rating
    participant.ratings.push({
      judgeId,
      innovation,
      technicality,
      presentation,
      feasibility,
      impact,
      comments,
      totalScore,
      ratedAt: new Date(),
    });

    // Calculate average rating
    if (participant.ratings.length > 0) {
      const sum = participant.ratings.reduce(
        (acc, rating) => acc + rating.totalScore,
        0
      );
      participant.averageRating = sum / participant.ratings.length;
    }

    // Save participant with new rating
    await participant.save();

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: {
        teamId: participant._id,
        ratings: participant.ratings.find(
          (rating) => rating.judgeId.toString() === judgeId.toString()
        ),
        averageRating: participant.averageRating,
      },
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting rating",
      error: error.message,
    });
  }
};

// Get rating for a specific team from the logged-in judge
module.exports.getJudgeRating = async (req, res) => {
  try {
    const { teamId } = req.params;
    const judgeId = req.user._id;

    const participant = await HackathonParticipant.findById(teamId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    const rating = participant.ratings.find(
      (rating) => rating.judgeId.toString() === judgeId.toString()
    );

    res.status(200).json({
      success: true,
      data: rating || null,
    });
  } catch (error) {
    console.error("Error getting rating:", error);
    res.status(500).json({
      success: false,
      message: "Error getting rating",
      error: error.message,
    });
  }
};

// Get all ratings for a specific team
module.exports.getTeamRatings = async (req, res) => {
  try {
    const { teamId } = req.params;

    const participant = await HackathonParticipant.findById(teamId).populate(
      "ratings.judgeId",
      "email"
    ); // Populate judge details if needed

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        teamId: participant._id,
        ratings: participant.ratings,
        averageRating: participant.averageRating,
      },
    });
  } catch (error) {
    console.error("Error getting team ratings:", error);
    res.status(500).json({
      success: false,
      message: "Error getting team ratings",
      error: error.message,
    });
  }
};

module.exports.getLeaderboard = async (req, res) => {
  try {
    // Get all shortlisted participants with ratings
    const participants = await HackathonParticipant.find(
      { applicationStatus: "shortlisted" },
      { password: 0, idCard: 0, proposalFile: 0, paymentProof: 0 }
    ).populate("ratings.judgeId", "email");

    // Filter to only include participants with at least one rating
    const ratedParticipants = participants.filter(
      (p) => p.ratings && p.ratings.length > 0
    );

    // Sort by average rating (descending)
    ratedParticipants.sort((a, b) => b.averageRating - a.averageRating);

    // Map to leaderboard format with rank
    const leaderboardData = ratedParticipants.map((participant, index) => {
      // Calculate average scores for each criterion
      const criteriaAverages = {
        innovation: 0,
        technicality: 0,
        presentation: 0,
        feasibility: 0,
        impact: 0,
      };

      // Calculate sums for each criterion
      participant.ratings.forEach((rating) => {
        criteriaAverages.innovation += rating.innovation || 0;
        criteriaAverages.technicality += rating.technicality || 0;
        criteriaAverages.presentation += rating.presentation || 0;
        criteriaAverages.feasibility += rating.feasibility || 0;
        criteriaAverages.impact += rating.impact || 0;
      });

      // Calculate averages
      const judgeCount = participant.ratings.length;
      if (judgeCount > 0) {
        criteriaAverages.innovation /= judgeCount;
        criteriaAverages.technicality /= judgeCount;
        criteriaAverages.presentation /= judgeCount;
        criteriaAverages.feasibility /= judgeCount;
        criteriaAverages.impact /= judgeCount;
      }

      return {
        rank: index + 1,
        teamId: participant._id,
        teamName: participant.teamName,
        domain: participant.domain,
        institution: participant.institution,
        memberCount: participant.memberCount,
        averageRating: participant.averageRating,
        judgeCount: judgeCount,
        criteriaAverages: criteriaAverages,
      };
    });

    res.status(200).json({
      success: true,
      count: leaderboardData.length,
      data: leaderboardData,
    });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard data",
      error: error.message,
    });
  }
};

module.exports.getShortlistedLeaderboard = async (req, res) => {
  try {
    const shortlistedApplications = await HackathonParticipant.find(
      { applicationStatus: "shortlisted" },
      { password: 0, idCard: 0, proposalFile: 0, paymentProof: 0 }
    );

    res.status(200).json({
      success: true,
      count: shortlistedApplications.length,
      data: shortlistedApplications,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error fetching shortlisted participants",
    });
  }
};
