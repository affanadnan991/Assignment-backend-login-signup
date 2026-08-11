const fs = require('fs').promises;
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

async function getUsers() {
  try {
    const content = await fs.readFile(usersPath, 'utf8');
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(usersPath, '[]', 'utf8');
      return [];
    }
    throw error;
  }
}

async function saveUsers(users) {
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf8');
}

async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find((user) => user.email === email);
}

async function addUser(user) {
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);
}

module.exports = {
  getUsers,
  saveUsers,
  findUserByEmail,
  addUser,
};
