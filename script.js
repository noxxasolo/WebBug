const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/noxxasoloera/WebDb/main/database.json'; // <-- ganti ini

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from((root || document).querySelectorAll(sel)); }

document.addEventListener('DOMContentLoaded', () => {
  // Jika halaman punya form login
  const loginForm = qs('#loginForm');
  if (loginForm) {
    const msg = qs('#msg');
    const userInput = qs('#username');
    const passInput = qs('#password');

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

  /* Main.html code */
  const profileInfo = qs('#profileInfo');
  if (profileInfo) {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (!userData) {
      window.location.href = 'index.html';
      return;
    }

    function updateProfileView() {
      const now = new Date();
      profileInfo.textContent =
        `👤 Username: ${userData.username}\n🔑 Password: ${userData.password}\n 📅 Exp: ${userData.exp || 'tidak ada'}\n⏰ Waktu Hari ini: ${now.toLocaleTimeString()}`;
    }
    updateProfileView();
    setInterval(updateProfileView, 1000);

    const timeNow = qs('#timeNow');
    if (timeNow) {
      function tick() {
        const now = new Date();
        timeNow.textContent = now.toLocaleString();
      }
      tick();
      setInterval(tick, 1000);
    }

    qs('#logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('userData');
      window.location.href = 'index.html';
    });

    showSection('profile');

    // Toggle dropdown developer menu
    const menuToggle = qs('#menuToggle');
    const dropdownMenu = qs('#dropdownMenu');
    menuToggle?.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });

    // Developer buttons
    const devBtn = qs('#devBtn');
    const dev2Btn = qs('#dev2Btn');

    devBtn?.addEventListener('click', () => {
      window.open('https://t.me/noxxasoloera', '_blank');
    });

    dev2Btn?.addEventListener('click', () => {
      window.open('https://t.me/SyakYanRawr', '_blank');
    });

    // Bug selector buttons & form handling
    const bugSelector = qs('#bugSelector');
    const bugForm = qs('#bugForm');
    const selectedBugTypeSpan = qs('#selectedBugType');
    const bugResult = qs('#bugResult');
    const bugTime = qs('#bugTime');
    const bugBackBtn = qs('#bugBackBtn');

    bugSelector?.addEventListener('click', (e) => {
      if (e.target.classList.contains('bug-btn')) {
        const type = e.target.getAttribute('data-type');
        selectedBugTypeSpan.textContent = type.toUpperCase();
        bugForm.style.display = 'block';
        bugSelector.style.display = 'grid';
        bugResult.textContent = '';
        bugTime.textContent = '';
      }
    });

    bugBackBtn?.addEventListener('click', () => {
      bugForm.style.display = 'none';
      bugSelector.style.display = 'flex';
      bugResult.textContent = '';
      bugTime.textContent = '';
      qs('#targetNumber').value = '';
    });

    bugForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = selectedBugTypeSpan.textContent.toLowerCase();
      const number = qs('#targetNumber').value.trim();

      if (!number) {
        bugResult.textContent = 'Harap masukkan nomor target!';
        return;
      }

      const apis = {
        fc: `https://api.example.com/fc?number=${number}`,
        crash: `https://api.example.com/crash?number=${number}`,
        hs: `https://api.example.com/hs?number=${number}`,
        jw: `https://api.example.com/jw?number=${number}`
      };

      try {
        const res = await fetch(apis[type]);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        bugResult.textContent = `Success bug type ${type.toUpperCase()}`;
        bugTime.textContent = `Target: ${number} | Waktu: ${new Date().toLocaleString()}`;
      } catch (err) {
        bugResult.textContent = `Error calling bug type ${type.toUpperCase()}`;
        bugTime.textContent = '';
      }
    });
  }
});

/* Fungsi navigasi section */
function showSection(id) {
  qsa('.section').forEach(sec => sec.style.display = 'none');
  const target = qs('#'+id);
  if (target) target.style.display = 'block';
  window.scrollTo({top:0, behavior: 'smooth'});
}
