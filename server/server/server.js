// server.js
const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://weskam12312:yXE1CUVNBhhb7wcM@geoguess.tdff4.mongodb.net/?retryWrites=true&w=majority&appName=GeoGuess'; // Update with your MongoDB URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

let gridFSBucket;

const cors = require('cors');
app.use(cors());


conn.once('open', () => {
  console.log('MongoDB connected');
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: 'images' });
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    console.log('File uploaded:', file); // Debug statement: log file object
    return {
      bucketName: 'images',
      filename: file.originalname
    };
  }
});

const upload = multer({ storage });
console.log('Upload:', upload); // Debug statement: log upload object

app.post('/upload', upload.array('images'), async (req, res) => {
  console.log('Files uploaded:', req.files); // Debug statement: log uploaded files
  res.json({ message: 'Files uploaded successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  