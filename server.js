const express = require('express');
const bodyParser = require('body-parser');



const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();
const PORT = 3000;
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(cors({
    origin: (origin, callback) => callback(null, origin),
    credentials: true
  }));
app.use(bodyParser.json());

app.use('/api', require('./routes/batchRoutes'));
app.use('/api', require('./routes/exporterRoutes'));
app.use('/api', require('./routes/harvesterRouter'));
app.use('/api', require('./routes/importerRoutes'));
app.use('/api', require('./routes/processorRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/farmInspectorRouter'));
// rouing for test api url working
app.get('/', (req, res) => {
  res.json({ message: 'Test API is working!' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
