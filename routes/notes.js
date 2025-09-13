const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');

const NOTE_LIMIT_FREE = 3;

// List all notes (Admins and Members can view)
router.get('/', auth, async (req, res) => {
  const notes = await Note.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });
  res.json(notes);
});

// Create note (Members only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== "Member") 
    return res.status(403).json({ error: "Only Members can create notes" });

  const { title, content } = req.body;
  const tenant = await Tenant.findById(req.user.tenantId);

  if (tenant.plan === "Free") {
    const count = await Note.countDocuments({ tenantId: tenant._id });
    if (count >= NOTE_LIMIT_FREE) 
      return res.status(403).json({ error: "You've reached the Free plan limit, ask your Admin to upgrade" });
  }

  const note = await Note.create({
    tenantId: tenant._id,
    title: title || "Untitled",
    content: content || "",
    createdBy: req.user.sub
  });

  res.status(201).json(note);
});

// Get note by ID (Admins and Members can view)
router.get('/:id', auth, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// Update note (Members only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== "Member") 
    return res.status(403).json({ error: "Only Members can update notes" });

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    { title: req.body.title, content: req.body.content },
    { new: true }
  );

  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// Delete note (Members only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== "Member") 
    return res.status(403).json({ error: "Only Members can delete notes" });

  const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});

module.exports = router;
