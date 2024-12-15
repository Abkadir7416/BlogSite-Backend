const express = require("express");
// const StudyTool = require("../../model/StudyTool.js");
const StudyTool = require('../../model/StudyTool')

const router = express.Router();

router.post("/study-tool", async (req, res) => {
  try {
    const studyTool = new StudyTool(req.body);
    await studyTool.save();
    res.status(201).json({
      success: true,
      message: "Study-tool Added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error in adding study-Tool", error });
  }
});

router.put("/study-tool/:id", async (req, res) => {
  try {
    const studyTool = new StudyTool(req.body);
  await studyTool.save();
  res.status(201).json({
    success: true,
    message: "Book Added successfully",
  });
  } catch (error) {
    res.status(500).json({ message: "Error in updating study-Tool", error });
  }
});

router.get("/study-tool", async (req, res) => {
  try {
    const studyTool = await StudyTool.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    const studyToolCount = studyTool.length;
    res.status(200).json({
      success: true,
      data: studyTool,
      ToolsCount: studyToolCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in fetching study-Tool", error });
  }
}); 

router.get("/study-tool/:id", async (req, res) => {
  try {
    const studyTool = await StudyTool.findById(req.params.id); // Sort by createdAt in descending order
    res.status(200).json({
      success: true,
      data: studyTool,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in fetching study-Tool", error });
  }
});

module.exports = router;
