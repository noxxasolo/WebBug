const RAW_GITHUB_URL = "https://raw.githubusercontent.com/noxxasoloera/WebDb/main/database.json";

// LOGIN HANDLER
if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const msg = document.getElementById("loginMsg");
    msg.style.display = "none";

    try {
      const res = await fetch(RAW_GITHUB_URL);
      const data = await res.json();
      const found = data.find(u => u.username === user && u.password === pass);

      if (found) {
        localStorage.setItem("userData", JSON.stringify(found));
        window.location = "main.html";
      } else {
        msg.innerText = "Username atau password salah!";
        msg.style.display = "block";
      }
    } catch (err) {
      msg.innerText = "Gagal menghubungi server!";
      msg.style.display = "block";
    }
  });
}

// MAIN PAGE HANDLER
if (window.location.pathname.includes("main.html")) {
  const menuBtn = document.getElementById("menuBtn");
  const dropdown = document.getElementById("dropdownMenu");
  menuBtn.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userData");
    window.location = "index.html";
  });

  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => loadPage(btn.dataset.page));
  });

  loadPage("profile");
}

// LOAD PAGES
function loadPage(page) {
  const content = document.getElementById("content");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    window.location = "index.html";
    return;
  }

  if (page === "profile") {
    content.innerHTML = `
      <h2>All Team Galaxy 🌌🚀✨💫🔥⚡🌠🌟🌍🌙🪐⭐</h2>
      <p>💻🌐🔥 Kami adalah tim luar biasa penuh semangat, kreativitas, dan keberanian! 
      Selalu siap menjelajahi dunia bug, eksplorasi tak terbatas, dan inovasi tanpa henti! 🚀✨💡🔥⚡🌌💎</p>
      <p><b>Username:</b> ${userData.username}</p>
      <p><b>Password:</b> ${userData.password}</p>
      <p><b>Exp:</b> ${userData.exp}</p>
      <p><b>Waktu:</b> <span id="realTime"></span></p>
      <button id="logoutBtn2">Logout</button>
    `;
    document.getElementById("logoutBtn2").addEventListener("click", () => {
      localStorage.removeItem("userData");
      window.location = "index.html";
    });
    setInterval(() => {
      document.getElementById("realTime").innerText = new Date().toLocaleTimeString();
    }, 1000);
  }

  if (page === "bugs") {
    content.innerHTML = `
      <h2>Menu Bug</h2>
      <input type="text" id="target" placeholder="Nomor WA (628xxx)">
      <div>
        <button class="bug-btn" onclick="sendBug('fc')">FC</button>
        <button class="bug-btn" onclick="sendBug('crash')">Crash</button>
        <button class="bug-btn" onclick="sendBug('delay')">Delay</button>
        <button class="bug-btn" onclick="sendBug('blank')">Blank</button>
      </div>
      <div id="bugResult"></div>
    `;
  }

  if (page === "thanks") {
    content.innerHTML = `
      <h2>Thanks To</h2>
      <p>Special thanks to:</p>
      <p><a href="https://t.me/noxxasoloo" target="_blank">Developer 1</a></p>
      <p><a href="https://t.me/SyakYanRawr" target="_blank">Developer 2</a></p>
    `;
  }
}

// BUG API SENDER
const bugApi = {
  fc: "https://example.com/api?type=fc",
  crash: "https://example.com/api?type=crash",
  delay: "https://example.com/api?type=delay",
  blank: "https://example.com/api?type=blank"
};

async function sendBug(type) {
  const target = document.getElementById("target").value.trim();
  const resDiv = document.getElementById("bugResult");
  if (!target) {
    resDiv.innerText = "Masukkan nomor target!";
    return;
  }
  try {
    const res = await fetch(`${bugApi[type]}&target=${encodeURIComponent(target)}`);
    const json = await res.json();
    resDiv.innerText = "✅ Bug terkirim: " + JSON.stringify(json);
  } catch (err) {
    resDiv.innerText = "❌ Gagal: " + err;
  }
}