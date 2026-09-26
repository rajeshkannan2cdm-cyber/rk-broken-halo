const Contact = require('../models/Contact');
const mongoose = require('mongoose');

// Regular expression to validate standard email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @desc    Submit a new contact message
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Check for missing required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: name, email, and message.'
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: 'Fields cannot be empty or contain only whitespace.'
      });
    }

    // 2. Validate email format
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g., name@example.com).'
      });
    }

    // 3. Check MongoDB Connection State
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ [Contact] MongoDB is not connected. Returning friendly fallback response.');
      return res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! (Note: Running in offline mode without active MongoDB connection)',
        data: {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          receivedAt: new Date().toISOString()
        }
      });
    }

    // 4. Save to MongoDB
    const newContact = await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. RK will get back to you soon!',
      data: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        createdAt: newContact.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);

    // Handle Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while saving contact message. Please try again later.'
    });
  }
};

/**
 * @desc    Get all contact messages (Helper/Admin)
 * @route   GET /api/contact
 * @access  Public (for development/testing)
 */
const getContacts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'Database is disconnected. Connect to MongoDB to view stored messages.',
        data: []
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts from database.'
    });
  }
};

module.exports = {
  submitContact,
  getContacts
};
