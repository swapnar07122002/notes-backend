const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const tenant = await Tenant.findById(user.tenantId);
    if (!tenant) return res.status(400).json({ error: 'Tenant not found' });

    const token = jwt.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
      tenantId: tenant._id,
      tenantSlug: tenant.slug,
      tenantPlan: tenant.plan
    }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
