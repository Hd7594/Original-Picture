const express = require("express");
const router = express.Router();

const fileUpload = require("express-fileupload");

const convertToBase64 = require("../utils/convertToBase64");

const Picture = require("../models/Picture");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/picture/add", fileUpload(), async (req, res) => {
  try {
    const { name, author, authorization, camera, date } = req.body;

    const picture = req.files.picture;
    const pictureComplete = await cloudinary.uploader.upload(
      convertToBase64(picture)
    );

    const addPicture = new Picture({
      name: name,
      date: date,
      author: author,
      authorization: authorization,
      camera: camera,
      picture: pictureComplete,
    });
    console.log(addPicture);
    await addPicture.save();
    res.json(addPicture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/picture/list", async (req, res) => {
  try {
    const allPictures = await Picture.find();
    res.json(allPictures);

    /*
    const onePicture = await Picture.findById(req.query.id);
    if (!req.query.id) {
      res.json({ message: "missing id" });
    } else {
      res.json(onePicture);
    }
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/picture/delete", async (req, res) => {
  try {
    await Picture.findByIdAndDelete(req.body.id);
    if (!req.body.id) {
      res.status(400).json({ message: "missing id" });
    } else {
      res.status(200).json({ message: "element deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
