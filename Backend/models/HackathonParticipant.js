const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HackathonParticipantSchema = new Schema(
  {
    // Account Information
    userType: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Personal Information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    idCard: {
      data: Buffer,
      contentType: String,
      fileName: String,
      fileSize: Number,
    },

    // Team Information
    teamType: {
      type: String,
      enum: ["individual", "team"],
      default: "individual",
    },
    teamName: {
      type: String,
      trim: true,
      required: true,
    },
    teamMembers: [
      {
        fullName: {
          type: String,
          trim: true,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
        },
        contactNumber: {
          type: String,
          trim: true,
        },
        institution: {
          type: String,
          trim: true,
        },
        tShirtSize: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
        },
      },
    ],
    tShirtSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: true,
    },
    memberCount: {
      type: Number,
      min: 1,
      max: 4,
      default: 1,
      required: function () {
        return this.teamType === "team";
      },
    },

    // Proposal Information
    domain: {
      type: String,
      enum: [
        "Artificial Intelligence",
        "WEB DEV",
        "WEB3",
        "Open Innovation",
        "AI & ML",
        "IOT & HARDWARE",
        "CYBERSECURITY & BLOCKCHAIN",
        "OPEN DOMAIN",
      ],
      required: true,
    },
    proposalFile: {
      data: Buffer,
      contentType: String,
      fileName: String,
      fileSize: Number,
    },
    isProposal: {
      type: Boolean,
      default: false,
    },
    // Application Status
    applicationStatus: {
      type: String,
      enum: [
        "pending_proposal",
        "pending",
        "under_review",
        "shortlisted",
        "rejected",
      ],
      default: "pending",
    },
    reviewerNotes: String,
    reviewDate: Date,

    // For shortlisted applications
    shortlistedDate: Date,
    acceptanceNotificationSent: {
      type: Boolean,
      default: false,
    },
    ratings: [
      {
        judgeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "HACKONXJudge",
          required: true,
        },
        innovation: {
          type: Number,
          min: 1,
          max: 10,
        },
        technicality: {
          type: Number,
          min: 1,
          max: 10,
        },
        presentation: {
          type: Number,
          min: 1,
          max: 10,
        },
        feasibility: {
          type: Number,
          min: 1,
          max: 10,
        },
        impact: {
          type: Number,
          min: 1,
          max: 10,
        },
        comments: {
          type: String,
          trim: true,
        },
        totalScore: {
          type: Number,
        },
        ratedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },
    // For rejected applications
    rejectedDate: Date,
    rejectionReason: String,
    rejectionNotificationSent: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentProof: {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Add methods to the schema as needed
HackathonParticipantSchema.methods.updateStatus = function (
  newStatus,
  reviewerNotes
) {
  this.applicationStatus = newStatus;

  if (newStatus === "shortlisted") {
    this.shortlistedDate = new Date();
  } else if (newStatus === "rejected") {
    this.rejectedDate = new Date();
    this.rejectionReason = reviewerNotes;
  }

  this.reviewDate = new Date();
  this.reviewerNotes = reviewerNotes;

  return this.save();
};
HackathonParticipantSchema.index({ createdAt: -1 });
const HackathonParticipant = mongoose.model(
  "HackathonParticipant",
  HackathonParticipantSchema
);

module.exports = HackathonParticipant;
