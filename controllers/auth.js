const { findUserByEmail, addUser } = require('../models/user');

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validateCredentials(email, password) {
  return (
    typeof email === 'string' && email.trim() !== '' &&
    typeof password === 'string' && password.trim() !== ''
  );
}

exports.signup = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  if (!validateCredentials(email, password)) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const bcrypt = await import('bcrypt');
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
  };

  await addUser(newUser);
  return res.status(201).json({
    message: 'Signup successful',
    user: { id: newUser.id, email: newUser.email },
  });
};

exports.login = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  if (!validateCredentials(email, password)) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const bcrypt = await import('bcrypt');
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.status(200).json({ message: 'Login successful' });
};
