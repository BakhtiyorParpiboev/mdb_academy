const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const prisma = require('../prismaClient');

// Sync Firebase User to Postgres
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { firebaseUid, email, username, profilePic, firstName, lastName, phoneNumber } = req.body;
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          username,
          profilePic,
          firstName,
          lastName,
          phoneNumber
        }
      });
      console.log('New user synced:', user.username);
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Server error syncing user' });
  }
});

module.exports = router;
