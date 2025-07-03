const express = require('express');
const bodyParser = require('body-parser');



const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();
const PORT = 7000;
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(cors({
    origin: (origin, callback) => callback(null, origin),
    credentials: true
  }));
app.use(bodyParser.json());

app.use('/api1', require('./routes/batchRoutes'));
app.use('/api1', require('./routes/exporterRoutes'));
app.use('/api1', require('./routes/harvesterRouter'));
app.use('/api1', require('./routes/importerRoutes'));
app.use('/api1', require('./routes/processorRoutes'));
app.use('/api1', require('./routes/userRoutes'));
app.use('/api1', require('./routes/farmInspectorRouter'));
app.use('/api1', require('./routes/buyRouter'));

// rouing for test api url working
app.get('/api1', (req, res) => {
  res.json({ message: 'Test API is working!' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
