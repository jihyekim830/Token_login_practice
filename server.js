const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const PORT = 3000;
const users = [
  {
    id: 'test',
    password: '1234',
    name: '테스트 유저',
    info: '테스트 유저입니다',
  },
];
const secretKey = 'your-secret-key';

const app = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
    methods: ['OPTIONS', 'POST', 'GET', 'DELETE'],
  })
);
app.use(cookieParser());
app.use(express.json());

app.post('/', (req, res) => {
  const { userId, userPassword } = req.body;
  const userInfo = users.find(
    (user) => user.id === userId && user.password === userPassword
  );

  if (!userInfo) {
    return res
      .status(401)
      .send('Login failed. Please check your id and password.');
  }
  const accessToken = jwt.sign({ userId }, secretKey, {
    expiresIn: '1h',
  });
  res.status(200).send(accessToken);
});

app.get('/', (req, res) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).send('Missing Authorization header');
    const accessToken = req.headers.authorization.split(' ')[1];

    const { userId } = jwt.verify(accessToken, secretKey);
    const userInfo = users.find((user) => user.id === userId);

    if (!userInfo) return res.status(401).send('User not found');
    res.status(200).send(userInfo);
  } catch (error) {
    res.status(401).send('Invalid token');
  }
});

app.listen(PORT, () =>
  console.log(`🟢 Server is running on http://localhost:${PORT}`)
);
