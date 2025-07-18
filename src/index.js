const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/clans', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Clans API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});