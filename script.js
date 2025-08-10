const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/yourname/repo/branch/database.json'; // <-- ganti ini


function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from((root || document).querySelectorAll(sel)); }


document.addEventListener('DOMContentLoaded', () => {
  // Jika halaman punya form login
  const loginForm = qs('#loginForm');
  if (loginForm) {
    const msg = qs('#msg');
    const userInput = qs('#username');
    const passInput = qs('#password');
    const demoBtn = qs('#demoBtn');

    // Demo (untuk testing lokal)
    demoBtn?.addEventListener('click', () => {
      userInput.value = 'demo';
      passInput.value = 'demo';
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.style.display = 'none';
      const user = userInput.value.trim();
      const pass = passInput.value.trim();

      if (!user || !pass) {
        msg.textContent = 'Isi username & password';
        msg.style.display = 'block';
        return;
      }

      try {
        const res = await fetch(RAW_GITHUB_URL);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        // data diasumsikan array object dengan fields: username, password, exp, dll.
        const found = (Array.isArray(data) ? data : []).find(acc => acc.username === user && acc.password === pass);

        if (found) {
          localStorage.setItem('userData', JSON.stringify(found));
          window.location.href = 'main.html';
        } else {
          msg.textContent = 'Invalid credentials';
          msg.style.display = 'block';
        }
      } catch (err) {
        console.error(err);
        msg.textContent = 'Error connecting to server';
        msg.style.display = 'block';
      }
    });
  }

  /* -------------------------------------------------
     KODE YANG BERJALAN DI HALAMAN MAIN (main.html)
     ------------------------------------------------- */
  const profileInfo = qs('#profileInfo');
  if (profileInfo) {
    // Cek login
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (!userData) {
      window.location.href = 'index.html';
      return;
    }

    // tampilkan profil
    function updateProfileView() {
      const now = new Date();
      profileInfo.textContent =
        `👤 Username: ${userData.username} | 🔑 Password: ${userData.password} | 📅 Exp: ${userData.exp || 'tidak ada'} | ⏰ Waktu Sekarang: ${now.toLocaleTimeString()}`;
    }
    updateProfileView();

    // waktu di topbar update tiap 1s
    const timeNow = qs('#timeNow');
    function tick() {
      const now = new Date();
      timeNow.textContent = now.toLocaleString();
    }
    tick();
    setInterval(tick, 1000);

    // logout
    qs('#logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('userData');
      window.location.href = 'index.html';
    });

    // show default section
    showSection('profile');
  }
});

/* -------------------------------------------------
   Fungsi navigasi section (dipakai oleh main.html)
   ------------------------------------------------- */
function showSection(id) {
  qsa('.section').forEach(sec => sec.style.display = 'none');
  const target = qs('#' + id);
  if (target) target.style.display = 'block';

  // scroll to top of content area for UX
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -------------------------------------------------
   Fungsi untuk memanggil API bug (dipanggil dari tombol)
   ------------------------------------------------- */
async function sendBug(e) {
  e.preventDefault();
  const type = document.getElementById('bugType').value;
  const number = document.getElementById('targetNumber').value;
  const resBox = document.getElementById('bugResult');

  if (!type || !number) {
    resBox.textContent = "Harap pilih type bug dan masukkan nomor!";
    return;
  }

  const apis = {
    fc: `https://api.example.com/fc?number=${number}`,
    crash: `https://api.example.com/crash?number=${number}`,
    type3: `https://api.example.com/type3?number=${number}`,
    type4: `https://api.example.com/type4?number=${number}`
  };

  try {
    const res = await fetch(apis[type]);
    const data = await res.json();
    resBox.textContent = `Bug ${type} result: ${JSON.stringify(data)}`;
  } catch (err) {
    resBox.textContent = `Error calling Bug ${type}`;
  }
}