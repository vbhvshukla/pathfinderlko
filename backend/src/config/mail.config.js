const nodemailer = require('nodemailer');

function createTransporter() {
	const host = process.env.SMTP_HOST;
	const port = process.env.SMTP_PORT;
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;
    console.log("SMTP config", { host, port, user: user ? '***' : null, pass: pass ? '***' : null });
	if (!host || !port || !user || !pass) {
		console.warn('SMTP configuration incomplete; emails may not send');
	}

	const secureEnv = process.env.SMTP_SECURE; // 'true' or 'false'

	// Determine secure flag: explicit env, or true for port 465
	const secure = secureEnv ? secureEnv === 'true' : port === 465;

	const transporter = nodemailer.createTransport({
		host,
		port: port ? Number(port) : undefined,
		secure,
		auth: { user, pass },
		// timeouts - greetingTimeout helps with "Greeting never received"
		connectionTimeout: process.env.SMTP_CONNECTION_TIMEOUT ? Number(process.env.SMTP_CONNECTION_TIMEOUT) : 30_000,
		greetingTimeout: process.env.SMTP_GREETING_TIMEOUT ? Number(process.env.SMTP_GREETING_TIMEOUT) : 15_000,
		socketTimeout: process.env.SMTP_SOCKET_TIMEOUT ? Number(process.env.SMTP_SOCKET_TIMEOUT) : 30_000,
		tls: {
			// Allow self-signed / testing servers when explicitly configured
			rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
		},
	});

	return transporter;
}

async function verifyTransporter() {
	const transporter = createTransporter();
	try {
		const ok = await transporter.verify();
		return { ok: true, info: ok };
	} catch (err) {
		return { ok: false, error: err };
	}
}

module.exports = { createTransporter, verifyTransporter };

