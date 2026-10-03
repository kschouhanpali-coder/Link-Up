// =========================================================
// LinkedIn Clone - Authentication & Session Management
// =========================================================

const SEED_USERS = [
  {
    id: 1,
    email: "alex@tech.io",
    password: "password123",
    name: "Alex Rivera",
    headline: "Senior Staff AI Engineer @ Anthropic | Ex-Google Brain",
    about: "Passionate about foundation models, autonomous agents, and high-performance distributed systems. 10+ years engineering scalable cloud backends.",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    email: "priya@stripe.com",
    password: "password123",
    name: "Priya Sharma",
    headline: "VP of Product @ Stripe | Building Global Financial Infrastructure",
    about: "Building fintech products that empower millions of entrepreneurs worldwide. Angel investor in early-stage developer tools.",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    email: "marcus@deepmind.com",
    password: "password123",
    name: "Marcus Vance",
    headline: "Principal Research Scientist @ Google DeepMind",
    about: "Researching emergent cognitive behaviors in multi-agent reinforcement learning architectures.",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    email: "elena@cloudscale.io",
    password: "password123",
    name: "Elena Rostova",
    headline: "Head of Infrastructure & Cloud Systems @ CloudScale",
    about: "Kubernetes, distributed low-latency caching, high reliability engineering at hyper scale.",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80"
  }
];

// Initialize users storage if empty
function getRegisteredUsers() {
  const stored = localStorage.getItem("lk_users");
  if (!stored) {
    localStorage.setItem("lk_users", JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem("lk_users", JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem("lk_users", JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem("lk_users", JSON.stringify(users));
}

// Check session state
function isUserLoggedIn() {
  const loggedInFlag = localStorage.getItem("lk_logged_in");
  const user = localStorage.getItem("lk_user");
  return loggedInFlag === "true" && !!user;
}

// Get current active user
function getActiveUser() {
  const stored = localStorage.getItem("lk_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // Fallback
    }
  }
  const users = getRegisteredUsers();
  return users[0] || SEED_USERS[0];
}

// Log in with email and password
async function authLogin(email, password, rememberMe = true) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: "Please enter both email and password." };
  }

  // Attempt backend FastAPI login if accessible
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const resp = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (resp.ok) {
      const data = await resp.json();
      console.log("Authenticated via backend API:", data);
    }
  } catch (err) {
    // Backend offline; continue with local storage auth
  }

  // Verify against local storage users
  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    return { success: false, error: "Couldn't find a LinkedIn account associated with this email." };
  }

  if (found.password !== cleanPass) {
    return { success: false, error: "Incorrect password. Please double check and try again." };
  }

  // Set session
  localStorage.setItem("lk_logged_in", "true");
  localStorage.setItem("lk_user", JSON.stringify(found));
  if (rememberMe) {
    localStorage.setItem("lk_remembered_email", cleanEmail);
  } else {
    localStorage.removeItem("lk_remembered_email");
  }

  return { success: true, user: found };
}

// Register a new user
async function authSignup(data) {
  const { name, email, password, headline, location } = data;
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();
  const cleanHeadline = (headline || "Member at LinkedIn Community").trim();
  const cleanLocation = (location || "San Francisco Bay Area").trim();

  if (!cleanName) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!cleanPass || cleanPass.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: "An account with this email already exists. Try signing in." };
  }

  // Default avatars based on name or sleek modern generator
  const avatarSeed = encodeURIComponent(cleanName);
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  const bannerUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";

  const newUser = {
    id: Date.now(),
    name: cleanName,
    email: cleanEmail,
    password: cleanPass,
    headline: cleanHeadline,
    about: `Passionate professional exploring opportunities, networking, and innovation. Connect with me on LinkedIn!`,
    location: cleanLocation,
    avatar: avatarUrl,
    banner: bannerUrl
  };

  // Attempt backend FastAPI signup if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const resp = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password: cleanPass, name: cleanName }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (resp.ok) {
      const respData = await resp.json();
      if (respData.user_id) newUser.id = respData.user_id;
    }
  } catch (err) {
    // Backend offline; continue with local storage
  }

  users.push(newUser);
  saveRegisteredUsers(users);

  // Set active session
  localStorage.setItem("lk_logged_in", "true");
  localStorage.setItem("lk_user", JSON.stringify(newUser));

  return { success: true, user: newUser };
}

// Log out user
function authLogout() {
  localStorage.setItem("lk_logged_in", "false");
  // Keep registered users and data intact, redirect to login
  window.location.href = "login.html?logged_out=true";
}

// Reset password simulation
function authResetPassword(email, newPassword) {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return { success: false, error: "No account found with this email." };
  }
  user.password = newPassword || "password123";
  saveRegisteredUsers(users);
  return { success: true, message: "Password updated successfully! You can now sign in with your new password." };
}

// Quick 1-click login for demo purposes
function quickDemoLogin(email) {
  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    localStorage.setItem("lk_logged_in", "true");
    localStorage.setItem("lk_user", JSON.stringify(found));
    window.location.href = "index.html?welcome=true";
  }
}

// Manage the "Me ▾" dropdown on index.html
function toggleMeDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById("me-dropdown-menu");
  if (!dropdown) return;
  dropdown.classList.toggle("hidden");
}

function closeMeDropdown() {
  const dropdown = document.getElementById("me-dropdown-menu");
  if (dropdown && !dropdown.classList.contains("hidden")) {
    dropdown.classList.add("hidden");
  }
}

// Close dropdown when clicking outside
window.addEventListener("click", (e) => {
  const dropdown = document.getElementById("me-dropdown-menu");
  const navProfileBtn = document.getElementById("nav-profile");
  if (dropdown && !dropdown.classList.contains("hidden")) {
    if (!dropdown.contains(e.target) && (!navProfileBtn || !navProfileBtn.contains(e.target))) {
      dropdown.classList.add("hidden");
    }
  }
});

// Update Header / Navbar Auth UI based on session
function updateNavAuthUI() {
  const loggedIn = isUserLoggedIn();
  const authButtons = document.getElementById("nav-auth-buttons");
  const profileContainer = document.getElementById("nav-profile-container");
  const guestBanner = document.getElementById("guest-alert-banner");
  
  if (authButtons) {
    authButtons.classList.toggle("hidden", loggedIn);
  }
  if (guestBanner) {
    guestBanner.classList.toggle("hidden", loggedIn);
  }
}

