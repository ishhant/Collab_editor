import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from the CoSync Backend!');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running and listening on http://localhost:${PORT}`);
});