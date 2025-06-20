const express = require('express');

const router = express.Router();
const {register, login, getParticipantDetails,createAdminHackathon, adminLogin,getAllApplications,updateApplicationStatus, submitProposal,getProposalStatus,downloadFile,submitPayment,getPaymentProof,updatePaymentStatus, resetParticipantPassword,deleteParticipant} = require('../controllers/hackathonController');
const {getShortlistedParticipants, createJudge,judgeLogin,submitRating,getJudgeRating,getTeamRatings,getLeaderboard} = require('../controllers/judgeController')
const {protectHackathonParticipant,protectHackathonManager, protectJudge} = require('../middlewares/authMiddleware')
const multer = require("multer");
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });
//admin routes login signup
router.post('/create',createAdminHackathon);
router.post('/admin-login',adminLogin)

//hackathon user login signup routes 
router.post('/register',register)
router.post('/login',login)
router.get('/participant-details',protectHackathonParticipant,getParticipantDetails);
router.post('/submit-proposal', protectHackathonParticipant, submitProposal);
router.get('/proposal-status',protectHackathonParticipant,getProposalStatus)
//hackathon manager
router.get('/applications', protectHackathonManager, getAllApplications);
router.put('/application-status/:id', protectHackathonManager, updateApplicationStatus);
router.get('/download-file/:id/:fileType', protectHackathonManager, downloadFile);
//payment routes new
router.post('/submit-payment', protectHackathonParticipant, submitPayment);
router.put('/payment-status/:id', protectHackathonManager, updatePaymentStatus);
router.get('/payment-proof/:id', protectHackathonManager, getPaymentProof);
router.put('/reset-participant-password/:participantId',protectHackathonManager,resetParticipantPassword)
router.delete('/delete-participant/:id', protectHackathonManager, deleteParticipant);
//judges routes
router.post('/create-judge',createJudge);
router.post('/judge-login',judgeLogin);
router.get('/get-shortlisted',protectJudge,getShortlistedParticipants);
router.get('/get-shortlisted-leaderboard',getShortlistedParticipants);
router.post('/rate-team/:teamId', protectJudge, submitRating);
router.get('/judge-rating/:teamId', protectJudge, getJudgeRating);
router.get('/team-ratings/:teamId', protectJudge, getTeamRatings);
router.get('/leaderboard', protectJudge, getLeaderboard);

module.exports = router;