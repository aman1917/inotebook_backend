const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const Notes = require("../models/Nodes");

//ROUTE 1: Get All the nodes using GET "api/auth/fetchallnotes" Login not required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.meassage);
    res.status(500).json("Internal Server Error");
  }
});

//ROUTE 2 :Add new nodes using Post  "api/auth/addnote" Login require
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter Valid Title").isLength({ min: 3 }),
    body("description", "Description Atleast 5 Characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If error occurs,return the error
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      // console.log(note);
      const saveNote = await note.save();
      // console.log(saveNote);
      res.json(saveNote);
    } catch (error) {
      console.log(error.meassage);
      res.status(500).json("Internal Server Error");
    }
  }
);

//ROUTE 3 :Updatenodes using Put  "api/auth/updatenote/:id" Login require
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //Create new Note Object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  //Find the notes to be updated & update it
  let note = await Notes.findById(req.params.id);
  // console.log(note);
  if (!note) {
    return res.status(400).send("Not data Found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

//ROUTE 3 :Updatenodes using delete  "api/auth/deletenote/:id" Login require
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //Find the notes to be delete & delete it
  let note = await Notes.findById(req.params.id);
  // console.log(note);
  if (!note) {
    return res.status(400).send("Not data Found");
  }
  //allow deletion only if user owns this Note
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }
  note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ Sucess: "This ID has been deleted", note: note });
});

module.exports = router;
