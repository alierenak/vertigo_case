const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/clans', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Clans API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});