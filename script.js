const RAW_GITHUB_URL = "https://raw.githubusercontent.com/noxxasoloera/WebDb/main/database.json";

const bugApi = {
  fc: "https://api.example.com?type=fc",
  crash: "https://api.example.com?type=crash",
  delay: "https://api.example.com?type=delay",
  blank: "https://api.example.com?type=blank"
};

// LOGIN PAGE
if (document.body.classList.contains("login-page")) {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth; canvas.height = innerHeight;
  let hue = 200;
  function animateBG() {
    hue = (hue + 0.5) % 360;
    ctx.fillStyle = `hsl(${hue}, 80%, 20%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animateBG);
  }
  animateBG();

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const msg = document.getElementById("loginMsg");
    msg.style.display = "block";

    try {
      const res = await fetch(RAW_GITHUB_URL);
      const data = await res.json();
      const found = data.find(u => u.username === user && u.password === pass);
      if (!found) return msg.textContent = "❌ Username atau Password salah!";
      if (new Date(found.exp + "T23:59:59Z") < new Date()) return msg.textContent = "⏳ Akun expired!";
      localStorage.setItem("userData", JSON.stringify(found));
      window.location = "main.html";
    } catch (err) {
      msg.textContent = "Gagal koneksi login!";
    }
  });
}

// MAIN PAGE
if (!document.body.classList.contains("login-page")) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.username) return window.location = "index.html";

  document.getElementById("profUsername").textContent = userData.username;
  document.getElementById("profPassword").textContent = userData.password;
  document.getElementById("profExp").textContent = userData.exp;

  function updateTime() {
    document.getElementById("profTime").textContent = new Date().toLocaleTimeString();
  }
  setInterval(updateTime, 1000); updateTime();

  document.getElementById("menuBtn").addEventListener("click", () => {
    const dd = document.getElementById("menuDropdown");
    dd.style.display = dd.style.display === "block" ? "none" : "block";
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userData");
    window.location = "index.html";
  });
  document.getElementById("logoutBtn2").addEventListener("click", () => {
    localStorage.removeItem("userData");
    window.location = "index.html";
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".page").forEach(p => p.style.display = "none");
      document.getElementById(btn.dataset.page + "Page").style.display = "block";
    });
  });

  let selectedBug = null;
  document.querySelectorAll(".bug-card").forEach(card => {
    card.addEventListener("click", () => {
      selectedBug = card.dataset.bug;
      document.querySelectorAll(".bug-card").forEach(c => c.style.background = "#222");
      card.style.background = "#555";
    });
  });

  document.getElementById("sendBtn").addEventListener("click", async () => {
    const input = document.getElementById("target").value.trim();
    const result = document.getElementById("result");
    if (!selectedBug) return result.textContent = "Pilih jenis bug!";
    if (!/^\d+$/.test(input)) return result.textContent = "Nomor WA invalid!";

    try {
      const response = await fetch(`${bugApi[selectedBug]}&target=${encodeURIComponent(input)}`);
      const data = await response.json();
      result.textContent = `Berhasil kirim bug ${selectedBug} ke ${input}`;
    } catch (err) {
      result.textContent = "Gagal kirim bug!";
    }
  });
}