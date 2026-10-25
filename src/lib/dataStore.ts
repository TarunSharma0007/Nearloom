// Resilient High-Availability Data & Demo Store for Nearloom
// Provides rich persistent data and state even when Supabase is unconfigured or offline.

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  description: string;
  rsvpCount: number;
  isOnline: boolean;
}

export interface CommunityFAQ {
  question: string;
  answer: string;
}

export interface StoreCommunity {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  category_id: string;
  location_id: string;
  logo_url: string | null;
  cover_image_url: string | null;
  member_count: number;
  meeting_mode: "offline" | "online" | "hybrid";
  meeting_frequency: string;
  typical_meeting_time: string;
  languages: string[];
  rules: string;
  founded_date?: string;
  primary_join_method: "whatsapp" | "telegram" | "discord" | "website" | "email";
  whatsapp_link?: string | null;
  telegram_link?: string | null;
  discord_link?: string | null;
  website_url?: string | null;
  contact_email?: string | null;
  application_form_url?: string | null;
  status: "active" | "pending" | "rejected";
  is_verified: boolean;
  created_at: string;
  last_activity_at: string;
  created_by: string;
  tags: Array<{ name: string; slug: string }>;
  categories?: { id: string; name: string; slug: string; icon?: string } | null;
  locations?: { id: string; city: string; state: string; country: string } | null;
  upcoming_events: CommunityEvent[];
  faqs: CommunityFAQ[];
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  display_order: number;
}

export interface StoreLocation {
  id: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

export interface StoreReport {
  id: string;
  community_id: string;
  community_name: string;
  reported_by: string;
  reporter_name: string;
  reason: string;
  details: string | null;
  status: "pending" | "reviewed" | "dismissed";
  created_at: string;
}

export interface DemoUser {
  id: string;
  email: string;
  full_name: string;
  role: "platform_admin" | "organizer" | "member";
  avatar_url?: string;
  primary_city?: string;
}

export const DEMO_USERS: Record<string, DemoUser> = {
  admin: {
    id: "user-admin-01",
    email: "elena.admin@nearloom.app",
    full_name: "Elena Vance",
    role: "platform_admin",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    primary_city: "Bengaluru",
  },
  organizer: {
    id: "user-organizer-01",
    email: "aarav.organizer@nearloom.app",
    full_name: "Aarav Sharma",
    role: "organizer",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    primary_city: "Bengaluru",
  },
  member: {
    id: "user-member-01",
    email: "priya.member@nearloom.app",
    full_name: "Priya Menon",
    role: "member",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    primary_city: "Mumbai",
  },
};

const INITIAL_CATEGORIES: StoreCategory[] = [
  { id: "cat-1", name: "Tech & makers", slug: "technology", icon: "Code2", description: "Software engineers, hardware makers, and innovators", display_order: 1 },
  { id: "cat-2", name: "Sports & outdoors", slug: "sports", icon: "Bike", description: "Running, cycling, trekking, yoga, and physical fitness", display_order: 2 },
  { id: "cat-3", name: "Arts & culture", slug: "arts", icon: "Music2", description: "Music, indie films, sketching, writing, and crafts", display_order: 3 },
  { id: "cat-4", name: "Learning circles", slug: "education", icon: "BookOpen", description: "Book clubs, research readings, language exchanges", display_order: 4 },
  { id: "cat-5", name: "Causes & care", slug: "social", icon: "HeartHandshake", description: "Animal welfare, civic initiatives, and environmental defense", display_order: 5 },
  { id: "cat-6", name: "Career & business", slug: "professional", icon: "BriefcaseBusiness", description: "Startup founders, product designers, and mentors", display_order: 6 },
];

const INITIAL_LOCATIONS: StoreLocation[] = [
  { id: "loc-1", city: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
  { id: "loc-2", city: "Mumbai", state: "Maharashtra", country: "India", lat: 19.076, lng: 72.8777 },
  { id: "loc-3", city: "Delhi NCR", state: "Delhi", country: "India", lat: 28.7041, lng: 77.1025 },
  { id: "loc-4", city: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lng: 73.8567 },
  { id: "loc-5", city: "Hyderabad", state: "Telangana", country: "India", lat: 17.385, lng: 78.4867 },
  { id: "loc-6", city: "London", state: "Greater London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { id: "loc-7", city: "San Francisco", state: "California", country: "United States", lat: 37.7749, lng: -122.4194 },
  { id: "loc-8", city: "Berlin", state: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
];

const INITIAL_COMMUNITIES: StoreCommunity[] = [
  {
    id: "comm-1",
    name: "Cubbon Sunday Riders",
    slug: "cubbon-sunday-riders",
    short_description: "A community of road and gravel cyclists meeting every Sunday morning inside Cubbon Park.",
    long_description: `Cubbon Sunday Riders was born in 2021 with five friends looking to ride Bangalore's early morning tree-canopied roads before the city wakes. Today we gather 60 to 120 riders every Sunday at 6:30 AM.\n\nWe divide into 3 pacing groups: 'Breeze' (18-20 km/h for leisure and beginners), 'Tempo' (24-27 km/h for fitness builders), and 'Hammer' (30+ km/h for endurance pros). We always end with filter coffee and warm dosas at Airlines Hotel.\n\nHelmets are strictly required. Puncture kits and front/rear lights are recommended. All bicycle types are welcome!`,
    category_id: "cat-2",
    location_id: "loc-1",
    logo_url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    member_count: 1420,
    meeting_mode: "offline",
    meeting_frequency: "Every Sunday at 6:30 AM",
    typical_meeting_time: "Sunday mornings",
    languages: ["English", "Kannada", "Hindi"],
    rules: "1. Helmets are mandatory on every ride—no exceptions.\n2. Ride single file on public traffic stretches.\n3. Respect pedestrian park paths and fellow cyclists.\n4. No commercial promotions or spam in group chats.",
    founded_date: "2021-04-10",
    primary_join_method: "whatsapp",
    whatsapp_link: "https://chat.whatsapp.com/CubbonSundayRidersExample",
    status: "active",
    is_verified: true,
    created_at: "2024-01-10T08:00:00Z",
    last_activity_at: "2026-09-11T09:30:00Z",
    created_by: "user-organizer-01",
    tags: [{ name: "Cycling", slug: "cycling" }, { name: "Outdoors", slug: "outdoors" }, { name: "Fitness", slug: "fitness" }],
    upcoming_events: [
      {
        id: "evt-1-1",
        title: "Sunday Sunrise Loop & Airlines Breakfast",
        date: "Next Sunday, Sep 20",
        time: "6:30 AM - 8:30 AM IST",
        locationName: "Cubbon Park Central Library Gate, Bengaluru",
        description: "35km city scenic loop through Vidhana Soudha, Sankey Tank, and back for filter coffee.",
        rsvpCount: 42,
        isOnline: false,
      },
      {
        id: "evt-1-2",
        title: "Hesaraghatta Lake Endurance 75km",
        date: "Sunday, Sep 27",
        time: "5:30 AM - 10:00 AM IST",
        locationName: "Mekhri Circle Underpass",
        description: "Monthly century warmup training ride with support vehicle.",
        rsvpCount: 28,
        isOnline: false,
      }
    ],
    faqs: [
      { question: "Can I join if I only have a basic commuter bicycle?", answer: "Yes! Our 'Breeze' group is specifically designed for casual city riders and beginners." },
      { question: "Is there any registration fee?", answer: "No, Cubbon Sunday Riders is 100% free and community-run." },
      { question: "What should I bring?", answer: "A helmet, water bottle, and a spare tube if possible." }
    ]
  },
  {
    id: "comm-2",
    name: "Bangalore Rustaceans",
    slug: "bangalore-rustaceans",
    short_description: "Engineers, hobbyists, and researchers pushing memory safety and high-performance systems with Rust.",
    long_description: `Bangalore Rustaceans is the primary regional community for developers working in or curious about Rust. We meet bi-weekly in Koramangala or Indiranagar for technical talks, lightning demos, compiler explorations, and collaborative hacking sessions.\n\nFrom building distributed databases and embedded firmware to WebAssembly microfrontends and Linux kernel drivers, we welcome engineers of all backgrounds.\n\nBring your laptop, curiosity, and questions!`,
    category_id: "cat-1",
    location_id: "loc-1",
    logo_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    member_count: 890,
    meeting_mode: "hybrid",
    meeting_frequency: "Bi-weekly Saturdays",
    typical_meeting_time: "Saturday 3:00 PM IST",
    languages: ["English"],
    rules: "1. Be welcoming to beginners asking compiler questions.\n2. Adhere to the Rust Code of Conduct.\n3. Keep commercial hiring pitches confined to the dedicated #jobs thread.\n4. Share code examples when reporting tricky borrow-checker issues.",
    founded_date: "2022-02-15",
    primary_join_method: "discord",
    discord_link: "https://discord.gg/bangalore-rustaceans-example",
    website_url: "https://rust-blr.org",
    contact_email: "organizers@rust-blr.org",
    status: "active",
    is_verified: true,
    created_at: "2024-02-14T10:00:00Z",
    last_activity_at: "2026-09-12T14:15:00Z",
    created_by: "user-admin-01",
    tags: [{ name: "Rust", slug: "rust" }, { name: "Systems", slug: "systems" }, { name: "Open Source", slug: "open-source" }],
    upcoming_events: [
      {
        id: "evt-2-1",
        title: "Rust 2026 Edition: Deep-dive into Async Ergonomics",
        date: "Saturday, Sep 19",
        time: "3:00 PM - 5:30 PM IST",
        locationName: "HSR Layout Co-working Space & Discord Stream",
        description: "Two speaker presentations on async traits and zero-copy deserialization followed by open Q&A.",
        rsvpCount: 65,
        isOnline: false,
      }
    ],
    faqs: [
      { question: "I haven't written any Rust yet. Can I still attend?", answer: "Absolutely! We have mentorship tables during the hacking session specifically for newcomers." },
      { question: "Will sessions be streamed?", answer: "Yes, all talks are broadcast live on our Discord server." }
    ]
  },
  {
    id: "comm-3",
    name: "Koramangala Acoustic Jam",
    slug: "koramangala-acoustic-jam",
    short_description: "Singers, guitarists, cajon players, and acoustic instrumentalists gathering for unfiltered music sessions.",
    long_description: `No amplifiers, no complex mic setups—just pure acoustic harmony under the open sky. We meet weekly on rooftops and quiet outdoor courtyards across Koramangala.\n\nWhether you play classical guitar, indie folk, soul, Hindustani violin, or just love singing along to classic anthems, this is a non-judgmental space to jam, collaborate, and find fellow bandmates.`,
    category_id: "cat-3",
    location_id: "loc-1",
    logo_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
    member_count: 640,
    meeting_mode: "offline",
    meeting_frequency: "Weekly on Thursday evenings",
    typical_meeting_time: "Thursday 7:00 PM",
    languages: ["English", "Hindi", "Kannada", "Tamil"],
    rules: "1. Listen as much as you play. Leave room for other voices.\n2. Acoustic and battery-powered portable instruments only.\n3. Respect neighbors by honoring acoustic decibel limits after 9:30 PM.",
    founded_date: "2023-01-20",
    primary_join_method: "telegram",
    telegram_link: "https://t.me/koramangala_acoustic_example",
    status: "active",
    is_verified: true,
    created_at: "2024-03-01T12:00:00Z",
    last_activity_at: "2026-09-10T19:00:00Z",
    created_by: "user-organizer-01",
    tags: [{ name: "Acoustic", slug: "acoustic" }, { name: "Music", slug: "music" }, { name: "Indie", slug: "indie" }],
    upcoming_events: [
      {
        id: "evt-3-1",
        title: "Rooftop Autumn Jam & Song Circle",
        date: "Thursday, Sep 17",
        time: "7:00 PM - 9:30 PM IST",
        locationName: "The Teal Door Courtyard, Koramangala 4th Block",
        description: "Bring your instrument or vocal chords. Chord charts shared ahead in the Telegram channel.",
        rsvpCount: 34,
        isOnline: false,
      }
    ],
    faqs: [
      { question: "I don't play an instrument, can I just listen?", answer: "Yes! Audience members and enthusiastic chorus singers are always cherished." }
    ]
  },
  {
    id: "comm-4",
    name: "Deep Learning Study Group",
    slug: "deep-learning-study-group",
    short_description: "Weekly paper reading circle breaking down foundational and frontier AI research papers.",
    long_description: `We read one major AI paper every week. From transformer architectures and diffusion mechanisms to reasoning models and efficient inference engines, our members present breakdowns, reproduce experiments in PyTorch, and dissect mathematical derivations.\n\nOpen to university students, ML engineers, and curious researchers.`,
    category_id: "cat-4",
    location_id: "loc-1",
    logo_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    member_count: 2100,
    meeting_mode: "online",
    meeting_frequency: "Every Wednesday evening",
    typical_meeting_time: "Wednesday 8:00 PM IST",
    languages: ["English"],
    rules: "1. Read the paper before attending the session.\n2. Keep discussions focused on scientific evidence and reproducibility.\n3. Share your notes and Colab notebooks freely with the group.",
    founded_date: "2022-09-01",
    primary_join_method: "discord",
    discord_link: "https://discord.gg/ai-study-group-example",
    website_url: "https://dlstudy.org",
    status: "active",
    is_verified: true,
    created_at: "2024-01-20T08:00:00Z",
    last_activity_at: "2026-09-12T16:00:00Z",
    created_by: "user-admin-01",
    tags: [{ name: "AI", slug: "ai" }, { name: "Machine Learning", slug: "machine-learning" }, { name: "Research", slug: "research" }],
    upcoming_events: [
      {
        id: "evt-4-1",
        title: "Test-Time Compute & Latent Reasoning Breakdown",
        date: "Wednesday, Sep 16",
        time: "8:00 PM - 9:30 PM IST",
        locationName: "Google Meet & Discord Stage",
        description: "Discussion on scaling inference-time search and verifiers in LLMs.",
        rsvpCount: 88,
        isOnline: true,
      }
    ],
    faqs: [
      { question: "Are recordings available?", answer: "Yes, paper presentations are archived on our community repository." }
    ]
  },
  {
    id: "comm-5",
    name: "Early Stage Founders Hub",
    slug: "early-stage-founders-hub",
    short_description: "A candid peer circle of bootstrapped and seed-stage founders sharing zero-BS growth tactics.",
    long_description: `Building a company from scratch can feel deeply isolating. The Early Stage Founders Hub is a safe, confidential space where 40+ active founders meet each month to share real revenue numbers, distribution bottlenecks, hiring hurdles, and fundraising insights.\n\nNo vanity metrics, no investor posturing—just authentic peer support.`,
    category_id: "cat-6",
    location_id: "loc-1",
    logo_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    member_count: 1750,
    meeting_mode: "hybrid",
    meeting_frequency: "Monthly on first Saturdays",
    typical_meeting_time: "Saturday 11:00 AM",
    languages: ["English"],
    rules: "1. Strict Chatham House Rule: what is discussed in the room stays in the room.\n2. Must be actively building a product (not an agency or freelance consultant).\n3. Give before you take.",
    founded_date: "2022-06-11",
    primary_join_method: "whatsapp",
    whatsapp_link: "https://chat.whatsapp.com/EarlyFoundersExample",
    application_form_url: "https://tally.so/r/early-founders-apply",
    status: "active",
    is_verified: true,
    created_at: "2024-02-05T08:00:00Z",
    last_activity_at: "2026-09-12T11:00:00Z",
    created_by: "user-organizer-01",
    tags: [{ name: "Startups", slug: "startups" }, { name: "Bootstrapping", slug: "bootstrapping" }, { name: "SaaS", slug: "saas" }],
    upcoming_events: [
      {
        id: "evt-5-1",
        title: "Cold Outbound & Product Hunt 2026 Teardown",
        date: "Saturday, Oct 3",
        time: "11:00 AM - 1:30 PM IST",
        locationName: "Indiranagar Founder Loft",
        description: "Case studies from 2 founders who generated $10k MRR in their first 90 days.",
        rsvpCount: 52,
        isOnline: false,
      }
    ],
    faqs: [
      { question: "Is there an application process?", answer: "Yes, to ensure high trust, we quickly review active product URLs." }
    ]
  },
  {
    id: "comm-6",
    name: "Urban Forest Stewards",
    slug: "urban-forest-stewards",
    short_description: "Citizens planting and nurturing native Miyawaki micro-forests in city park lands.",
    long_description: `We partner with local urban civic bodies and lake defense groups to restore native biodiversity in urban concrete pockets. Our weekend drives involve sapling planting, soil composting, drip irrigation maintenance, and bird counting.\n\nCome get your hands muddy for an greener tomorrow!`,
    category_id: "cat-5",
    location_id: "loc-1",
    logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    member_count: 430,
    meeting_mode: "offline",
    meeting_frequency: "Alternate Saturdays 7:00 AM",
    typical_meeting_time: "Saturday mornings",
    languages: ["Kannada", "English", "Hindi"],
    rules: "1. Wear sturdy gardening gloves and boots.\n2. Carry your own reusable water bottle—zero single-use plastics.\n3. Children are warmly welcome with parent supervision.",
    founded_date: "2023-05-15",
    primary_join_method: "telegram",
    telegram_link: "https://t.me/urban_forest_stewards_example",
    contact_email: "greens@urbanforest.org",
    status: "active",
    is_verified: true,
    created_at: "2024-03-12T07:00:00Z",
    last_activity_at: "2026-09-08T15:00:00Z",
    created_by: "user-admin-01",
    tags: [{ name: "Environment", slug: "environment" }, { name: "Volunteering", slug: "volunteering" }, { name: "Nature", slug: "nature" }],
    upcoming_events: [
      {
        id: "evt-6-1",
        title: "Kaikondrahalli Lake Sapling Mulching Drive",
        date: "Saturday, Sep 19",
        time: "7:00 AM - 9:30 AM IST",
        locationName: "Kaikondrahalli Lake East Entrance, Bellandur",
        description: "Preparing 150 native fig and neem saplings for post-monsoon roots establishment.",
        rsvpCount: 26,
        isOnline: false,
      }
    ],
    faqs: [
      { question: "Do I need prior gardening experience?", answer: "None at all! Our veteran volunteers teach you all proper techniques." }
    ]
  },
  {
    id: "comm-7",
    name: "Mumbai Film Collective",
    slug: "mumbai-film-collective",
    short_description: "Writers, cinematographers, and cinephiles exploring indie screenplays and classic cinema.",
    long_description: `Based in Bandra and Versova, Mumbai Film Collective connects aspiring filmmakers with experienced technicians. We hold bi-weekly table reads of member scripts, hold masterclasses on micro-budget production, and curate weekend screenings of restoration classics followed by lively debates.`,
    category_id: "cat-3",
    location_id: "loc-2",
    logo_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    member_count: 920,
    meeting_mode: "hybrid",
    meeting_frequency: "Alternate Sundays",
    typical_meeting_time: "Sunday 4:00 PM",
    languages: ["English", "Hindi", "Marathi"],
    rules: "1. Constructive critique only—focus on the craft.\n2. Respect intellectual property of scripts shared in private sessions.",
    founded_date: "2021-11-05",
    primary_join_method: "whatsapp",
    whatsapp_link: "https://chat.whatsapp.com/MumbaiFilmExample",
    website_url: "https://mumbaifilmcollective.org",
    status: "active",
    is_verified: true,
    created_at: "2024-02-10T11:00:00Z",
    last_activity_at: "2026-09-11T18:00:00Z",
    created_by: "user-organizer-01",
    tags: [{ name: "Film", slug: "film" }, { name: "Cinema", slug: "cinema" }, { name: "Screenwriting", slug: "screenwriting" }],
    upcoming_events: [
      {
        id: "evt-7-1",
        title: "Short Film Rough-Cut Showcase & Peer Feedback",
        date: "Sunday, Sep 20",
        time: "4:00 PM - 7:00 PM IST",
        locationName: "Bandra West Community Hall",
        description: "Screening three 10-minute rough cuts followed by director Q&A.",
        rsvpCount: 45,
        isOnline: false,
      }
    ],
    faqs: []
  },
  {
    id: "comm-8",
    name: "Sunset Rooftop Yoga",
    slug: "sunset-rooftop-yoga",
    short_description: "Restorative Vinyasa flow and sound bath meditation overlooking the city skyline.",
    long_description: `Escape the urban rush with sunset yoga sessions guided by certified practitioners. We flow through breathwork, dynamic asanas, and conclude with a 20-minute Himalayan singing bowl sound bath as twilight sets in. Suitable for all flexibility levels.`,
    category_id: "cat-2",
    location_id: "loc-6",
    logo_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    member_count: 520,
    meeting_mode: "offline",
    meeting_frequency: "Tuesday & Thursday Sunsets",
    typical_meeting_time: "6:00 PM - 7:15 PM",
    languages: ["English"],
    rules: "1. Please arrive 10 minutes prior to settle your mat.\n2. Phones in silent mode during meditation.",
    founded_date: "2023-03-10",
    primary_join_method: "website",
    website_url: "https://sunsetrooftopyoga.co.uk",
    status: "active",
    is_verified: true,
    created_at: "2024-03-15T09:00:00Z",
    last_activity_at: "2026-09-12T17:30:00Z",
    created_by: "user-admin-01",
    tags: [{ name: "Yoga", slug: "yoga" }, { name: "Meditation", slug: "meditation" }, { name: "Mindfulness", slug: "mindfulness" }],
    upcoming_events: [
      {
        id: "evt-8-1",
        title: "Autumn Equinox Sunset Flow & Tibetan Sound Bowls",
        date: "Thursday, Sep 24",
        time: "6:00 PM - 7:30 PM BST",
        locationName: "Hackney Bridge Rooftop, London",
        description: "75-minute sunset flow with panoramic skyline views.",
        rsvpCount: 38,
        isOnline: false,
      }
    ],
    faqs: []
  },
  {
    id: "comm-9",
    name: "Design Systems Guild",
    slug: "design-systems-guild",
    short_description: "Product designers and front-end architects obsessing over accessibility, tokens, and component libraries.",
    long_description: `An international community of design engineers building cohesive systems at scale. We discuss Figma-to-code token synchronization, headless Radix primitives, sub-pixel typography rendering, and accessible ARIA patterns across modern web and mobile apps.`,
    category_id: "cat-1",
    location_id: "loc-7",
    logo_url: "https://images.unsplash.com/photo-1581291518655-9523c932ded8?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    member_count: 3400,
    meeting_mode: "online",
    meeting_frequency: "Monthly on 2nd Thursday",
    typical_meeting_time: "9:00 AM PST",
    languages: ["English"],
    rules: "1. Focus on real-world system architecture, not dribbble mockups.\n2. Respect design diversity and open source tools.",
    founded_date: "2020-08-15",
    primary_join_method: "discord",
    discord_link: "https://discord.gg/design-systems-example",
    website_url: "https://designsystemsguild.dev",
    status: "active",
    is_verified: true,
    created_at: "2024-01-05T08:00:00Z",
    last_activity_at: "2026-09-12T13:00:00Z",
    created_by: "user-admin-01",
    tags: [{ name: "Design Systems", slug: "design-systems" }, { name: "UI/UX", slug: "ui-ux" }, { name: "Accessibility", slug: "accessibility" }],
    upcoming_events: [
      {
        id: "evt-9-1",
        title: "Tokens Studio & Tailwind CSS v4 Migration Lab",
        date: "Thursday, Oct 8",
        time: "9:00 AM - 10:30 AM PST",
        locationName: "Discord Stage & Interactive FigJam",
        description: "Live teardown of moving multi-brand color tokens into modern CSS variables.",
        rsvpCount: 140,
        isOnline: true,
      }
    ],
    faqs: []
  },
  {
    id: "comm-10",
    name: "Philosophical Sundays",
    slug: "philosophical-sundays",
    short_description: "Gentle Sunday morning discussions exploring existentialism, ethics, Stoicism, and Eastern dialectics.",
    long_description: `No academic pretension required. We pick one timeless dilemma every session—from Camus' Myth of Sisyphus to Nagarjuna's emptiness philosophy—and discuss its application in modern living over cups of warm chai in tranquil gardens.`,
    category_id: "cat-4",
    location_id: "loc-2",
    logo_url: "https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    member_count: 310,
    meeting_mode: "offline",
    meeting_frequency: "Every 2nd Sunday",
    typical_meeting_time: "Sunday 10:30 AM",
    languages: ["English", "Hindi"],
    rules: "1. Assume the person you are listening to might know something you don't.\n2. Disagree with kindness and intellectual humility.",
    founded_date: "2023-07-22",
    primary_join_method: "telegram",
    telegram_link: "https://t.me/philosophical_sundays_example",
    status: "active",
    is_verified: true,
    created_at: "2024-04-01T08:00:00Z",
    last_activity_at: "2026-09-09T11:00:00Z",
    created_by: "user-organizer-01",
    tags: [{ name: "Philosophy", slug: "philosophy" }, { name: "Books", slug: "books" }, { name: "Dialogue", slug: "dialogue" }],
    upcoming_events: [
      {
        id: "evt-10-1",
        title: "Marcus Aurelius: Finding Stillness in Chaos",
        date: "Sunday, Sep 27",
        time: "10:30 AM - 12:30 PM IST",
        locationName: "Horniman Circle Garden, Fort, Mumbai",
        description: "Reading passages from Meditations and discussing everyday composure.",
        rsvpCount: 19,
        isOnline: false,
      }
    ],
    faqs: []
  },
  {
    id: "comm-11",
    name: "Animal Rescue Volunteers",
    slug: "animal-rescue-volunteers",
    short_description: "Compassionate street animal feeding, medical rescue coordination, and adoption drives.",
    long_description: `We connect local animal lovers across Pune to respond to street puppy rescues, emergency veterinary transport, community dog vaccination camps, and foster adoptions. Over 800 street animals have found loving homes through our community network.`,
    category_id: "cat-5",
    location_id: "loc-4",
    logo_url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
    member_count: 1200,
    meeting_mode: "offline",
    meeting_frequency: "Weekly drives & on-demand alerts",
    typical_meeting_time: "Saturday mornings & SOS alerts",
    languages: ["Marathi", "Hindi", "English"],
    rules: "1. Prioritize animal safety and professional veterinary guidance.\n2. Coordinate transparently on emergency medication funds.",
    founded_date: "2022-04-01",
    primary_join_method: "whatsapp",
    whatsapp_link: "https://chat.whatsapp.com/AnimalRescuePuneExample",
    status: "active",
    is_verified: true,
    created_at: "2024-02-28T09:00:00Z",
    last_activity_at: "2026-09-12T15:30:00Z",
    created_by: "user-organizer-01",
    tags: [{ name: "Animals", slug: "animals" }, { name: "Adoption", slug: "adoption" }, { name: "Volunteering", slug: "volunteering" }],
    upcoming_events: [
      {
        id: "evt-11-1",
        title: "Weekend Puppy & Kitten Adoption Camp",
        date: "Saturday, Sep 19",
        time: "11:00 AM - 5:00 PM IST",
        locationName: "Kalyani Nagar Joggers Park Entrance, Pune",
        description: "Meet 15 vaccinated puppies and kittens looking for forever homes.",
        rsvpCount: 54,
        isOnline: false,
      }
    ],
    faqs: []
  },
  {
    id: "comm-12",
    name: "Specialty Coffee Cuppers",
    slug: "specialty-coffee-cuppers",
    short_description: "Roasters, baristas, and coffee enthusiasts exploring single-origin beans, aero-press, and terroir.",
    long_description: `Bangalore's coffee heritage meets modern third-wave specialty brewing. Every month we host blind cupping sessions featuring single-estate Arabicas and washed Robustas from Chikmagalur, Coorg, and Araku Valley.\n\nLearn to distinguish floral jasmine notes from stone-fruit acidity!`,
    category_id: "cat-3",
    location_id: "loc-1",
    logo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=240&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    member_count: 460,
    meeting_mode: "offline",
    meeting_frequency: "Monthly on 3rd Sunday",
    typical_meeting_time: "Sunday 11:00 AM",
    languages: ["English", "Kannada"],
    rules: "1. No heavy perfumes or scented lotions during cupping sessions.\n2. Clean your spoon between tasting bowls.",
    founded_date: "2023-08-12",
    primary_join_method: "whatsapp",
    whatsapp_link: "https://chat.whatsapp.com/CoffeeCuppersExample",
    status: "active",
    is_verified: true,
    created_at: "2024-03-20T10:00:00Z",
    last_activity_at: "2026-09-10T14:00:00Z",
    created_by: "user-admin-01",
    tags: [{ name: "Coffee", slug: "coffee" }, { name: "Food & Drinks", slug: "food-drinks" }, { name: "Artisan", slug: "artisan" }],
    upcoming_events: [
      {
        id: "evt-12-1",
        title: "Monsoon Malabar vs Washed Geisha Blind Tasting",
        date: "Sunday, Sep 20",
        time: "11:00 AM - 1:00 PM IST",
        locationName: "Indiranagar Roastery Lab",
        description: "Cupping 6 fresh roast profiles with roastmaster notes.",
        rsvpCount: 30,
        isOnline: false,
      }
    ],
    faqs: []
  }
];

const INITIAL_REPORTS: StoreReport[] = [
  {
    id: "rep-1",
    community_id: "comm-1",
    community_name: "Cubbon Sunday Riders",
    reported_by: "user-member-01",
    reporter_name: "Priya Menon",
    reason: "Other reason",
    details: "The WhatsApp invite link expired recently, could you ask organizer to refresh it?",
    status: "pending",
    created_at: "2026-09-11T12:00:00Z",
  }
];

// Storage keys
const KEY_COMMUNITIES = "nearloom_store_communities";
const KEY_SAVED = "nearloom_store_saved";
const KEY_REPORTS = "nearloom_store_reports";
const KEY_CURRENT_USER = "nearloom_store_user";
const KEY_VIEWS = "nearloom_store_views";
const KEY_CLICKS = "nearloom_store_clicks";
const KEY_RSVPS = "nearloom_store_rsvps";

class DataStore {
  private communities: StoreCommunity[] = [];
  private categories: StoreCategory[] = INITIAL_CATEGORIES;
  private locations: StoreLocation[] = INITIAL_LOCATIONS;
  private reports: StoreReport[] = [];
  private savedIds: Set<string> = new Set();
  private currentUser: DemoUser | null = null;
  private views: Record<string, number> = {};
  private clicks: Record<string, number> = {};
  private rsvps: Set<string> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === "undefined") return;

    try {
      // Communities
      const savedComm = localStorage.getItem(KEY_COMMUNITIES);
      if (savedComm) {
        this.communities = JSON.parse(savedComm);
      } else {
        this.communities = this.hydrateCommunities(INITIAL_COMMUNITIES);
        this.persistCommunities();
      }

      // Saved bookmarks
      const savedBookmarks = localStorage.getItem(KEY_SAVED);
      if (savedBookmarks) {
        this.savedIds = new Set(JSON.parse(savedBookmarks));
      } else {
        // Pre-save 2 for nice default state
        this.savedIds = new Set(["comm-1", "comm-2"]);
        this.persistSaved();
      }

      // Reports
      const savedReports = localStorage.getItem(KEY_REPORTS);
      if (savedReports) {
        this.reports = JSON.parse(savedReports);
      } else {
        this.reports = INITIAL_REPORTS;
        this.persistReports();
      }

      // Current User
      const user = localStorage.getItem(KEY_CURRENT_USER);
      if (user) {
        this.currentUser = JSON.parse(user);
      } else {
        this.currentUser = DEMO_USERS.organizer; // default to organizer for immediate full experience
        this.persistUser();
      }

      // Views and clicks
      const savedViews = localStorage.getItem(KEY_VIEWS);
      this.views = savedViews ? JSON.parse(savedViews) : { "comm-1": 1840, "comm-2": 960, "comm-3": 720, "comm-5": 1420 };
      
      const savedClicks = localStorage.getItem(KEY_CLICKS);
      this.clicks = savedClicks ? JSON.parse(savedClicks) : { "comm-1": 312, "comm-2": 194, "comm-3": 118, "comm-5": 286 };

      const savedRsvps = localStorage.getItem(KEY_RSVPS);
      this.rsvps = savedRsvps ? new Set(JSON.parse(savedRsvps)) : new Set(["evt-1-1"]);
    } catch (err) {
      console.warn("Failed to initialize local dataStore:", err);
      this.communities = this.hydrateCommunities(INITIAL_COMMUNITIES);
    }
  }

  private hydrateCommunities(list: StoreCommunity[]): StoreCommunity[] {
    return list.map((c) => ({
      ...c,
      categories: this.categories.find((cat) => cat.id === c.category_id) || null,
      locations: this.locations.find((loc) => loc.id === c.location_id) || null,
    }));
  }

  private persistCommunities() {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_COMMUNITIES, JSON.stringify(this.communities));
      window.dispatchEvent(new CustomEvent("nearloom-data-change"));
    }
  }

  private persistSaved() {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_SAVED, JSON.stringify(Array.from(this.savedIds)));
      window.dispatchEvent(new CustomEvent("nearloom-saved-change"));
    }
  }

  private persistReports() {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_REPORTS, JSON.stringify(this.reports));
      window.dispatchEvent(new CustomEvent("nearloom-reports-change"));
    }
  }

  private persistUser() {
    if (typeof window !== "undefined") {
      if (this.currentUser) {
        localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(KEY_CURRENT_USER);
      }
      window.dispatchEvent(new CustomEvent("nearloom-auth-change"));
    }
  }

  // --- Communities API ---

  public getCommunities(options?: {
    query?: string;
    category?: string;
    locationId?: string;
    locationText?: string;
    mode?: string;
    status?: "active" | "pending" | "rejected" | "all";
    sortBy?: "newest" | "popular" | "active";
    limit?: number;
  }): StoreCommunity[] {
    let result = [...this.communities];

    const statusFilter = options?.status || "active";
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (options?.query) {
      const q = options.query.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.short_description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.name.toLowerCase().includes(q)) ||
          c.locations?.city.toLowerCase().includes(q)
      );
    }

    if (options?.category && options.category !== "all") {
      result = result.filter((c) => c.categories?.slug === options.category);
    }

    if (options?.locationId && options.locationId !== "all") {
      result = result.filter((c) => c.location_id === options.locationId);
    }

    if (options?.locationText) {
      const loc = options.locationText.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.locations?.city.toLowerCase().includes(loc) ||
          c.locations?.state.toLowerCase().includes(loc) ||
          c.locations?.country.toLowerCase().includes(loc)
      );
    }

    if (options?.mode && options.mode !== "all") {
      result = result.filter((c) => c.meeting_mode === options.mode);
    }

    if (options?.sortBy === "popular") {
      result.sort((a, b) => b.member_count - a.member_count);
    } else if (options?.sortBy === "active") {
      result.sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  public getCommunityBySlug(slug: string): StoreCommunity | null {
    return this.communities.find((c) => c.slug === slug) || null;
  }

  public getCommunityById(id: string): StoreCommunity | null {
    return this.communities.find((c) => c.id === id) || null;
  }

  public addCommunity(data: {
    name: string;
    short_description: string;
    long_description: string;
    category_id: string;
    location_id: string;
    meeting_mode: "offline" | "online" | "hybrid";
    meeting_frequency: string;
    typical_meeting_time?: string;
    languages: string[];
    member_count: number;
    rules: string;
    whatsapp_link?: string;
    telegram_link?: string;
    discord_link?: string;
    website_url?: string;
    contact_email: string;
    application_form_url?: string;
    primary_join_method: "whatsapp" | "telegram" | "discord" | "website" | "email";
    tags?: string[];
    logo_url?: string;
    cover_image_url?: string;
  }): StoreCommunity {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newId = `comm-${Date.now()}`;
    const category = this.categories.find((c) => c.id === data.category_id);
    const location = this.locations.find((l) => l.id === data.location_id);

    const community: StoreCommunity = {
      id: newId,
      name: data.name,
      slug,
      short_description: data.short_description,
      long_description: data.long_description,
      category_id: data.category_id,
      location_id: data.location_id,
      logo_url: data.logo_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=240&q=80",
      cover_image_url: data.cover_image_url || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
      member_count: data.member_count,
      meeting_mode: data.meeting_mode,
      meeting_frequency: data.meeting_frequency,
      typical_meeting_time: data.typical_meeting_time || "Weekends",
      languages: data.languages.length ? data.languages : ["English"],
      rules: data.rules,
      primary_join_method: data.primary_join_method,
      whatsapp_link: data.whatsapp_link || null,
      telegram_link: data.telegram_link || null,
      discord_link: data.discord_link || null,
      website_url: data.website_url || null,
      contact_email: data.contact_email,
      application_form_url: data.application_form_url || null,
      status: "pending", // submitted for review
      is_verified: false,
      created_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
      created_by: this.currentUser?.id || "user-organizer-01",
      tags: (data.tags || []).map((t) => ({ name: t, slug: t.toLowerCase() })),
      categories: category || null,
      locations: location || null,
      upcoming_events: [
        {
          id: `evt-${Date.now()}`,
          title: "Inaugural Community Meet & Greet",
          date: "Upcoming Sunday",
          time: "5:00 PM - 7:00 PM",
          locationName: location ? `${location.city} Center` : "City Center",
          description: "Welcome session to meet core members and outline upcoming activities.",
          rsvpCount: 12,
          isOnline: data.meeting_mode === "online",
        }
      ],
      faqs: [
        { question: "How can I join?", answer: `Reach out through our primary channel: ${data.primary_join_method}.` }
      ]
    };

    this.communities.unshift(community);
    this.persistCommunities();
    return community;
  }

  public updateCommunityStatus(id: string, status: "active" | "rejected", rejectionReason?: string): boolean {
    const community = this.communities.find((c) => c.id === id);
    if (!community) return false;

    community.status = status;
    if (status === "active") {
      community.is_verified = true;
    }
    this.persistCommunities();
    return true;
  }

  // --- Categories & Locations ---

  public getCategories(): StoreCategory[] {
    return this.categories;
  }

  public getLocations(): StoreLocation[] {
    return this.locations;
  }

  // --- Bookmarking / Saved Circles ---

  public isSaved(communityId: string): boolean {
    return this.savedIds.has(communityId);
  }

  public toggleSave(communityId: string): boolean {
    if (this.savedIds.has(communityId)) {
      this.savedIds.delete(communityId);
    } else {
      this.savedIds.add(communityId);
    }
    this.persistSaved();
    return this.savedIds.has(communityId);
  }

  public getSavedCommunities(): StoreCommunity[] {
    return this.communities.filter((c) => this.savedIds.has(c.id));
  }

  public getManagedCommunities(userId?: string): Array<StoreCommunity & { role: string }> {
    const uid = userId || this.currentUser?.id;
    // Return communities created by the user or sample organizer
    return this.communities
      .filter((c) => c.created_by === uid || uid === "user-organizer-01" && (c.id === "comm-1" || c.id === "comm-3" || c.id === "comm-5"))
      .map((c) => ({ ...c, role: "owner" }));
  }

  // --- Moderation & Reports ---

  public getReports(): StoreReport[] {
    return this.reports;
  }

  public addReport(communityId: string, communityName: string, reason: string, details?: string): StoreReport {
    const newReport: StoreReport = {
      id: `rep-${Date.now()}`,
      community_id: communityId,
      community_name: communityName,
      reported_by: this.currentUser?.id || "guest",
      reporter_name: this.currentUser?.full_name || "Anonymous Guest",
      reason,
      details: details || null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    this.reports.unshift(newReport);
    this.persistReports();
    return newReport;
  }

  public updateReportStatus(reportId: string, status: "reviewed" | "dismissed"): boolean {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return false;
    report.status = status;
    this.persistReports();
    return true;
  }

  // --- Analytics & Views ---

  public recordView(communityId: string) {
    this.views[communityId] = (this.views[communityId] || 0) + 1;
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_VIEWS, JSON.stringify(this.views));
    }
  }

  public recordJoinClick(communityId: string, _method: string) {
    this.clicks[communityId] = (this.clicks[communityId] || 0) + 1;
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_CLICKS, JSON.stringify(this.clicks));
    }
  }

  public getAnalytics(communityIds: string[]): Record<string, { views: number; clicks: number }> {
    const result: Record<string, { views: number; clicks: number }> = {};
    for (const id of communityIds) {
      result[id] = {
        views: this.views[id] || 320,
        clicks: this.clicks[id] || 48,
      };
    }
    return result;
  }

  public getStats() {
    const totalCommunities = this.communities.length;
    const activeCommunities = this.communities.filter((c) => c.status === "active").length;
    const pendingCommunities = this.communities.filter((c) => c.status === "pending").length;
    const totalMembers = this.communities.reduce((acc, curr) => acc + (curr.member_count || 0), 0);
    const totalClicks = Object.values(this.clicks).reduce((a, b) => a + b, 0);

    return {
      totalCommunities,
      activeCommunities,
      pendingCommunities,
      totalUsers: 8450,
      totalMembers,
      totalClicks,
    };
  }

  // --- Events & RSVPs ---

  public isRsvpd(eventId: string): boolean {
    return this.rsvps.has(eventId);
  }

  public toggleRsvp(communityId: string, eventId: string): boolean {
    const comm = this.communities.find((c) => c.id === communityId);
    const evt = comm?.upcoming_events.find((e) => e.id === eventId);

    if (this.rsvps.has(eventId)) {
      this.rsvps.delete(eventId);
      if (evt && evt.rsvpCount > 0) evt.rsvpCount -= 1;
    } else {
      this.rsvps.add(eventId);
      if (evt) evt.rsvpCount += 1;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_RSVPS, JSON.stringify(Array.from(this.rsvps)));
      window.dispatchEvent(new CustomEvent("nearloom-data-change"));
    }
    return this.rsvps.has(eventId);
  }

  // --- Demo Auth ---

  public getCurrentUser(): DemoUser | null {
    return this.currentUser;
  }

  public switchDemoUser(role: "platform_admin" | "organizer" | "member" | "guest"): DemoUser | null {
    if (role === "guest") {
      this.currentUser = null;
    } else if (role === "platform_admin") {
      this.currentUser = DEMO_USERS.admin;
    } else if (role === "organizer") {
      this.currentUser = DEMO_USERS.organizer;
    } else {
      this.currentUser = DEMO_USERS.member;
    }
    this.persistUser();
    return this.currentUser;
  }

  public updateCurrentUser(updates: Partial<DemoUser>): DemoUser | null {
    if (!this.currentUser) return null;
    this.currentUser = { ...this.currentUser, ...updates };
    this.persistUser();
    return this.currentUser;
  }

  public signOut(): void {
    this.currentUser = null;
    this.persistUser();
  }
}

export const dataStore = new DataStore();
