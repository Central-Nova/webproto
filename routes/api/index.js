const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', (req, res) => res.render('../../views/index.html'));

// Dashboard
router.get('/dashboard', (req, res) =>
  res.render('../../views/dashboard.html', {
    user: req.user
  })
);

module.exports = router;
