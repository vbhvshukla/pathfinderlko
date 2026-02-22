require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { connectDB } = require('./src/config/db.config');

const app = express();

// CORS: restrict to FRONTEND_URL if provided and allow credentials for cookie auth
const corsOptions = {};
if (process.env.FRONTEND_URL) {
  corsOptions.origin = process.env.FRONTEND_URL;
  corsOptions.credentials = true;
} else {
  // allow credentials by default for local dev when FRONTEND_URL not set
  corsOptions.credentials = true;
}
app.use(require('cors')(corsOptions));

// Basic hardening (optional packages)
try {
  const helmet = require('helmet');
  app.use(helmet());
} catch (e) {
  console.warn('helmet not installed; consider adding it for security');
}
try {
  const rateLimit = require('express-rate-limit');
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
} catch (e) {
  console.warn('express-rate-limit not installed; consider adding it to mitigate brute force');
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database and seed admin user
// const bcrypt = require('bcryptjs')
// const User = require('./src/models/user.model')

// async function seedAdminUser() {
//   try {
//     const email = ''
//     const password = ''
//     const existing = await User.findOne({ email })
//     if (existing) {
//       console.log('Admin user already exists:', email)
//       return
//     }

//     const hashed = await bcrypt.hash(password, 10)
//     await User.create({ name: 'Admin', email, password: hashed, role: 'admin' })
//     console.log('Seeded admin user:', email)
//   } catch (e) {
//     console.warn('Failed to seed admin user', e && e.message ? e.message : e)
//   }
// }

;(async () => {
  try {
    await connectDB()
    // await seedAdminUser()
  } catch (err) {
    console.error('Failed to connect to DB', err)
    process.exit(1)
  }
})()

// Ensure critical env vars
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET not set in environment. Set JWT_SECRET before starting.');
  process.exit(1);
}

// Basic health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount routers (they export an Express router)
try { app.use('/api/auth', require('./src/routes/auth.routes')); } catch (e) {}
try { app.use('/api/appointments', require('./src/routes/appointment.routes')); } catch (e) {}
try { app.use('/api/contact', require('./src/routes/contact.routes')); } catch (e) {}
try { app.use('/api/posts', require('./src/routes/post.routes')); } catch (e) {}
try { app.use('/api/testimonials', require('./src/routes/testimonial.routes')); } catch (e) {}
try { app.use('/api/uploads', require('./src/routes/upload.routes')); } catch (e) {}
try { app.use('/api/magazines', require('./src/routes/magazine.routes')); } catch (e) {}

// Fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
