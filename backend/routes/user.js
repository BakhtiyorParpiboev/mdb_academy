const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const prisma = require('../prismaClient');

// Get enriched user profile (including streak, achievements, recent XP)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid },
            include: {
                streak: true,
                achievements: {
                    orderBy: { earnedAt: 'desc' }
                },
                xpLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 20
                },
                courseProgress: true,
                portfolioProject: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate XP breakdown by source
        const allXpLogs = await prisma.xpLog.findMany({
            where: { userId: user.id }
        });

        const xpBreakdown = {};
        allXpLogs.forEach(log => {
            xpBreakdown[log.source] = (xpBreakdown[log.source] || 0) + log.amount;
        });

        // Calculate next level XP threshold
        const xpForNextLevel = user.level * 1000;
        const xpProgress = Math.min((user.xp / xpForNextLevel) * 100, 100);

        res.status(200).json({
            ...user,
            xpBreakdown,
            xpForNextLevel,
            xpProgress
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error fetching profile' });
    }
});

// Get activity history for heatmap (last 90 days)
router.get('/activity', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const xpLogs = await prisma.xpLog.findMany({
            where: {
                userId: user.id,
                createdAt: { gte: ninetyDaysAgo }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by date
        const activityMap = {};
        xpLogs.forEach(log => {
            const dateKey = log.createdAt.toISOString().split('T')[0];
            if (!activityMap[dateKey]) {
                activityMap[dateKey] = { date: dateKey, xp: 0, actions: 0 };
            }
            activityMap[dateKey].xp += log.amount;
            activityMap[dateKey].actions += 1;
        });

        // Fill in empty days
        const activities = [];
        const now = new Date();
        for (let d = new Date(ninetyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            activities.push(activityMap[dateKey] || { date: dateKey, xp: 0, actions: 0 });
        }

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ error: 'Server error fetching activity' });
    }
});

// Update user profile
router.put('/profile/update', verifyToken, async (req, res) => {
    try {
        const { firstName, lastName, bio, githubLink, profilePic } = req.body;

        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (bio !== undefined) updateData.bio = bio;
        if (githubLink !== undefined) updateData.githubLink = githubLink;
        if (profilePic !== undefined) updateData.profilePic = profilePic;

        const updatedUser = await prisma.user.update({
            where: { firebaseUid: req.user.uid },
            data: updateData
        });

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error updating profile' });
    }
});

// Toggle a saved roadmap
router.post('/roadmap/toggle', verifyToken, async (req, res) => {
    try {
        const { roadmapName } = req.body;

        if (!roadmapName) {
            return res.status(400).json({ error: 'Roadmap name is required' });
        }

        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let updatedRoadmaps = [...user.savedRoadmaps];

        if (updatedRoadmaps.includes(roadmapName)) {
            updatedRoadmaps = updatedRoadmaps.filter(name => name !== roadmapName);
        } else {
            updatedRoadmaps.push(roadmapName);
        }

        const updatedUser = await prisma.user.update({
            where: { firebaseUid: req.user.uid },
            data: { savedRoadmaps: updatedRoadmaps }
        });

        res.status(200).json({
            success: true,
            savedRoadmaps: updatedUser.savedRoadmaps
        });
    } catch (error) {
        console.error('Error toggling roadmap:', error);
        res.status(500).json({ error: 'Server error toggling roadmap' });
    }
});

module.exports = router;
