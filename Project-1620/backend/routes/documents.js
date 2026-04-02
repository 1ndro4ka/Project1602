import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';
import Document from '../models/Document.js';
import School from '../models/School.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Helper to send email with attachments
const sendDocumentsEmail = async (school, user, documentRecord) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMPT_USER || process.env.SMTP_USER,
        pass: process.env.SMPT,
      },
    });

    const attachments = [];
    const uploadsPath = 'backend/uploads';

    const addAttachment = (fileObj) => {
      if (!fileObj || !fileObj.filename) return;
      const filePath = path.join(uploadsPath, fileObj.filename);
      if (fs.existsSync(filePath)) {
        attachments.push({
          filename: fileObj.originalName,
          path: filePath
        });
      }
    };

    if (documentRecord.documents) {
      ['parent_statement', 'medical_cert', 'health_passport'].forEach(key => {
        if (documentRecord.documents[key]) {
          addAttachment(documentRecord.documents[key]);
        }
      });
      if (documentRecord.documents.photos && Array.isArray(documentRecord.documents.photos)) {
        documentRecord.documents.photos.forEach(photo => addAttachment(photo));
      }
    }

    const mailOptions = {
      from: process.env.SMPT_USER || process.env.SMTP_USER,
      to: school.email,
      subject: `Новая заявка на поступление от ${user.fullName || user.email}`,
      text: `Здравствуйте!\n\nПоступила новая заявка от имени ${user.fullName || ''} (${user.email}).\nВсе необходимые документы прикреплены во вложении.\n\nС уважением,\nСистема подачи документов, ШколаДок`,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", school.email);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

// Create uploads directory if it doesn't exist
const uploadsDir = 'backend/uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get user's documents
router.get('/', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ user: req.user.id })
      .populate('user', 'name email')
      .populate('verifiedBy', 'name');

    if (!document) {
      return res.status(404).json({ message: 'No documents found for this user' });
    }

    res.json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload documents with multer
router.post('/upload', auth, upload.fields([
  { name: 'parent_statement', maxCount: 1 },
  { name: 'medical_cert', maxCount: 1 },
  { name: 'health_passport', maxCount: 1 },
  { name: 'photos', maxCount: 2 }
]), async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const schoolId = req.body.schoolId;
    if (!schoolId) {
      return res.status(400).json({ message: 'School is required' });
    }

    // Validate school exists and has places
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (school.receiverd >= school.maxperYear) {
      return res.status(400).json({ message: 'No places available in this school' });
    }

    let document = await Document.findOne({ user: req.user.id });
    const isNewSubmission = !document;

    const documentsData = {};

    // Process single documents
    ['parent_statement', 'medical_cert', 'health_passport'].forEach(docType => {
      if (req.files[docType]) {
        const file = req.files[docType][0];
        documentsData[docType] = {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          uploadedAt: new Date()
        };
      }
    });

    // Process photos
    if (req.files.photos) {
      documentsData.photos = req.files.photos.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        uploadedAt: new Date()
      }));
    }

    if (!document) {
      document = new Document({
        user: req.user.id,
        school: schoolId,
        documents: documentsData,
        status: 'received'
      });
    } else {
      document.school = schoolId;
      document.documents = documentsData;
      document.status = 'received';
    }

    await document.save();

    // Increment the school's received count (only for new submissions)
    if (isNewSubmission) {
      await School.findByIdAndUpdate(schoolId, { $inc: { receiverd: 1 } });
    }

    res.json({
      message: 'Documents uploaded successfully',
      document: document
    });

    // Fire and forget email sending
    User.findById(req.user.id).then(user => {
      if (user) sendDocumentsEmail(school, user, document);
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply to a different school using existing documents
router.post('/apply-existing', auth, async (req, res) => {
  try {
    const schoolId = req.body.schoolId;
    if (!schoolId) {
      return res.status(400).json({ message: 'School is required' });
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (school.receiverd >= school.maxperYear) {
      return res.status(400).json({ message: 'No places available in this school' });
    }

    let document = await Document.findOne({ user: req.user.id });
    if (!document || !document.documents || Object.keys(document.documents).length === 0) {
      return res.status(400).json({ message: 'Не найдены ранее загруженные документы. Пожалуйста, загрузите их заново.' });
    }

    const isNewSubmission = document.school.toString() !== schoolId.toString();

    document.school = schoolId;
    document.status = 'received';
    await document.save();

    if (isNewSubmission) {
      await School.findByIdAndUpdate(schoolId, { $inc: { receiverd: 1 } });
    }

    res.json({
      message: 'Заявка успешно перенаправлена',
      document: document
    });

    // Send email
    User.findById(req.user.id).then(user => {
      if (user) sendDocumentsEmail(school, user, document);
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get document status
router.get('/status', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ user: req.user.id });

    if (!document) {
      return res.json({
        status: 'not_submitted',
        message: 'No documents submitted yet',
      });
    }

    res.json({
      status: document.status,
      verifiedAt: document.verifiedAt,
      rejectionReason: document.rejectionReason,
      notes: document.notes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all documents for user
router.delete('/', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ user: req.user.id });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete files from filesystem
    Object.entries(document.documents).forEach(([key, value]) => {
      if (value && value.filename) {
        const filePath = path.join(uploadsDir, value.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (item && item.filename) {
            const filePath = path.join(uploadsDir, item.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        });
      }
    });

    // Delete the document record
    await Document.deleteOne({ _id: document._id });

    res.json({ message: 'Documents deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
