const prisma = require('./prismaClient');

async function test() {
  try {
    const chats = await prisma.chat.findMany({ take: 1 });
    console.log("Success:", chats);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
  }
}

test();
