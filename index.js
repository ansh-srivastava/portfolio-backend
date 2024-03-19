const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://anshsrivastava0987:akLSLhb9Qcs2JSUs@contactlivetest.lztdmer.mongodb.net/?retryWrites=true&w=majority&appName=ContactLiveTest', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define Mongoose schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'ansh.srivastava0987@gmail.com',
        pass: 'icmlcwgrjxbcwcsa'
      }
    });

    const emailTemplate = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,200&display=swap");
    
          * {
            margin: 0;
            padding: 0;
            border: 0;
          }
    
          body {
            font-family: "Raleway", sans-serif;
            background-color: #d8dada;
            font-size: 19px;
            max-width: 800px;
            margin: 0 auto;
            padding: 3%;
          }
    
          img {
            max-width: 100%;
          }
    
          header {
            width: 98%;
          }
    
          #logo {
            max-width: 120px;
            margin: 3% 0 3% 3%;
            float: left;
          }
    
          #wrapper {
            background-color: #f0f6fb;
          }
    
          #social {
            float: right;
            margin: 3% 2% 4% 3%;
            list-style-type: none;
          }
    
          #social > li {
            display: inline;
          }
    
          #social > li > a > img {
            max-width: 35px;
          }
    
          h1,
          p {
            margin: 3%;
          }
          .btn {
            float: right;
            margin: 0 2% 4% 0;
            background-color: #303840;
            color: #f6faff;
            text-decoration: none;
            font-weight: 800;
            padding: 8px 12px;
            border-radius: 8px;
            letter-spacing: 2px;
          }
    
          hr {
            height: 1px;
            background-color: #303840;
            clear: both;
            width: 96%;
            margin: auto;
          }
    
          #contact {
            text-align: center;
            padding-bottom: 3%;
            line-height: 16px;
            font-size: 12px;
            color: #303840;
          }
        </style>
      </head>
      <body>
        <div id="wrapper">
          <header style="display: flex; justify-content: center; align-items: center;">
            
          </header>
          <div class="one-col">
            <h2 style="text-align: center; margin-bottom: 30px;">Greetings, ${name}!</h2>
           <p style="font-size: 22px; font-weight: 600; text-align: center; margin-bottom: 70px;">Thank you for dropping Querry.</p>
    
    
          <p style="font-weight:500; margin-top: 70px; text-align: center;">Ansh will get in touch with you soon.</p>
                <p style="font-weight: 700; margin-top: 70px; text-align: center; margin-bottom: 50px;">We hope you enjoy your experience.</p>
    
            <hr />
    
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-left: 5rem; ">
            <p style="font-size: 0.75rem; line-height: 1rem; ">Best regards</p>
            <p style="font-size: 0.75rem; line-height: 1rem; text-align: center;">Ansh Srivastava</p>
        </div>

          </div>
        </div>
      </body>
    </html>`;

    const mailOptions = {
      from: 'Ansh Srivastava <ansh.srivastava0987@gmail.com>',
      to: email,
      subject: 'Thanks for Reaching out',
      html: emailTemplate
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Form submitted successfully and email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
