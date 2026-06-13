import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import User from '../models/User.js';
import Seat from '../models/Seat.js';
import ActivityLog from '../models/ActivityLog.js';
import OccupancyHistory from '../models/OccupancyHistory.js';
import AnalyticsSnapshot from '../models/AnalyticsSnapshot.js';
import Notification from '../models/Notification.js';
import Prediction from '../models/Prediction.js';

// ────────────────────────────────────────────────────────────────
// Seed Configuration
// ────────────────────────────────────────────────────────────────

const ZONES = [
  { name: 'Quiet Study',       floors: [1, 2], quietZone: true,  nearWindow: false, hasChargingPort: true  },
  { name: 'Collaboration Area', floors: [1, 2], quietZone: false, nearWindow: false, hasChargingPort: true  },
  { name: 'Window Seats',       floors: [2, 3], quietZone: false, nearWindow: true,  hasChargingPort: true  },
  { name: 'Tech Hub',           floors: [1, 3], quietZone: false, nearWindow: false, hasChargingPort: true  },
];

const STUDENTS = [
  { name: 'Arjun Mehta',       email: 'arjun@seatsync.dev',     dept: 'Computer Science' },
  { name: 'Priya Sharma',      email: 'priya@seatsync.dev',     dept: 'Electronics' },
  { name: 'Rahul Verma',       email: 'rahul@seatsync.dev',     dept: 'Mechanical Eng.' },
  { name: 'Sneha Nair',        email: 'sneha@seatsync.dev',     dept: 'Computer Science' },
  { name: 'Vikram Patel',      email: 'vikram@seatsync.dev',    dept: 'Civil Engineering' },
  { name: 'Ananya Iyer',       email: 'ananya@seatsync.dev',    dept: 'Computer Science' },
  { name: 'Rohan Das',         email: 'rohan@seatsync.dev',     dept: 'Electrical Eng.' },
  { name: 'Divya Krishnan',    email: 'divya@seatsync.dev',     dept: 'Computer Science' },
  { name: 'Karan Joshi',       email: 'karan@seatsync.dev',     dept: 'Mathematics' },
  { name: 'Neha Gupta',        email: 'neha@seatsync.dev',      dept: 'Physics' },
  { name: 'Aditya Kumar',      email: 'aditya@seatsync.dev',    dept: 'Computer Science' },
  { name: 'Meera Rajan',       email: 'meera@seatsync.dev',     dept: 'Biotechnology' },
  { name: 'Siddharth Roy',     email: 'siddharth@seatsync.dev', dept: 'Computer Science' },
  { name: 'Kavya Menon',       email: 'kavya@seatsync.dev',     dept: 'Chemistry' },
  { name: 'Aryan Singh',       email: 'aryan@seatsync.dev',     dept: 'Mechanical Eng.' },
  { name: 'Pooja Reddy',       email: 'pooja@seatsync.dev',     dept: 'Computer Science' },
  { name: 'Nikhil Banerjee',   email: 'nikhil@seatsync.dev',    dept: 'Electrical Eng.' },
  { name: 'Shruti Agarwal',    email: 'shruti@seatsync.dev',    dept: 'Mathematics' },
  { name: 'Varun Nambiar',     email: 'varun@seatsync.dev',     dept: 'Computer Science' },
  { name: 'Riya Chakraborty',  email: 'riya@seatsync.dev',      dept: 'Physics' },
  { name: 'Abhishek Tiwari',   email: 'abhishek@seatsync.dev',  dept: 'Computer Science' },
  { name: 'Nandini Pillai',    email: 'nandini@seatsync.dev',   dept: 'Electronics' },
  { name: 'Harsh Malhotra',    email: 'harsh@seatsync.dev',     dept: 'Civil Engineering' },
  { name: 'Anjali Desai',      email: 'anjali@seatsync.dev',    dept: 'Biotechnology' },
  { name: 'Kunal Kapoor',      email: 'kunal@seatsync.dev',     dept: 'Computer Science' },
  { name: 'Tanvi Bhatt',       email: 'tanvi@seatsync.dev',     dept: 'Chemistry' },
  { name: 'Deepak Yadav',      email: 'deepak@seatsync.dev',    dept: 'Mechanical Eng.' },
  { name: 'Swati Mishra',      email: 'swati@seatsync.dev',     dept: 'Computer Science' },
  { name: 'Rajesh Kumar',      email: 'rajesh@seatsync.dev',    dept: 'Electrical Eng.' },
  { name: 'Lakshmi Suresh',    email: 'lakshmi@seatsync.dev',   dept: 'Mathematics' },
];

const LIBRARIANS = [
  { name: 'Dr. Meena Rao',       email: 'meena.librarian@seatsync.dev' },
  { name: 'Mr. Suresh Iyer',     email: 'suresh.librarian@seatsync.dev' },
  { name: 'Mrs. Padma Krishnan', email: 'padma.librarian@seatsync.dev' },
];

const DEFAULT_PASSWORD = 'password123';

// ────────────────────────────────────────────────────────────────
// Seed Functions
// ────────────────────────────────────────────────────────────────

async function seedUsers() {
  console.log('  → Seeding users...');

  const users = [];

  // Admin
  users.push(
    await User.create({
      name: 'Admin SeatSync',
      email: 'admin@seatsync.dev',
      password: DEFAULT_PASSWORD,
      role: 'admin',
    })
  );

  // Librarians
  for (const lib of LIBRARIANS) {
    users.push(
      await User.create({
        ...lib,
        password: DEFAULT_PASSWORD,
        role: 'librarian',
      })
    );
  }

  // Students
  for (const student of STUDENTS) {
    users.push(
      await User.create({
        ...student,
        password: DEFAULT_PASSWORD,
        role: 'student',
      })
    );
  }

  console.log(`  ✓ Created ${users.length} users (1 admin, ${LIBRARIANS.length} librarians, ${STUDENTS.length} students)`);
  return users;
}

async function seedSeats() {
  console.log('  → Seeding seats...');

  const seats = [];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  let seatCount = 0;

  for (let floorIdx = 0; floorIdx < 4; floorIdx++) {
    const floor = floorIdx + 1;
    for (let zoneIdx = 0; zoneIdx < ZONES.length; zoneIdx++) {
      const zone = ZONES[zoneIdx];
      if (!zone.floors.includes(floor)) {
        // Create seats on this floor anyway for variety
      }
      const letter = letters[zoneIdx + (floorIdx % 2) * 4] || letters[zoneIdx];
      const seatsPerZone = floor <= 2 ? 14 : 12;

      for (let i = 1; i <= seatsPerZone; i++) {
        const seatNumber = `${letter}${floor}${String(i).padStart(2, '0')}`;
        seats.push({
          seatNumber,
          floor,
          zone: zone.name,
          status: 'available',
          hasChargingPort: zone.hasChargingPort || Math.random() > 0.3,
          nearWindow: zone.nearWindow || Math.random() > 0.8,
          quietZone: zone.quietZone,
          popularityScore: Math.floor(Math.random() * 80) + 10,
        });
        seatCount++;
      }
    }
  }

  const created = await Seat.insertMany(seats);
  console.log(`  ✓ Created ${created.length} seats across 4 floors, ${ZONES.length} zones`);
  return created;
}

async function seedOccupancy(seats, students) {
  console.log('  → Seeding occupancy (assigning students to seats)...');

  const now = new Date();
  const assignCount = Math.min(40, students.length);

  for (let i = 0; i < assignCount; i++) {
    const seat = seats[i * 3]; // spread across seats
    if (!seat) continue;

    const student = students[i];
    const minsAgo = Math.floor(Math.random() * 180) + 15;
    const checkInTime = new Date(now - minsAgo * 60 * 1000);

    // 70% occupied, 20% away, 10% abandoned
    const roll = Math.random();
    let status, awayUntil = null, abandoned = false;

    if (roll < 0.7) {
      status = 'occupied';
    } else if (roll < 0.9) {
      status = 'away';
      awayUntil = new Date(now.getTime() + Math.floor(Math.random() * 15) * 60 * 1000);
    } else {
      status = 'abandoned';
      abandoned = true;
    }

    await Seat.findByIdAndUpdate(seat._id, {
      status,
      occupiedBy: student._id,
      checkInTime,
      awayUntil,
      abandoned,
      lastPresenceConfirmation: new Date(checkInTime.getTime() + Math.random() * (now - checkInTime)),
    });
  }

  console.log(`  ✓ Assigned ${assignCount} students to seats`);
}

async function seedActivityLogs(seats, students) {
  console.log('  → Seeding activity logs...');

  const logs = [];
  const actions = ['check_in', 'check_out', 'away_start', 'away_end', 'presence_confirmed'];
  const now = new Date();

  for (let i = 0; i < 200; i++) {
    const seat = seats[Math.floor(Math.random() * seats.length)];
    const student = students[Math.floor(Math.random() * students.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const hoursAgo = Math.floor(Math.random() * 168); // last 7 days
    const timestamp = new Date(now - hoursAgo * 60 * 60 * 1000);

    logs.push({
      seatId: seat._id,
      userId: student._id,
      action,
      metadata: { seatNumber: seat.seatNumber, zone: seat.zone },
      timestamp,
    });
  }

  await ActivityLog.insertMany(logs);
  console.log(`  ✓ Created ${logs.length} activity log entries`);
}

async function seedOccupancyHistory(seats) {
  console.log('  → Seeding occupancy history (7 days)...');

  const now = new Date();
  const snapshots = [];
  const statuses = ['available', 'occupied', 'away', 'abandoned'];
  const statusWeights = [0.35, 0.45, 0.12, 0.08]; // realistic distribution

  // Generate snapshots every 30 min for 7 days (to keep size manageable)
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    for (let hour = 8; hour <= 22; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - dayOffset);
        timestamp.setHours(hour, min, 0, 0);

        // Simulate occupancy curve (higher during peak hours)
        const peakMultiplier = 1 - Math.abs(hour - 14) / 10; // peak at 2PM
        const sampleSize = Math.min(seats.length, Math.floor(seats.length * 0.3));

        for (let i = 0; i < sampleSize; i++) {
          const seat = seats[Math.floor(Math.random() * seats.length)];
          const roll = Math.random();
          const adjustedRoll = roll * (1 - peakMultiplier * 0.3);

          let status;
          if (adjustedRoll < statusWeights[0]) status = 'available';
          else if (adjustedRoll < statusWeights[0] + statusWeights[1]) status = 'occupied';
          else if (adjustedRoll < statusWeights[0] + statusWeights[1] + statusWeights[2]) status = 'away';
          else status = 'abandoned';

          snapshots.push({
            seatId: seat._id,
            status,
            zone: seat.zone,
            timestamp,
          });
        }
      }
    }
  }

  // Insert in batches to avoid memory issues
  const BATCH_SIZE = 5000;
  for (let i = 0; i < snapshots.length; i += BATCH_SIZE) {
    await OccupancyHistory.insertMany(snapshots.slice(i, i + BATCH_SIZE));
  }

  console.log(`  ✓ Created ${snapshots.length} occupancy history snapshots`);
}

async function seedAnalyticsSnapshots() {
  console.log('  → Seeding analytics snapshots...');

  const snapshots = [];
  const zones = ZONES.map((z) => z.name);

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);

    const peakHours = ['11:00', '12:00', '13:00', '14:00', '15:00'];

    snapshots.push({
      date,
      occupancyRate: Math.floor(Math.random() * 30) + 55,
      occupiedSeats: Math.floor(Math.random() * 60) + 80,
      availableSeats: Math.floor(Math.random() * 40) + 40,
      awaySeats: Math.floor(Math.random() * 15) + 5,
      abandonedSeats: Math.floor(Math.random() * 8) + 2,
      peakHour: peakHours[Math.floor(Math.random() * peakHours.length)],
      mostPopularZone: zones[Math.floor(Math.random() * zones.length)],
      avgSessionDuration: Math.floor(Math.random() * 60) + 60,
    });
  }

  await AnalyticsSnapshot.insertMany(snapshots);
  console.log(`  ✓ Created ${snapshots.length} analytics snapshots`);
}

async function seedPredictions() {
  console.log('  → Seeding predictions...');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const predictions = [];
  // Realistic occupancy curve
  const curve = [5, 8, 15, 30, 50, 68, 82, 90, 95, 88, 78, 65, 55, 72, 85, 80, 70, 55, 40, 25, 15, 10, 5, 3];

  for (let hour = 0; hour < 24; hour++) {
    predictions.push({
      date: tomorrow,
      hour,
      predictedOccupancy: curve[hour] + Math.floor(Math.random() * 6) - 3,
    });
  }

  await Prediction.insertMany(predictions);
  console.log(`  ✓ Created ${predictions.length} prediction entries`);
}

// ────────────────────────────────────────────────────────────────
// Main Seed Runner
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║     🪑  SeatSync Database Seeder  🪑        ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log(`📦 Connected to MongoDB: ${env.MONGODB_URI}\n`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Seat.deleteMany({}),
      ActivityLog.deleteMany({}),
      OccupancyHistory.deleteMany({}),
      AnalyticsSnapshot.deleteMany({}),
      Notification.deleteMany({}),
      Prediction.deleteMany({}),
    ]);
    console.log('  ✓ All collections cleared\n');

    // Seed in order
    console.log('📥 Seeding data...');
    const users = await seedUsers();
    const students = users.filter((u) => u.role === 'student');
    const seats = await seedSeats();
    await seedOccupancy(seats, students);
    await seedActivityLogs(seats, students);
    await seedOccupancyHistory(seats);
    await seedAnalyticsSnapshots();
    await seedPredictions();

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅  Seeding complete!');
    console.log('═══════════════════════════════════════════════');
    console.log(`\n📋 Summary:`);
    console.log(`   Users:       ${users.length} (1 admin, ${LIBRARIANS.length} librarians, ${STUDENTS.length} students)`);
    console.log(`   Seats:       ${seats.length}`);
    console.log(`   Default password: ${DEFAULT_PASSWORD}`);
    console.log(`\n🔑 Login credentials:`);
    console.log(`   Admin:     admin@seatsync.dev / ${DEFAULT_PASSWORD}`);
    console.log(`   Librarian: meena.librarian@seatsync.dev / ${DEFAULT_PASSWORD}`);
    console.log(`   Student:   arjun@seatsync.dev / ${DEFAULT_PASSWORD}`);
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
