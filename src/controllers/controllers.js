const axios = require("axios");
const { generateConfig } = require("../utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("../constants");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

//Users

const users = [];

//Authentication

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    if (user && user.password === password) {
      const token = jwt.sign({ email }, process.env.SECRET);
      res.header("auth-token", token)
      res.status(200).send({ message: "User logged in successfully"});
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.send(error);
    console.log(error);
  }
}

async function register(req, res) {
  try {
    const { email, password } = req.body;
    users.push({ email, password });
    res.send({ message: "User registered successfully" });
  } catch (error) {
    res.send(error);
  }
}


async function dashboard(req, res) {
  try {
    const params = req.params.id;
    res.send(params);
  } catch (error) {
    console.log(error);
  }
}

//Email

async function sendMail(req, res) {
  const token = req.headers["user-token"];

  if (token !== process.env.AUTH_TOKEN) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  const { name, email, message } = req.body;

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      ...CONSTANTS.mailoptions,
      html: `You got message from:
             Name: ${name},
             Email: ${email},
             Message: ${message}.`,
    };
    const result = await transport.sendMail(mailOptions);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getUser(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getDrafts(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function searchMail(req, res) {
  try {
    const url = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${req.params.search}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    console.log(response);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  searchMail,
  login,
  register,
  dashboard,
};
