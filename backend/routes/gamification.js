const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const prisma = require('../prismaClient');

// Helper to determine next level threshold
const getXpForNextLevel = (currentLevel) => {
  return currentLevel * 1000; // Example: Level 2 needs 2000 XP total, Level 3 needs 3000 XP...
};

// Add XP endpoint
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { amount, source } = req.body;
    const firebaseUid = req.user.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create XP Log
    await prisma.xpLog.create({
      data: {
        amount,
        source,
        userId: user.id
      }
    });

    // Update total XP
    const newXp = user.xp + amount;
    let newLevel = user.level;

    // Check level up
    if (newXp >= getXpForNextLevel(user.level)) {
      newLevel += 1;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: newXp,
        level: newLevel
      }
    });

    res.json({
      success: true,
      xpAdded: amount,
      totalXp: updatedUser.xp,
      level: updatedUser.level,
      leveledUp: newLevel > user.level
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    res.status(500).json({ error: 'Server error adding XP' });
  }
});

// Get Leaderboard
router.get('/leaderboard/global', async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      take: 100,
      orderBy: { xp: 'desc' },
      select: {
        username: true,
        xp: true,
        level: true,
        profilePic: true
      }
    });
    res.json(topUsers);
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
});

module.exports = router;
