// config/emailConfig.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false, // false for 587, true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certificates
    rejectUnauthorized: false,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `skillonx <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};
const sendVerificationEmail = async (email, verificationCode, acoountType) => {
  try {
    const baseUrl = "http://localhost:5173";
    const prodUrl = "https://skillonx.com";
    // For production
    // const baseUrl = 'https://skillonx.com';

    const verificationLink = `${prodUrl}/verification-email?code=${verificationCode}&email=${encodeURIComponent(
      email
    )}&accountType=${acoountType}`;

    const mailOptions = {
      from: `skillonx <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <p>Thank you for registering at skillonx.</p>
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>Alternatively, you can verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="color: #007bff; text-decoration: none;">Verify My Email</a>
        <p>If you did not register, please ignore this email.</p>
      `,
      text: `Thank you for registering at skillonx.\n\nYour verification code is: ${verificationCode}\n\nAlternatively, you can verify your email by visiting this link: ${verificationLink}\n\nIf you did not register, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

const sendApprovalEmail = async (
  universityEmail,
  isApproved,
  universityName,
  remarks
) => {
  try {
    // Email template for approval
    const approvalTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #0d6efd;">Skillonx University Update</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${universityName},</p>
          
          ${
            isApproved
              ? `
            <p>Congratulations! Your university registration has been approved. You can now access your account on Skillonx.</p>
            
            <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>Status: Approved</strong>
            </div>

            <p>Next steps:</p>
            <ol>
              <li>Log in to your university account</li>
              <li>Complete your university profile</li>
              <li>Start managing your courses and students</li>
            </ol>
          `
              : `
            <p>Thank you for your interest in registering with Skillonx. After careful review of your application, we regret to inform you that we cannot approve your registration at this time.</p>
            
            <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>Status: Not Approved</strong>
              ${
                remarks
                  ? `<p style="margin-top: 10px;">Remarks: ${remarks}</p>`
                  : ""
              }
            </div>

            <p>If you believe this decision was made in error or would like to submit additional information, please contact our support team.</p>
          `
          }
          
          <p style="margin-top: 20px;">Best regards,<br>The Skillonx Team</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>If you need assistance, please contact our support team.</p>
        </div>
      </div>
    `;

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: universityEmail,
      subject: isApproved
        ? "University Registration Approved - Skillonx"
        : "University Registration Update - Skillonx",
      html: approvalTemplate,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending approval email:", error);
    return false;
  }
};
const sendBulkWelcomeEmail = async (users, subject, messageContent) => {
  try {
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("Invalid users data provided");
    }

    const emailTemplate = (firstName, content) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #0d6efd;">skillonx Message</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${firstName},</p>
          
          ${content}
          
          <p>Best regards,<br>The skillonx Team</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
          <p>If you need help, please contact our support team.</p>
        </div>
      </div>
    `;

    // Send emails to all users
    const results = await Promise.all(
      users.map(async (user) => {
        try {
          const mailOptions = {
            from: `Skillonx <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: subject || "Message from Skillonx",
            html: emailTemplate(user.firstName || "Student", messageContent),
          };

          const info = await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${user.email}:`, info.messageId);
          return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            success: true,
          };
        } catch (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            success: false,
            error: error.message,
          };
        }
      })
    );

    // Return summary of results
    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      details: results,
    };

    return summary;
  } catch (error) {
    console.error("Error in bulk email:", error);
    throw error;
  }
};

const sendHackathonRegistrationEmail = async (
  email,
  fullName,
  domain,
  hasProposal
) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX Registration</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${fullName},</p>
          
          <p>Thank you for registering for <strong>HACKONX 2025</strong>! We're excited to have you join our community of innovators and problem solvers.</p>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Registration Details</h3>
            <p><strong>College:</strong> DSATM Bangalore</p>
            <p><strong>Domain:</strong> ${domain}</p>
            <p><strong>Proposal Status:</strong> ${
              hasProposal ? "Submitted" : "Pending"
            }</p>
          </div>
          
          ${
            !hasProposal
              ? `
            <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>Important:</strong> Your registration is incomplete. Please submit your project proposal through your dashboard as soon as possible to complete your application.
            </div>
          `
              : `
            <p>Our team will review your application and proposal. You'll be notified once the review process is complete.</p>
          `
          }
          
          <p>You can log in to your dashboard at any time to check your application status.</p>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX 2025 <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "HACKONX 2025 - Registration Confirmation",
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Registration email sent to:", email, info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending hackathon registration email:", error);
    return false;
  }
};

const sendTeamMemberRegistrationEmail = async (
  teamMembers,
  teamName,
  teamLeaderName,
  domain
) => {
  try {
    if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
      console.log("No team members to notify");
      return { success: false, message: "No team members to notify" };
    }

    // Create email template for team members
    const teamMemberEmailTemplate = (
      memberName,
      teamLeaderName,
      teamName,
      domain
    ) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX 2025 - Team Registration</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${memberName},</p>
          
          <p>Congratulations! You have been registered as a team member for <strong>HACKONX 2025</strong> by ${teamLeaderName}.</p>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Team Details</h3>
            <p><strong>Team Name:</strong> ${teamName}</p>
            <p><strong>Team Leader:</strong> ${teamLeaderName}</p>
            <p><strong>College:</strong> DSATM Bangalore</p>
            <p><strong>Domain:</strong> ${domain}</p>
          </div>
          
          <p>Your team leader will manage the submission process for the hackathon. They will be your point of contact for any updates regarding the competition.</p>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong>Important:</strong> If you believe you have been added to this team by mistake, please contact the team leader or our support team immediately.
          </div>
          
          <p>We're excited to see what your team creates! If you have any questions about the hackathon, please visit our website or contact our support team.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send emails to all team members
    const results = await Promise.all(
      teamMembers.map(async (member) => {
        try {
          if (!member.email || !member.fullName) {
            return {
              success: false,
              message: "Missing email or name for team member",
              member,
            };
          }

          const mailOptions = {
            from: `HACKONX 2025 <${process.env.EMAIL_USER}>`,
            to: member.email,
            subject: `HACKONX 2025 - You've Been Added to Team ${teamName}`,
            html: teamMemberEmailTemplate(
              member.fullName,
              teamLeaderName,
              teamName,
              domain
            ),
          };

          const info = await transporter.sendMail(mailOptions);
          console.log(
            `Team member notification email sent to: ${member.email}`,
            info.messageId
          );

          return {
            success: true,
            email: member.email,
            messageId: info.messageId,
          };
        } catch (error) {
          console.error(
            `Error sending email to team member ${member.email}:`,
            error
          );
          return {
            success: false,
            email: member.email,
            error: error.message,
          };
        }
      })
    );

    // Return summary of results
    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      details: results,
    };

    return summary;
  } catch (error) {
    console.error("Error sending team member registration emails:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const sendHackathonStatusEmail = async (
  email,
  fullName,
  status,
  domain,
  remarks = ""
) => {
  try {
    // Email content based on status
    let statusTitle, statusMessage, statusColor, ctaMessage;

    switch (status) {
      case "shortlisted":
        statusTitle = "Congratulations! You have Been Shortlisted";
        statusMessage =
          "We are pleased to inform you that your application for HACKONX 2025 has been shortlisted. Your innovative approach and proposal have impressed our review panel.";
        statusColor = "#28a745";
        ctaMessage =
          "Please keep an eye on your email for further instructions regarding the next steps. We look forward to seeing your project come to life!";
        break;

      case "under_review":
        statusTitle = "Your Application is Under Review";
        statusMessage =
          "We are currently reviewing your application and proposal. Our panel is evaluating all submissions carefully, and we will get back to you soon with a decision.";
        statusColor = "#17a2b8";
        ctaMessage =
          "Thank you for your patience during this process. You can check your application status anytime through your dashboard.";
        break;

      case "rejected":
        statusTitle = "Application Status Update";
        statusMessage =
          "Thank you for your interest in HACKONX 2025. After careful consideration, we regret to inform you that your application has not been selected to proceed to the next round.";
        statusColor = "#dc3545";
        ctaMessage =
          "We received many strong applications this year, making the selection process very competitive. We encourage you to apply for future hackathons and events.";
        break;

      default:
        statusTitle = "Application Status Update";
        statusMessage =
          "There has been an update to your HACKONX 2025 application status. Please check your dashboard for the latest information.";
        statusColor = "#6c757d";
        ctaMessage =
          "If you have any questions, feel free to contact our support team.";
    }

    // Create email template
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX 2025</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${fullName},</p>
          
          <div style="background-color: ${statusColor}; color: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: white;">${statusTitle}</h2>
          </div>
          
          <p>${statusMessage}</p>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Application Details</h3>
            <p><strong>College:</strong> DSATM Bangalore</p>
            <p><strong>Domain:</strong> ${domain}</p>
            <p><strong>Status:</strong> ${status
              .replace("_", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}</p>
            ${
              remarks
                ? `<p><strong>Reviewer Remarks:</strong> ${remarks}</p>`
                : ""
            }
          </div>
          
          <p>${ctaMessage}</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX 2025 <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `HACKONX 2025 - ${statusTitle}`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to: ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending hackathon status email:", error);
    return false;
  }
};

const sendHackathonProposalConfirmationEmail = async (
  email,
  participantName,
  teamName,
  submissionDate
) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX 2025</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${participantName},</p>
          
          <p>Thank you for submitting your proposal for HACKONX 2025! We're excited to confirm that your submission has been successfully received and is now under review by our panel of judges.</p>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Proposal Details:</h3>
            <p><strong>Team Name:</strong> ${teamName}</p>
            <p><strong>College:</strong> DSATM Bangalore</p>
            <p><strong>Submission Date:</strong> ${submissionDate}</p>
          </div>
          
          <p>Our team will carefully evaluate all proposals based on innovation, feasibility, impact, and alignment with this year's themes. We appreciate the time and effort you've invested in crafting your proposal.</p>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0d47a1;">Important Notes:</h3>
            <ul>
              <li>All proposals must be submitted through the official portal to be considered</li>
              <li>After submission, your proposal will be under review by our panel of judges</li>
              <li>Teams with selected proposals will be notified to proceed to the next round</li>
              <li>Selection is based on innovation, feasibility, technical merit, and alignment with hackathon themes</li>
            </ul>
          </div>
          
          <h3>What Happens Next?</h3>
          <p>Our review process typically takes 1-2 business days. You can check the status of your proposal anytime by logging into your dashboard at:<br>
          <a href="https://skillonx.com/Hackathon-login" style="color: #6b46c1;">https://skillonx.com/Hackathon-login</a></p>
          
          <h3>Have Questions?</h3>
          <p>If you have any questions or need clarification about the evaluation process, please don't hesitate to reach out to:</p>
          <ul>
            <li>Student Coordinator: Madan N</li>
            <li>Mail: <a href="mailto:Madan@skillonx.net" style="color: #6b46c1;">Madan@skillonx.net</a></li>
            <li>Ph No: 9845523415</li>
            <li>WhatsApp No: 9845523415</li>
            <li>Faculty Coordinator: Syed Rehman</li>
            <li>Mail: <a href="mailto:ateeqbeme07@gmail.com" style="color: #6b46c1;">ateeqbeme07@gmail.com</a></li>
            <li>Ph No: 831-0367481</li>
            <li>WhatsApp No: +91 89716 11062</li>
          </ul>
          
          <p>We'll notify you via email once the review of your proposal is complete. Make sure to check your inbox regularly, including your spam folder.</p>
          
          <p>Thank you for your participation in HACKONX 2025. We look forward to seeing how your innovative ideas develop throughout the hackathon!</p>
          
          <p style="margin-top: 20px;">Warm regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX 2025 <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `HACKONX 2025 - Proposal Submission Confirmation`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Proposal confirmation email sent to: ${email}`,
      info.messageId
    );
    return true;
  } catch (error) {
    console.error(
      "Error sending hackathon proposal confirmation email:",
      error
    );
    return false;
  }
};

const sendHackathonProposalReminderEmail = async (
  email,
  participantName,
  deadline
) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX 2025</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${participantName},</p>
          
          <p>Thank you for registering for HACKONX 2025! We noticed that you haven't submitted your project proposal yet. To continue with the hackathon, please follow the steps below to complete your submission.</p>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0;">How to Submit Your Proposal:</h3>
            <ol>
              <li><strong>Download the Proposal Template:</strong> We've attached a PDF template to this email that outlines the required format and sections for your proposal. Please follow this format carefully.</li>
              <li><strong>Prepare Your Submission:</strong> Complete all sections of the template with your project details, team information, and implementation plan.</li>
              <li><strong>Submit Online:</strong> Log in to your account at <a href="https://skillonx.com/Hackathon-login" style="color: #856404;">https://skillonx.com/Hackathon-login</a> and navigate to the "Submit Proposal" section to upload your completed proposal.</li>
            </ol>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Important Notes:</h3>
            <ul>
              <li>All proposals must be submitted through the official portal to be considered</li>
              <li>After submission, your proposal will be under review by our panel of judges</li>
              <li>Teams with selected proposals will be notified to proceed to the next round</li>
              <li>Selection is based on innovation, feasibility, technical merit, and alignment with hackathon themes</li>
            </ul>
          </div>
          
          <p><strong>Submission Deadline:</strong> ${deadline}</p>
          
          <h3>Have Questions?</h3>
          <p>If you have any questions about the submission process or need clarification, please don't hesitate to reach out to:</p>
          <ul>
            <li>Student Coordinator: Madan N</li>
            <li>Mail: <a href="mailto:Madan@skillonx.net" style="color: #6b46c1;">Madan@skillonx.net</a></li>
            <li>Ph No: 9845523415</li>
            <li>WhatsApp No: 9845523415</li>
            <li>Faculty Coordinator: Syed Rehman</li>
            <li>Mail: <a href="mailto:ateeqbeme07@gmail.com" style="color: #6b46c1;">ateeqbeme07@gmail.com</a></li>
            <li>Ph No: 831-0367481</li>
            <li>WhatsApp No: +91 89716 11062</li>
          </ul>
          
          <p>We're excited to see your innovative ideas and look forward to your submission!</p>
          
          <p style="margin-top: 20px;">Warm regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX 2025 <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `HACKONX 2025 - Important: Submit Your Proposal`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Proposal reminder email sent to: ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending hackathon proposal reminder email:", error);
    return false;
  }
};

const sendHackathonProposalAcceptanceEmail = async (
  email,
  participantName,
  teamName,
  domain,
  paymentDeadline
) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX 2025</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${participantName},</p>
          
          <p>We are delighted to inform you that your proposal for HACKONX 2025 has been <strong>ACCEPTED</strong>!</p>
          
          <p>Our panel of judges was impressed with your innovative concept, technical approach, and alignment with this year's hackathon themes. Congratulations on successfully clearing the first round of the selection process.</p>
          
          <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #155724;">Next Steps:</h3>
            <ol>
              <li><strong>Complete Registration Fee Payment:</strong>
                <ul>
                  <li>Log in to your account at: <a href="https://skillonx.com/Hackathon-login" style="color: #155724;">https://skillonx.com/Hackathon-login</a></li>
                  <li>Navigate to the "Payment" section</li>
                  <li>Complete the registration fee payment of 500 INR</li>
                  <li>Deadline for payment: ${paymentDeadline}</li>
                </ul>
              </li>
            </ol>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Important Information:</h3>
            <ul>
              <li>Registration is only confirmed after the payment is completed</li>
              <li>Your team will be assigned a mentor once payment is confirmed</li>
              <li>Please ensure all team members are available for the hackathon dates</li>
              <li>Detailed hackathon guidelines will be shared after payment</li>
            </ul>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Proposal Details:</h3>
            <p><strong>Team Name:</strong> ${teamName}</p>
            <p><strong>College:</strong> DSATM Bangalore</p>
            <p><strong>Selected Track:</strong> ${domain}</p>
          </div>
          
          <p>If you need any assistance with the payment process or have questions about the next steps, please contact:</p>
          <ul>
            <li>Student Coordinator: Madan N</li>
            <li>Mail: <a href="mailto:Madan@skillonx.net" style="color: #6b46c1;">Madan@skillonx.net</a></li>
            <li>Ph No: 9845523415</li>
            <li>WhatsApp No: 9845523415</li>
            <li>Faculty Coordinator: Syed Rehman</li>
            <li>Mail: <a href="mailto:ateeqbeme07@gmail.com" style="color: #6b46c1;">ateeqbeme07@gmail.com</a></li>
            <li>Ph No: 831-0367481</li>
            <li>WhatsApp No: +91 89716 11062</li>
          </ul>
          
          <p>Once again, congratulations on your acceptance! We look forward to seeing your project come to life during HACKONX 2025.</p>
          
          <p style="margin-top: 20px;">Warm regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX 2025 <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `HACKONX 2025 - Congratulations! Your Proposal Has Been Accepted`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Proposal acceptance email sent to: ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending hackathon proposal acceptance email:", error);
    return false;
  }
};
const sendPasswordResetEmail = async (
  email,
  resetToken,
  userType,
  fullName
) => {
  try {
    const prodUrl = "https://skillonx.com";
    const baseUrl = "http://localhost:5173";
    const resetUrl = `${prodUrl}/Innovonox/reset-password?token=${resetToken}&userType=${userType}`;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX - Password Reset</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${fullName || "User"},</p>
          
          <p>We received a request to reset your password for your HACKONX ${
            userType === "participant" ? "Participant" : "Organizer"
          } account. If you did not make this request, please ignore this email.</p>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Password Reset Instructions:</h3>
            <p>Please click the button below to reset your password. This link will expire in 1 hour for security reasons.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset My Password</a>
            </div>
            
            <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
            <p style="word-break: break-all;"><a href="${resetUrl}" style="color: #6b46c1;">${resetUrl}</a></p>
          </div>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong>Important:</strong> This password reset link will expire in 1 hour. If you don't reset your password within this time, you'll need to request a new reset link.
          </div>
          
          <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.</p>
          
          <p style="margin-top: 20px;">Warm regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX Password Reset <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `HACKONX - Password Reset Request`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};
const sendPasswordResetConfirmationEmail = async (
  email,
  userType,
  fullName
) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">HACKONX - Password Updated</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${fullName || "User"},</p>
          
          <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center;">
            <h3 style="margin-top: 0; color: #155724;">Your Password Has Been Successfully Updated!</h3>
          </div>
          
          <p>This email confirms that your password for your HACKONX ${
            userType === "participant" ? "Participant" : "Organizer"
          } account has been successfully changed.</p>
          
          <p>You can now log in to your account using your new password.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://skillonx.com/Innovonox/login" style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Go to Login</a>
          </div>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong>Security Notice:</strong> If you did not make this change, please contact our support team immediately as your account may have been compromised.
          </div>
          
          <p style="margin-top: 20px;">Warm regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX Account Security <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `HACKONX - Password Successfully Updated`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Password reset confirmation email sent to: ${email}`,
      info.messageId
    );
    return true;
  } catch (error) {
    console.error("Error sending password reset confirmation email:", error);
    return false;
  }
};
const sendHackathonCreationEmail = async (
  email,
  organizerName,
  hackathonTitle
) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">Hackathon Submitted</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${organizerName},</p>
          
          <p>Thank you for submitting your hackathon <strong>${hackathonTitle}</strong> on Skillonx. Your submission has been received and is now pending admin approval.</p>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What happens next?</h3>
            <p>Our admin team will review your hackathon details. You'll receive a notification once it's approved or if any changes are required.</p>
            <p>This process typically takes 1-2 business days.</p>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">While you wait:</h3>
            <ul>
              <li>You can view your pending hackathon in your organizer dashboard</li>
              <li>Prepare any additional materials you might need for participants</li>
              <li>Consider reaching out to potential judges or mentors</li>
            </ul>
          </div>
          
          <p>If you have any questions or need to make changes to your submission, please contact our support team.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `Skillonx <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Hackathon Submission Received: ${hackathonTitle}`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Hackathon creation email sent to: ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending hackathon creation email:", error);
    return false;
  }
};

const sendHackathonStatusUpdateEmail = async (
  email,
  organizerName,
  hackathonTitle,
  isApproved,
  adminRemarks
) => {
  try {
    // Set variables based on approval status
    const statusTitle = isApproved
      ? "Hackathon Approved"
      : "Hackathon Needs Revision";
    const statusColor = isApproved ? "#28a745" : "#dc3545";
    const statusMessage = isApproved
      ? `We're pleased to inform you that your hackathon <strong>${hackathonTitle}</strong> has been approved and is now live on our platform!`
      : `After reviewing your hackathon <strong>${hackathonTitle}</strong>, our admin team has determined that some revisions are needed before it can be approved.`;

    const nextSteps = isApproved
      ? `
        <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #155724;">Next Steps:</h3>
          <ul>
            <li>Your hackathon is now visible to potential participants</li>
            <li>You can monitor registrations through your organizer dashboard</li>
            <li>Set up your judging criteria and prepare for the event</li>
          </ul>
        </div>
      `
      : `
        <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #721c24;">Admin Feedback:</h3>
          <p>${
            adminRemarks ||
            "No specific feedback was provided by the admin. Please review your hackathon details and ensure they meet our guidelines."
          }</p>
          <h4 style="margin-top: 15px; color: #721c24;">Next Steps:</h4>
          <ul>
            <li>Review the feedback provided above</li>
            <li>Make necessary revisions to your hackathon</li>
            <li>If you have questions, please contact our support team</li>
          </ul>
        </div>
      `;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">${statusTitle}</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${organizerName},</p>
          
          <div style="background-color: ${statusColor}; color: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: white;">${
              isApproved ? "Congratulations!" : "Action Required"
            }</h2>
          </div>
          
          <p>${statusMessage}</p>
          
          ${nextSteps}
          
          <p>You can access your hackathon dashboard at any time to make updates or check on participant registrations.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `Skillonx <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${statusTitle}: ${hackathonTitle}`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Hackathon status update email sent to: ${email}`,
      info.messageId
    );
    return true;
  } catch (error) {
    console.error("Error sending hackathon status update email:", error);
    return false;
  }
};
const sendOrganizerRegistrationEmail = async (email, organizerName) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">Welcome to Skillonx!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${organizerName},</p>
          
          <p>Thank you for registering as an Organizer on Skillonx! Your account has been created successfully and is now pending admin approval.</p>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #856404;">What happens next?</h3>
            <p>Our admin team will review your organizer account details to verify your identity and credentials. This process typically takes 1-2 business days.</p>
            <p>You'll receive an email notification once your account is approved or if any additional information is required.</p>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">While you wait:</h3>
            <ul>
              <li>Browse upcoming hackathons on our platform</li>
              <li>Start planning your event ideas</li>
              <li>Familiarize yourself with our organizer guidelines</li>
            </ul>
          </div>
          
          <p>If you have any questions about the verification process, please don't hesitate to contact our support team.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `Skillonx <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Skillonx - Organizer Registration Received`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Organizer registration email sent to: ${email}`,
      info.messageId
    );
    return true;
  } catch (error) {
    console.error("Error sending organizer registration email:", error);
    return false;
  }
};
const sendOrganizerVerificationEmail = async (
  email,
  organizerName,
  isApproved,
  adminRemarks = ""
) => {
  try {
    // Set variables based on approval status
    const statusTitle = isApproved
      ? "Organizer Account Approved!"
      : "Organizer Account Verification Update";
    const statusColor = isApproved ? "#28a745" : "#dc3545";
    const statusMessage = isApproved
      ? `We're pleased to inform you that your Skillonx Organizer account has been approved! You can now log in and start creating hackathons and events on our platform.`
      : `Thank you for your interest in becoming an Organizer on Skillonx. After reviewing your application, we need to inform you that your account has not been approved at this time.`;

    const nextSteps = isApproved
      ? `
        <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #155724;">What you can do now:</h3>
          <ul>
            <li>Log in to your account at <a href="https://skillonx.com/login" style="color: #155724;">https://skillonx.com/login</a></li>
            <li>Create your first hackathon or event</li>
            <li>Explore the organizer dashboard and available features</li>
            <li>Update your organizer profile with additional information</li>
          </ul>
        </div>
      `
      : `
        <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #721c24;">Feedback from our team:</h3>
          <p>${
            adminRemarks ||
            "No specific feedback was provided by the admin. If you have questions about this decision, please contact our support team for more information."
          }</p>
          <h4 style="margin-top: 15px; color: #721c24;">Next Steps:</h4>
          <ul>
            <li>Review the feedback provided above</li>
            <li>You may submit a new application after addressing the concerns</li>
            <li>If you have questions, please contact our support team for clarification</li>
          </ul>
        </div>
      `;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">${statusTitle}</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${organizerName},</p>
          
          <div style="background-color: ${statusColor}; color: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: white;">${
              isApproved ? "Congratulations!" : "Application Status Update"
            }</h2>
          </div>
          
          <p>${statusMessage}</p>
          
          ${nextSteps}
          
          <p>We appreciate your interest in contributing to the Skillonx community and thank you for your understanding.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `Skillonx <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${statusTitle}`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Organizer verification email sent to: ${email}`,
      info.messageId
    );
    return true;
  } catch (error) {
    console.error("Error sending organizer verification email:", error);
    return false;
  }
};
const sendParticipantRegistrationEmail = async (email, fullName) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">Welcome to HACKONX!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${fullName},</p>
          
          <p>Thank you for registering as a Participant on Skillonx HACKONX! Your account has been successfully created, and you're now ready to explore and apply for hackathons on our platform.</p>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">What you can do now:</h3>
            <ul>
              <li>Explore available hackathons on our platform</li>
              <li>Create or join a team for upcoming events</li>
              <li>Apply to participate in hackathons that interest you</li>
              <li>Prepare your project proposals and submissions</li>
            </ul>
          </div>
          
          <div style="background-color: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0c5460;">Getting Started Tips:</h3>
            <ol>
              <li>Complete your profile with all relevant information</li>
              <li>Browse the available hackathons and review their requirements</li>
              <li>Connect with other participants to form a strong team</li>
              <li>Prepare your project proposal ahead of time</li>
            </ol>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team. We're excited to see what you'll create!</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to HACKONX - Registration Successful`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Participant registration email sent to: ${email}`,
      info.messageId
    );
    return true;
  } catch (error) {
    console.error("Error sending participant registration email:", error);
    return false;
  }
};

const sendHackathonApplicationEmail = async (
  email,
  fullName,
  hackathonTitle,
  teamName,
  domain,
  hasProposal
) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6b46c1; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff;">Hackathon Application Received</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${fullName},</p>
          
          <p>Thank you for applying to participate in <strong>${hackathonTitle}</strong>! Your application has been received and is currently being reviewed by our team.</p>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6b46c1;">Application Details:</h3>
            <ul>
              <li><strong>Hackathon:</strong> ${hackathonTitle}</li>
              <li><strong>Team Name:</strong> ${teamName}</li>
              <li><strong>Domain:</strong> ${domain || "Not specified"}</li>
              <li><strong>Application Status:</strong> Pending Review</li>
              <li><strong>Proposal Status:</strong> ${
                hasProposal ? "Submitted" : "Not Yet Submitted"
              }</li>
            </ul>
          </div>
          
          ${
            !hasProposal
              ? `
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #856404;">Important Next Step:</h3>
            <p>Your application is currently <strong>incomplete</strong>. Please log in to your dashboard and submit your project proposal as soon as possible. Applications without proposals may not be considered.</p>
            <p>The proposal should include your project idea, implementation plan, and how it addresses the hackathon's theme or problem statement.</p>
          </div>
          `
              : `
          <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #155724;">What Happens Next?</h3>
            <p>Our review team will evaluate your application and proposal. You'll receive a notification once the review is complete, which typically takes 1-2 business days.</p>
            <p>If your application is approved, you'll receive further instructions regarding the hackathon schedule, resources, and next steps.</p>
          </div>
          `
          }
          
          <p>You can check the status of your application anytime by logging into your dashboard. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>SkillonX Team ❤</p>
        </div>

        <div style="background-color: #6b46c1; padding: 15px; text-align: center; font-size: 12px; color: #ffffff;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>© 2025 Skillonx. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `HACKONX <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `HACKONX - Application Received for ${hackathonTitle}`,
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Hackathon application email sent to: ${email}`,
      info.messageId
    );
    return true;
  } catch (error) {
    console.error("Error sending hackathon application email:", error);
    return false;
  }
};
module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendApprovalEmail,
  sendBulkWelcomeEmail,
  sendHackathonRegistrationEmail,
  sendHackathonStatusEmail,
  sendHackathonProposalConfirmationEmail,
  sendHackathonProposalReminderEmail,
  sendHackathonProposalAcceptanceEmail,
  sendTeamMemberRegistrationEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  sendHackathonCreationEmail,
  sendHackathonStatusUpdateEmail,
  sendOrganizerRegistrationEmail,
  sendOrganizerVerificationEmail,
  sendParticipantRegistrationEmail,
  sendHackathonApplicationEmail,
};
