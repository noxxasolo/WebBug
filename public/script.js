// Toggle menu
function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Logout
function logout() {
  localStorage.removeItem('userData');
  window.location.href = 'index.html';
}

// Login
document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const msg = document.getElementById('loginMsg');
  
  try {
    const res = await fetch(RAW_GITHUB_URL);
    const data = await res.json();
    const found = data.find(acc => acc.username === user && acc.password === pass);
    if (found) {
      localStorage.setItem('userData', JSON.stringify(found));
      window.location.href = 'main.html';
    } else {
      msg.textContent = 'Invalid credentials';
      msg.style.display = 'block';
    }
  } catch (err) {
    msg.textContent = 'Error connecting to server';
    msg.style.display = 'block';
  }
});

// Load profile
if (document.getElementById('profileInfo')) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData) {
    window.location.href = 'index.html';
  } else {
    const now = new Date();
    document.getElementById('profileInfo').textContent =
      `👤 Username: ${userData.username} | 🔑 Password: ${userData.password} | 📅 Exp: ${userData.exp} | ⏰ Waktu Sekarang: ${now.toLocaleTimeString()}`;
  }
}

// Show section
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// Trigger bug API
async function triggerBug(type) {
  const apis = {
    fc: 'https://api.example.com/fc',
    crash: 'https://api.example.com/crash',
    type3: 'https://api.example.com/type3',
    type4: 'https://api.example.com/type4'
  };
  const resBox = document.getElementById('bugResult');
  try {
    const res = await fetch(apis[type]);
    const data = await res.json();
    resBox.textContent = `Bug ${type} result: ${JSON.stringify(data)}`;
  } catch (err) {
    resBox.textContent = `Error calling Bug ${type}`;
  }
}