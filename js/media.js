// =========================================================
// LinkedIn Clone - Media, Multi-Image Grid, Lightbox & Quoted Cards
// =========================================================

// Open Lightbox supporting single or multiple images
function openImageLightbox(images, startIndex = 0) {
  if (!images) return;

  if (Array.isArray(images)) {
    lightboxImages = images.filter(u => !!u);
    currentLightboxIndex = Math.max(0, Math.min(startIndex, lightboxImages.length - 1));
  } else if (typeof images === "string") {
    lightboxImages = [images];
    currentLightboxIndex = 0;
  }

  if (lightboxImages.length === 0) return;

  updateLightboxView();
  const modal = document.getElementById("image-lightbox-modal");
  if (modal) modal.classList.remove("hidden");
}

function updateLightboxView() {
  const img = document.getElementById("lightbox-image");
  const counter = document.getElementById("lightbox-counter");
  const prevBtn = document.getElementById("lightbox-prev-btn");
  const nextBtn = document.getElementById("lightbox-next-btn");

  if (img && lightboxImages[currentLightboxIndex]) {
    img.src = lightboxImages[currentLightboxIndex];
  }

  const isMulti = lightboxImages.length > 1;

  if (counter) {
    counter.innerText = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
    counter.classList.toggle("hidden", !isMulti);
  }

  if (prevBtn) prevBtn.classList.toggle("hidden", !isMulti);
  if (nextBtn) nextBtn.classList.toggle("hidden", !isMulti);
}

function prevLightboxImage() {
  if (lightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxView();
}

function nextLightboxImage() {
  if (lightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
  updateLightboxView();
}

function closeImageLightbox() {
  const modal = document.getElementById("image-lightbox-modal");
  if (modal) modal.classList.add("hidden");
  lightboxImages = [];
  currentLightboxIndex = 0;
}

// Global keyboard navigation for Lightbox
window.addEventListener("keydown", (e) => {
  const modal = document.getElementById("image-lightbox-modal");
  if (!modal || modal.classList.contains("hidden")) return;

  if (e.key === "ArrowLeft") {
    prevLightboxImage();
  } else if (e.key === "ArrowRight") {
    nextLightboxImage();
  } else if (e.key === "Escape") {
    closeImageLightbox();
  }
});

// Helper for escaping image JSON in inline onclick attributes
function escapeForOnClick(arr) {
  return JSON.stringify(arr).replace(/"/g, '&quot;');
}

// High quality multi-image collage and media block generator
function buildMediaHtml(mediaType, mediaUrl, isQuoted = false, mediaUrls = null) {
  // Check if video
  if (mediaType === "video" && mediaUrl) {
    const maxHeight = isQuoted ? "max-h-[360px]" : "max-h-[440px]";
    return `
      <div class="mt-2.5 rounded-lg overflow-hidden border border-gray-200 bg-black shadow-xs">
        <video controls class="w-full ${maxHeight} mx-auto">
          <source src="${mediaUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>`;
  }

  // Collect image array
  let images = [];
  if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
    images = mediaUrls.filter(u => typeof u === "string" && u.trim().length > 0);
  } else if (mediaUrl && mediaType !== "none") {
    images = [mediaUrl];
  }

  if (images.length === 0) return "";

  const imagesJson = escapeForOnClick(images);

  // Single Image Layout
  if (images.length === 1) {
    const maxHeight = isQuoted ? "max-h-[420px]" : "max-h-[500px]";
    return `
      <div class="mt-2.5 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group relative cursor-pointer shadow-xs" onclick="openImageLightbox(${imagesJson}, 0)" title="Click to view full image">
        <img src="${images[0]}" 
             alt="Post media" 
             loading="eager"
             class="w-full ${maxHeight} object-cover group-hover:opacity-95 transition-opacity" 
             onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80'" />
        <div class="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded px-2 py-1 text-[11px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <i class="fa-solid fa-expand"></i> View
        </div>
      </div>`;
  }

  // 2 Images Layout (Side-by-side 2-column)
  if (images.length === 2) {
    const height = isQuoted ? "h-52 sm:h-60" : "h-64 sm:h-76";
    return `
      <div class="mt-2.5 grid grid-cols-2 gap-1 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-xs ${height}">
        <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 0)" title="Click to view image 1 of 2">
          <img src="${images[0]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
        </div>
        <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 1)" title="Click to view image 2 of 2">
          <img src="${images[1]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
        </div>
      </div>`;
  }

  // 3 Images Layout (1 large on left, 2 stacked on right)
  if (images.length === 3) {
    const height = isQuoted ? "h-60 sm:h-72" : "h-72 sm:h-84";
    return `
      <div class="mt-2.5 grid grid-cols-2 gap-1 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-xs ${height}">
        <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 0)" title="Click to view image 1 of 3">
          <img src="${images[0]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
        </div>
        <div class="grid grid-rows-2 gap-1 h-full">
          <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 1)" title="Click to view image 2 of 3">
            <img src="${images[1]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
          </div>
          <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 2)" title="Click to view image 3 of 3">
            <img src="${images[2]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
          </div>
        </div>
      </div>`;
  }

  // 4 Images Layout (2x2 grid)
  if (images.length === 4) {
    const height = isQuoted ? "h-64 sm:h-76" : "h-76 sm:h-92";
    return `
      <div class="mt-2.5 grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-xs ${height}">
        ${images.map((imgUrl, i) => `
          <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, ${i})" title="Click to view image ${i + 1} of 4">
            <img src="${imgUrl}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
          </div>
        `).join("")}
      </div>`;
  }

  // 5+ Images Layout (2x2 grid with +X more overlay on 4th image)
  const height = isQuoted ? "h-64 sm:h-76" : "h-76 sm:h-92";
  const remaining = images.length - 3;
  return `
    <div class="mt-2.5 grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-xs ${height}">
      <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 0)">
        <img src="${images[0]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
      </div>
      <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 1)">
        <img src="${images[1]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
      </div>
      <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 2)">
        <img src="${images[2]}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
      </div>
      <div class="relative group cursor-pointer h-full overflow-hidden" onclick="openImageLightbox(${imagesJson}, 3)">
        <img src="${images[3]}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/60 hover:bg-black/75 flex flex-col items-center justify-center text-white font-bold transition-colors">
          <span class="text-2xl sm:text-3xl">+${remaining}</span>
          <span class="text-[11px] font-medium tracking-wide uppercase mt-0.5">View all</span>
        </div>
      </div>
    </div>`;
}

// High fidelity quoted repost card builder
function buildQuotedPostHtml(post) {
  if (!post.isRepost) return "";

  // Ensure proper fallback fields for repost
  let authorName = post.repostAuthor || post.originalAuthor || "Marcus Vance";
  let authorAvatar = post.repostAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80";
  let originalContent = post.repostContent || "";
  let mediaType = post.mediaType || "none";
  let mediaUrl = post.mediaUrl || "";
  let mediaUrls = post.mediaUrls || null;

  // If media is missing, find matching original post in posts or fallback
  if ((!mediaUrl || mediaType === "none") && (!mediaUrls || mediaUrls.length === 0)) {
    const orig = posts.find(o => !o.isRepost && (o.author === authorName || (originalContent && o.content && o.content.includes(originalContent.slice(0, 30)))));
    if (orig && (orig.mediaUrl || (orig.mediaUrls && orig.mediaUrls.length))) {
      mediaUrl = orig.mediaUrl || "";
      mediaUrls = orig.mediaUrls || null;
      mediaType = orig.mediaType || "image";
    } else if (authorName.includes("Marcus") || (originalContent && originalContent.includes("DeepMind"))) {
      mediaUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80";
      mediaUrls = [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
      ];
      mediaType = "image";
    }
  }

  const mediaHtml = buildMediaHtml(mediaType, mediaUrl, true, mediaUrls);

  return `
    <div class="border border-gray-200 rounded-xl p-3.5 mt-2 bg-white hover:bg-gray-50/50 transition-colors shadow-2xs space-y-2">
      <!-- Quoted Original Author Header -->
      <div class="flex items-center gap-2.5">
        <img src="${authorAvatar}" class="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-2xs" />
        <div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-gray-900">${authorName}</span>
            <span class="text-[10px] text-gray-400">• 1st</span>
          </div>
          <p class="text-[11px] text-gray-400 font-medium">Original post • <i class="fa-solid fa-earth-americas text-[10px]"></i></p>
        </div>
      </div>
      <!-- Quoted Original Content -->
      ${originalContent ? `<p class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${originalContent}</p>` : ""}
      <!-- Quoted Original Media (Single/Multi Image or Video) -->
      ${mediaHtml}
    </div>`;
}

// Automatically repair any saved reposts in localStorage that might have missing mediaUrl or avatar
function fixRepostsData() {
  let updated = false;
  posts.forEach(p => {
    if (p.isRepost) {
      if ((!p.mediaUrl && (!p.mediaUrls || !p.mediaUrls.length)) || !p.repostAvatar || !p.repostAuthor || p.mediaType === "none") {
        const orig = posts.find(o => !o.isRepost && (o.author === p.repostAuthor || o.author === p.originalAuthor || (p.repostContent && o.content && o.content.includes(p.repostContent.slice(0, 30)))));
        if (orig) {
          if (orig.mediaUrls && orig.mediaUrls.length) {
            p.mediaUrls = orig.mediaUrls;
            p.mediaUrl = orig.mediaUrl || orig.mediaUrls[0];
            p.mediaType = orig.mediaType || "image";
            updated = true;
          } else if (orig.mediaUrl && (!p.mediaUrl || p.mediaUrl !== orig.mediaUrl)) {
            p.mediaUrl = orig.mediaUrl;
            p.mediaType = orig.mediaType || "image";
            updated = true;
          }
          if (!p.repostAvatar && orig.avatar) { p.repostAvatar = orig.avatar; updated = true; }
          if (!p.repostAuthor && orig.author) { p.repostAuthor = orig.author; updated = true; }
          if (!p.repostContent && orig.content) { p.repostContent = orig.content; updated = true; }
        } else if (p.repostAuthor === "Marcus Vance" || (p.repostContent && p.repostContent.includes("DeepMind"))) {
          p.mediaUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80";
          p.mediaUrls = [
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
          ];
          p.mediaType = "image";
          p.repostAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80";
          p.repostAuthor = "Marcus Vance";
          updated = true;
        }
      }
    }
  });
  if (updated) {
    localStorage.setItem("lk_posts", JSON.stringify(posts));
  }
}
