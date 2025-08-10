const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/noxxasoloera/WebDb/main/database.json';

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from((root || document).querySelectorAll(sel)); }

document.addEventListener('DOMContentLoaded', () => {
  // Toggle dropdown developer di menu garis tiga
  const menuToggle = qs('#menuToggle');
  const dropdownMenu = qs('#dropdownMenu');

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });
  }

  // Tombol developer di dropdown
  const devBtn = qs('#devBtn');
  const dev2Btn = qs('#dev2Btn');

  devBtn?.addEventListener('click', () => {
    window.open('https://t.me/noxxasoloo', '_blank');
  });
  dev2Btn?.addEventListener('click', () => {
    window.open('https://t.me/SyakYanRawr', '_blank');
  });

  // LOGIN PAGE
  const loginForm = qs('#loginForm');
  if (loginForm) {
    const msg = qs('#msg');
    const userInput = qs('#username');
    const passInput = qs('#password');

    loginForm.addEventListener('submit', async e => {
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

  // MAIN PAGE
  const profileInfo = qs('#profileInfo');
  if (profileInfo) {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (!userData) {
      window.location.href = 'index.html';
      return;
    }

    // Tambah elemen waktu realtime di bawah profil info
    const timeNowSpan = document.createElement('div');
    timeNowSpan.id = 'timeNow';
    timeNowSpan.style.marginTop = '10px';
    timeNowSpan.style.fontWeight = 'normal';
    profileInfo.parentElement.insertBefore(timeNowSpan, profileInfo.nextSibling);

    // Set profile info & waktu real-time
    function updateProfileInfo() {
      profileInfo.textContent =
        `Username: ${userData.username}\nPassword: ${userData.password}\nExp: ${userData.exp || 'tidak ada'}`;
      const now = new Date();
      timeNowSpan.textContent = `Waktu Hari ini: ${now.toLocaleTimeString()}`;
    }
    updateProfileInfo();

    // Update waktu setiap detik
    setInterval(() => {
      const now = new Date();
      timeNowSpan.textContent = `Waktu Hari ini: ${now.toLocaleTimeString()}`;
    }, 1000);

    // Logout button
    qs('#logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('userData');
      window.location.href = 'index.html';
    });

    // Navigation show section
    window.showSection = function(id) {
      qsa('.section').forEach(sec => sec.style.display = 'none');
      const target = qs('#' + id);
      if(target) target.style.display = 'block');
      window.scrollTo({top: 0, behavior: 'smooth'});

      if(id === 'bug') {
        showBugSelector();
      }
    };

    // Show default section profile
    showSection('profile');

    // --- BUG MENU ---
    const bugSelector = qs('#bugSelector');
    const bugForm = qs('#bugForm');
    const selectedBugTypeSpan = qs('#selectedBugType');
    const bugResult = qs('#bugResult');
    const bugBackBtn = qs('#bugBackBtn');
    const targetNumberInput = qs('#targetNumber');
    const bugTime = qs('#bugTime');

    let currentBugType = null;

    function showBugSelector() {
      currentBugType = null;
      bugResult.textContent = '';
      bugTime.textContent = '';
      bugForm.style.display = 'none';
      bugSelector.style.display = 'flex';
      targetNumberInput.value = '';
      clearInterval(window.bugTimeInterval);
    }

    // Klik tombol bug type → tampil form kirim bug
    qsa('.bug-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentBugType = btn.dataset.type;
        selectedBugTypeSpan.textContent = currentBugType.toUpperCase();
        bugSelector.style.display = 'none';
        bugForm.style.display = 'block';
        bugResult.textContent = '';
        bugTime.textContent = '';
        targetNumberInput.value = '';
        targetNumberInput.focus();
      });
    });

    // Kirim Bug form submit
    window.sendBug = async function(e) {
      e.preventDefault();
      bugResult.textContent = '';
      bugTime.textContent = '';
      const number = targetNumberInput.value.trim();

      if (!currentBugType || !number) {
        bugResult.textContent = 'Harap pilih tipe bug dan isi nomor target!';
        return;
      }

      const apis = {
        fc: `https://api.example.com/fc?number=${number}`,
        crash: `https://api.example.com/crash?number=${number}`,
        hs: `https://api.example.com/hs?number=${number}`,
        jw: `https://api.example.com/jw?number=${number}`
      };

      try {
        const res = await fetch(apis[currentBugType]);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        const now = new Date();
        bugResult.textContent =
          `Success bug type ${currentBugType.toUpperCase()}\nTarget: ${number}\nResponse: ${JSON.stringify(data)}`;

        bugTime.textContent = `Waktu: ${now.toLocaleTimeString()}`;

        // Update waktu live setiap detik
        clearInterval(window.bugTimeInterval);
        window.bugTimeInterval = setInterval(() => {
          const nowLive = new Date();
          bugTime.textContent = `Waktu: ${nowLive.toLocaleTimeString()}`;
        }, 1000);

      } catch (err) {
        bugResult.textContent = `Error mengirim bug type ${currentBugType.toUpperCase()}`;
        bugTime.textContent = '';
        clearInterval(window.bugTimeInterval);
      }
    };

    // Tombol back di bug form
    bugBackBtn.addEventListener('click', () => {
      showBugSelector();
    });
  }
});
