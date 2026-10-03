// =========================================================
// LinkedIn Clone - Post Feed, CRUD, Multiple Images & Interactions
// =========================================================

// ─── Build a single post card DOM element ───────────────────────────────────
function buildPostCard(post, index) {
  const postCard = document.createElement("div");
  postCard.className = "post-card p-4 w-full space-y-3 shadow-sm";
  postCard.dataset.postId = post.id;

  const repostBannerHtml = post.isRepost
    ? `<div class="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold pb-1 border-b border-gray-100 mb-2">
         <i class="fa-solid fa-repeat text-[#0a66c2]"></i>
         <span>${post.author} reposted this</span>
       </div>`
    : '';

  const quotedCardHtml  = post.isRepost ? buildQuotedPostHtml(post) : '';
  const directMediaHtml = post.isRepost ? '' : buildMediaHtml(post.mediaType, post.mediaUrl, false, post.mediaUrls);

  const commentsListHtml = (post.comments && post.comments.length > 0)
    ? post.comments.map(c => `
        <div class="flex items-start gap-2 bg-gray-100 p-2.5 rounded-xl text-xs">
          <strong>${c.name}:</strong> <span>${c.text}</span>
        </div>
      `).join("")
    : "";

  postCard.innerHTML = `
    <!-- Repost banner -->
    ${repostBannerHtml}

    <!-- Header -->
    <div class="flex items-start justify-between w-full">
      <div class="flex items-center gap-3">
        <img src="${post.avatar}" class="w-12 h-12 rounded-full object-cover border" />
        <div>
          <div class="flex items-center gap-1">
            <h4 class="font-bold text-gray-900 text-sm hover:underline cursor-pointer">${post.author}</h4>
            <span class="text-xs text-gray-400">• 1st</span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-1">${post.headline}</p>
          <p class="text-[11px] text-gray-400">${post.time} • <i class="fa-solid fa-earth-americas"></i></p>
        </div>
      </div>

      <!-- Three Dots Dropdown -->
      <div class="relative">
        <button onclick="togglePostMenu(event, '${index}')" class="text-gray-400 hover:text-black p-1 text-base rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
        <div id="post-menu-${index}" class="post-dropdown-menu absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40 hidden z-20">
          <button onclick="openEditPostModal(${index})" class="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium transition-colors">
            <i class="fa-regular fa-pen-to-square text-[#0a66c2]"></i> Edit post
          </button>
          <button onclick="promptDeletePost(${index})" class="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium transition-colors">
            <i class="fa-regular fa-trash-can"></i> Delete post
          </button>
          <div class="border-t border-gray-100 my-1"></div>
          <button onclick="showToast('Post saved to bookmarks!')" class="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors">
            <i class="fa-regular fa-bookmark"></i> Save post
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    ${post.content ? `<p class="text-sm text-gray-800 whitespace-pre-line leading-relaxed">${post.content}</p>` : ''}

    <!-- Quoted card or direct media -->
    ${quotedCardHtml}
    ${directMediaHtml}

    <!-- Reactions Count -->
    <div class="flex justify-between text-xs text-gray-500 pt-2 border-b pb-2">
      <span class="flex items-center gap-1">
        <span class="bg-[#0a66c2] text-white rounded-full px-1 text-[10px]">👍</span>
        <span class="bg-red-500 text-white rounded-full px-1 text-[10px]">❤️</span>
        <span>${post.likes} reactions</span>
      </span>
      <span>${post.comments ? post.comments.length : 0} comments • ${post.reposts || 0} reposts</span>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-around items-center pt-1 text-sm font-semibold text-gray-600">
      <button onclick="toggleLike(${index})" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${post.userLiked ? 'text-[#0a66c2]' : ''}">
        <i class="fa-regular fa-thumbs-up"></i>
        <span>${post.userLiked ? 'Liked' : 'Like'}</span>
      </button>
      <button onclick="toggleComments(${index})" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
        <i class="fa-regular fa-comment"></i>
        <span>Comment</span>
      </button>
      <button onclick="openRepostModal(${index})" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors" id="repost-btn-${index}">
        <i class="fa-solid fa-repeat"></i>
        <span id="repost-label-${index}">${post.reposts > 0 ? post.reposts + ' Reposts' : 'Repost'}</span>
      </button>
      <button onclick="openSendModal(${index})" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors">
        <i class="fa-regular fa-paper-plane"></i>
        <span>Send</span>
      </button>
    </div>

    <!-- Comments Section -->
    <div id="comments-section-${index}" class="hidden pt-2 space-y-2 border-t mt-2">
      <div class="flex gap-2">
        <input type="text" id="comment-input-${index}" placeholder="Add a comment..." onkeydown="if(event.key==='Enter') addComment(${index})" class="flex-1 border rounded-full px-3 py-1.5 text-xs outline-none" />
        <button onclick="addComment(${index})" class="bg-[#0a66c2] text-white rounded-full px-4 text-xs font-semibold">Post</button>
      </div>
      <div class="space-y-1 pt-1">
        ${commentsListHtml}
      </div>
    </div>
  `;
  return postCard;
}

// ─── Render Main Feed Posts ──────────────────────────────────────────────────
function renderPosts() {
  const container = document.getElementById("posts-feed");
  if (!container) return;
  container.innerHTML = "";
  posts.forEach((post, index) => container.appendChild(buildPostCard(post, index)));
}


// Post Menu Toggle with outside click listener
function togglePostMenu(event, key) {
  if (event) {
    event.stopPropagation();
  }
  const menu = document.getElementById(`post-menu-${key}`);
  if (!menu) return;
  const isClosed = menu.classList.contains("hidden");
  // Close all open menus first
  document.querySelectorAll(".post-dropdown-menu").forEach(m => m.classList.add("hidden"));
  if (isClosed) {
    menu.classList.remove("hidden");
  }
}

// Global listener to close dropdowns when clicking anywhere outside
document.addEventListener("click", () => {
  document.querySelectorAll(".post-dropdown-menu").forEach(m => m.classList.add("hidden"));
});

// ===================== EDIT POST LOGIC =====================
function openEditPostModal(target) {
  let idx = -1;
  if (typeof target === "number" && target >= 0 && target < posts.length) {
    idx = target;
  } else {
    idx = posts.findIndex(p => p.id === target);
  }

  if (idx === -1 || !posts[idx]) {
    showToast("Error: Post not found");
    return;
  }

  editingPostIndex = idx;
  editingPostId = posts[idx].id;
  const post = posts[idx];

  const avatarEl = document.getElementById("edit-post-modal-avatar");
  if (avatarEl) avatarEl.src = post.avatar || currentUser.avatar;

  const authorEl = document.getElementById("edit-post-modal-author");
  if (authorEl) authorEl.innerText = `${post.author || currentUser.name} • ${post.headline || 'Member'}`;

  const textEl = document.getElementById("edit-post-text");
  if (textEl) textEl.value = post.content || "";

  // Populate multiple media list
  editPendingMediaList = [];
  if (Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0) {
    post.mediaUrls.forEach((u, i) => {
      const isVideo = u.toLowerCase().includes(".mp4") || u.toLowerCase().includes(".webm");
      editPendingMediaList.push({
        type: isVideo ? "video" : "image",
        url: u,
        filename: `Photo ${i + 1}`
      });
    });
  } else if (post.mediaUrl && post.mediaType !== "none") {
    editPendingMediaList.push({
      type: post.mediaType || "image",
      url: post.mediaUrl,
      filename: post.mediaType === "video" ? "Video" : "Photo 1"
    });
  }

  const urlBox = document.getElementById("edit-post-url-box");
  if (urlBox) urlBox.classList.add("hidden");

  const urlVal = document.getElementById("edit-post-url-val");
  if (urlVal) urlVal.value = "";

  updateEditPreview();
  document.getElementById("edit-post-modal").classList.remove("hidden");
  document.querySelectorAll(".post-dropdown-menu").forEach(m => m.classList.add("hidden"));
}

function closeEditPostModal() {
  document.getElementById("edit-post-modal").classList.add("hidden");
  editingPostIndex = null;
  editingPostId = null;
  editPendingMediaList = [];
}

function updateEditPreview() {
  const preview = document.getElementById("edit-post-preview-container");
  const nameLabel = document.getElementById("edit-post-attached-filename");
  if (!preview || !nameLabel) return;

  if (editPendingMediaList.length === 0) {
    nameLabel.innerText = "No media attached";
    preview.classList.add("hidden");
    preview.innerHTML = "";
    return;
  }

  nameLabel.innerText = `${editPendingMediaList.length} item${editPendingMediaList.length !== 1 ? 's' : ''} attached`;
  preview.classList.remove("hidden");

  if (editPendingMediaList.length === 1) {
    const item = editPendingMediaList[0];
    if (item.type === "video") {
      preview.innerHTML = `
        <div class="relative bg-black rounded p-1">
          <video controls class="w-full max-h-56 bg-black rounded"><source src="${item.url}"></video>
          <button type="button" onclick="removeEditPendingMedia(0)" class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow text-xs transition-colors" title="Remove video">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    } else {
      preview.innerHTML = `
        <div class="relative bg-gray-50 rounded">
          <img src="${item.url}" class="w-full max-h-56 object-cover rounded" />
          <button type="button" onclick="removeEditPendingMedia(0)" class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow text-xs transition-colors" title="Remove photo">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    }
  } else {
    // Multi-image thumbnail grid with delete buttons and "+ Add More" tile
    preview.innerHTML = `
      <div class="p-2.5 bg-gray-50 rounded-lg">
        <div class="text-[11px] font-semibold text-gray-500 mb-2 flex items-center justify-between">
          <span>Attached Photos (${editPendingMediaList.length})</span>
          <span class="text-[10px] text-gray-400">Click ✕ to remove individual photos</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          ${editPendingMediaList.map((item, i) => `
            <div class="relative group rounded-lg overflow-hidden border border-gray-200 bg-white h-20 shadow-2xs">
              ${item.type === "video"
                ? `<video class="w-full h-full object-cover"><source src="${item.url}"></video>`
                : `<img src="${item.url}" class="w-full h-full object-cover" />`
              }
              <button type="button" onclick="removeEditPendingMedia(${i})" class="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow transition-colors" title="Remove this photo">
                ✕
              </button>
            </div>
          `).join("")}
          <button type="button" onclick="document.getElementById('edit-post-file-input').click()" class="h-20 border-2 border-dashed border-gray-300 hover:border-[#0a66c2] hover:bg-blue-50/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-[#0a66c2] transition-colors cursor-pointer text-xs font-semibold gap-1">
            <i class="fa-solid fa-plus text-sm"></i>
            <span>Add More</span>
          </button>
        </div>
      </div>
    `;
  }
}

function removeEditPendingMedia(index) {
  editPendingMediaList.splice(index, 1);
  updateEditPreview();
  showToast("Photo removed");
}

function clearEditPostMedia() {
  editPendingMediaList = [];
  const urlVal = document.getElementById("edit-post-url-val");
  if (urlVal) urlVal.value = "";
  updateEditPreview();
  showToast("All media removed");
}

function toggleEditPostUrlInput() {
  const box = document.getElementById("edit-post-url-box");
  if (box) box.classList.toggle("hidden");
}

function handleEditPostFileSelect(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  let loadedCount = 0;
  files.forEach(file => {
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();

    reader.onload = function(e) {
      editPendingMediaList.push({
        type: isVideo ? "video" : "image",
        url: e.target.result,
        filename: file.name
      });
      loadedCount++;
      if (loadedCount === files.length) {
        updateEditPreview();
        showToast(files.length > 1 ? `Added ${files.length} photos!` : `Attached ${file.name}`);
      }
    };

    reader.readAsDataURL(file);
  });
  event.target.value = "";
}

function addEditUrlMedia() {
  const input = document.getElementById("edit-post-url-val");
  if (!input) return;
  const url = input.value.trim();
  if (!url) return;

  const isVideo = url.toLowerCase().includes(".mp4") || url.toLowerCase().includes(".webm");
  editPendingMediaList.push({
    type: isVideo ? "video" : "image",
    url: url,
    filename: "Web Media URL"
  });
  input.value = "";
  updateEditPreview();
  showToast("Media URL added!");
}

function handleEditPostUrlInput(val) {
  // Kept for backward compatibility if user types directly
}

// Save Edited Post
function saveEditedPost() {
  if (editingPostIndex === null && editingPostId === null) return;
  let idx = editingPostIndex;
  if (idx === null || !posts[idx] || posts[idx].id !== editingPostId) {
    idx = posts.findIndex(p => p.id === editingPostId);
  }

  if (idx === -1 || !posts[idx]) {
    showToast("Error: Post could not be found");
    closeEditPostModal();
    return;
  }

  const text = document.getElementById("edit-post-text").value.trim();
  const directUrlInput = document.getElementById("edit-post-url-val");
  const directUrl = directUrlInput ? directUrlInput.value.trim() : "";

  if (directUrl) {
    const isVideo = directUrl.toLowerCase().includes(".mp4") || directUrl.toLowerCase().includes(".webm");
    editPendingMediaList.push({
      type: isVideo ? "video" : "image",
      url: directUrl,
      filename: "Web Media URL"
    });
    directUrlInput.value = "";
  }

  if (!text && editPendingMediaList.length === 0) {
    showToast("Post cannot be empty. Please enter text or attach photos!");
    return;
  }

  let mType = "none";
  let mUrl = "";
  let mUrls = [];

  if (editPendingMediaList.length === 1) {
    mType = editPendingMediaList[0].type;
    mUrl = editPendingMediaList[0].url;
    mUrls = [editPendingMediaList[0].url];
  } else if (editPendingMediaList.length > 1) {
    const hasVideo = editPendingMediaList.some(m => m.type === "video");
    mType = hasVideo ? "video" : "image";
    mUrl = editPendingMediaList[0].url;
    mUrls = editPendingMediaList.map(m => m.url);
  }

  posts[idx].content = text;
  posts[idx].mediaType = mType;
  posts[idx].mediaUrl = mUrl;
  posts[idx].mediaUrls = mUrls;
  delete posts[idx].isEdited;

  localStorage.setItem("lk_posts", JSON.stringify(posts));
  renderPosts();
  renderProfilePosts();
  closeEditPostModal();
  showToast(mUrls.length > 1 ? `Post updated with ${mUrls.length} photos! 📸` : "Post updated successfully!");
}

// ===================== DELETE POST LOGIC =====================
function promptDeletePost(target) {
  let idx = -1;
  if (typeof target === "number" && target >= 0 && target < posts.length) {
    idx = target;
  } else {
    idx = posts.findIndex(p => p.id === target);
  }

  if (idx === -1 || !posts[idx]) {
    showToast("Error: Post not found");
    return;
  }

  deletingPostIndex = idx;
  deletingPostId = posts[idx].id;
  document.getElementById("delete-post-modal").classList.remove("hidden");
  document.querySelectorAll(".post-dropdown-menu").forEach(m => m.classList.add("hidden"));
}

function closeDeletePostModal() {
  document.getElementById("delete-post-modal").classList.add("hidden");
  deletingPostIndex = null;
  deletingPostId = null;
}

function confirmDeletePost() {
  if (deletingPostIndex === null && deletingPostId === null) return;
  let idx = deletingPostIndex;
  if (idx === null || !posts[idx] || posts[idx].id !== deletingPostId) {
    idx = posts.findIndex(p => p.id === deletingPostId);
  }

  if (idx !== -1 && posts[idx]) {
    posts.splice(idx, 1);
    localStorage.setItem("lk_posts", JSON.stringify(posts));
    renderPosts();
    renderProfilePosts();
    showToast("Post deleted successfully");
  }
  closeDeletePostModal();
}

function deletePost(index) {
  promptDeletePost(index);
}

// ===================== LIKES & COMMENTS =====================
function toggleLike(index) {
  if (posts[index].userLiked) {
    posts[index].likes--;
    posts[index].userLiked = false;
  } else {
    posts[index].likes++;
    posts[index].userLiked = true;
  }
  localStorage.setItem("lk_posts", JSON.stringify(posts));
  renderPosts();
}

function toggleComments(index) {
  const sec = document.getElementById(`comments-section-${index}`);
  if (sec) sec.classList.toggle("hidden");
}

function addComment(index) {
  const input = document.getElementById(`comment-input-${index}`);
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  if (!posts[index].comments) posts[index].comments = [];
  posts[index].comments.push({ name: currentUser.name, text: val });
  localStorage.setItem("lk_posts", JSON.stringify(posts));
  renderPosts();
  showToast("Comment added!");
}

// ===================== CREATE POST MODAL & MULTI-IMAGE =====================
function openPostModal(defaultType) {
  document.getElementById("post-modal").classList.remove("hidden");
  document.getElementById("modal-post-text").value = "";
  pendingMediaList = [];
  updatePreview();
  if (defaultType === "image" || defaultType === "video") {
    document.getElementById("local-file-input").click();
  }
}

function closePostModal() {
  document.getElementById("post-modal").classList.add("hidden");
  pendingMediaList = [];
}

function toggleUrlInput() {
  const box = document.getElementById("url-input-box");
  if (box) box.classList.toggle("hidden");
}

// Handle multiple file selection from gallery/disk
function handleFileSelect(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  let loadedCount = 0;
  files.forEach(file => {
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();

    reader.onload = function(e) {
      pendingMediaList.push({
        type: isVideo ? "video" : "image",
        url: e.target.result,
        filename: file.name
      });
      loadedCount++;
      if (loadedCount === files.length) {
        updatePreview();
        showToast(files.length > 1 ? `Added ${files.length} photos! 📸` : `Attached ${file.name}`);
      }
    };

    reader.readAsDataURL(file);
  });

  event.target.value = "";
}

function addUrlMedia() {
  const input = document.getElementById("media-url-val");
  if (!input) return;
  const url = input.value.trim();
  if (!url) return;

  const isVideo = url.toLowerCase().includes(".mp4") || url.toLowerCase().includes(".webm");
  pendingMediaList.push({
    type: isVideo ? "video" : "image",
    url: url,
    filename: "Web Media URL"
  });
  input.value = "";
  updatePreview();
  showToast("Media URL added!");
}

function applyPreset(type, url) {
  pendingMediaList.push({ type, url, filename: "Preset Media" });
  updatePreview();
  toggleUrlInput();
  showToast("Preset added!");
}

function removePendingMedia(index) {
  pendingMediaList.splice(index, 1);
  updatePreview();
  showToast("Photo removed");
}

function clearMedia() {
  pendingMediaList = [];
  const urlInput = document.getElementById("media-url-val");
  if (urlInput) urlInput.value = "";
  updatePreview();
  showToast("Media cleared");
}

function updatePreview() {
  const preview = document.getElementById("modal-preview-container");
  const nameLabel = document.getElementById("attached-filename");
  if (!preview || !nameLabel) return;

  if (pendingMediaList.length === 0) {
    nameLabel.innerText = "";
    preview.classList.add("hidden");
    preview.innerHTML = "";
    return;
  }

  nameLabel.innerText = `${pendingMediaList.length} item${pendingMediaList.length !== 1 ? 's' : ''} attached`;
  preview.classList.remove("hidden");

  if (pendingMediaList.length === 1) {
    const item = pendingMediaList[0];
    if (item.type === "image") {
      preview.innerHTML = `
        <div class="relative bg-gray-50 rounded">
          <img src="${item.url}" class="w-full max-h-52 object-cover rounded" />
          <button type="button" onclick="removePendingMedia(0)" class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow text-xs transition-colors" title="Remove photo">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    } else {
      preview.innerHTML = `
        <div class="relative bg-black rounded p-1">
          <video controls class="w-full max-h-52 bg-black rounded"><source src="${item.url}"></video>
          <button type="button" onclick="removePendingMedia(0)" class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow text-xs transition-colors" title="Remove video">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    }
  } else {
    // Multi-image thumbnail grid with delete buttons and "+ Add More" tile
    preview.innerHTML = `
      <div class="p-2.5 bg-gray-50 rounded-lg">
        <div class="text-[11px] font-semibold text-gray-500 mb-2 flex items-center justify-between">
          <span>Attached Photos (${pendingMediaList.length})</span>
          <span class="text-[10px] text-gray-400">Click ✕ to remove individual photos</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          ${pendingMediaList.map((item, i) => `
            <div class="relative group rounded-lg overflow-hidden border border-gray-200 bg-white h-20 shadow-2xs">
              ${item.type === "video"
                ? `<video class="w-full h-full object-cover"><source src="${item.url}"></video>`
                : `<img src="${item.url}" class="w-full h-full object-cover" />`
              }
              <button type="button" onclick="removePendingMedia(${i})" class="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow transition-colors" title="Remove this photo">
                ✕
              </button>
            </div>
          `).join("")}
          <button type="button" onclick="document.getElementById('local-file-input').click()" class="h-20 border-2 border-dashed border-gray-300 hover:border-[#0a66c2] hover:bg-blue-50/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-[#0a66c2] transition-colors cursor-pointer text-xs font-semibold gap-1">
            <i class="fa-solid fa-plus text-sm"></i>
            <span>Add More</span>
          </button>
        </div>
      </div>
    `;
  }
}

// Publish New Post with Single or Multiple Photos
function submitNewPost() {
  const text = document.getElementById("modal-post-text").value.trim();
  const directUrlInput = document.getElementById("media-url-val");
  const directUrl = directUrlInput ? directUrlInput.value.trim() : "";

  if (directUrl) {
    const isVideo = directUrl.toLowerCase().includes(".mp4") || directUrl.toLowerCase().includes(".webm");
    pendingMediaList.push({
      type: isVideo ? "video" : "image",
      url: directUrl,
      filename: "Web Media URL"
    });
    directUrlInput.value = "";
  }

  if (!text && pendingMediaList.length === 0) {
    showToast("Please add text or attach photos to your post!");
    return;
  }

  let mType = "none";
  let mUrl = "";
  let mUrls = [];

  if (pendingMediaList.length === 1) {
    mType = pendingMediaList[0].type;
    mUrl = pendingMediaList[0].url;
    mUrls = [pendingMediaList[0].url];
  } else if (pendingMediaList.length > 1) {
    const hasVideo = pendingMediaList.some(m => m.type === "video");
    mType = hasVideo ? "video" : "image";
    mUrl = pendingMediaList[0].url;
    mUrls = pendingMediaList.map(m => m.url);
  }

  const newPost = {
    id: Date.now(),
    author: currentUser.name,
    headline: currentUser.headline,
    avatar: currentUser.avatar,
    time: "Just now",
    content: text,
    mediaType: mType,
    mediaUrl: mUrl,
    mediaUrls: mUrls,
    likes: 0,
    userLiked: false,
    comments: []
  };

  posts.unshift(newPost);
  localStorage.setItem("lk_posts", JSON.stringify(posts));
  renderPosts();
  renderProfilePosts();
  closePostModal();
  showToast(mUrls.length > 1 ? `Published post with ${mUrls.length} photos! 📸` : "Post published successfully!");
}
