// =========================================================
// LinkedIn Clone - Main Application Controller & Bootstrapper
// =========================================================

// Switch active navigation tab
function switchTab(tabId) {
  const views = ["feed", "jobs", "messaging", "notifications", "network", "profile"];
  views.forEach(v => {
    const el = document.getElementById("view-" + v);
    const nav = document.getElementById("nav-" + v);
    if (el) el.classList.toggle("hidden", v !== tabId);
    if (nav) nav.classList.toggle("active-tab", v === tabId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Global Application Initialization on DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  if (typeof fixRepostsData === "function") {
    fixRepostsData();
  }
  updateUserUI();
  renderPosts();
  renderProfilePosts();
  if (typeof renderCertifications === "function") renderCertifications();
  if (typeof renderSkills === "function") renderSkills();
  renderJobs();
  renderChat();
  renderNotifications();
  renderNetwork();

  // Check auth query parameters
  const params = new URLSearchParams(window.location.search);
  if (params.get("welcome") === "true") {
    setTimeout(() => {
      showToast("Welcome back, " + currentUser.name + "! 👋");
    }, 400);
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (params.get("welcome") === "new") {
    setTimeout(() => {
      showToast("Welcome to LinkedIn, " + currentUser.name + "! 🎉");
    }, 400);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Update navbar auth state
  if (typeof updateNavAuthUI === "function") {
    updateNavAuthUI();
  }
});

