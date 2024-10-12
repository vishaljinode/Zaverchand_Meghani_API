const BookModel = require("../models/bookSchema");

const Book = BookModel.book;
const Image = BookModel.image;
const Story = BookModel.story;

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: "dhyq1xwix",
  api_key: "191923522744623",
  api_secret: "FIEq8HyYSMDbm2S3-YDLEotJ8AU",
});

const addBook = async (req, res) => {
  const storage = multer.memoryStorage();
  let uploadMedia = multer({ storage: storage }).single("file");

  try {
    uploadMedia(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).send(err.message);
      } else if (err) {
        return res.status(500).send(err.message);
      } else if (!req.file) {
        return res.status(400).send("Please select a file to upload");
      }

      const { bookName, author } = req.body;
      if (!bookName) {
        return res.status(404).json({ error: "Book Name Is Required" });
      }

      if (!author) {
        return res.status(404).json({ error: "Author Is Required" });
      }

      try {
        let newBook = new Book({
          bookName: req.body.bookName,
          // title  :  req.body.title,
          // description :  req.body.description,
          author: req.body.author,
          // titleIndex :  req.body.titleIndex
        });

        await newBook.save();

        const file = req.file;
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
        );
        const newImage = new Image({
          mediaUrl: result.secure_url,
          mediaType: result.format,
          bookId: newBook._id,
        });

        await newImage.save();
        newBook.bookImage = newImage._id;
        await newBook.save();
        res.status(201).json(newBook);
      } catch (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }
    });
  } catch (err) {
    // This is for catching multer setup errors
    res.status(500).send("An unexpected error occurred");
  }
};

const addStory = async (req, res) => {
  try {
    const { bookId, title, description, titleIndex } = req.body;

    if (!bookId) {
      return res.status(404).json({ error: "bookId Is Required" });
    }
    if (!title) {
      return res.status(404).json({ error: "Title Is Required" });
    }
    if (!description) {
      return res.status(404).json({ error: "Description Is Required" });
    }
    if (!titleIndex) {
      return res.status(404).json({ error: "Title Index Is Required" });
    }

    // Create a new story instance
    const newStory = new Story({
      bookId,
      title,
      description,
      titleIndex,
    });

    // Save the story to the database
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const page = req.body.page || 0; 
    const limit = req.body.limit || 20;
    const search = req.body.search || ""; 

    // Build query for searching
    const query = search ? { bookName : { $regex: search, $options: "i" } } : {}; 

    const books = await Book.find(query) 
      .populate("bookImage") 
      .limit(limit) 
      .skip(page * limit); 

    // Get total count for pagination
    const totalCount = await Book.countDocuments(query);

    res.json({
      message: "Get Books Successfully",
      totalCount, 
      books, 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookIndexBybookName = async (req, res) => {
  const { bookName } = req.body;
  console.log(req.body);
  if (!bookName) {
    return res.status(404).json({ error: "Book Name Is Required" });
  }

  try {
    const book = await Book.find({ bookName: bookName, status: "Active" })
      .select("title bookName titleIndex")
      .sort({ titleIndex: 1 });
    res.status(200).json({ message: " Get Books Successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDescriptionById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(404).json({ error: "Id Is Required" });
  }
  try {
    const book = await Book.findOne({ _id: id, status: "Active" })
      .select("description title")
      .sort({ titleIndex: 1 });
    res.status(200).json({ message: " Get Books Successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTtilesByBookId = async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(404).json({ error: "bookId Is Required" });
  }
  try {
    const book = await Story.find({ bookId: bookId, status: "Active" })
      .select("titleIndex title")
      .sort({ titleIndex: 1 });
    res
      .status(200)
      .json({ message: " Get title By BookId Successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStoryByBookId = async (req, res) => {
  const { storyId } = req.body;

  if (!storyId) {
    return res.status(404).json({ error: "storyId Is Required" });
  }
  try {
    const book = await Story.findOne({ _id: storyId, status: "Active" })
      .select("titleIndex title description")
      .sort({ titleIndex: 1 });
    res
      .status(200)
      .json({ message: " Get story By BookId Successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addBook,
  getBooks,
  getBookIndexBybookName,
  getDescriptionById,
  addStory,
  getTtilesByBookId,
  getStoryByBookId,
};
