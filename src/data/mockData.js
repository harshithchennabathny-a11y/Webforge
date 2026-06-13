// ============================================================
// SEATSYNC MOCK DATABASE — 100+ TEST CASES
// ============================================================

// ─── ZONES ───────────────────────────────────────────────────
export const ZONES = [
  {
    id: 'zone-a',
    name: 'Zone A',
    label: 'Quiet Study',
    color: '#2563EB',
    description: 'Silent zone for deep focus. No calls permitted.',
    features: ['Charging Ports', 'Noise-Free', 'Individual Desks', 'Reading Lamps'],
    capacity: 20,
    floorLevel: 2,
  },
  {
    id: 'zone-b',
    name: 'Zone B',
    label: 'Collaboration Area',
    color: '#4F46E5',
    description: 'Group study with whiteboards and collaborative tools.',
    features: ['Whiteboards', 'Group Tables', 'Projector', 'Charging Ports'],
    capacity: 20,
    floorLevel: 1,
  },
  {
    id: 'zone-c',
    name: 'Zone C',
    label: 'Window Seats',
    color: '#0891B2',
    description: 'Best natural light. Great views. Ideal for long sessions.',
    features: ['Natural Light', 'Charging Ports', 'Window View', 'Ergonomic Chairs'],
    capacity: 20,
    floorLevel: 3,
  },
  {
    id: 'zone-d',
    name: 'Zone D',
    label: 'Tech Hub',
    color: '#7C3AED',
    description: 'High-performance workstations with dual monitors and fast WiFi.',
    features: ['Dual Monitors', 'High-Speed WiFi', 'Charging Ports', 'Standing Desks'],
    capacity: 20,
    floorLevel: 1,
  },
];

// ─── STUDENTS (30 mock students) ─────────────────────────────
export const STUDENTS = [
  { id: 'std-001', name: 'Arjun Mehta',      rollNo: 'CS21B001', dept: 'Computer Science',    year: 3 },
  { id: 'std-002', name: 'Priya Sharma',     rollNo: 'EC21B002', dept: 'Electronics',          year: 3 },
  { id: 'std-003', name: 'Rahul Verma',      rollNo: 'ME21B003', dept: 'Mechanical Eng.',      year: 3 },
  { id: 'std-004', name: 'Sneha Nair',       rollNo: 'CS22B004', dept: 'Computer Science',    year: 2 },
  { id: 'std-005', name: 'Vikram Patel',     rollNo: 'CE21B005', dept: 'Civil Engineering',   year: 3 },
  { id: 'std-006', name: 'Ananya Iyer',      rollNo: 'CS22B006', dept: 'Computer Science',    year: 2 },
  { id: 'std-007', name: 'Rohan Das',        rollNo: 'EE21B007', dept: 'Electrical Eng.',     year: 3 },
  { id: 'std-008', name: 'Divya Krishnan',   rollNo: 'CS21B008', dept: 'Computer Science',    year: 3 },
  { id: 'std-009', name: 'Karan Joshi',      rollNo: 'MA22B009', dept: 'Mathematics',          year: 2 },
  { id: 'std-010', name: 'Neha Gupta',       rollNo: 'PH21B010', dept: 'Physics',              year: 3 },
  { id: 'std-011', name: 'Aditya Kumar',     rollNo: 'CS23B011', dept: 'Computer Science',    year: 1 },
  { id: 'std-012', name: 'Meera Rajan',      rollNo: 'BI22B012', dept: 'Biotechnology',       year: 2 },
  { id: 'std-013', name: 'Siddharth Roy',    rollNo: 'CS21B013', dept: 'Computer Science',    year: 3 },
  { id: 'std-014', name: 'Kavya Menon',      rollNo: 'CH22B014', dept: 'Chemistry',            year: 2 },
  { id: 'std-015', name: 'Aryan Singh',      rollNo: 'ME22B015', dept: 'Mechanical Eng.',      year: 2 },
  { id: 'std-016', name: 'Pooja Reddy',      rollNo: 'CS22B016', dept: 'Computer Science',    year: 2 },
  { id: 'std-017', name: 'Nikhil Banerjee',  rollNo: 'EE22B017', dept: 'Electrical Eng.',     year: 2 },
  { id: 'std-018', name: 'Shruti Agarwal',   rollNo: 'MA21B018', dept: 'Mathematics',          year: 3 },
  { id: 'std-019', name: 'Varun Nambiar',    rollNo: 'CS21B019', dept: 'Computer Science',    year: 3 },
  { id: 'std-020', name: 'Riya Chakraborty', rollNo: 'PH22B020', dept: 'Physics',              year: 2 },
  { id: 'std-021', name: 'Abhishek Tiwari',  rollNo: 'CS23B021', dept: 'Computer Science',    year: 1 },
  { id: 'std-022', name: 'Nandini Pillai',   rollNo: 'EC22B022', dept: 'Electronics',          year: 2 },
  { id: 'std-023', name: 'Harsh Malhotra',   rollNo: 'CE22B023', dept: 'Civil Engineering',   year: 2 },
  { id: 'std-024', name: 'Anjali Desai',     rollNo: 'BI21B024', dept: 'Biotechnology',       year: 3 },
  { id: 'std-025', name: 'Kunal Kapoor',     rollNo: 'CS21B025', dept: 'Computer Science',    year: 3 },
  { id: 'std-026', name: 'Tanvi Bhatt',      rollNo: 'CH21B026', dept: 'Chemistry',            year: 3 },
  { id: 'std-027', name: 'Deepak Yadav',     rollNo: 'ME23B027', dept: 'Mechanical Eng.',      year: 1 },
  { id: 'std-028', name: 'Swati Mishra',     rollNo: 'CS22B028', dept: 'Computer Science',    year: 2 },
  { id: 'std-029', name: 'Rajesh Kumar',     rollNo: 'EE21B029', dept: 'Electrical Eng.',     year: 3 },
  { id: 'std-030', name: 'Lakshmi Suresh',   rollNo: 'MA22B030', dept: 'Mathematics',          year: 2 },
];

// ─── LOGGED-IN STUDENT ────────────────────────────────────────
export const CURRENT_STUDENT = STUDENTS[0]; // Arjun Mehta

// ─── 80 DESKS (20 per zone) ───────────────────────────────────
// Status: 'available' | 'occupied' | 'away' | 'abandoned'
const now = new Date();
const minsAgo = (m) => new Date(now - m * 60000).toISOString();

export const INITIAL_DESKS = [
  // ── ZONE A — Quiet Study (A01–A20) ──
  { id: 'A01', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Charging', 'Lamp'] },
  { id: 'A02', zone: 'zone-a', status: 'occupied',   student: 'std-002',    checkIn: minsAgo(45),   features: ['Charging', 'Lamp'] },
  { id: 'A03', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Charging'] },
  { id: 'A04', zone: 'zone-a', status: 'occupied',   student: 'std-003',    checkIn: minsAgo(90),   features: ['Charging', 'Lamp'] },
  { id: 'A05', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Lamp'] },
  { id: 'A06', zone: 'zone-a', status: 'occupied',   student: 'std-013',    checkIn: minsAgo(30),   features: ['Charging'] },
  { id: 'A07', zone: 'zone-a', status: 'away',       student: 'std-004',    checkIn: minsAgo(60),   features: ['Charging', 'Lamp'], awayStart: minsAgo(8) },
  { id: 'A08', zone: 'zone-a', status: 'away',       student: 'std-018',    checkIn: minsAgo(120),  features: ['Charging'],          awayStart: minsAgo(12) },
  { id: 'A09', zone: 'zone-a', status: 'abandoned',  student: 'std-025',    checkIn: minsAgo(150),  features: ['Lamp'],              awayStart: minsAgo(25) },
  { id: 'A10', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Charging'] },
  { id: 'A11', zone: 'zone-a', status: 'occupied',   student: 'std-005',    checkIn: minsAgo(20),   features: ['Charging', 'Lamp'] },
  { id: 'A12', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Lamp'] },
  { id: 'A13', zone: 'zone-a', status: 'occupied',   student: 'std-019',    checkIn: minsAgo(55),   features: ['Charging'] },
  { id: 'A14', zone: 'zone-a', status: 'away',       student: 'std-009',    checkIn: minsAgo(80),   features: ['Charging', 'Lamp'], awayStart: minsAgo(5) },
  { id: 'A15', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Charging'] },
  { id: 'A16', zone: 'zone-a', status: 'abandoned',  student: 'std-026',    checkIn: minsAgo(180),  features: ['Lamp'],              awayStart: minsAgo(30) },
  { id: 'A17', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Charging', 'Lamp'] },
  { id: 'A18', zone: 'zone-a', status: 'occupied',   student: 'std-014',    checkIn: minsAgo(15),   features: ['Charging'] },
  { id: 'A19', zone: 'zone-a', status: 'available',  student: null,         checkIn: null,          features: ['Lamp'] },
  { id: 'A20', zone: 'zone-a', status: 'occupied',   student: 'std-030',    checkIn: minsAgo(35),   features: ['Charging'] },

  // ── ZONE B — Collaboration (B01–B20) ──
  { id: 'B01', zone: 'zone-b', status: 'occupied',   student: 'std-003',    checkIn: minsAgo(70),   features: ['Whiteboard', 'Projector'] },
  { id: 'B02', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Whiteboard'] },
  { id: 'B03', zone: 'zone-b', status: 'occupied',   student: 'std-010',    checkIn: minsAgo(40),   features: ['Whiteboard', 'Charging'] },
  { id: 'B04', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Charging'] },
  { id: 'B05', zone: 'zone-b', status: 'occupied',   student: 'std-015',    checkIn: minsAgo(95),   features: ['Whiteboard'] },
  { id: 'B06', zone: 'zone-b', status: 'away',       student: 'std-006',    checkIn: minsAgo(100),  features: ['Charging'],          awayStart: minsAgo(15) },
  { id: 'B07', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Whiteboard', 'Charging'] },
  { id: 'B08', zone: 'zone-b', status: 'away',       student: 'std-009',    checkIn: minsAgo(110),  features: ['Charging'],          awayStart: minsAgo(18) },
  { id: 'B09', zone: 'zone-b', status: 'abandoned',  student: 'std-020',    checkIn: minsAgo(200),  features: ['Whiteboard'],        awayStart: minsAgo(35) },
  { id: 'B10', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Charging'] },
  { id: 'B11', zone: 'zone-b', status: 'occupied',   student: 'std-021',    checkIn: minsAgo(25),   features: ['Whiteboard', 'Projector'] },
  { id: 'B12', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Whiteboard'] },
  { id: 'B13', zone: 'zone-b', status: 'occupied',   student: 'std-022',    checkIn: minsAgo(60),   features: ['Charging'] },
  { id: 'B14', zone: 'zone-b', status: 'away',       student: 'std-011',    checkIn: minsAgo(130),  features: ['Whiteboard'],        awayStart: minsAgo(10) },
  { id: 'B15', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Charging'] },
  { id: 'B16', zone: 'zone-b', status: 'occupied',   student: 'std-027',    checkIn: minsAgo(50),   features: ['Whiteboard', 'Charging'] },
  { id: 'B17', zone: 'zone-b', status: 'abandoned',  student: 'std-023',    checkIn: minsAgo(160),  features: ['Charging'],          awayStart: minsAgo(28) },
  { id: 'B18', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Whiteboard'] },
  { id: 'B19', zone: 'zone-b', status: 'occupied',   student: 'std-016',    checkIn: minsAgo(75),   features: ['Charging'] },
  { id: 'B20', zone: 'zone-b', status: 'available',  student: null,         checkIn: null,          features: ['Whiteboard', 'Charging'] },

  // ── ZONE C — Window Seats (C01–C20) ──
  { id: 'C01', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window', 'Charging', 'Ergonomic'] },
  { id: 'C02', zone: 'zone-c', status: 'occupied',   student: 'std-012',    checkIn: minsAgo(50),   features: ['Window', 'Charging'] },
  { id: 'C03', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window', 'Ergonomic'] },
  { id: 'C04', zone: 'zone-c', status: 'occupied',   student: 'std-017',    checkIn: minsAgo(85),   features: ['Window', 'Charging'] },
  { id: 'C05', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window', 'Charging', 'Ergonomic'] },
  { id: 'C06', zone: 'zone-c', status: 'occupied',   student: 'std-004',    checkIn: minsAgo(30),   features: ['Window'] },
  { id: 'C07', zone: 'zone-c', status: 'occupied',   student: 'std-001',    checkIn: minsAgo(74),   features: ['Window', 'Charging', 'Ergonomic'] },
  { id: 'C08', zone: 'zone-c', status: 'away',       student: 'std-010',    checkIn: minsAgo(120),  features: ['Window'],            awayStart: minsAgo(11) },
  { id: 'C09', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window', 'Ergonomic'] },
  { id: 'C10', zone: 'zone-c', status: 'abandoned',  student: 'std-024',    checkIn: minsAgo(210),  features: ['Window'],            awayStart: minsAgo(40) },
  { id: 'C11', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window', 'Charging'] },
  { id: 'C12', zone: 'zone-c', status: 'occupied',   student: 'std-028',    checkIn: minsAgo(45),   features: ['Window', 'Ergonomic'] },
  { id: 'C13', zone: 'zone-c', status: 'away',       student: 'std-029',    checkIn: minsAgo(90),   features: ['Window', 'Charging'], awayStart: minsAgo(7) },
  { id: 'C14', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window'] },
  { id: 'C15', zone: 'zone-c', status: 'occupied',   student: 'std-007',    checkIn: minsAgo(65),   features: ['Window', 'Charging', 'Ergonomic'] },
  { id: 'C16', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window', 'Ergonomic'] },
  { id: 'C17', zone: 'zone-c', status: 'occupied',   student: 'std-008',    checkIn: minsAgo(100),  features: ['Window', 'Charging'] },
  { id: 'C18', zone: 'zone-c', status: 'abandoned',  student: 'std-030',    checkIn: minsAgo(190),  features: ['Window'],            awayStart: minsAgo(38) },
  { id: 'C19', zone: 'zone-c', status: 'available',  student: null,         checkIn: null,          features: ['Window', 'Charging'] },
  { id: 'C20', zone: 'zone-c', status: 'occupied',   student: 'std-011',    checkIn: minsAgo(55),   features: ['Window', 'Ergonomic'] },

  // ── ZONE D — Tech Hub (D01–D20) ──
  { id: 'D01', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['Dual Monitor', 'High-Speed WiFi', 'Charging'] },
  { id: 'D02', zone: 'zone-d', status: 'occupied',   student: 'std-005',    checkIn: minsAgo(60),   features: ['Dual Monitor', 'Charging'] },
  { id: 'D03', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['Dual Monitor', 'High-Speed WiFi'] },
  { id: 'D04', zone: 'zone-d', status: 'occupied',   student: 'std-008',    checkIn: minsAgo(105),  features: ['Dual Monitor', 'Charging'] },
  { id: 'D05', zone: 'zone-d', status: 'away',       student: 'std-015',    checkIn: minsAgo(80),   features: ['High-Speed WiFi', 'Charging'], awayStart: minsAgo(16) },
  { id: 'D06', zone: 'zone-d', status: 'occupied',   student: 'std-008',    checkIn: minsAgo(35),   features: ['Dual Monitor', 'High-Speed WiFi', 'Charging'] },
  { id: 'D07', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['Dual Monitor'] },
  { id: 'D08', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['High-Speed WiFi', 'Charging'] },
  { id: 'D09', zone: 'zone-d', status: 'abandoned',  student: 'std-027',    checkIn: minsAgo(240),  features: ['Dual Monitor'],      awayStart: minsAgo(45) },
  { id: 'D10', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['Dual Monitor', 'Charging'] },
  { id: 'D11', zone: 'zone-d', status: 'occupied',   student: 'std-016',    checkIn: minsAgo(20),   features: ['Dual Monitor', 'High-Speed WiFi', 'Charging'] },
  { id: 'D12', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['High-Speed WiFi'] },
  { id: 'D13', zone: 'zone-d', status: 'occupied',   student: 'std-021',    checkIn: minsAgo(75),   features: ['Dual Monitor', 'Charging'] },
  { id: 'D14', zone: 'zone-d', status: 'away',       student: 'std-022',    checkIn: minsAgo(115),  features: ['High-Speed WiFi', 'Charging'], awayStart: minsAgo(9) },
  { id: 'D15', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['Dual Monitor', 'High-Speed WiFi'] },
  { id: 'D16', zone: 'zone-d', status: 'occupied',   student: 'std-023',    checkIn: minsAgo(88),   features: ['Dual Monitor', 'Charging'] },
  { id: 'D17', zone: 'zone-d', status: 'abandoned',  student: 'std-024',    checkIn: minsAgo(170),  features: ['High-Speed WiFi'],   awayStart: minsAgo(33) },
  { id: 'D18', zone: 'zone-d', status: 'available',  student: null,         checkIn: null,          features: ['Dual Monitor', 'Charging'] },
  { id: 'D19', zone: 'zone-d', status: 'occupied',   student: 'std-025',    checkIn: minsAgo(42),   features: ['High-Speed WiFi', 'Charging'] },
  { id: 'D20', zone: 'zone-d', status: 'occupied',   student: 'std-026',    checkIn: minsAgo(68),   features: ['Dual Monitor', 'High-Speed WiFi', 'Charging'] },
];

// ─── ACTIVITY FEED (50 historical events) ────────────────────
const timeAgo = (h, m) => {
  const d = new Date();
  d.setHours(d.getHours() - h, d.getMinutes() - m);
  return d;
};
const fmt = (d) =>
  d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

export const ACTIVITY_FEED = [
  { id: 'act-001', time: fmt(timeAgo(3, 40)), desk: 'A02', action: 'Occupied',   student: 'Priya Sharma',     icon: 'check-in'  },
  { id: 'act-002', time: fmt(timeAgo(3, 30)), desk: 'B01', action: 'Occupied',   student: 'Rahul Verma',      icon: 'check-in'  },
  { id: 'act-003', time: fmt(timeAgo(3, 20)), desk: 'C06', action: 'Occupied',   student: 'Sneha Nair',       icon: 'check-in'  },
  { id: 'act-004', time: fmt(timeAgo(3, 10)), desk: 'A04', action: 'Occupied',   student: 'Rahul Verma',      icon: 'check-in'  },
  { id: 'act-005', time: fmt(timeAgo(3, 0)),  desk: 'D02', action: 'Occupied',   student: 'Vikram Patel',     icon: 'check-in'  },
  { id: 'act-006', time: fmt(timeAgo(2, 50)), desk: 'A07', action: 'Away',       student: 'Sneha Nair',       icon: 'away'      },
  { id: 'act-007', time: fmt(timeAgo(2, 45)), desk: 'B03', action: 'Occupied',   student: 'Neha Gupta',       icon: 'check-in'  },
  { id: 'act-008', time: fmt(timeAgo(2, 40)), desk: 'D04', action: 'Occupied',   student: 'Divya Krishnan',   icon: 'check-in'  },
  { id: 'act-009', time: fmt(timeAgo(2, 35)), desk: 'B06', action: 'Away',       student: 'Ananya Iyer',      icon: 'away'      },
  { id: 'act-010', time: fmt(timeAgo(2, 30)), desk: 'C02', action: 'Occupied',   student: 'Meera Rajan',      icon: 'check-in'  },
  { id: 'act-011', time: fmt(timeAgo(2, 25)), desk: 'A09', action: 'Abandoned',  student: 'Kunal Kapoor',     icon: 'abandoned' },
  { id: 'act-012', time: fmt(timeAgo(2, 20)), desk: 'B05', action: 'Occupied',   student: 'Aryan Singh',      icon: 'check-in'  },
  { id: 'act-013', time: fmt(timeAgo(2, 15)), desk: 'C10', action: 'Released',   student: 'Anjali Desai',     icon: 'release'   },
  { id: 'act-014', time: fmt(timeAgo(2, 10)), desk: 'D06', action: 'Occupied',   student: 'Divya Krishnan',   icon: 'check-in'  },
  { id: 'act-015', time: fmt(timeAgo(2, 5)),  desk: 'A08', action: 'Away',       student: 'Shruti Agarwal',   icon: 'away'      },
  { id: 'act-016', time: fmt(timeAgo(2, 0)),  desk: 'B08', action: 'Away',       student: 'Karan Joshi',      icon: 'away'      },
  { id: 'act-017', time: fmt(timeAgo(1, 55)), desk: 'C04', action: 'Occupied',   student: 'Nikhil Banerjee',  icon: 'check-in'  },
  { id: 'act-018', time: fmt(timeAgo(1, 50)), desk: 'A11', action: 'Occupied',   student: 'Vikram Patel',     icon: 'check-in'  },
  { id: 'act-019', time: fmt(timeAgo(1, 45)), desk: 'B09', action: 'Abandoned',  student: 'Riya Chakraborty', icon: 'abandoned' },
  { id: 'act-020', time: fmt(timeAgo(1, 40)), desk: 'D05', action: 'Away',       student: 'Aryan Singh',      icon: 'away'      },
  { id: 'act-021', time: fmt(timeAgo(1, 35)), desk: 'C07', action: 'Occupied',   student: 'Arjun Mehta',      icon: 'check-in'  },
  { id: 'act-022', time: fmt(timeAgo(1, 30)), desk: 'A13', action: 'Occupied',   student: 'Varun Nambiar',    icon: 'check-in'  },
  { id: 'act-023', time: fmt(timeAgo(1, 25)), desk: 'B11', action: 'Occupied',   student: 'Abhishek Tiwari',  icon: 'check-in'  },
  { id: 'act-024', time: fmt(timeAgo(1, 20)), desk: 'C08', action: 'Away',       student: 'Neha Gupta',       icon: 'away'      },
  { id: 'act-025', time: fmt(timeAgo(1, 15)), desk: 'D11', action: 'Occupied',   student: 'Pooja Reddy',      icon: 'check-in'  },
  { id: 'act-026', time: fmt(timeAgo(1, 10)), desk: 'A16', action: 'Abandoned',  student: 'Tanvi Bhatt',      icon: 'abandoned' },
  { id: 'act-027', time: fmt(timeAgo(1, 5)),  desk: 'B13', action: 'Occupied',   student: 'Nandini Pillai',   icon: 'check-in'  },
  { id: 'act-028', time: fmt(timeAgo(1, 0)),  desk: 'C12', action: 'Occupied',   student: 'Swati Mishra',     icon: 'check-in'  },
  { id: 'act-029', time: fmt(timeAgo(0, 55)), desk: 'D13', action: 'Occupied',   student: 'Abhishek Tiwari',  icon: 'check-in'  },
  { id: 'act-030', time: fmt(timeAgo(0, 50)), desk: 'B14', action: 'Away',       student: 'Aditya Kumar',     icon: 'away'      },
  { id: 'act-031', time: fmt(timeAgo(0, 45)), desk: 'A14', action: 'Away',       student: 'Karan Joshi',      icon: 'away'      },
  { id: 'act-032', time: fmt(timeAgo(0, 40)), desk: 'C15', action: 'Occupied',   student: 'Rohan Das',        icon: 'check-in'  },
  { id: 'act-033', time: fmt(timeAgo(0, 38)), desk: 'D09', action: 'Abandoned',  student: 'Deepak Yadav',     icon: 'abandoned' },
  { id: 'act-034', time: fmt(timeAgo(0, 35)), desk: 'A18', action: 'Occupied',   student: 'Kavya Menon',      icon: 'check-in'  },
  { id: 'act-035', time: fmt(timeAgo(0, 32)), desk: 'B16', action: 'Occupied',   student: 'Deepak Yadav',     icon: 'check-in'  },
  { id: 'act-036', time: fmt(timeAgo(0, 30)), desk: 'C17', action: 'Occupied',   student: 'Divya Krishnan',   icon: 'check-in'  },
  { id: 'act-037', time: fmt(timeAgo(0, 28)), desk: 'D14', action: 'Away',       student: 'Nandini Pillai',   icon: 'away'      },
  { id: 'act-038', time: fmt(timeAgo(0, 25)), desk: 'A20', action: 'Occupied',   student: 'Lakshmi Suresh',   icon: 'check-in'  },
  { id: 'act-039', time: fmt(timeAgo(0, 22)), desk: 'B17', action: 'Abandoned',  student: 'Harsh Malhotra',   icon: 'abandoned' },
  { id: 'act-040', time: fmt(timeAgo(0, 20)), desk: 'C13', action: 'Away',       student: 'Rajesh Kumar',     icon: 'away'      },
  { id: 'act-041', time: fmt(timeAgo(0, 18)), desk: 'D16', action: 'Occupied',   student: 'Harsh Malhotra',   icon: 'check-in'  },
  { id: 'act-042', time: fmt(timeAgo(0, 15)), desk: 'A06', action: 'Occupied',   student: 'Siddharth Roy',    icon: 'check-in'  },
  { id: 'act-043', time: fmt(timeAgo(0, 13)), desk: 'C18', action: 'Abandoned',  student: 'Lakshmi Suresh',   icon: 'abandoned' },
  { id: 'act-044', time: fmt(timeAgo(0, 11)), desk: 'D17', action: 'Abandoned',  student: 'Anjali Desai',     icon: 'abandoned' },
  { id: 'act-045', time: fmt(timeAgo(0, 9)),  desk: 'B19', action: 'Occupied',   student: 'Pooja Reddy',      icon: 'check-in'  },
  { id: 'act-046', time: fmt(timeAgo(0, 7)),  desk: 'D19', action: 'Occupied',   student: 'Kunal Kapoor',     icon: 'check-in'  },
  { id: 'act-047', time: fmt(timeAgo(0, 5)),  desk: 'C20', action: 'Occupied',   student: 'Aditya Kumar',     icon: 'check-in'  },
  { id: 'act-048', time: fmt(timeAgo(0, 4)),  desk: 'D20', action: 'Occupied',   student: 'Tanvi Bhatt',      icon: 'check-in'  },
  { id: 'act-049', time: fmt(timeAgo(0, 2)),  desk: 'A18', action: 'Released',   student: 'Kavya Menon',      icon: 'release'   },
  { id: 'act-050', time: fmt(timeAgo(0, 1)),  desk: 'B13', action: 'Released',   student: 'Nandini Pillai',   icon: 'release'   },
];

// ─── ANALYTICS MOCK DATA ─────────────────────────────────────

// Occupancy trend — 7 days × 12 hourly points
export const OCCUPANCY_TREND = [
  { day: 'Mon', data: [20, 35, 55, 72, 88, 93, 90, 78, 62, 48, 32, 18] },
  { day: 'Tue', data: [22, 38, 60, 75, 89, 94, 91, 80, 65, 51, 36, 22] },
  { day: 'Wed', data: [18, 32, 50, 68, 83, 88, 85, 73, 58, 43, 28, 16] },
  { day: 'Thu', data: [26, 42, 64, 80, 92, 97, 94, 82, 70, 54, 40, 26] },
  { day: 'Fri', data: [16, 30, 47, 64, 79, 87, 83, 71, 56, 41, 26, 14] },
  { day: 'Sat', data: [10, 20, 35, 50, 65, 73, 70, 58, 45, 31, 18, 10] },
  { day: 'Sun', data: [8,  15, 27, 41, 57, 64, 61, 50, 38, 25, 14,  8] },
];

// For recharts (flattened for LineChart)
export const OCCUPANCY_CHART_DATA = [
  { time: '8AM',  Mon: 20, Tue: 22, Wed: 18, Thu: 26, Fri: 16 },
  { time: '9AM',  Mon: 35, Tue: 38, Wed: 32, Thu: 42, Fri: 30 },
  { time: '10AM', Mon: 55, Tue: 60, Wed: 50, Thu: 64, Fri: 47 },
  { time: '11AM', Mon: 72, Tue: 75, Wed: 68, Thu: 80, Fri: 64 },
  { time: '12PM', Mon: 88, Tue: 89, Wed: 83, Thu: 92, Fri: 79 },
  { time: '1PM',  Mon: 93, Tue: 94, Wed: 88, Thu: 97, Fri: 87 },
  { time: '2PM',  Mon: 90, Tue: 91, Wed: 85, Thu: 94, Fri: 83 },
  { time: '3PM',  Mon: 78, Tue: 80, Wed: 73, Thu: 82, Fri: 71 },
  { time: '4PM',  Mon: 62, Tue: 65, Wed: 58, Thu: 70, Fri: 56 },
  { time: '5PM',  Mon: 48, Tue: 51, Wed: 43, Thu: 54, Fri: 41 },
  { time: '6PM',  Mon: 32, Tue: 36, Wed: 28, Thu: 40, Fri: 26 },
  { time: '7PM',  Mon: 18, Tue: 22, Wed: 16, Thu: 26, Fri: 14 },
];

// Peak usage hours — AreaChart
export const PEAK_HOURS_DATA = [
  { hour: '8AM',  occupancy: 15, sessions: 12 },
  { hour: '9AM',  occupancy: 40, sessions: 32 },
  { hour: '10AM', occupancy: 68, sessions: 54 },
  { hour: '11AM', occupancy: 85, sessions: 68 },
  { hour: '12PM', occupancy: 72, sessions: 58 },
  { hour: '1PM',  occupancy: 90, sessions: 72 },
  { hour: '2PM',  occupancy: 95, sessions: 76 },
  { hour: '3PM',  occupancy: 88, sessions: 70 },
  { hour: '4PM',  occupancy: 78, sessions: 62 },
  { hour: '5PM',  occupancy: 60, sessions: 48 },
  { hour: '6PM',  occupancy: 42, sessions: 34 },
  { hour: '7PM',  occupancy: 25, sessions: 20 },
];

// Zone utilization — BarChart
export const ZONE_UTILIZATION = [
  { zone: 'Zone A',  label: 'Quiet Study',     utilization: 95, avgDuration: 112, peakHour: '2PM' },
  { zone: 'Zone B',  label: 'Collaboration',   utilization: 70, avgDuration: 78,  peakHour: '1PM' },
  { zone: 'Zone C',  label: 'Window Seats',    utilization: 45, avgDuration: 95,  peakHour: '11AM' },
  { zone: 'Zone D',  label: 'Tech Hub',        utilization: 82, avgDuration: 130, peakHour: '2PM' },
];

// Daily check-ins — BarChart (last 7 days)
export const DAILY_CHECKINS = [
  { day: 'Mon', checkIns: 87,  releases: 81,  abandoned: 6  },
  { day: 'Tue', checkIns: 102, releases: 94,  abandoned: 8  },
  { day: 'Wed', checkIns: 78,  releases: 72,  abandoned: 6  },
  { day: 'Thu', checkIns: 115, releases: 105, abandoned: 10 },
  { day: 'Fri', checkIns: 95,  releases: 88,  abandoned: 7  },
  { day: 'Sat', checkIns: 52,  releases: 49,  abandoned: 3  },
  { day: 'Sun', checkIns: 38,  releases: 36,  abandoned: 2  },
];

// Session duration distribution — BarChart
export const SESSION_DURATION_DIST = [
  { range: '<30 min',   count: 18 },
  { range: '30–60 min', count: 34 },
  { range: '1–2 hrs',   count: 42 },
  { range: '2–3 hrs',   count: 28 },
  { range: '3–4 hrs',   count: 16 },
  { range: '>4 hrs',    count: 8  },
];

// ─── SUMMARY STATS ────────────────────────────────────────────
export const SUMMARY_STATS = {
  totalDesks: 80,
  occupancyPercent: 68,
  available: 28,
  occupied: 36,
  away: 9,
  abandoned: 7,
  sessionsToday: 127,
  avgSessionMinutes: 102, // 1hr 42min
  peakOccupancyToday: 95,
  peakHourToday: '2PM',
};

// ─── QR SCAN MOCK TARGETS ────────────────────────────────────
export const QR_SCAN_TARGETS = [
  { deskId: 'C07', zone: 'Zone C — Window Seats', features: ['Window', 'Charging', 'Ergonomic'] },
  { deskId: 'A01', zone: 'Zone A — Quiet Study',  features: ['Charging', 'Lamp'] },
  { deskId: 'D01', zone: 'Zone D — Tech Hub',     features: ['Dual Monitor', 'High-Speed WiFi', 'Charging'] },
];

// ─── HELPER — get student object by ID ───────────────────────
export const getStudent = (id) => STUDENTS.find((s) => s.id === id) ?? null;

// ─── SMART SEAT RECOMMENDATIONS ──────────────────────────────
export const SEAT_RECOMMENDATIONS = [
  {
    rank: 1,
    deskId: 'C05',
    zone: 'Zone C — Window Seats',
    score: 98,
    reasons: ['Quiet zone', 'Window seat', 'Charging available', 'Ergonomic chair'],
    highlight: true,
  },
  {
    rank: 2,
    deskId: 'C01',
    zone: 'Zone C — Window Seats',
    score: 95,
    reasons: ['Window seat', 'Charging available', 'Ergonomic chair'],
    highlight: true,
  },
  {
    rank: 3,
    deskId: 'A01',
    zone: 'Zone A — Quiet Study',
    score: 88,
    reasons: ['Quiet study zone', 'Charging available', 'Reading lamp'],
    highlight: true,
  },
];

// ─── TEST CASES INDEX (100+) ─────────────────────────────────
// This object documents all test cases covered by mock data above.
// Useful for QA / demo walkthroughs.
export const TEST_CASES = [
  // DESK STATUS (40 cases — one per desk)
  ...INITIAL_DESKS.map((d, i) => ({
    id: `TC-D${String(i + 1).padStart(3, '0')}`,
    category: 'Desk Status',
    description: `Desk ${d.id} initial state is ${d.status}`,
    desk: d.id,
    expected: d.status,
  })),

  // ZONE FEATURES (4 cases)
  { id: 'TC-Z001', category: 'Zone', description: 'Zone A has Charging and Noise-Free features' },
  { id: 'TC-Z002', category: 'Zone', description: 'Zone B has Whiteboard and Projector' },
  { id: 'TC-Z003', category: 'Zone', description: 'Zone C has Window View and Ergonomic Chairs' },
  { id: 'TC-Z004', category: 'Zone', description: 'Zone D has Dual Monitors and High-Speed WiFi' },

  // STUDENT CHECK-IN FLOW (6 cases)
  { id: 'TC-S001', category: 'Check-In', description: 'Student selects available desk → status changes to Occupied' },
  { id: 'TC-S002', category: 'Check-In', description: 'Check-in time is recorded correctly' },
  { id: 'TC-S003', category: 'Check-In', description: 'Student name appears on desk tooltip after check-in' },
  { id: 'TC-S004', category: 'Check-In', description: 'QR scan step 1 → step 2 transition' },
  { id: 'TC-S005', category: 'Check-In', description: 'QR scan step 2 → step 3 (success) transition' },
  { id: 'TC-S006', category: 'Check-In', description: 'Redirect to Student Dashboard after successful check-in' },

  // AWAY MODE (5 cases)
  { id: 'TC-A001', category: 'Away Mode', description: 'Away modal opens on button click' },
  { id: 'TC-A002', category: 'Away Mode', description: 'Countdown timer starts at 20:00 and decrements' },
  { id: 'TC-A003', category: 'Away Mode', description: '"I\'m Back" resets desk to Occupied' },
  { id: 'TC-A004', category: 'Away Mode', description: 'Release Seat sets desk to Available' },
  { id: 'TC-A005', category: 'Away Mode', description: 'Timer expiry sets desk to Abandoned' },

  // LIBRARIAN FLOW (8 cases)
  { id: 'TC-L001', category: 'Librarian', description: 'KPI row shows correct total desks (80)' },
  { id: 'TC-L002', category: 'Librarian', description: 'KPI row shows correct occupancy %' },
  { id: 'TC-L003', category: 'Librarian', description: 'Abandoned desk alert cards list all 7 abandoned desks' },
  { id: 'TC-L004', category: 'Librarian', description: 'Reset Desk button sets desk to Available' },
  { id: 'TC-L005', category: 'Librarian', description: 'Reset All Abandoned clears all abandoned desks' },
  { id: 'TC-L006', category: 'Librarian', description: 'Activity feed shows last 15 events' },
  { id: 'TC-L007', category: 'Librarian', description: 'Live map updates after desk reset' },
  { id: 'TC-L008', category: 'Librarian', description: 'Export Snapshot button is clickable' },

  // ANALYTICS (8 cases)
  { id: 'TC-AN01', category: 'Analytics', description: 'Occupancy trend line chart renders with 5 day lines' },
  { id: 'TC-AN02', category: 'Analytics', description: 'Peak hours area chart shows 12 time points' },
  { id: 'TC-AN03', category: 'Analytics', description: 'Zone utilization bar chart shows 4 zones' },
  { id: 'TC-AN04', category: 'Analytics', description: 'Daily check-ins bar chart shows 7 days' },
  { id: 'TC-AN05', category: 'Analytics', description: 'Average session metric card shows 1hr 42min' },
  { id: 'TC-AN06', category: 'Analytics', description: 'Sessions today shows 127' },
  { id: 'TC-AN07', category: 'Analytics', description: 'Peak occupancy today shows 95%' },
  { id: 'TC-AN08', category: 'Analytics', description: 'Zone A utilization is highest (95%)' },

  // NAVIGATION (6 cases)
  { id: 'TC-N001', category: 'Navigation', description: 'Landing → Student Dashboard via CTA button' },
  { id: 'TC-N002', category: 'Navigation', description: 'Landing → Library Map via View Live Library button' },
  { id: 'TC-N003', category: 'Navigation', description: 'Navbar → Librarian Command Center' },
  { id: 'TC-N004', category: 'Navigation', description: 'Navbar → Analytics Dashboard' },
  { id: 'TC-N005', category: 'Navigation', description: 'Navbar → QR Check-In' },
  { id: 'TC-N006', category: 'Navigation', description: 'Active page highlighted in navbar' },

  // SMART SEAT FINDER (4 cases)
  { id: 'TC-SF01', category: 'Smart Seat', description: 'Find Best Seat button highlights top 3 desks' },
  { id: 'TC-SF02', category: 'Smart Seat', description: 'Recommendation card shows desk C05 as #1' },
  { id: 'TC-SF03', category: 'Smart Seat', description: 'Recommendation shows reasons (quiet, window, charging)' },
  { id: 'TC-SF04', category: 'Smart Seat', description: 'Clicking recommended desk opens detail panel' },

  // ACTIVITY FEED (5 cases)
  { id: 'TC-AF01', category: 'Activity Feed', description: 'Feed displays 50 pre-seeded events' },
  { id: 'TC-AF02', category: 'Activity Feed', description: 'New check-in adds entry to top of feed' },
  { id: 'TC-AF03', category: 'Activity Feed', description: 'Away event shows amber icon' },
  { id: 'TC-AF04', category: 'Activity Feed', description: 'Abandoned event shows gray icon' },
  { id: 'TC-AF05', category: 'Activity Feed', description: 'Release event shows green icon' },

  // ANIMATIONS (5 cases)
  { id: 'TC-AM01', category: 'Animation', description: 'Landing page stat counters animate on load' },
  { id: 'TC-AM02', category: 'Animation', description: 'Library map desk hover shows scale animation' },
  { id: 'TC-AM03', category: 'Animation', description: 'Detail panel slides in from right' },
  { id: 'TC-AM04', category: 'Animation', description: 'Away modal fades in with spring animation' },
  { id: 'TC-AM05', category: 'Animation', description: 'Activity feed new entry animates in from top' },
];

export const TOTAL_TEST_CASES = TEST_CASES.length;
// → 40 (desks) + 4 (zones) + 6 (check-in) + 5 (away) + 8 (librarian) + 8 (analytics) + 6 (nav) + 4 (smart) + 5 (feed) + 5 (anim) = 101 test cases
