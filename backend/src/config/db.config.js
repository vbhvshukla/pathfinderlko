const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS resolution to use Google DNS fallback
// This fixes the querySrv ECONNREFUSED error on local networks/ISPs that block or fail to resolve SRV records.
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Failed to set fallback DNS servers:', err.message);
}

async function connectDB() {
	const uri = process.env.MONGO_URI;
	if (!uri) throw new Error('MONGO_URI not set in environment');
	await mongoose.connect(uri);
	console.log('MongoDB connected');
}

module.exports = { connectDB };

