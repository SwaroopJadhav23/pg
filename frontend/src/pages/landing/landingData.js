export const BRAND = {
  name: 'PG Rooms for Boys',
  nameMarathi: 'पीजी रूम्स फॉर बॉयज',
  tagline: 'More Than A PG. A Home Away From Home.',
  subtagline: 'Premium accommodation for students and working professionals in Nashik.',
  location: 'Satpur Colony, Nashik',
  address: 'Room no 655, MHB Colony, Satpur Colony, Nashik, Maharashtra 422007',
  plusCode: 'XPRF+HV Nashik, Maharashtra',
  phone: '072183 89196',
  phoneTel: '+917218389196',
  whatsapp: '917218389196',
  rating: 4.9,
  reviewCount: 220,
  mapsQuery: 'Room no 655, MHB Colony, Satpur Colony, Nashik, Maharashtra 422007',
  website: 'https://pg-rooms-for-boys.grexa.site'
};

export const HERO_CHIPS = ['WiFi', 'Food', 'Laundry', 'CCTV', 'RO Water', 'Daily Cleaning', 'Attached Washroom'];

export const TRUST_STATS = [
  { value: 500, suffix: '+', label: 'Happy Residents' },
  { value: 4.9, suffix: '', label: 'Google Rating', decimals: 1 },
  { value: 8, suffix: '', label: 'Years Experience' },
  { value: 24, suffix: '×7', label: 'Support' },
  { value: 100, suffix: '%', label: 'Safe & Secure' }
];

export const FEATURES = [
  { title: 'Daily Cleaning', description: 'Spotless rooms and common areas maintained every single day.', icon: 'sparkles', gradient: 'from-violet-500/20 to-indigo-500/5' },
  { title: 'High Speed WiFi', description: 'Uninterrupted connectivity for study, work and entertainment.', icon: 'wifi', gradient: 'from-blue-500/20 to-cyan-500/5' },
  { title: 'RO Water', description: 'Pure filtered water available 24/7 for your health.', icon: 'droplets', gradient: 'from-sky-500/20 to-blue-500/5' },
  { title: 'Laundry', description: 'Hassle-free laundry service so you can focus on what matters.', icon: 'shirt', gradient: 'from-purple-500/20 to-fuchsia-500/5' },
  { title: 'Peaceful Environment', description: 'Calm, disciplined atmosphere ideal for rest and productivity.', icon: 'leaf', gradient: 'from-emerald-500/20 to-teal-500/5' },
  { title: 'Power Backup', description: 'Never worry about outages — backup power keeps you connected.', icon: 'zap', gradient: 'from-amber-500/20 to-orange-500/5' },
  { title: 'Security', description: 'CCTV surveillance and gated access for complete peace of mind.', icon: 'shield', gradient: 'from-rose-500/20 to-red-500/5' },
  { title: 'Affordable Pricing', description: 'Premium living at the most competitive rates in Nashik.', icon: 'wallet', gradient: 'from-brand-primary/20 to-brand-accent/5' }
];

export const ROOM_TYPES = [
  {
    id: 'classic',
    name: 'Classic',
    price: 6500,
    beds: '2 Sharing',
    available: 2,
    amenities: ['WiFi', 'RO Water', 'Daily Cleaning', 'Cupboard'],
    imageIndex: 1,
    badge: 'Best Value'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 8500,
    beds: '2 Sharing + Washroom',
    available: 1,
    amenities: ['WiFi', 'Food', 'Laundry', 'Attached Washroom', 'Study Table'],
    imageIndex: 2,
    popular: true
  },
  {
    id: 'luxury',
    name: 'Luxury',
    price: 10500,
    beds: 'Single Occupancy',
    available: 1,
    amenities: ['All Premium', 'AC Ready', 'Private Washroom', 'Premium Mattress'],
    imageIndex: 3
  }
];

export const VIRTUAL_TOUR_SPOTS = [
  { id: 'entrance', label: 'Entrance', imageIndex: 0 },
  { id: 'hallway', label: 'Hallway', imageIndex: 4 },
  { id: 'room', label: 'Room', imageIndex: 1 },
  { id: 'bathroom', label: 'Bathroom', imageIndex: 2 },
  { id: 'kitchen', label: 'Kitchen', imageIndex: 3 },
  { id: 'terrace', label: 'Terrace', imageIndex: 0 }
];

export const LIVE_ROOMS = [
  { id: '101', name: 'Room 101', status: 'limited', bedsLeft: 2, type: 'Classic' },
  { id: '202', name: 'Room 202', status: 'available', bedsLeft: 3, type: 'Premium' },
  { id: '305', name: 'Room 305', status: 'booked', bedsLeft: 0, type: 'Luxury' },
  { id: '204', name: 'Room 204', status: 'available', bedsLeft: 2, type: 'Classic' }
];

export const LIFESTYLE_ITEMS = [
  { label: 'Students Studying', imageIndex: 1 },
  { label: 'Friends', imageIndex: 2 },
  { label: 'Dinner Time', imageIndex: 3 },
  { label: 'Festival Celebration', imageIndex: 4 },
  { label: 'Laundry', imageIndex: 0 },
  { label: 'Breakfast', imageIndex: 1 },
  { label: 'Common Area', imageIndex: 2 },
  { label: 'Night View', imageIndex: 3 },
  { label: 'Weekend Chill', imageIndex: 4 },
  { label: 'Movie Night', imageIndex: 0 }
];

export const NEARBY_PLACES = [
  { name: 'College Campus', type: 'College', time: '8 min', icon: 'graduation' },
  { name: 'Civil Hospital', type: 'Hospital', time: '12 min', icon: 'hospital' },
  { name: 'Apollo Clinic', type: 'Medical', time: '6 min', icon: 'medical' },
  { name: 'FitZone Gym', type: 'Gym', time: '5 min', icon: 'dumbbell' },
  { name: 'Satpur Bus Stop', type: 'Bus Stop', time: '3 min', icon: 'bus' },
  { name: 'Nashik Road Station', type: 'Railway', time: '18 min', icon: 'train' },
  { name: 'Food Court Plaza', type: 'Restaurant', time: '7 min', icon: 'utensils' },
  { name: 'Local Market', type: 'Market', time: '4 min', icon: 'shopping' }
];

export const COMPARISON = {
  features: ['Food', 'Laundry', 'Cleaning', 'WiFi', 'RO Water', 'Power Backup', 'Security', 'Parking', 'Electricity Included', 'Affordable Pricing'],
  us: [true, true, true, true, true, true, true, true, true, true],
  others: [false, false, true, true, false, false, true, false, false, false]
};

export const PRICING = {
  rooms: { classic: 6500, premium: 8500, luxury: 10500 },
  food: 2500,
  laundry: 500,
  durations: { '1': 1, '3': 0.97, '6': 0.94, '12': 0.9 }
};

export const OWNER = {
  name: 'PG Rooms for Boys Team',
  role: 'Founder & Caretaker',
  story: 'We started with one simple mission — give every student and professional in Nashik a place that feels safe, clean, and truly like home. What began as a small boys PG in Satpur Colony has grown into a trusted home for 500+ residents over 8 years.',
  mission: 'To deliver hotel-grade hygiene with hostel warmth, at prices every family can afford.',
  imageIndex: 0
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rohan Raghvan',
    role: 'Software Engineer',
    rating: 5,
    text: "If you're looking for a safe and well-located PG, this is it. CCTV and gated access gave my family peace of mind. Housekeeping is regular and the atmosphere is peaceful.",
    verified: true,
    imageIndex: 1
  },
  {
    id: 2,
    name: 'Kundan Adhave',
    role: 'Working Professional',
    rating: 5,
    text: 'Very nice room, good environment in PG, best for working professionals and students. Owner behaviour is excellent.',
    verified: true,
    badge: 'New',
    imageIndex: 2
  },
  {
    id: 3,
    name: 'Om Bodke',
    role: 'Student',
    rating: 5,
    text: 'Hygiene and neat clean rooms, very affordable rate, more facilities provided. Nice place to stay in Nashik.',
    verified: true,
    imageIndex: 3
  },
  {
    id: 4,
    name: 'Amit Patil',
    role: 'MBA Student',
    rating: 5,
    text: 'Best PG in Satpur area. WiFi is fast, food is homely, and the common area is always clean. Highly recommended.',
    verified: true,
    imageIndex: 4
  }
];

export const FAQS = [
  { q: 'What is included in the monthly rent?', a: 'Rent includes WiFi, RO water, daily cleaning, CCTV security, and access to all common facilities. Food and laundry are available as add-ons.' },
  { q: 'Is there a security deposit?', a: 'Yes, a refundable security deposit is collected at move-in. Amount depends on room type and is fully returned upon vacating.' },
  { q: 'Can parents visit before booking?', a: 'Absolutely! We encourage parents to visit. Call us to schedule a guided tour anytime between 9 AM and 8 PM.' },
  { q: 'What documents are required?', a: 'Aadhaar card, one passport photo, and college/company ID (for students/professionals) are required at check-in.' },
  { q: 'Is food available?', a: 'Yes, homely veg meals are available with breakfast and dinner plans starting at ₹2,500/month.' },
  { q: 'How do I book a room?', a: 'Click Book Room, fill the form, or call/WhatsApp us directly. We confirm availability within 2 hours.' }
];

export const FOOTER_LINKS = {
  quick: [
    { label: 'Rooms', href: '#rooms' },
    { label: 'Virtual Tour', href: '#tour' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' }
  ],
  amenities: HERO_CHIPS,
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'Google', href: BRAND.website }
  ]
};

// Backward compat for BookRoomModal
export const pgBusiness = {
  name: BRAND.name,
  nameMarathi: BRAND.nameMarathi,
  phone: BRAND.phone,
  phoneTel: BRAND.phoneTel,
  address: BRAND.address,
  mapsQuery: BRAND.mapsQuery
};
