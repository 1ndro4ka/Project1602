import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import schoolsRoutes from './routes/schools.js';
import documentsRoutes from './routes/documents.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import sanitizeHtml from 'sanitize-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", process.env.CLIENT_ORIGIN || 'http://localhost:5173'],
        formAction: ["'self'"],
    }
}));

app.use(express.json());
app.use(cookieParser());

function sanitizeValue(value) {
    if (typeof value === 'string') return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
    if (Array.isArray(value)) return value.map(sanitizeValue);
    if (value && typeof value === 'object') {
        const out = {};
        for (const k of Object.keys(value)) out[k] = sanitizeValue(value[k]);
        return out;
    }
    return value;
}

function sanitizeMiddleware(req, res, next) {
    if (req.body) req.body = sanitizeValue(req.body);
    next();
}
app.use(sanitizeMiddleware);

const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } });


// Apply CSRF protection only to routes that need it. Authentication routes
// (`/api/auth/*`) are left without CSRF so frontend can use simple fetch
// during development; keep CSRF on the dedicated token endpoint so clients
// can request a token when necessary.
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    try {
        res.json({ csrfToken: req.csrfToken() });
    } catch (err) {
        res.status(500).json({ message: 'Could not generate CSRF token' });
    }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/documents', documentsRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend работает" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});