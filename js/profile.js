// =========================================================
// LinkedIn Clone - Profile Management & User Posts Handlers
// =========================================================

// Direct quick-upload from profile page (banner/avatar overlays)
function handleDirectBannerUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    currentUser.banner = e.target.result;
    localStorage.setItem("lk_user", JSON.stringify(currentUser));
    updateUserUI();
    showToast("Banner photo updated! ✨");
  };
  reader.readAsDataURL(file);
}

function handleDirectAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    currentUser.avatar = e.target.result;
    localStorage.setItem("lk_user", JSON.stringify(currentUser));
    updateUserUI();
    showToast("Profile photo updated! ✨");
  };
  reader.readAsDataURL(file);
}

// Edit Profile Modal helpers
function syncAvatarPreview(url) {
  const el = document.getElementById("edit-avatar-preview");
  if (url && el) el.src = url;
}

function syncBannerPreview(url) {
  const el = document.getElementById("edit-banner-preview");
  if (url && el) el.src = url;
}

function handleEditAvatarFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById("edit-avatar-preview");
    const input = document.getElementById("edit-avatar");
    if (preview) preview.src = e.target.result;
    if (input) input.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleEditBannerFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById("edit-banner-preview");
    const input = document.getElementById("edit-banner");
    if (preview) preview.src = e.target.result;
    if (input) input.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Edit Profile Modal open / close / save
function openEditProfileModal() {
  document.getElementById("edit-name").value = currentUser.name;
  document.getElementById("edit-headline").value = currentUser.headline;
  document.getElementById("edit-location").value = currentUser.location;
  document.getElementById("edit-about").value = currentUser.about;
  document.getElementById("edit-avatar").value = currentUser.avatar;
  document.getElementById("edit-banner").value = currentUser.banner;
  document.getElementById("edit-avatar-preview").src = currentUser.avatar;
  document.getElementById("edit-banner-preview").src = currentUser.banner;
  document.getElementById("edit-profile-modal").classList.remove("hidden");
}

function closeEditProfileModal() {
  document.getElementById("edit-profile-modal").classList.add("hidden");
}

function saveProfileChanges() {
  currentUser.name     = document.getElementById("edit-name").value.trim()     || currentUser.name;
  currentUser.headline = document.getElementById("edit-headline").value.trim() || currentUser.headline;
  currentUser.location = document.getElementById("edit-location").value.trim() || currentUser.location;
  currentUser.about    = document.getElementById("edit-about").value.trim()    || currentUser.about;
  currentUser.avatar   = document.getElementById("edit-avatar").value.trim()   || currentUser.avatar;
  currentUser.banner   = document.getElementById("edit-banner").value.trim()   || currentUser.banner;

  localStorage.setItem("lk_user", JSON.stringify(currentUser));
  updateUserUI();
  closeEditProfileModal();
  showToast("Profile updated successfully! ✅");
}

function updateUserUI() {
  const setIf = (id, prop, val) => {
    const el = document.getElementById(id);
    if (el) el[prop] = val;
  };

  setIf("sidebar-name", "innerText", currentUser.name);
  setIf("sidebar-headline", "innerText", currentUser.headline);
  setIf("sidebar-avatar", "src", currentUser.avatar);
  setIf("sidebar-banner", "src", currentUser.banner);
  setIf("nav-avatar", "src", currentUser.avatar);
  setIf("postbox-avatar", "src", currentUser.avatar);

  setIf("profile-name-text", "innerText", currentUser.name);
  setIf("profile-headline-text", "innerText", currentUser.headline);
  setIf("profile-location-text", "innerText", currentUser.location);
  setIf("profile-about-text", "innerText", currentUser.about);
  setIf("profile-avatar-img", "src", currentUser.avatar);
  setIf("profile-banner-img", "src", currentUser.banner);

  setIf("dropdown-avatar", "src", currentUser.avatar);
  setIf("dropdown-name", "innerText", currentUser.name);
  setIf("dropdown-headline", "innerText", currentUser.headline);

  renderProfilePosts();
  renderCertifications();
  renderSkills();
}

// Render current user's posts on the Profile page
function renderProfilePosts() {
  const container = document.getElementById("profile-posts-list");
  const emptyMsg  = document.getElementById("profile-posts-empty");
  const countBadge = document.getElementById("profile-posts-count");
  if (!container) return;

  // Filter posts authored by current user
  const myPosts = posts.filter(p => p.author === currentUser.name);

  if (countBadge) {
    countBadge.innerText = `${myPosts.length} post${myPosts.length !== 1 ? 's' : ''}`;
  }

  if (myPosts.length === 0) {
    container.innerHTML = '';
    if (emptyMsg) emptyMsg.classList.remove('hidden');
    return;
  }
  if (emptyMsg) emptyMsg.classList.add('hidden');

  container.innerHTML = myPosts.map(post => {
    const originalIndex = posts.findIndex(p => p.id === post.id);
    const quotedCardHtml = post.isRepost ? buildQuotedPostHtml(post) : '';
    const directMediaHtml = post.isRepost ? '' : buildMediaHtml(post.mediaType, post.mediaUrl, false, post.mediaUrls);

    const likesCount    = post.likes    || 0;
    const commentsCount = (post.comments || []).length;
    const repostsCount  = post.reposts  || 0;

    return `
      <div class="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-2.5">
        <!-- Repost banner (if repost) -->
        ${post.isRepost ? `
          <div class="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold pb-1 border-b border-gray-100">
            <i class="fa-solid fa-repeat text-[#0a66c2]"></i>
            <span>You reposted this</span>
          </div>` : ''}

        <!-- Post header with actions -->
        <div class="flex items-start justify-between w-full">
          <div class="flex items-center gap-3">
            <img src="${post.avatar}" class="w-10 h-10 rounded-full object-cover border" />
            <div>
              <p class="text-sm font-bold text-gray-900">${post.author}</p>
              <p class="text-[11px] text-gray-400">${post.time} • <i class="fa-solid fa-earth-americas"></i></p>
            </div>
          </div>

          <!-- Three Dots Dropdown (Edit & Delete Post) -->
          <div class="relative">
            <button onclick="togglePostMenu(event, 'prof-${post.id}')" class="text-gray-400 hover:text-black p-1 text-base rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
            <div id="post-menu-prof-${post.id}" class="post-dropdown-menu absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40 hidden z-20">
              <button onclick="openEditPostModal(${originalIndex})" class="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium transition-colors">
                <i class="fa-regular fa-pen-to-square text-[#0a66c2]"></i> Edit post
              </button>
              <button onclick="promptDeletePost(${originalIndex})" class="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium transition-colors">
                <i class="fa-regular fa-trash-can"></i> Delete post
              </button>
            </div>
          </div>
        </div>

        <!-- Reposter's thought or normal post text -->
        ${post.content ? `<p class="text-sm text-gray-800 whitespace-pre-line leading-relaxed">${post.content}</p>` : ''}
        
        <!-- Quoted original post card (for reposts) or direct media (for normal posts) -->
        ${quotedCardHtml}
        ${directMediaHtml}

        <!-- Stats bar -->
        <div class="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t mt-1">
          <span class="flex items-center gap-1"><span class="bg-[#0a66c2] text-white rounded-full px-1 text-[10px]">👍</span> ${likesCount}</span>
          <span>${commentsCount} comment${commentsCount !== 1 ? 's' : ''}</span>
          <span>${repostsCount} repost${repostsCount !== 1 ? 's' : ''}</span>
        </div>
      </div>`;
  }).join('');
}

// =========================================================
// Licenses & Certifications Handlers
// =========================================================

function renderCertifications() {
  const container = document.getElementById("profile-certifications-list");
  const emptyState = document.getElementById("profile-certifications-empty");
  const countBadge = document.getElementById("certifications-count");
  if (!container) return;

  if (countBadge) {
    countBadge.innerText = `${certifications.length}`;
  }

  if (!certifications || certifications.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if (emptyState) emptyState.classList.add("hidden");

  container.innerHTML = certifications.map(cert => {
    const logoHtml = `
      <div class="w-12 h-12 rounded bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-xl shrink-0 overflow-hidden relative">
        <i class="fa-solid fa-award"></i>
        ${cert.logo ? `<img src="${cert.logo}" alt="" class="absolute inset-0 w-full h-full object-cover bg-white" onerror="this.remove()" />` : ''}
      </div>`;

    const credentialLinkHtml = cert.credentialUrl
      ? `<div class="mt-2.5">
          <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black border border-gray-400 hover:border-gray-700 rounded-full px-3.5 py-1 transition-colors">
            Show credential <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>`
      : '';

    const credIdHtml = cert.credentialId
      ? `<p class="text-xs text-gray-500 mt-0.5">Credential ID: <span class="font-mono text-gray-700">${cert.credentialId}</span></p>`
      : '';

    return `
      <div class="flex items-start justify-between gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          ${logoHtml}
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm text-gray-900 leading-snug">${cert.name}</h4>
            <p class="text-xs text-gray-700 mt-0.5">${cert.organization}</p>
            ${cert.issueDate ? `<p class="text-xs text-gray-400 mt-0.5">${cert.issueDate}</p>` : ''}
            ${credIdHtml}
            ${credentialLinkHtml}
          </div>
        </div>
        <button onclick="removeCertification(${cert.id})" title="Remove certification" class="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors shrink-0">
          <i class="fa-regular fa-trash-can text-sm"></i>
        </button>
      </div>
    `;
  }).join("");
}

function openAddCertModal() {
  const modal = document.getElementById("add-cert-modal");
  if (!modal) return;
  document.getElementById("cert-name-input").value = "";
  document.getElementById("cert-org-input").value = "";
  document.getElementById("cert-date-input").value = "";
  document.getElementById("cert-id-input").value = "";
  document.getElementById("cert-url-input").value = "";
  document.getElementById("cert-logo-input").value = "";
  modal.classList.remove("hidden");
  setTimeout(() => document.getElementById("cert-name-input").focus(), 50);
}

function closeAddCertModal() {
  const modal = document.getElementById("add-cert-modal");
  if (modal) modal.classList.add("hidden");
}

function saveNewCertification() {
  const name = document.getElementById("cert-name-input").value.trim();
  const org = document.getElementById("cert-org-input").value.trim();
  const date = document.getElementById("cert-date-input").value.trim();
  const id = document.getElementById("cert-id-input").value.trim();
  const url = document.getElementById("cert-url-input").value.trim();
  const logo = document.getElementById("cert-logo-input").value.trim();

  if (!name) {
    showToast("Please enter certification name");
    return;
  }
  if (!org) {
    showToast("Please enter issuing organization");
    return;
  }

  const newCert = {
    id: Date.now(),
    name: name,
    organization: org,
    issueDate: date ? (date.toLowerCase().startsWith("issued") ? date : `Issued ${date}`) : "",
    credentialId: id,
    credentialUrl: url,
    logo: logo || "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=80"
  };

  certifications.unshift(newCert);
  localStorage.setItem("lk_certifications", JSON.stringify(certifications));
  renderCertifications();
  closeAddCertModal();
  showToast("Certification added successfully! 🏆");
}

function removeCertification(certId) {
  certifications = certifications.filter(c => c.id !== certId);
  localStorage.setItem("lk_certifications", JSON.stringify(certifications));
  renderCertifications();
  showToast("Certification removed 🗑️");
}

// =========================================================
// Skills Handlers
// =========================================================

const POPULAR_SKILLS = [
  "React.js", "TypeScript", "Node.js", "GraphQL", "Kubernetes",
  "Docker", "FastAPI", "Next.js", "PostgreSQL", "PyTorch", "Tailwind CSS", "Go (Golang)"
];

function renderSkills() {
  const container = document.getElementById("profile-skills-list");
  const emptyState = document.getElementById("profile-skills-empty");
  const countBadge = document.getElementById("skills-count");
  if (!container) return;

  if (countBadge) {
    countBadge.innerText = `${skills.length}`;
  }

  if (!skills || skills.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if (emptyState) emptyState.classList.add("hidden");

  container.innerHTML = skills.map(skill => {
    return `
      <div class="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50 shadow-2xs transition-all group w-full">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-[#0a66c2] flex items-center justify-center text-sm font-bold shrink-0">
            <i class="fa-solid fa-bolt text-xs"></i>
          </div>
          <div class="min-w-0">
            <h4 class="font-bold text-sm text-gray-900 truncate">${skill.name}</h4>
            <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
              <span>${skill.endorsements || 0} endorsements</span>
              <span class="text-gray-300">•</span>
              <span class="text-gray-400">Passed skill assessment</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="endorseSkill(${skill.id})" class="text-xs font-semibold text-[#0a66c2] hover:text-[#004182] border border-[#0a66c2] hover:bg-blue-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1" title="Endorse this skill">
            <i class="fa-regular fa-thumbs-up text-xs"></i> Endorse
          </button>
          <button onclick="removeSkill(${skill.id})" title="Remove skill" class="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
            <i class="fa-regular fa-trash-can text-sm"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function openAddSkillModal() {
  const modal = document.getElementById("add-skill-modal");
  if (!modal) return;
  document.getElementById("skill-name-input").value = "";
  
  // Render suggestions not already added
  const currentNames = skills.map(s => s.name.toLowerCase());
  const suggestionsBox = document.getElementById("skill-suggestions");
  if (suggestionsBox) {
    const unadded = POPULAR_SKILLS.filter(s => !currentNames.includes(s.toLowerCase()));
    suggestionsBox.innerHTML = unadded.map(name => `
      <button type="button" onclick="saveNewSkill('${name}')" class="text-xs font-semibold bg-gray-100 hover:bg-blue-50 hover:text-[#0a66c2] border border-gray-200 hover:border-blue-200 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
        <i class="fa-solid fa-plus text-[10px]"></i> ${name}
      </button>
    `).join("");
  }

  modal.classList.remove("hidden");
  setTimeout(() => document.getElementById("skill-name-input").focus(), 50);
}

function closeAddSkillModal() {
  const modal = document.getElementById("add-skill-modal");
  if (modal) modal.classList.add("hidden");
}

function saveNewSkill(prefilledName) {
  const input = document.getElementById("skill-name-input");
  const name = prefilledName || (input ? input.value.trim() : "");
  if (!name) {
    showToast("Please enter a skill name");
    return;
  }

  const exists = skills.some(s => s.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    showToast(`"${name}" is already in your skills list!`);
    return;
  }

  const newSkill = {
    id: Date.now(),
    name: name,
    endorsements: 1
  };

  skills.unshift(newSkill);
  localStorage.setItem("lk_skills", JSON.stringify(skills));
  renderSkills();
  closeAddSkillModal();
  showToast(`Skill "${name}" added! 💡`);
}

function removeSkill(skillId) {
  skills = skills.filter(s => s.id !== skillId);
  localStorage.setItem("lk_skills", JSON.stringify(skills));
  renderSkills();
  showToast("Skill removed 🗑️");
}

function endorseSkill(skillId) {
  const target = skills.find(s => s.id === skillId);
  if (!target) return;
  target.endorsements = (target.endorsements || 0) + 1;
  localStorage.setItem("lk_skills", JSON.stringify(skills));
  renderSkills();
  showToast(`Endorsed ${target.name}! 👍`);
}

