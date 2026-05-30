require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./db.config');
const User = require('../models/user.model');
const Service = require('../models/service.model');
const Post = require('../models/post.model');

const DEFAULT_SERVICES = [
	{
		title: 'Depression, Anxiety and Phobias',
		description: 'Professional cognitive-behavioral counseling for individuals experiencing persistent sadness, panic attacks, general anxiety, or phobias.',
		price: 500,
		duration: 60,
		sessions: 1,
		active: true,
	},
	{
		title: 'Stress Management',
		description: 'Actionable coping strategies, mindfulness, and breathing exercises to manage study-related pressure and work-life balance.',
		price: 500,
		duration: 60,
		sessions: 1,
		active: true,
	},
	{
		title: 'Career Management / Counselling',
		description: 'Aptitude assessment, stream selection help, and career path coaching for students and young professionals in Lucknow.',
		price: 500,
		duration: 60,
		sessions: 1,
		active: true,
	},
	{
		title: 'Relationship and Family Issues',
		description: 'Mediation and conflict resolution therapy for couples, family disputes, and resolving domestic emotional adjustment concerns.',
		price: 500,
		duration: 60,
		sessions: 1,
		active: true,
	},
	{
		title: 'Child / Teenager Counselling',
		description: 'Specialized counseling addressing adolescent behavioral issues, school anxiety, screen addiction, and academic adjustment.',
		price: 500,
		duration: 60,
		sessions: 1,
		active: true,
	},
	{
		title: 'Mental and Emotional Addictions',
		description: 'Therapeutic support programs to overcome dependencies on screen time, social media, gaming, and other emotional habits.',
		price: 500,
		duration: 60,
		sessions: 1,
		active: true,
	},
];

const DEFAULT_POSTS = [
	{
		title: 'Managing Exam Stress: A Guide for Students',
		slug: 'managing-exam-stress-students',
		excerpt: 'Exam season can be overwhelming. Learn how to manage stress, structure study sessions, and build mental resilience.',
		content: '<p>Exam pressure can lead to severe academic anxiety. Practicing short breathing cycles, scheduling 50-minute study slots, and keeping expectations realistic are vital steps toward keeping burnout at bay.</p><h4>1. The 50/10 Rule</h4><p>Study for 50 minutes, then take a full 10-minute break. Step away from your desk, stretch, and drink water.</p><h4>2. Grounding Exercises</h4><p>If you feel panic rising, focus on 5 things you can see, 4 things you can touch, and 3 things you can hear.</p>',
		categories: ['mental-health'],
		tags: ['stress', 'students', 'exams'],
		featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
		author: 'Dr. P.K. Dwivedi',
		seo: {
			title: 'Student Exam Stress Management Guide',
			description: 'Actionable stress relief techniques for high school and university students.',
		},
	},
	{
		title: 'Finding the Right Career Path in 2026',
		slug: 'finding-the-right-career-path',
		excerpt: 'Discover your strengths, analyze job market trends, and make informed choices for your career progression.',
		content: '<p>Choosing a career in the digital era requires assessing personal interest, testing real-world projects, and identifying technical/creative growth areas. Pathfinder mentors provide regular workshops to guide stream selections.</p>',
		categories: ['career'],
		tags: ['career', 'counseling', 'students'],
		featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60',
		author: 'Pathfinder Mentor Team',
		seo: {
			title: 'How to Choose Your Career Path',
			description: 'Expert career counseling guidelines for selecting stream packages.',
		},
	},
];

async function seed() {
	try {
		await connectDB();
		console.log('Connected to DB for seeding...');

		// 1. Seed Admin User
		const adminEmail = process.env.SMTP_ADMIN || 'admin@pathfinderlko.org';
		const adminPassword = process.env.ADMIN_PASSWORD || 'adminPassword123';

		await User.deleteMany({ role: 'admin' });
		const hashedPassword = await bcrypt.hash(adminPassword, 10);
		await User.create({
			name: 'Pathfinder Admin',
			email: adminEmail,
			password: hashedPassword,
			role: 'admin',
		});
		console.log(`Seeded Admin: ${adminEmail} / ${adminPassword}`);

		// 2. Seed Services
		await Service.deleteMany({});
		await Service.insertMany(DEFAULT_SERVICES);
		console.log(`Seeded ${DEFAULT_SERVICES.length} counseling services.`);

		// 3. Seed Posts
		await Post.deleteMany({ slug: { $in: DEFAULT_POSTS.map(p => p.slug) } });
		await Post.insertMany(DEFAULT_POSTS);
		console.log(`Seeded sample blog posts.`);

		console.log('Database seeding completed successfully!');
		process.exit(0);
	} catch (err) {
		console.error('Seeding error:', err);
		process.exit(1);
	}
}

seed();
