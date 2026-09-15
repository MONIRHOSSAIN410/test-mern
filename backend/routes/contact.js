import express from "express";

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact({ fullName, email, message }) {
  const errors = {};

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
    errors.fullName = "Full name is required (minimum 3 characters).";
  }

  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    errors.email = "Please provide a valid email address.";
  }

  if (!message || typeof message !== "string" || message.trim().length < 10) {
    errors.message = "Message is required (minimum 10 characters).";
  }

  return errors;
}

// POST /api/contact
// Validates + "processes" a contact form submission.
// NOTE: This does not actually send an email — it simulates the
// backend logic so the validation + submit flow can be verified end to end.
router.post("/", (req, res) => {
  const { fullName, email, message } = req.body || {};
  const errors = validateContact({ fullName, email, message });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  console.log("New contact message received:", { fullName, email, message });

  return res.status(200).json({
    success: true,
    message: `Thank you, ${fullName.trim()}! Your message has been received. We'll get back to you soon.`,
  });
});

export default router;
