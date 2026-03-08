const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const prisma = require('../prismaClient');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get all chats for the current user
router.get('/chats', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });
        console.log('GET /chats -> req.user.uid:', req.user.uid, 'User Found:', !!user);
        if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });

        const chats = await prisma.chat.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' }
        });
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Server error fetching chats' });
    }
});

// Create a new chat
router.post('/chats', verifyToken, async (req, res) => {
    try {
        const { model = 'gpt-4' } = req.body;
        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });
        console.log('POST /chats -> req.user.uid:', req.user.uid, 'User Found:', !!user);
        if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });

        const chat = await prisma.chat.create({
            data: {
                title: 'Yangi Chat',
                model,
                userId: user.id
            }
        });
        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Server error creating chat' });
    }
});

// Get a specific chat and its messages
router.get('/chats/:chatId', verifyToken, async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!chat) return res.status(404).json({ error: 'Chat topilmadi' });

        // Basic authorization check
        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });
        if (chat.userId !== user?.id) {
            return res.status(403).json({ error: 'Ruxsat etilmagan' });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Server error fetching chat details' });
    }
});

// Send a new message to a chat
router.post('/chats/:chatId/messages', verifyToken, async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content, fileUrl } = req.body;

        if (!content) return res.status(400).json({ error: 'Xabar matni kiritilmadi' });

        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });

        const chat = await prisma.chat.findUnique({ where: { id: chatId } });
        console.log('POST /messages -> req.user.uid:', req.user.uid, 'User:', !!user, 'Chat:', !!chat);
        if (!chat || chat.userId !== user?.id) {
            return res.status(404).json({ error: "Chat topilmadi yoki huquq yo'q" });
        }

        // 1. Save User Message
        const userMessage = await prisma.message.create({
            data: {
                role: 'user',
                content,
                fileUrl,
                chatId
            }
        });

        // 2. Fetch history for context
        const chatHistoryRows = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }
        });
        
        // Remove the very last one we just created
        chatHistoryRows.pop();

        const history = chatHistoryRows.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        let responseText = '';
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
            
            // Using the latest free gemini-2.5-flash model
            const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const chatSession = generativeModel.startChat({ history });
            
            const result = await chatSession.sendMessage(content);
            responseText = result.response.text();
        } catch (err) {
            console.error('Gemini API Error:', err);
            responseText = "Kechirasiz, sun'iy intellekt (Gemini) javob berishda xatolik yuz berdi. API kalitni tekshiring.";
        }

        const aiMessage = await prisma.message.create({
            data: {
                role: 'assistant',
                content: responseText,
                chatId
            }
        });

        // Update chat's updatedAt timestamp
        await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() }
        });

        res.status(201).json({ userMessage, aiMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Server error sending message' });
    }
});

// Delete a chat
router.delete('/chats/:chatId', verifyToken, async (req, res) => {
    try {
        const { chatId } = req.params;
        const user = await prisma.user.findUnique({
            where: { firebaseUid: req.user.uid }
        });

        const chat = await prisma.chat.findUnique({ where: { id: chatId } });
        if (!chat || chat.userId !== user?.id) {
            return res.status(404).json({ error: "Chat topilmadi yoki huquq yo'q" });
        }

        await prisma.chat.delete({ where: { id: chatId } });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ error: 'Server error deleting chat' });
    }
});

module.exports = router;
