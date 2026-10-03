// ── Job Application State ─────────────────────────────────────────────────────
let currentApplyJob = null;
let appliedJobs = JSON.parse(localStorage.getItem('lk_applied_jobs') || '[]');

// All jobs data (extended)
const ALL_JOBS = [
  {
    title: "Senior AI Research Scientist",
    company: "Google DeepMind",
    location: "London, UK (Hybrid)",
    salary: "$240,000 - $310,000 / yr",
    posted: "2 days ago • 42 applicants",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80",
    type: "Full-time", skills: ["Machine Learning", "Python", "Research"]
  },
  {
    title: "Staff Distributed Systems Engineer",
    company: "Anthropic",
    location: "San Francisco, CA (Hybrid)",
    salary: "$270,000 - $350,000 / yr",
    posted: "1 day ago • 19 applicants",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    type: "Full-time", skills: ["Distributed Systems", "Go", "Kubernetes"]
  },
  {
    title: "Lead Machine Learning Architect",
    company: "OpenAI",
    location: "San Francisco, CA (On-site)",
    salary: "$290,000 - $380,000 / yr",
    posted: "3 days ago • 64 applicants",
    logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80",
    type: "Full-time", skills: ["LLMs", "PyTorch", "System Design"]
  },
  {
    title: "Principal Full Stack Engineer",
    company: "Stripe",
    location: "Seattle, WA (Remote)",
    salary: "$220,000 - $285,000 / yr",
    posted: "4 days ago • 53 applicants",
    logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80",
    type: "Remote", skills: ["React", "Node.js", "TypeScript"]
  },
  {
    title: "Product Design Lead",
    company: "Figma",
    location: "San Francisco, CA (Hybrid)",
    salary: "$195,000 - $250,000 / yr",
    posted: "5 days ago • 31 applicants",
    logo: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=100&auto=format&fit=crop&q=80",
    type: "Full-time", skills: ["Figma", "UX Design", "Design Systems"]
  },
  {
    title: "Head of Cloud Infrastructure",
    company: "CloudScale",
    location: "Remote (US)",
    salary: "$230,000 - $300,000 / yr",
    posted: "1 week ago • 28 applicants",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&auto=format&fit=crop&q=80",
    type: "Remote", skills: ["AWS", "Terraform", "SRE"]
  }
];

function renderJobCard(j, idx) {
  const isApplied = appliedJobs.includes(j.title + '|' + j.company);
  const skillsHtml = j.skills.map(s => `<span class="bg-blue-50 text-[#0a66c2] text-[10px] font-semibold px-2 py-0.5 rounded-full">${s}</span>`).join('');
  return `
    <div class="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0 gap-3">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <img src="${j.logo}" class="w-14 h-14 rounded-md object-cover border shrink-0" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'" />
        <div class="min-w-0">
          <h4 class="font-bold text-sm text-[#0a66c2] hover:underline cursor-pointer leading-tight">${j.title}</h4>
          <p class="text-xs font-semibold text-gray-800 mt-0.5">${j.company}</p>
          <p class="text-xs text-gray-500">${j.location}</p>
          <p class="text-xs font-semibold text-emerald-700 mt-1">${j.salary}</p>
          <div class="flex flex-wrap gap-1 mt-1.5">${skillsHtml}</div>
          <p class="text-[11px] text-gray-400 mt-1">${j.posted} • <span class="font-medium">${j.type}</span></p>
        </div>
      </div>
      ${isApplied
        ? `<span class="shrink-0 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
             <i class="fa-solid fa-check text-[10px]"></i> Applied
           </span>`
        : `<button onclick="openApplyModal(${idx})" class="shrink-0 bg-[#0a66c2] text-white rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-[#004182] transition-colors whitespace-nowrap">
             Easy Apply
           </button>`
      }
    </div>
  `;
}

// Render Jobs View
function renderJobs(jobsToShow) {
  const list = document.getElementById("jobs-list");
  if (!list) return;
  const jobs = jobsToShow || ALL_JOBS;
  if (jobs.length === 0) {
    list.innerHTML = `<p class="text-center text-gray-400 text-xs py-8">No jobs found matching your search. Try different keywords.</p>`;
    return;
  }
  list.innerHTML = jobs.map((j, i) => renderJobCard(j, ALL_JOBS.indexOf(j) !== -1 ? ALL_JOBS.indexOf(j) : i)).join('');
}

// Filter jobs by search query
function filterJobs() {
  const titleQ = (document.getElementById('job-search-title')?.value || '').toLowerCase().trim();
  const locQ = (document.getElementById('job-search-location')?.value || '').toLowerCase().trim();

  if (!titleQ && !locQ) {
    renderJobs(ALL_JOBS);
    showToast('Showing all jobs');
    return;
  }

  const filtered = ALL_JOBS.filter(j => {
    const matchTitle = !titleQ || j.title.toLowerCase().includes(titleQ) || j.company.toLowerCase().includes(titleQ) || j.skills.some(s => s.toLowerCase().includes(titleQ));
    const matchLoc = !locQ || j.location.toLowerCase().includes(locQ) || j.type.toLowerCase().includes(locQ);
    return matchTitle && matchLoc;
  });

  renderJobs(filtered);
  showToast(filtered.length > 0 ? `Found ${filtered.length} job${filtered.length > 1 ? 's' : ''}` : 'No jobs found');
}

// ── Easy Apply Modal Logic ────────────────────────────────────────────────────
function openApplyModal(jobIndex) {
  currentApplyJob = ALL_JOBS[jobIndex];
  if (!currentApplyJob) return;

  document.getElementById('apply-modal-title').innerText = currentApplyJob.title;
  document.getElementById('apply-modal-company').innerText = currentApplyJob.company + ' • ' + currentApplyJob.location;

  // Pre-fill with current user data
  document.getElementById('apply-fname').value = (currentUser.name || '').split(' ')[0] || '';
  document.getElementById('apply-lname').value = (currentUser.name || '').split(' ').slice(1).join(' ') || '';
  document.getElementById('apply-email').value = currentUser.email || '';
  document.getElementById('apply-city').value = currentUser.location || '';
  document.getElementById('apply-phone').value = '';
  document.getElementById('apply-cover').value = '';
  document.getElementById('apply-file-name').innerText = 'No file selected';

  applyGoStep(1);
  document.getElementById('easy-apply-modal').classList.remove('hidden');
}

function closeApplyModal() {
  document.getElementById('easy-apply-modal').classList.add('hidden');
  currentApplyJob = null;
}

function applyGoStep(step) {
  [1, 2, 3].forEach(s => {
    document.getElementById('apply-step-' + s)?.classList.toggle('hidden', s !== step);
    const tab = document.getElementById('apply-step-' + s + '-tab');
    if (tab) {
      if (s === step) {
        tab.className = 'flex-1 text-center py-2 text-[11px] font-semibold text-[#0a66c2] border-b-2 border-[#0a66c2] cursor-pointer';
      } else if (s < step) {
        tab.className = 'flex-1 text-center py-2 text-[11px] font-semibold text-green-600 border-b-2 border-green-400 cursor-pointer';
      } else {
        tab.className = 'flex-1 text-center py-2 text-[11px] font-semibold text-gray-400 border-b-2 border-transparent cursor-pointer';
      }
    }
  });

  // Populate review step
  if (step === 3) {
    const fname = document.getElementById('apply-fname')?.value || '';
    const lname = document.getElementById('apply-lname')?.value || '';
    const email = document.getElementById('apply-email')?.value || '';
    const fileName = document.getElementById('apply-file-name')?.innerText || 'Not uploaded';
    document.getElementById('review-title').innerText = currentApplyJob?.title || '—';
    document.getElementById('review-company').innerText = currentApplyJob?.company || '—';
    document.getElementById('review-name').innerText = (fname + ' ' + lname).trim() || '—';
    document.getElementById('review-email').innerText = email || '—';
    document.getElementById('review-resume').innerText = fileName === 'No file selected' ? 'Profile resume' : fileName;
  }
}

function handleResumeSelect(input) {
  const file = input.files[0];
  const nameEl = document.getElementById('apply-file-name');
  if (file && nameEl) {
    nameEl.innerText = file.name;
    nameEl.className = 'text-[11px] text-[#0a66c2] font-semibold mt-1';
  }
}

function submitApplication() {
  if (!currentApplyJob) return;
  const key = currentApplyJob.title + '|' + currentApplyJob.company;
  if (!appliedJobs.includes(key)) {
    appliedJobs.push(key);
    localStorage.setItem('lk_applied_jobs', JSON.stringify(appliedJobs));
  }
  closeApplyModal();
  renderJobs();
  showToast('✅ Application submitted to ' + currentApplyJob.company + '!');
}


// Render Messaging / Chat View
function renderChat() {
  const convList = document.getElementById("conversation-list");
  if (!convList) return;

  convList.innerHTML = CHAT_USERS.map((u, i) => `
    <div onclick="selectChat(${i})" class="flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-gray-50 ${i === activeChatIndex ? 'bg-blue-50/70 border-l-4 border-[#0a66c2]' : ''}">
      <img src="${u.avatar}" class="w-12 h-12 rounded-full object-cover" />
      <div class="flex-1 overflow-hidden">
        <div class="flex justify-between">
          <span class="font-bold text-xs text-gray-900">${u.name}</span>
          <span class="text-[10px] text-gray-400">Today</span>
        </div>
        <p class="text-[11px] text-gray-500 truncate">${u.headline}</p>
      </div>
    </div>
  `).join("");

  const activeUser = CHAT_USERS[activeChatIndex];
  if (!activeUser) return;

  const activeName = document.getElementById("chat-active-name");
  const activeHeadline = document.getElementById("chat-active-headline");
  const activeAvatar = document.getElementById("chat-active-avatar");
  if (activeName) activeName.innerText = activeUser.name;
  if (activeHeadline) activeHeadline.innerText = activeUser.headline;
  if (activeAvatar) activeAvatar.src = activeUser.avatar;

  const msgsContainer = document.getElementById("chat-messages-container");
  if (msgsContainer) {
    msgsContainer.innerHTML = activeUser.msgs.map(m => `
      <div class="max-w-md p-3 rounded-2xl text-xs ${m.sender === 'me' ? 'bg-[#0a66c2] text-white self-end rounded-br-none' : 'bg-white text-gray-800 self-start border rounded-bl-none shadow-xs'}">
        <p>${m.text}</p>
      </div>
    `).join("");
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }
}

function selectChat(idx) {
  activeChatIndex = idx;
  renderChat();
}

function sendMessage() {
  const inp = document.getElementById("message-input");
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;
  CHAT_USERS[activeChatIndex].msgs.push({ sender: "me", text: val });
  inp.value = "";
  renderChat();
}

// Render Notifications View
function renderNotifications() {
  const list = document.getElementById("notifications-list");
  if (!list) return;

  const notifs = [
    { name: "Priya Sharma", text: "viewed your profile and 12 others this week", time: "2h ago", unread: true, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" },
    { name: "Marcus Vance", text: "liked your post: '🚀 Excited to announce our newest release!...'", time: "4h ago", unread: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
    { name: "Elena Rostova", text: "commented on your post: 'Clean architecture. Huge win!'", time: "1d ago", unread: true, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80" },
    { name: "David Kim", text: "accepted your connection invitation", time: "2d ago", unread: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
    { name: "Career Alerts", text: "3 new Senior AI Engineer job openings match your preferences", time: "3d ago", unread: false, avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" }
  ];

  list.innerHTML = notifs.map(n => `
    <div class="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-blue-50/50' : ''}">
      <div class="flex items-center gap-3">
        <img src="${n.avatar}" class="w-12 h-12 rounded-full object-cover border" />
        <div>
          <p class="text-xs text-gray-800"><strong>${n.name}</strong> ${n.text}</p>
          <p class="text-[11px] text-gray-400 mt-0.5">${n.time}</p>
        </div>
      </div>
      ${n.unread ? '<span class="w-2.5 h-2.5 rounded-full bg-[#0a66c2]"></span>' : ''}
    </div>
  `).join("");
}

// ── Network State ────────────────────────────────────────────────────────────
const NETWORK_STATE = {
  connectionCount: parseInt(localStorage.getItem('lk_conn_count') || '428'),
  pendingConnections: JSON.parse(localStorage.getItem('lk_pending_conn') || '[]'),

  save() {
    localStorage.setItem('lk_conn_count', this.connectionCount);
    localStorage.setItem('lk_pending_conn', JSON.stringify(this.pendingConnections));
  }
};

// Invitation data (kept in memory so we can remove accepted/ignored ones)
const INVITATIONS = [
  { id: 'inv-david', name: "David Kim", headline: "Founder & CEO @ NexusAI (YC W25)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
  { id: 'inv-sarah', name: "Sarah Chen", headline: "Product Designer @ Figma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80" }
];

let activeInvitations = JSON.parse(localStorage.getItem('lk_invitations') || 'null') || INVITATIONS.map(i => i.id);

function saveInvitations() {
  localStorage.setItem('lk_invitations', JSON.stringify(activeInvitations));
}

function acceptInvitation(invId, btnEl) {
  const inv = INVITATIONS.find(i => i.id === invId);
  if (!inv) return;

  // Animate the card out
  const card = document.getElementById(invId);
  if (card) {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.maxHeight = card.offsetHeight + 'px';
    requestAnimationFrame(() => {
      card.style.maxHeight = '0';
      card.style.paddingTop = '0';
      card.style.paddingBottom = '0';
      card.style.marginBottom = '0';
      card.style.overflow = 'hidden';
    });
    setTimeout(() => card.remove(), 320);
  }

  // Update state
  activeInvitations = activeInvitations.filter(id => id !== invId);
  NETWORK_STATE.connectionCount++;
  NETWORK_STATE.save();
  saveInvitations();

  // Update the sidebar connection count
  const connCountEl = document.getElementById('network-conn-count');
  if (connCountEl) connCountEl.innerText = NETWORK_STATE.connectionCount.toLocaleString();

  // Update the invitation header count
  const invHeader = document.getElementById('inv-header-count');
  if (invHeader) invHeader.innerText = `Invitations (${activeInvitations.length})`;

  showToast(`✅ You are now connected with ${inv.name}!`);
}

function ignoreInvitation(invId) {
  const inv = INVITATIONS.find(i => i.id === invId);
  const card = document.getElementById(invId);
  if (card) {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.maxHeight = card.offsetHeight + 'px';
    requestAnimationFrame(() => {
      card.style.maxHeight = '0';
      card.style.paddingTop = '0';
      card.style.paddingBottom = '0';
      card.style.overflow = 'hidden';
    });
    setTimeout(() => card.remove(), 320);
  }

  activeInvitations = activeInvitations.filter(id => id !== invId);
  saveInvitations();

  const invHeader = document.getElementById('inv-header-count');
  if (invHeader) invHeader.innerText = `Invitations (${activeInvitations.length})`;

  showToast(inv ? `Invitation from ${inv.name} ignored.` : 'Invitation dismissed.');
}

function connectWithPerson(name, btnEl) {
  const isPending = btnEl.dataset.pending === 'true';
  if (isPending) {
    // Withdraw request
    btnEl.dataset.pending = 'false';
    btnEl.className = 'w-full rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold text-xs py-1 hover:bg-blue-50 transition-all';
    btnEl.innerHTML = 'Connect';

    const idx = NETWORK_STATE.pendingConnections.indexOf(name);
    if (idx > -1) NETWORK_STATE.pendingConnections.splice(idx, 1);
    NETWORK_STATE.save();
    showToast(`Connection request to ${name} withdrawn.`);
  } else {
    // Send request
    btnEl.dataset.pending = 'true';
    btnEl.className = 'w-full rounded-full border border-gray-400 text-gray-500 font-semibold text-xs py-1 bg-gray-50 cursor-default transition-all flex items-center justify-center gap-1';
    btnEl.innerHTML = '<i class="fa-regular fa-clock text-[10px]"></i> Pending';

    NETWORK_STATE.pendingConnections.push(name);
    NETWORK_STATE.save();
    showToast(`✅ Connection request sent to ${name}!`);
  }
}

// Render My Network View
function renderNetwork() {
  // ── Invitations ───────────────────────────────────────────────────────────
  const invList = document.getElementById("invitations-list");
  if (invList) {
    const visibleInvs = INVITATIONS.filter(i => activeInvitations.includes(i.id));

    // Update header count
    const invHeader = document.getElementById('inv-header-count');
    if (invHeader) invHeader.innerText = `Invitations (${visibleInvs.length})`;

    invList.innerHTML = visibleInvs.length === 0
      ? `<p class="text-xs text-gray-400 text-center py-4">No pending invitations.</p>`
      : visibleInvs.map(inv => `
          <div id="${inv.id}" class="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <div class="flex items-center gap-3">
              <img src="${inv.avatar}" class="w-12 h-12 rounded-full object-cover" />
              <div>
                <h5 class="font-bold text-sm text-gray-900">${inv.name}</h5>
                <p class="text-xs text-gray-500">${inv.headline}</p>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button
                onclick="ignoreInvitation('${inv.id}')"
                class="text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 text-xs font-semibold px-3 py-1.5 rounded-full transition-all">
                Ignore
              </button>
              <button
                onclick="acceptInvitation('${inv.id}', this)"
                class="bg-[#0a66c2] text-white rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-[#004182] transition-colors flex items-center gap-1">
                <i class="fa-solid fa-check text-[10px]"></i> Accept
              </button>
            </div>
          </div>
        `).join("");
  }

  // ── People You May Know ───────────────────────────────────────────────────
  const recGrid = document.getElementById("recommendations-grid");
  if (!recGrid) return;

  const recs = [
    { name: "Satya Nadella",  headline: "Chairman and CEO at Microsoft", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80", mutual: "12 mutual connections" },
    { name: "Mira Murati",    headline: "Building the frontier of artificial intelligence", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80", banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", mutual: "8 mutual connections" },
    { name: "Andrej Karpathy", headline: "AI Researcher & Educator", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80", banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80", mutual: "5 mutual connections" },
    { name: "Sarah Chen",     headline: "Product Designer @ Figma | Design Systems", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80", banner: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80", mutual: "3 mutual connections" },
    { name: "Elena Rostova",  headline: "Head of Infrastructure @ CloudScale", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80", banner: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80", mutual: "7 mutual connections" },
    { name: "Marcus Vance",   headline: "Principal Research Scientist @ DeepMind", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", banner: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80", mutual: "15 mutual connections" }
  ];

  recGrid.innerHTML = recs.map(r => {
    const isPending = NETWORK_STATE.pendingConnections.includes(r.name);
    const btnClass = isPending
      ? 'w-full rounded-full border border-gray-400 text-gray-500 font-semibold text-xs py-1 bg-gray-50 transition-all flex items-center justify-center gap-1'
      : 'w-full rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold text-xs py-1 hover:bg-blue-50 transition-all';
    const btnContent = isPending
      ? '<i class="fa-regular fa-clock text-[10px]"></i> Pending'
      : 'Connect';

    return `
      <div class="border rounded-xl overflow-hidden bg-white text-center flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
        <div class="h-16 w-full relative">
          <img src="${r.banner}" class="w-full h-full object-cover" />
          <img src="${r.avatar}" class="w-14 h-14 rounded-full border-2 border-white absolute -bottom-7 left-1/2 -translate-x-1/2 object-cover shadow" />
        </div>
        <div class="pt-9 pb-2 px-3">
          <h5 class="font-bold text-sm text-gray-900">${r.name}</h5>
          <p class="text-[11px] text-gray-500 line-clamp-2 mt-0.5">${r.headline}</p>
          <p class="text-[10px] text-gray-400 mt-1"><i class="fa-solid fa-user-group text-[9px]"></i> ${r.mutual}</p>
        </div>
        <div class="p-3 pt-2">
          <button
            data-pending="${isPending}"
            onclick="connectWithPerson('${r.name}', this)"
            class="${btnClass}">
            ${btnContent}
          </button>
        </div>
      </div>
    `;
  }).join("");
}
