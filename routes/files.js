const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

//cb  means callback function
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "myfile"
); //100mb

router.post("/", (req, res) => {
  //store file
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.json({ error: "All fields are Mandatory." });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APPLICATION_BASE_URL}/files/${response.uuid}`,
    });
    //http://localhost:3000/files/2316asddsda-3assads
  });
});

//email configuration
router.post("/send", async (req, res) => {


  const { uuid, emailTo, emailFrom } = req.body;
  //validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are Mandatory." });
  }
  //fetching data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email has been sent already." });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  //email sending codes and modules
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "easyShare file sharing",
    text: `${emailFrom} has shared a file with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APPLICATION_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  return res.send({ success: true });
});

module.exports = router;
