const prisma = require('./prismaClient');

async function check() {
  const users = await prisma.user.findMany();
  console.log("All Users:", users.map(u => ({ username: u.username, firebaseUid: u.firebaseUid })));
}
check();
