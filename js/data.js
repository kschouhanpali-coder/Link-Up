// =========================================================
// LinkedIn Clone - State & Initial Seed Data
// =========================================================

const DEFAULT_USER = {
  name: "Alex Rivera",
  headline: "Senior Staff AI Engineer @ Anthropic | Ex-Google Brain",
  about: "Passionate about foundation models, autonomous agents, and high-performance distributed systems. 10+ years engineering scalable cloud backends.",
  location: "San Francisco, CA",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
};

// ── Data version: bump this to force-refresh localStorage seed data ─────────
const DATA_VERSION = "v3";

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Alex Rivera",
    headline: "Senior Staff AI Engineer @ Anthropic | Ex-Google Brain",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    time: "Just now",
    content: "🚀 Excited to announce our newest release! After 8 months of hard work, we just open-sourced our autonomous agent workflow engine.\n\nKey highlights:\n✨ Native parallel execution across distributed nodes\n⚡ Sub-10ms memory retrieval pipeline\n🛡️ Enterprise grade sandbox environment\n\nHuge shoutout to the engineering team for making this milestone possible. Link in comments! 👇\n\n#AI #OpenSource #SoftwareEngineering #TechInnovation",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    likes: 147,
    userLiked: false,
    reposts: 23,
    comments: [
      { name: "Priya Sharma", text: "Incredible accomplishment Alex! Looking forward to testing this on our staging cluster." },
      { name: "David Kim", text: "Clean architecture. Huge win for the open source community!" }
    ]
  },
  {
    id: 2,
    author: "Priya Sharma",
    headline: "VP of Product @ Stripe | Building Global Financial Infrastructure",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    time: "2h ago",
    content: "Watch our product architecture walk-through in under 1 minute! 🎥\n\nWe wanted to show how modern payment orchestration can handle millions of concurrent webhook events with zero downtime.\n\nTake a look and let us know your thoughts in the comments! #ProductDesign #Engineering #FinTech",
    mediaType: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 293,
    userLiked: true,
    reposts: 41,
    comments: [
      { name: "Alex Rivera", text: "Brilliant demo Priya! That latency profile is ultra impressive." },
      { name: "Marcus Vance", text: "The zero-downtime failover is a game-changer for fintech!" }
    ]
  },
  {
    id: 3,
    author: "Marcus Vance",
    headline: "Principal Research Scientist @ Google DeepMind",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    time: "1d ago",
    content: "Proud of our team at DeepMind for the incredible breakthrough published today in Nature. 🧠\n\nOur cooperative multi-agent model demonstrated emergent reasoning skills across complex mathematical proofs without human intervention.\n\nThe future of automated science is closer than we think.\n\n#MachineLearning #Research #DeepMind #FutureOfTech",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
    mediaUrls: [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80"
    ],
    likes: 582,
    userLiked: false,
    reposts: 88,
    comments: [
      { name: "Elena Rostova", text: "Inspiring work as always Marcus! Congratulations to the whole research group." }
    ]
  },
  {
    id: 4,
    author: "Elena Rostova",
    headline: "Head of Infrastructure & Cloud Systems @ CloudScale",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    time: "3h ago",
    content: "Just wrapped up migrating 200+ microservices to our new Kubernetes multi-cluster setup. ☁️\n\nLessons learned:\n🔧 Blue-green deploys saved us at least 3 times\n📊 Observability-first mindset is non-negotiable\n🚨 Alerts without runbooks = noise\n\nHappy to share the full migration playbook — DM me!\n\n#Kubernetes #CloudNative #DevOps #SRE",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    likes: 214,
    userLiked: false,
    reposts: 37,
    comments: [
      { name: "Alex Rivera", text: "Would love to see that playbook Elena, DM sent!" },
      { name: "Priya Sharma", text: "Blue-green deploys are absolutely essential. Great writeup." }
    ]
  },
  {
    id: 5,
    author: "David Kim",
    headline: "Staff Software Engineer @ Netflix | Streaming Infrastructure",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    time: "5h ago",
    content: "Hot take: the best system design interview question isn't about system design at all.\n\nIt's about how you communicate trade-offs.\n\nI've interviewed 300+ candidates. The ones who get hired aren't always the most technically brilliant — they're the ones who can explain WHY they chose a solution, not just WHAT they built.\n\nCommunication is a technical skill. Start practicing it now.\n\n#SoftwareEngineering #TechInterviews #CareerAdvice #Leadership",
    mediaType: "none",
    mediaUrl: "",
    likes: 1847,
    userLiked: false,
    reposts: 312,
    comments: [
      { name: "Marcus Vance", text: "100% agree. Communication under pressure separates great engineers from good ones." },
      { name: "Elena Rostova", text: "This should be pinned everywhere. So true." }
    ]
  },
  {
    id: 6,
    author: "Sarah Chen",
    headline: "Product Designer @ Figma | Design Systems & Accessibility",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    time: "1d ago",
    content: "I redesigned our entire onboarding flow from scratch — here's what a difference accessibility-first thinking makes. 🎨\n\nBefore: 62% drop-off at step 2\nAfter: 89% completion rate\n\nSome key changes:\n✅ Increased contrast ratios across all CTAs\n✅ Keyboard navigation throughout\n✅ Reduced cognitive load with progressive disclosure\n\nAccessibility isn't a feature — it's the foundation.\n\n#ProductDesign #UX #Accessibility #Figma",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&auto=format&fit=crop&q=80",
    mediaUrls: [
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&auto=format&fit=crop&q=80"
    ],
    likes: 934,
    userLiked: false,
    reposts: 156,
    comments: [
      { name: "Priya Sharma", text: "Those numbers speak for themselves. Incredible impact Sarah!" },
      { name: "David Kim", text: "Accessibility-first is how every product should be built. Sharing this." }
    ]
  }
];

const JOBS = [
  {
    title: "Senior AI Research Scientist",
    company: "Google DeepMind",
    location: "London, UK (Hybrid)",
    salary: "$240,000 - $310,000 / yr",
    posted: "2 days ago • 42 applicants",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80"
  },
  {
    title: "Staff Distributed Systems Engineer",
    company: "Anthropic",
    location: "San Francisco, CA (Hybrid)",
    salary: "$270,000 - $350,000 / yr",
    posted: "1 day ago • 19 applicants",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
  },
  {
    title: "Lead Machine Learning Architect",
    company: "OpenAI",
    location: "San Francisco, CA (On-site)",
    salary: "$290,000 - $380,000 / yr",
    posted: "3 days ago • 64 applicants",
    logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80"
  },
  {
    title: "Principal Full Stack Engineer",
    company: "Stripe",
    location: "Seattle, WA (Remote)",
    salary: "$220,000 - $285,000 / yr",
    posted: "4 days ago • 53 applicants",
    logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80"
  }
];

const CHAT_USERS = [
  { id: 1, name: "Priya Sharma", headline: "VP of Product @ Stripe", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80", msgs: [
    { sender: "them", text: "Hey Alex! Loved your post about the distributed workflow engine." },
    { sender: "me", text: "Thanks Priya! Really excited to get community feedback on it." },
    { sender: "them", text: "Are you guys planning to integrate native WebHook orchestration next?" },
    { sender: "me", text: "Yes, exactly! That's slotted for our v0.4 sprint." }
  ]},
  { id: 2, name: "Marcus Vance", headline: "Principal Scientist @ DeepMind", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", msgs: [
    { sender: "them", text: "Alex, let's catch up next week regarding the benchmark comparisons." },
    { sender: "me", text: "Sounds great Marcus! Tuesday works well on my end." }
  ]},
  { id: 3, name: "Elena Rostova", headline: "Head of Engineering @ CloudScale", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80", msgs: [
    { sender: "them", text: "Hi Alex, quick question on your distributed memory caching approach." }
  ]}
];

// Initial Certifications
const DEFAULT_CERTIFICATIONS = [
  {
    id: 1,
    name: "AWS Certified Solutions Architect – Professional",
    organization: "Amazon Web Services (AWS)",
    issueDate: "Issued Jan 2024 • No Expiration Date",
    credentialId: "AWS-78945612",
    credentialUrl: "https://aws.amazon.com/verification",
    logo: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Deep Learning Specialization",
    organization: "DeepLearning.AI",
    issueDate: "Issued Aug 2023",
    credentialId: "DL-98214301",
    credentialUrl: "https://coursera.org/verify",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80"
  }
];

// Initial Skills
const DEFAULT_SKILLS = [
  { id: 1, name: "Artificial Intelligence (AI)", endorsements: 48 },
  { id: 2, name: "Large Language Models (LLMs)", endorsements: 36 },
  { id: 3, name: "Distributed Systems", endorsements: 29 },
  { id: 4, name: "Python", endorsements: 54 },
  { id: 5, name: "Machine Learning", endorsements: 41 },
  { id: 6, name: "System Architecture", endorsements: 22 }
];

// ── Version guard: flush stale posts if data version changed ────────────────
if (localStorage.getItem("lk_data_version") !== DATA_VERSION) {
  localStorage.removeItem("lk_posts");
  localStorage.setItem("lk_data_version", DATA_VERSION);
}

// LocalStorage Persistent State
let currentUser = (typeof getActiveUser === "function") ? getActiveUser() : (JSON.parse(localStorage.getItem("lk_user")) || DEFAULT_USER);
let posts = JSON.parse(localStorage.getItem("lk_posts")) || INITIAL_POSTS;
let certifications = JSON.parse(localStorage.getItem("lk_certifications")) || DEFAULT_CERTIFICATIONS;
let skills = JSON.parse(localStorage.getItem("lk_skills")) || DEFAULT_SKILLS;
let activeChatIndex = 0;

// Transient Modal & Creation States
let pendingMedia = { type: "none", url: "", filename: "" };
let pendingMediaList = []; // Array of { type: "image"|"video", url: string, filename: string }

let editingPostIndex = null;
let editingPostId = null;
let editPendingMedia = { type: "none", url: "", filename: "" };
let editPendingMediaList = []; // Array of { type: "image"|"video", url: string, filename: string }

let deletingPostIndex = null;
let deletingPostId = null;
let activeRepostIndex = null;
let activeSendIndex = null;
let selectedSendConnectionId = null;

// Lightbox Multi-image Gallery State
let lightboxImages = [];
let currentLightboxIndex = 0;

// Toast Utility Notification
function showToast(msg) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-msg");
  if (!toast || !msgEl) return;
  msgEl.innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}
