const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');

// Upgrade tenant plan (Admin only)
router.post('/:slug/upgrade', auth, async (req, res) => {
  const slug = req.params.slug;
  if (req.user.role !== "Admin" || req.user.tenantSlug !== slug) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const tenant = await Tenant.findOneAndUpdate(
    { slug },
    { plan: "Pro" },
    { new: true }
  );

  res.json({ success: true, tenant });
});

module.exports = router;
