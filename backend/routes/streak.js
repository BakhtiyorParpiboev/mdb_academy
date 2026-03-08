const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const prisma = require('../prismaClient');

// Get Streak Status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: { streak: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.streak) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
        streakFreezes: 2,
        todayLogged: false,
        lastActiveDate: null
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(user.streak.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    res.json({
      currentStreak: diffDays > 1 ? 0 : user.streak.currentStreak,
      longestStreak: user.streak.longestStreak,
      streakFreezes: user.streak.streakFreezes,
      todayLogged: diffDays === 0,
      lastActiveDate: user.streak.lastActiveDate
    });
  } catch (error) {
    console.error('Error getting streak status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Streak (improved with streak freeze logic)
router.post('/update', verifyToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: { streak: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakRecord = user.streak;

    if (!streakRecord) {
      // First time — create streak
      streakRecord = await prisma.streak.create({
        data: {
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: new Date(),
          streakFreezes: 2,
          userId: user.id
        }
      });
      return res.json({ success: true, streak: streakRecord, message: 'Streak started!' });
    }

    const lastActive = new Date(streakRecord.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already logged today
      return res.json({ success: true, message: 'Already updated today', streak: streakRecord });
    } else if (diffDays === 1) {
      // Consecutive day — increment streak
      const newStreak = streakRecord.currentStreak + 1;
      const newLongest = Math.max(newStreak, streakRecord.longestStreak);

      // Award bonus streak freeze every 7 days
      const bonusFreeze = newStreak % 7 === 0 ? 1 : 0;

      streakRecord = await prisma.streak.update({
        where: { id: streakRecord.id },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActiveDate: new Date(),
          freezeUsedToday: false,
          streakFreezes: streakRecord.streakFreezes + bonusFreeze
        }
      });

      const response = { success: true, streak: streakRecord };
      if (bonusFreeze) response.bonusFreeze = true;
      return res.json(response);
    } else if (diffDays === 2 && streakRecord.streakFreezes > 0) {
      // Missed exactly 1 day — use streak freeze automatically
      const newStreak = streakRecord.currentStreak + 1;
      const newLongest = Math.max(newStreak, streakRecord.longestStreak);

      streakRecord = await prisma.streak.update({
        where: { id: streakRecord.id },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActiveDate: new Date(),
          streakFreezes: streakRecord.streakFreezes - 1,
          freezeUsedToday: true
        }
      });

      return res.json({
        success: true,
        streak: streakRecord,
        freezeUsed: true,
        message: 'Streak freeze ishlatildi! Streak saqlab qolindi.'
      });
    } else {
      // Streak broken (missed 2+ days or no freezes)
      streakRecord = await prisma.streak.update({
        where: { id: streakRecord.id },
        data: {
          currentStreak: 1,
          lastActiveDate: new Date(),
          freezeUsedToday: false
        }
      });

      return res.json({
        success: true,
        streak: streakRecord,
        streakBroken: true,
        message: 'Streak uzildi. Qaytadan boshladingiz!'
      });
    }
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ error: 'Server error updating streak' });
  }
});

// Use a Streak Freeze manually
router.post('/freeze', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: { streak: true }
    });

    if (!user || !user.streak) {
      return res.status(404).json({ error: 'Streak not found' });
    }

    if (user.streak.streakFreezes <= 0) {
      return res.status(400).json({ error: "Streak freeze qolmadi. 7 kunlik streak bilan yangi freeze oling!" });
    }

    const updatedStreak = await prisma.streak.update({
      where: { id: user.streak.id },
      data: {
        streakFreezes: user.streak.streakFreezes - 1,
        freezeUsedToday: true
      }
    });

    res.json({ success: true, streak: updatedStreak, message: 'Streak freeze faollashtirildi!' });
  } catch (error) {
    console.error('Error using streak freeze:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
