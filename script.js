// ====== ELEMENTS ======
const input = document.getElementById("yt-url");
const btn = document.getElementById("fetch-btn");
const grid = document.getElementById("thumb-grid");
const status = document.getElementById("status");
const loader = document.getElementById("loader");

// ====== THUMBNAIL QUALITIES ======
const qualities = [
  { key: "maxresdefault", label: "Max Resolution" },
  { key: "hqdefault", label: "High Quality" },
  { key: "mqdefault", label: "Medium Quality" },
  { key: "default", label: "Default" }
];

// ====== EXTRACT VIDEO ID ======
function extractVideoId(url) {
  try {
    const u = new URL(url);

    // youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }

    // youtube.com/shorts/VIDEO_ID
    if (u.pathname.includes("/shorts/")) {
      return u.pathname.split("/shorts/")[1].split("?")[0];
    }

    // youtube.com/watch?v=VIDEO_ID
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

// ====== UI HELPERS ======
function showError(msg) {
  status.textContent = msg;
  status.style.color = "#ff6b6b";
  input.classList.add("error");
}

function clearError() {
  status.textContent = "";
  input.classList.remove("error");
}

// ====== CHECK IMAGE EXISTS ======
function imageExists(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// ====== FORCE DOWNLOAD (IMPORTANT FIX) ======
function forceDownload(url, filename) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Network error");
      return res.blob();
    })
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      alert("Download failed. Please try again.");
    });
}

// ====== MAIN LOGIC ======
btn.addEventListener("click", async () => {
  clearError();
  grid.innerHTML = "";

  const url = input.value.trim();

  if (!url) {
    showError("Please paste a YouTube link first.");
    return;
  }

  const videoId = extractVideoId(url);

  if (!videoId) {
    showError("Oops! That doesn’t look like a valid YouTube link.");
    return;
  }

  loader.classList.remove("hidden");
  status.textContent = "Fetching thumbnails...";
  status.style.color = "#ccc";

  let found = false;

  for (const q of qualities) {
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/${q.key}.jpg`;

    if (await imageExists(thumbUrl)) {
      found = true;

      const div = document.createElement("div");
      div.className = "thumb";
      div.innerHTML = `
        <img src="${thumbUrl}" loading="lazy" alt="${q.label}">
        <button class="download-btn">Download (${q.label})</button>
      `;

      div.querySelector(".download-btn").addEventListener("click", () => {
        forceDownload(thumbUrl, `${videoId}-${q.key}.jpg`);
      });

      grid.appendChild(div);
    }
  }

  loader.classList.add("hidden");

  if (!found) {
    showError("No thumbnails available for this video.");
  } else {
    status.textContent = "Thumbnails ready!";
    status.style.color = "#7CFC98";
  }
});

// ====== CLEAR ERROR ON INPUT ======
input.addEventListener("input", clearError);
