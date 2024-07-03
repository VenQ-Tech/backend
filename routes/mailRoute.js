const React = require("react");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const html_pdf = require("html-pdf");
const ReactDOMServer = require("react-dom/server");
const EmailContent = require("./EmailContent.jsx");
const path = require("path");

const mailTransport = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  secureConnection: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  const {
    investorName,
    investorEmail,
    propertyName,
    paymentAmount,
    numberOfUnits,
  } = req.body;

  const filePath = path.join(__dirname, "eoi-template.html");
  console.log("File path:", filePath);
  console.log("File exists:", fs.existsSync(filePath));
  const htmlTemplate = fs.readFileSync(filePath, "utf8");
  const html = htmlTemplate
    .replace(/{{ investorEmail }}/g, investorEmail)
    .replace(/{{ investorName }}/g, investorName)
    .replace(/{{ propertyName }}/g, propertyName)
    .replace(/{{ paymentAmount }}/g, paymentAmount)
    .replace(/{{ numberOfUnits }}/g, numberOfUnits);
  const pdfOptions = {
    format: "A4",
    border: {
      top: "60px",
      right: "60px",
      bottom: "60px",
      left: "60px",
    },
    footer: {
      height: "28mm",
      contents: {
        default:
          '<span style="color: #444; font-size: 10px;">{{page}}</span>/<span>{{pages}}</span>',
      },
    },
  };
  const pdfBuffer = await new Promise((resolve, reject) => {
    html_pdf
      .create(html,  {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      })
      .toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
  });
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(EmailContent, {
      investorName,
      investorEmail,
      propertyName,
      paymentAmount,
      numberOfUnits,
    })
  );
  const mailOptions = {
    from: "investment@venq.in",
    to: investorEmail,
    subject: "Confirmation of Payment Received-VENQ",
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation of Payment Received - Expression of Interest Document Attached</title>
        </head>
        <body>
            ${emailHtml}
        </body>
        </html>
        `,
    attachments: [
      {
        filename: "Expression Of Interest.pdf",
        content: pdfBuffer,
      },
    ],
  };
  mailTransport
    .sendMail(mailOptions)
    // .then(() => {
    //   console.log("Email sent successfully");
    //   res.status(200).send("Email sent successfully");
    // })
    // .catch((err) => {
    //   console.log("Failed to send email");
    //   res.status(500).send("Something went wrong");
    //   console.error(err);
    // });
    .then(() => {
      console.log("Email sent successfully");
      res.status(200).json({ message: "Email sent successfully" });
    })
    .catch((err) => {
      console.log("Failed to send email");
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

module.exports = router;
