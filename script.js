const RAW_GITHUB_URL = "https://raw.githubusercontent.com/noxxasoloera/WebDb/main/database.json";

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("login-page")) {
    initLoginAnimation();
    document.getElementById("loginBtn").addEventListener("click", login);
  } else {
    initMainPage();
  }
});

function initLoginAnimation() {
  const canvas = document.getElementById("loginCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, t = 0;
  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}
  window.addEventListener("resize", resize);resize();
  function wave(yOffset, amp, freq, phase, color){
    ctx.beginPath();
    for(let x=0;x<=w;x++){
      const y=yOffset+Math.sin((x*freq)+phase+t)*amp;
      ctx.lineTo(x,y);
    }
    ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();
    ctx.fillStyle=color;ctx.fill();
  }
  function draw(){
    t+=0.02;
    const grd=ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,"#001f3f");grd.addColorStop(0.5,"#004080");grd.addColorStop(1,"#000");
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    wave(h*0.5,20,0.02,0,"rgba(0,150,255,0.2)");
    wave(h*0.55,30,0.015,1,"rgba(0,180,255,0.25)");
    wave(h*0.6,40,0.01,2,"rgba(0,200,255,0.3)");
    wave(h*0.65,50,0.008,3,"rgba(0,220,255,0.35)");
    wave(h*0.7,60,0.006,4,"rgba(0,255,255,0.4)");
    requestAnimationFrame(draw);
  }
  draw();
}

async function login(){
  const user=document.getElementById("loginUser").value.trim();
  const pass=document.getElementById("loginPass").value.trim();
  const msg=document.getElementById("loginMsg");
  msg.style.display="block";
  msg.style.color="#ffd2d2";
  if(!user||!pass){msg.textContent="Isi semua field!";return;}
  try{
    const res=await fetch(RAW_GITHUB_URL);
    const data=await res.json();
    const found=data.find(u=>u.username===user&&u.password===pass);
    if(found){
      localStorage.setItem("userData",JSON.stringify(found));
      location.href="main.html";
    }else{
      msg.textContent="Username/Password salah!";
    }
  }catch(e){
    msg.textContent="Gagal koneksi ke server!";
  }
}

function initMainPage(){
  const userData=JSON.parse(localStorage.getItem("userData")||"{}");
  if(!userData.username){location.href="index.html";return;}
  document.getElementById("profUser").textContent=userData.username;
  document.getElementById("profPass").textContent=userData.password;
  document.getElementById("profExp").textContent=userData.exp;
  setInterval(()=>{
    document.getElementById("realTime").textContent=new Date().toLocaleTimeString();
  },1000);

  document.querySelectorAll(".tabBtn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".tabBtn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tabContent").forEach(c=>c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  document.getElementById("menuBtn").addEventListener("click",()=>{
    document.getElementById("dropdownMenu").classList.toggle("hidden");
  });

  document.getElementById("logoutBtn").addEventListener("click",()=>{
    localStorage.removeItem("userData");
    location.href="index.html";
  });

  let selectedBug="";
  document.querySelectorAll(".bug-card").forEach(card=>{
    card.addEventListener("click",()=>{
      document.querySelectorAll(".bug-card").forEach(c=>c.classList.remove("active"));
      card.classList.add("active");
      selectedBug=card.dataset.bug;
    });
  });

  document.getElementById("sendBtn").addEventListener("click",async()=>{
    const target=document.getElementById("target").value.trim();
    const resDiv=document.getElementById("result");
    if(!/^\d+$/.test(target)){resDiv.textContent="Nomor tidak valid!";return;}
    if(!selectedBug){resDiv.textContent="Pilih bug dulu!";return;}
    try{
      const apiMap={
        fc:"https://api.example.com/fc",
        crash:"https://api.example.com/crash",
        delay:"https://api.example.com/delay",
        blank:"https://api.example.com/blank"
      };
      const res=await fetch(`${apiMap[selectedBug]}?target=${encodeURIComponent(target)}`);
      if(res.ok){
        resDiv.textContent=`Bug ${selectedBug} berhasil dikirim ke ${target}`;
      }else{
        resDiv.textContent="Gagal mengirim bug!";
      }
    }catch(e){
      resDiv.textContent="Error: "+e;
    }
  });
}