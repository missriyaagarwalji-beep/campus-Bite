export type MenuCategory = 'meal' | 'snack' | 'beverage';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  categoryLabel: string;
  price: number;
  slotLabel: string;
  calories: string;
  shortDesc: string;
  fullDesc: string;
  ingredients: string[];
  hygieneNote: string;
  isFlagship?: boolean;
  imageUrl: string;
  illustrationKey:
    | 'thali'
    | 'rajma'
    | 'paneer'
    | 'egg'
    | 'poha'
    | 'paratha'
    | 'chai'
    | 'shikanji';
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  spiceLevel: 'Mild' | 'Homestyle' | 'Spicy';
}

export interface CampusZone {
  id: string;
  name: string;
  area: string;
  lunchWindow: string;
  dinnerWindow: string;
  deliveryFee: number;
}

export interface PilotOrder {
  id: string;
  studentName: string;
  hostelZone: string;
  roomDetails: string;
  slot: 'Lunch (12:30–1:30 PM)' | 'Dinner (7:30–8:30 PM)';
  paymentMode: 'UPI on Delivery' | 'Cash on Delivery';
  items: { name: string; quantity: number; price: number; spiceLevel: string }[];
  total: number;
  isRepeatCustomer: boolean;
  referralCodeUsed?: string;
  createdAt: string;
  whatsappText: string;
}

export interface StudentFeedback {
  id: string;
  studentName: string;
  hostelArea: string;
  mealOrdered: string;
  rating: number;
  findsPriceAffordable: boolean;
  willRepeatOrder: boolean;
  comment: string;
  submittedAt: string;
}

export interface CompetitorEntry {
  id: string;
  name: string;
  type: 'Our Venture' | 'Direct Competitor' | 'Indirect Competitor';
  priceRange: string;
  affordabilityScore: number; // 1-10
  convenienceScore: number; // 1-10
  mainOffer: string;
  strength: string;
  weakness: string;
}

export interface UnitEconomicsPreset {
  id: 'base' | 'conservative' | 'ambitious';
  label: string;
  sellingPrice: number;
  expectedCustomers: number;
  purchasesPerCustomer: number;
  variableCost: number;
  monthlyFixedCost: number;
  notes: string;
}

export interface GtmWeekPlan {
  week: number;
  title: string;
  channels: string;
  action: string;
  learningQuestion: string;
  targetLeads: number;
  targetCustomers: number;
  budgetInr: number;
  completed: boolean;
}

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: 'dgu-hostel',
    name: 'DBS Global University Hostels',
    area: 'Selaqui / Miwala Campus Gate',
    lunchWindow: '12:30 PM – 1:15 PM',
    dinnerWindow: '7:30 PM – 8:15 PM',
    deliveryFee: 0,
  },
  {
    id: 'premnagar-pg',
    name: 'Prem Nagar Student PGs',
    area: 'Chakrata Road & Wing 1–7',
    lunchWindow: '12:45 PM – 1:30 PM',
    dinnerWindow: '7:45 PM – 8:30 PM',
    deliveryFee: 0,
  },
  {
    id: 'pondha-hub',
    name: 'Pondha & Nanda Ki Chowki Hostels',
    area: 'University Road Corridor',
    lunchWindow: '12:30 PM – 1:20 PM',
    dinnerWindow: '7:30 PM – 8:20 PM',
    deliveryFee: 0,
  },
  {
    id: 'bidholi-pg',
    name: 'Bidholi & Kandoli PG Cluster',
    area: 'Upper Campus Road',
    lunchWindow: '1:00 PM – 1:45 PM',
    dinnerWindow: '8:00 PM – 8:45 PM',
    deliveryFee: 0,
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'ghar-thali',
    name: 'Classic Ghar-Style Thali',
    category: 'meal',
    categoryLabel: 'Daily Meal',
    price: 100,
    slotLabel: 'Lunch & Dinner',
    calories: '620 kcal',
    shortDesc:
      'Yellow dal tadka, seasonal sabzi, steamed jeera rice, 3 soft whole-wheat phulkas, and fresh kachumber.',
    fullDesc:
      'Designed as CampusBite’s signature ₹100 everyday meal for hostel and PG students. Cooked fresh in small batches with low-oil home spices and zero artificial thickeners.',
    ingredients: [
      'Toor & moong dal tadka',
      'Seasonal local sabzi',
      '3 whole-wheat phulkas',
      'Steamed basmati jeera rice',
      'Cucumber-tomato kachumber',
    ],
    hygieneNote: 'Sealed food-grade kraft box · Zero delivery surcharge',
    isFlagship: true,
    imageUrl: '/src/assets/images/dish_ghar_thali_1795064228228.jpg',
    illustrationKey: 'thali',
  },
  {
    id: 'rajma-chawal',
    name: 'Dehradun Rajma Chawal Bowl',
    category: 'meal',
    categoryLabel: 'Daily Meal',
    price: 85,
    slotLabel: 'Lunch & Dinner',
    calories: '540 kcal',
    shortDesc:
      'Slow-simmered local mountain rajma in homestyle tomato-ginger gravy over steamed rice with mint chutney.',
    fullDesc:
      'Inspired by Uttarakhand’s favorite comfort bowl—hearty, protein-rich mountain kidney beans served hot with fragrant basmati rice and pickled onions.',
    ingredients: [
      'Local Harsil-style red rajma',
      'Aged basmati rice',
      'Ginger-garlic tomato masala',
      'Fresh mint-coriander chutney',
    ],
    hygieneNote: 'Prepared fresh 45 mins prior to campus dispatch',
    imageUrl: '/src/assets/images/dish_rajma_chawal_1795064229062.jpg',
    illustrationKey: 'rajma',
  },
  {
    id: 'paneer-paratha-box',
    name: 'Paneer Bhurji & Paratha Box',
    category: 'meal',
    categoryLabel: 'Daily Meal',
    price: 115,
    slotLabel: 'Lunch & Dinner',
    calories: '640 kcal',
    shortDesc:
      'Crumbled fresh dairy paneer sauteed with capsicum and mild spices, paired with 2 flaky tawa parathas and curd.',
    fullDesc:
      'High-protein vegetarian dinner favorite for students tired of watery canteen curries. Made with fresh paneer sourced daily.',
    ingredients: [
      'Fresh crumbled malai paneer',
      '2 whole-wheat tawa parathas',
      'Homemade plain dahi cup',
      'Green chili & onion garnish',
    ],
    hygieneNote: 'Pure cow ghee tawa roast · Packed hot',
    imageUrl: '/src/assets/images/dish_paneer_paratha_1795064231573.jpg',
    illustrationKey: 'paneer',
  },
  {
    id: 'egg-curry-combo',
    name: 'Homestyle Egg Curry & Rice',
    category: 'meal',
    categoryLabel: 'Daily Meal',
    price: 110,
    slotLabel: 'Lunch & Dinner',
    calories: '590 kcal',
    shortDesc:
      'Two boiled eggs simmered in light homestyle onion-tomato gravy served with rice, 2 phulkas, and roasted papad.',
    fullDesc:
      'Balanced protein meal built for exam weeks and late hostel study nights without restaurant-level oil or pricing.',
    ingredients: [
      '2 farm-fresh boiled eggs',
      'Homestyle onion-tomato gravy',
      'Steamed rice & 2 phulkas',
      'Roasted urad papad',
    ],
    hygieneNote: 'Separate prep utensils maintained from veg meals',
    imageUrl: '/src/assets/images/dish_egg_curry_1795064231789.jpg',
    illustrationKey: 'egg',
  },
  {
    id: 'poha-sprouts',
    name: 'Kanda Poha & Sprouts Box',
    category: 'snack',
    categoryLabel: 'Quick Snack',
    price: 70,
    slotLabel: 'Between Classes',
    calories: '360 kcal',
    shortDesc:
      'Light flattened rice tempered with curry leaves, peanuts, and turmeric, served with steamed moong sprouts.',
    fullDesc:
      'Built for busy morning lectures and between-class hunger when you want clean, filling energy under ₹75.',
    ingredients: [
      'Thick poha with mustard & curry leaf',
      'Roasted peanuts',
      'Steamed green moong sprouts',
      'Fresh lemon wedge & sev',
    ],
    hygieneNote: 'Light oil · Zero refined maida',
    imageUrl: '/src/assets/images/dish_poha_sprouts_1795064231443.jpg',
    illustrationKey: 'poha',
  },
  {
    id: 'aloo-paratha-duo',
    name: 'Stuffed Aloo Paratha & Curd',
    category: 'snack',
    categoryLabel: 'Quick Snack',
    price: 75,
    slotLabel: 'Morning & Evening',
    calories: '490 kcal',
    shortDesc:
      'Two generously stuffed spiced potato whole-wheat parathas served with cool homemade curd and mango pickle.',
    fullDesc:
      'A classic hostel staple done cleanly—crisp edges, soft spiced potato filling, and fresh set curd.',
    ingredients: [
      '2 whole-wheat aloo parathas',
      'Roasted jeera & coriander spice',
      '100g homemade fresh curd',
      'Traditional mango pickle',
    ],
    hygieneNote: 'No palm oil · Cooked on cast-iron tawa',
    imageUrl: '/src/assets/images/dish_aloo_paratha_1795064231805.jpg',
    illustrationKey: 'paratha',
  },
  {
    id: 'masala-chai-bun',
    name: 'Ginger Masala Chai & Bun Maska',
    category: 'beverage',
    categoryLabel: 'Beverage',
    price: 45,
    slotLabel: 'Evening Study Break',
    calories: '240 kcal',
    shortDesc:
      'Crushed ginger and cardamom Assam tea in an insulated cup paired with a toasted buttered sweet bun.',
    fullDesc:
      'Warm evening fuel for assignment sessions and group project meetings in hostels.',
    ingredients: [
      'Assam CTC tea & fresh ginger',
      'Green cardamom pods',
      'Full-cream milk',
      'Soft toasted bun with salted butter',
    ],
    hygieneNote: 'Spill-proof heat-sealed cup',
    imageUrl: '/src/assets/images/dish_masala_chai_1795064231437.jpg',
    illustrationKey: 'chai',
  },
  {
    id: 'mint-shikanji',
    name: 'Fresh Mint Nimbu Shikanji',
    category: 'beverage',
    categoryLabel: 'Beverage',
    price: 35,
    slotLabel: 'All Day',
    calories: '85 kcal',
    shortDesc:
      'Freshly squeezed lemon, crushed garden mint, roasted cumin powder, and black salt over RO chilled water.',
    fullDesc:
      'Refreshing natural alternative to sugary sodas—made exclusively with RO-purified water and fresh lemons.',
    ingredients: [
      'Fresh Kagzi lemon juice',
      'Crushed mint leaves',
      'Roasted jeera & kala namak',
      'RO-purified chilled water',
    ],
    hygieneNote: '100% RO purified water · Zero artificial syrup',
    imageUrl: '/src/assets/images/dish_mint_shikanji_1795064231410.jpg',
    illustrationKey: 'shikanji',
  },
];

export const COMPETITOR_BATTLEFIELD: CompetitorEntry[] = [
  {
    id: 'campus-bite',
    name: 'CampusBite (Our Model)',
    type: 'Our Venture',
    priceRange: '₹70 – ₹120 / meal',
    affordabilityScore: 9,
    convenienceScore: 9,
    mainOffer:
      'Fresh, hygienic homemade-style meals with simple WhatsApp ordering and zero-fee campus hostel delivery.',
    strength: 'Student-budget pricing (~₹100), consistent home hygiene, flexible per-meal or weekly plans.',
    weakness: 'Focused curated menu during 30-day Dehradun pilot (no late-night restaurant sprawl).',
  },
  {
    id: 'college-canteen',
    name: 'College Canteens',
    type: 'Direct Competitor',
    priceRange: '₹50 – ₹100 / meal',
    affordabilityScore: 8,
    convenienceScore: 6,
    mainOffer: 'Low-cost snacks and standard meals inside campus boundaries.',
    strength: 'Walk-in proximity during campus hours and low entry price.',
    weakness: 'Repetitive menu, variable hygiene quality, and closed during late evenings or holidays.',
  },
  {
    id: 'local-tiffin',
    name: 'Local Tiffin Services',
    type: 'Direct Competitor',
    priceRange: '₹70 – ₹120 / meal',
    affordabilityScore: 7,
    convenienceScore: 5,
    mainOffer: 'Monthly subscription home-cooked tiffins delivered to PG areas.',
    strength: 'Homemade style and predictable recurring cost.',
    weakness: 'Rigid monthly lock-ins, zero menu flexibility, and inconsistent delivery timing.',
  },
  {
    id: 'swiggy-zomato',
    name: 'Swiggy / Zomato',
    type: 'Indirect Competitor',
    priceRange: '₹120 – ₹250+ / meal',
    affordabilityScore: 3,
    convenienceScore: 8,
    mainOffer: 'Wide commercial restaurant marketplace delivered to gate.',
    strength: 'Vast variety and polished mobile app tracking.',
    weakness: 'Packaging & delivery surcharges make everyday meals unaffordable for student budgets.',
  },
];

export const UNIT_ECONOMICS_PRESETS: UnitEconomicsPreset[] = [
  {
    id: 'base',
    label: 'Base Case',
    sellingPrice: 100,
    expectedCustomers: 200,
    purchasesPerCustomer: 12,
    variableCost: 60,
    monthlyFixedCost: 20000,
    notes:
      'Regular hostel/PG students order ~12 meals per month; WhatsApp convenience and homemade quality drive steady repeat orders.',
  },
  {
    id: 'conservative',
    label: 'Conservative',
    sellingPrice: 80,
    expectedCustomers: 150,
    purchasesPerCustomer: 10,
    variableCost: 55,
    monthlyFixedCost: 20000,
    notes:
      'Slower initial hostel acquisition and lower average ticket focused strictly on budget basic meals.',
  },
  {
    id: 'ambitious',
    label: 'Ambitious',
    sellingPrice: 110,
    expectedCustomers: 300,
    purchasesPerCustomer: 15,
    variableCost: 60,
    monthlyFixedCost: 30000,
    notes:
      'Strong multi-campus Dehradun adoption across DGU, Prem Nagar, and Pondha with weekly meal subscriptions.',
  },
];

export const INITIAL_GTM_WEEKS: GtmWeekPlan[] = [
  {
    week: 1,
    title: 'Week 1 — Menu Launch & Student Awareness',
    channels: 'Instagram + WhatsApp Groups',
    action:
      'Launch CampusBite Instagram page, circulate ₹100 homemade thali menu across hostel & PG WhatsApp groups.',
    learningQuestion: 'Which meal offers and price points generate the highest student enquiries?',
    targetLeads: 25,
    targetCustomers: 5,
    budgetInr: 500,
    completed: true,
  },
  {
    week: 2,
    title: 'Week 2 — Trial Orders & Post-Meal Feedback',
    channels: 'Instagram + Direct WhatsApp',
    action:
      'Fulfill first trial lunch/dinner batches to DBS Global University & Prem Nagar hostels; collect rating after delivery.',
    learningQuestion: 'How many interested enquiries convert into their first paid ₹100 order?',
    targetLeads: 30,
    targetCustomers: 8,
    budgetInr: 600,
    completed: true,
  },
  {
    week: 3,
    title: 'Week 3 — Hostel Referrals & Repeat Orders',
    channels: 'Student Referrals + WhatsApp + Instagram',
    action:
      'Share verified hostel student reviews and reward ₹15 off referral codes to expand across neighboring PG blocks.',
    learningQuestion: 'Can peer referrals lower customer acquisition cost below ₹80/student?',
    targetLeads: 25,
    targetCustomers: 7,
    budgetInr: 500,
    completed: false,
  },
  {
    week: 4,
    title: 'Week 4 — Channel Optimization & Subscription Pilot',
    channels: 'Top Converting Channel + Repeat Buyers',
    action:
      'Double down on highest-converting PG clusters and invite 2+ time buyers onto flexible weekly meal plans.',
    learningQuestion: 'Which acquisition channel delivers repeat buyers at the lowest cost?',
    targetLeads: 20,
    targetCustomers: 5,
    budgetInr: 400,
    completed: false,
  },
];

export const SEEDED_ORDERS: PilotOrder[] = [
  {
    id: 'CB-1018',
    studentName: 'Aarav Rawat',
    hostelZone: 'DBS Global University Hostels',
    roomDetails: 'Boys Hostel Block B, Room 204',
    slot: 'Lunch (12:30–1:30 PM)',
    paymentMode: 'UPI on Delivery',
    items: [{ name: 'Classic Ghar-Style Thali', quantity: 1, price: 100, spiceLevel: 'Homestyle' }],
    total: 100,
    isRepeatCustomer: true,
    createdAt: '2026-11-18T06:40:00Z',
    whatsappText: 'Order #CB-1018 · Classic Ghar-Style Thali (₹100)',
  },
  {
    id: 'CB-1019',
    studentName: 'Sneha Negi',
    hostelZone: 'Prem Nagar Student PGs',
    roomDetails: 'Shivalik Girls PG, Room 12',
    slot: 'Dinner (7:30–8:30 PM)',
    paymentMode: 'UPI on Delivery',
    items: [
      { name: 'Dehradun Rajma Chawal Bowl', quantity: 1, price: 85, spiceLevel: 'Mild' },
      { name: 'Fresh Mint Nimbu Shikanji', quantity: 1, price: 35, spiceLevel: 'Homestyle' },
    ],
    total: 120,
    isRepeatCustomer: true,
    referralCodeUsed: 'DGU-FRIEND',
    createdAt: '2026-11-18T11:15:00Z',
    whatsappText: 'Order #CB-1019 · Rajma Chawal + Shikanji (₹120)',
  },
  {
    id: 'CB-1020',
    studentName: 'Rohan Bisht',
    hostelZone: 'Pondha & Nanda Ki Chowki Hostels',
    roomDetails: 'Himalaya Residency, Floor 3',
    slot: 'Dinner (7:30–8:30 PM)',
    paymentMode: 'Cash on Delivery',
    items: [{ name: 'Paneer Bhurji & Paratha Box', quantity: 1, price: 115, spiceLevel: 'Spicy' }],
    total: 115,
    isRepeatCustomer: false,
    createdAt: '2026-11-18T12:05:00Z',
    whatsappText: 'Order #CB-1020 · Paneer Bhurji & Paratha Box (₹115)',
  },
  {
    id: 'CB-1021',
    studentName: 'Ananya Joshi',
    hostelZone: 'DBS Global University Hostels',
    roomDetails: 'Girls Hostel Wing A, Room 118',
    slot: 'Lunch (12:30–1:30 PM)',
    paymentMode: 'UPI on Delivery',
    items: [{ name: 'Classic Ghar-Style Thali', quantity: 1, price: 100, spiceLevel: 'Homestyle' }],
    total: 100,
    isRepeatCustomer: true,
    createdAt: '2026-11-18T12:30:00Z',
    whatsappText: 'Order #CB-1021 · Classic Ghar-Style Thali (₹100)',
  },
  {
    id: 'CB-1022',
    studentName: 'Kabir Verma',
    hostelZone: 'Bidholi & Kandoli PG Cluster',
    roomDetails: 'Pine View PG, Room 09',
    slot: 'Dinner (7:30–8:30 PM)',
    paymentMode: 'UPI on Delivery',
    items: [{ name: 'Homestyle Egg Curry & Rice', quantity: 1, price: 110, spiceLevel: 'Spicy' }],
    total: 110,
    isRepeatCustomer: false,
    referralCodeUsed: 'CAMPUS15',
    createdAt: '2026-11-18T13:10:00Z',
    whatsappText: 'Order #CB-1022 · Homestyle Egg Curry & Rice (₹110)',
  },
];

export const SEEDED_FEEDBACK: StudentFeedback[] = [
  {
    id: 'fb-1',
    studentName: 'Aarav Rawat',
    hostelArea: 'DGU Boys Hostel',
    mealOrdered: 'Classic Ghar-Style Thali',
    rating: 5,
    findsPriceAffordable: true,
    willRepeatOrder: true,
    comment:
      'Finally proper light dal and soft rotis without ₹60 Swiggy delivery fees. Ordered thrice this week during mid-sems.',
    submittedAt: '2026-11-17',
  },
  {
    id: 'fb-2',
    studentName: 'Sneha Negi',
    hostelArea: 'Prem Nagar Girls PG',
    mealOrdered: 'Dehradun Rajma Chawal Bowl',
    rating: 4,
    findsPriceAffordable: true,
    willRepeatOrder: true,
    comment:
      'Clean packaging and tasted like home food. Ordering straight on WhatsApp saved time between evening classes.',
    submittedAt: '2026-11-17',
  },
  {
    id: 'fb-3',
    studentName: 'Ananya Joshi',
    hostelArea: 'DGU Girls Hostel',
    mealOrdered: 'Classic Ghar-Style Thali',
    rating: 5,
    findsPriceAffordable: true,
    willRepeatOrder: true,
    comment:
      '₹100 for a full balanced thali delivered right at the hostel gate is unbeatable compared to canteen food.',
    submittedAt: '2026-11-18',
  },
];

export const MARKET_SIZE_DATA = {
  tam: {
    label: 'TAM · Total Dehradun Student Base',
    customers: '1,00,000 students',
    annualSpend: '₹12,000 / year',
    value: 'INR 1,20,00,00,000',
    shortValue: '₹120 Cr',
    evidence:
      'Dehradun education hub with 1,00,000+ college and university students living across campuses, hostels, and PGs.',
  },
  sam: {
    label: 'SAM · Target Hostel & PG Corridors',
    customers: '30,000 students',
    annualSpend: '₹12,000 / year',
    value: 'INR 36,00,00,000',
    shortValue: '₹36 Cr',
    evidence:
      'Selected colleges, universities, hostels, and PG clusters within CampusBite’s Dehradun delivery/pickup radius.',
  },
  som: {
    label: 'SOM · Initial Obtainable Base',
    customers: '1,000 regular students',
    annualSpend: '₹12,000 / year',
    value: 'INR 1,20,00,000',
    shortValue: '₹1.2 Cr',
    evidence:
      'Initial 1,000 regular customers via WhatsApp, Instagram, hostel ambassadors, and peer referrals.',
  },
};
