// =========================================================
// LinkedIn Clone - Repost and Send Modals & Handlers
// =========================================================

// ===================== REPOST LOGIC =====================
function openRepostModal(index) {
  activeRepostIndex = index;
  const post = posts[index];
  const snippet = (post.author + ': ' + post.content).slice(0, 180) + (post.content.length > 180 ? '…' : '');
  document.getElementById('repost-preview-instant').innerText = snippet;
  document.getElementById('repost-preview-thought').innerText = snippet;
  document.getElementById('repost-user-avatar').src = currentUser.avatar;
  document.getElementById('repost-user-name').innerText = currentUser.name;
  document.getElementById('repost-thought-text').value = '';
  setRepostType('instant');
  document.getElementById('repost-modal').classList.remove('hidden');
}

function closeRepostModal() {
  document.getElementById('repost-modal').classList.add('hidden');
  activeRepostIndex = null;
}

function setRepostType(type) {
  const isThought = type === 'thought';
  document.getElementById('repost-pane-instant').classList.toggle('hidden', isThought);
  document.getElementById('repost-pane-thought').classList.toggle('hidden', !isThought);
  document.getElementById('repost-btn-instant').classList.toggle('text-[#0a66c2]', !isThought);
  document.getElementById('repost-btn-instant').classList.toggle('border-[#0a66c2]', !isThought);
  document.getElementById('repost-btn-instant').classList.toggle('text-gray-500', isThought);
  document.getElementById('repost-btn-instant').classList.toggle('border-transparent', isThought);
  document.getElementById('repost-btn-thought').classList.toggle('text-[#0a66c2]', isThought);
  document.getElementById('repost-btn-thought').classList.toggle('border-[#0a66c2]', isThought);
  document.getElementById('repost-btn-thought').classList.toggle('text-gray-500', !isThought);
  document.getElementById('repost-btn-thought').classList.toggle('border-transparent', !isThought);
}

function submitRepost(withThought) {
  if (activeRepostIndex === null) return;
  const originalIndex = activeRepostIndex;
  const original = posts[originalIndex];
  const thought = withThought ? document.getElementById('repost-thought-text').value.trim() : '';

  // Increment repost count on the original post
  if (!original.reposts) original.reposts = 0;
  original.reposts++;

  // Build repost entry
  const repostEntry = {
    id: Date.now(),
    author: currentUser.name,
    headline: currentUser.headline,
    avatar: currentUser.avatar,
    time: 'Just now',
    isRepost: true,
    originalAuthor: original.author,
    content: thought || '',
    repostContent: original.content,
    repostAuthor: original.author,
    repostAvatar: original.avatar,
    mediaType: original.mediaType,
    mediaUrl: original.mediaUrl,
    mediaUrls: original.mediaUrls || (original.mediaUrl ? [original.mediaUrl] : []),
    likes: 0,
    userLiked: false,
    reposts: 0,
    comments: []
  };

  // ── Step 1: Close modal instantly — zero waiting ──────────────────────────
  closeRepostModal();

  // ── Step 2: Prepend only the new card to the top of the feed ─────────────
  //    All existing post cards stay completely untouched.
  posts.unshift(repostEntry);
  const container = document.getElementById('posts-feed');
  if (container) {
    // Shift all existing card indices up by 1 to keep onclick handlers in sync
    container.querySelectorAll('[data-post-id]').forEach((card, i) => {
      const newIdx = i + 1;
      // Update repost button id/label for the original post
      const repostBtn = card.querySelector('[id^="repost-btn-"]');
      const repostLbl = card.querySelector('[id^="repost-label-"]');
      if (repostBtn) repostBtn.id = 'repost-btn-' + newIdx;
      if (repostLbl) {
        repostLbl.id = 'repost-label-' + newIdx;
        // If this is the original post, update its repost count label right now
        if (i === originalIndex) {
          repostLbl.innerText = original.reposts + ' Reposts';
        }
      }
    });

    // Prepend the new repost card as index 0
    const newCard = buildPostCard(repostEntry, 0);
    container.insertBefore(newCard, container.firstChild);
  }

  // ── Step 3: Show success toast ────────────────────────────────────────────
  showToast('✅ Reposted to your network!');

  // ── Step 4: Persist silently in the background ────────────────────────────
  requestAnimationFrame(() => {
    localStorage.setItem('lk_posts', JSON.stringify(posts));
  });
}

// ===================== SEND POST LOGIC =====================
function openSendModal(index) {
  activeSendIndex = index;
  selectedSendConnectionId = null;
  const post = posts[index];
  const snippet = (post.author + ': ' + post.content).slice(0, 120) + (post.content.length > 120 ? '…' : '');
  document.getElementById('send-post-preview').innerText = snippet;
  document.getElementById('send-message-text').value = '';

  // Render connection list
  const list = document.getElementById('send-connections-list');
  list.innerHTML = CHAT_USERS.map(u => `
    <div onclick="selectSendConnection(${u.id})" id="send-conn-${u.id}" class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 border-2 border-transparent transition-all">
      <img src="${u.avatar}" class="w-10 h-10 rounded-full object-cover" />
      <div>
        <p class="text-xs font-bold text-gray-900">${u.name}</p>
        <p class="text-[11px] text-gray-500">${u.headline}</p>
      </div>
      <i class="fa-regular fa-circle ml-auto text-gray-300 text-base" id="send-check-${u.id}"></i>
    </div>
  `).join('');

  document.getElementById('send-modal').classList.remove('hidden');
}

function closeSendModal() {
  document.getElementById('send-modal').classList.add('hidden');
  activeSendIndex = null;
  selectedSendConnectionId = null;
}

function selectSendConnection(id) {
  // Deselect previous
  if (selectedSendConnectionId !== null) {
    const prev = document.getElementById(`send-conn-${selectedSendConnectionId}`);
    const prevCheck = document.getElementById(`send-check-${selectedSendConnectionId}`);
    if (prev) prev.classList.remove('border-[#0a66c2]', 'bg-blue-50/60');
    if (prevCheck) { prevCheck.className = 'fa-regular fa-circle ml-auto text-gray-300 text-base'; }
  }
  selectedSendConnectionId = id;
  const el = document.getElementById(`send-conn-${id}`);
  const check = document.getElementById(`send-check-${id}`);
  if (el) el.classList.add('border-[#0a66c2]', 'bg-blue-50/60');
  if (check) check.className = 'fa-solid fa-circle-check ml-auto text-[#0a66c2] text-base';
}

function submitSendPost() {
  if (!selectedSendConnectionId) {
    showToast('⚠️ Please select a connection to send to.');
    return;
  }
  const post = posts[activeSendIndex];
  const userMsg = document.getElementById('send-message-text').value.trim();
  const chatUser = CHAT_USERS.find(u => u.id === selectedSendConnectionId);
  if (!chatUser) return;

  // Build message text
  const sharedText = (userMsg ? userMsg + '\n\n' : '') +
    '📎 Shared post by ' + post.author + ':\n"' + post.content.slice(0, 100) + (post.content.length > 100 ? '…' : '') + '"';

  chatUser.msgs.push({ sender: 'me', text: sharedText });
  closeSendModal();
  showToast(`✅ Sent to ${chatUser.name}!`);
}
