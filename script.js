/* ════════════════ STATE ════════════════ */
const S = {
  user: null,
  room: { name:'Aria Sharma', emoji:'👩', status:'online', sub:'Designer at Figma • Mumbai', id:'aria' },
  replyTo: null,
  callTimer: null,
  ctxTarget: null,
};

const CONTACTS = {
  aria:    { handle:'@aria.sharma',  work:'Designer at Figma',    location:'Mumbai, India',    bio:'Design is not just what it looks like — it is how it works ✨', joined:'January 2024' },
  devteam: { handle:'@devteam',      work:'Engineering Group',    location:'Remote / India',   bio:'Building the future one commit at a time 🚀',                  joined:'August 2023'  },
  lucas:   { handle:'@lucas.white',  work:'Product Manager',      location:'Bengaluru, India', bio:'Shipping products that people love 📦',                        joined:'March 2023'   },
  design:  { handle:'@designsquad',  work:'Design Community',     location:'All India',        bio:'Where pixels meet purpose 🎨',                                joined:'June 2023'    },
  mia:     { handle:'@mia.chen',     work:'Startup Founder',      location:'Delhi, India',     bio:'Building the next big thing. One day at a time 💡',            joined:'November 2023'},
  noah:    { handle:'@noah.park',    work:'Software Engineer',    location:'Pune, India',      bio:'Code, coffee, repeat ☕',                                      joined:'February 2024'},
  priya:   { handle:'@priya.patel',  work:'Full Stack Developer', location:'Ahmedabad, India', bio:'Full stack devs do it both ways 😄',                           joined:'December 2023'},
};

const REPLIES = [
  "Haha that's so true! 😂","Sounds amazing! Let's do it 🔥","Wait really? 👀","OMG yes!! 🎉",
  "Hmm let me think 🤔","Sure works for me! 👌","Absolutely! Count me in 💪","No way!! 😮",
  "That's hilarious 😅","Can't wait!! ✨","Great idea! 💡","Let's goo! 🚀","Same 😊",
  "Okay you convinced me 😎","Agreed 100% 🙏",
];

/* ════════════════ AUTH ════════════════ */
function showView(id) {
  document.getElementById('loginView').classList.toggle('hidden', id !== 'loginView');
  document.getElementById('signupView').classList.toggle('hidden', id !== 'signupView');
}
function toggleEye(id, btn) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? '👁️' : '🙈';
}
function setLoading(id, on, txt) {
  const b = document.getElementById(id);
  b.disabled = on;
  b.innerHTML = on ? '<span class="spinner"></span> Please wait...' : txt;
}
function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = '⚠️ ' + msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}
function socialAuth(p) { showToast('🔗', p, p + ' auth — connect your backend!'); }
function forgotPassword() {
  const e = document.getElementById('loginEmail').value;
  if (!e) { showErr('loginErr','Enter your email first'); return; }
  showToast('📧','Password Reset','Reset link sent to ' + e);
}
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  if (!email)         return showErr('loginErr','Enter your email');
  if (!validEmail(email)) return showErr('loginErr','Invalid email');
  if (pass.length < 6)   return showErr('loginErr','Password too short (min 6)');
  setLoading('loginBtn', true);
  setTimeout(() => {
    setLoading('loginBtn', false, 'Sign In →');
    S.user = { name: cap(email.split('@')[0]), email, emoji: pickEmoji(email) };
    enterApp();
  }, 1400);
}
function handleSignup() {
  const first = document.getElementById('signupFirst').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPass').value;
  const last  = document.getElementById('signupLast').value.trim();
  if (!first)         return showErr('signupErr','Enter first name');
  if (!validEmail(email)) return showErr('signupErr','Invalid email');
  if (pass.length < 6)   return showErr('signupErr','Password too short (min 6)');
  setLoading('signupBtn', true);
  setTimeout(() => {
    setLoading('signupBtn', false, 'Create Account →');
    S.user = { name: first + (last ? ' '+last : ''), email, emoji: pickEmoji(first) };
    enterApp();
  }, 1500);
}
function enterApp() {
  document.getElementById('authScreen').classList.remove('active');
  document.getElementById('appScreen').classList.add('active');
  document.getElementById('sbUserAv').textContent   = S.user.emoji;
  document.getElementById('sbUserName').textContent = S.user.name;
  document.getElementById('myPpAvatar').textContent = S.user.emoji;
  document.getElementById('myPpName').textContent   = S.user.name;
  document.getElementById('myPpHandle').textContent = '@' + S.user.name.toLowerCase().replace(/\s+/g,'.');
  document.getElementById('myPpEmail').textContent  = S.user.email;
  // Load default room
  const first = document.querySelector('.room-item');
  if (first) first.click();
}
function logout() {
  if (!confirm('Sign out?')) return;
  S.user = null;
  document.getElementById('appScreen').classList.remove('active');
  document.getElementById('authScreen').classList.add('active');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPass').value = '';
  showView('loginView');
}

/* ════════════════ SIDEBAR ════════════════ */
function openSidebar()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('active'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('active'); }
function setTab(el) { document.querySelectorAll('.sb-tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
function filterRooms(v) {
  document.querySelectorAll('.room-item').forEach(r => {
    r.style.display = r.querySelector('.room-name').textContent.toLowerCase().includes(v.toLowerCase()) ? '' : 'none';
  });
}
function newChatPrompt() {
  const n = prompt('Username or name:');
  if (n && n.trim()) showToast('💬','New Chat','Starting chat with ' + n.trim() + '...');
}

/* ════════════════ ROOM ════════════════ */
function openRoom(el, name, emoji, status, sub) {
  document.querySelectorAll('.room-item').forEach(r => r.classList.remove('active'));
  el.classList.add('active');
  el.querySelector('.badge')?.remove();

  S.room = { name, emoji, status, sub, id: el.dataset.room };

  document.getElementById('chatAv').textContent   = emoji;
  document.getElementById('chatName').textContent = name;
  document.getElementById('chatSub').textContent  =
    status === 'online' ? '● Online now' :
    status === 'away'   ? '⊙ Away · ' + sub :
    status === 'group'  ? '👥 ' + sub : '○ Offline · ' + sub;
  document.getElementById('msgInput').placeholder = 'Message ' + name.split(' ')[0] + '...';
  document.getElementById('typingText').textContent = name.split(' ')[0] + ' is typing...';

  document.getElementById('noChat').style.display   = 'none';
  document.getElementById('chatView').style.display = 'flex';
  document.getElementById('chatView').classList.remove('hidden');

  // Fresh messages for each room
  const box = document.getElementById('messages');
  box.innerHTML = '<div class="date-chip">Today</div>';
  const seed = [
    { t:'them', txt:'Hey! What\'s up? 👋' },
    { t:'me',   txt:'All good! You?' },
    { t:'them', txt:'Great, just working 💻' },
  ];
  if (el.dataset.room === 'aria') {
    seed[0].txt = 'Hey! Free tonight? Thinking rooftop dinner ✨🍷';
    seed[1].txt = 'Yes! 100% in 🔥 What time?';
    seed[2].txt = 'Around 8 PM? Meet at The Sky Lounge 🌃';
  }
  seed.forEach(s => addMsg(s.t, s.txt, name, emoji, false));

  scrollBottom(); clearReply(); closeSidebar();
}

/* ════════════════ MESSAGING ════════════════ */
function sendMsg() {
  const inp = document.getElementById('msgInput');
  const txt = inp.value.trim();
  if (!txt) return;
  addMsg('me', txt);
  inp.value = ''; inp.style.height = 'auto';
  clearReply(); scrollBottom();
  setTimeout(() => showTyping(), 700 + Math.random()*400);
  setTimeout(() => {
    hideTyping();
    const r = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    addMsg('them', r, S.room.name, S.room.emoji);
    scrollBottom();
    showToast(S.room.emoji, S.room.name, r);
  }, 1800 + Math.random()*900);
}

function addMsg(type, text, sender='', emoji='', animate=true) {
  const box  = document.getElementById('messages');
  const wrap = document.createElement('div');
  wrap.className = 'msg-wrap';
  const isMe = type === 'me';
  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const avBg = isMe ? 'linear-gradient(135deg,#082040,#0ea5e9)' : 'linear-gradient(135deg,#0d2b5e,#0ea5e9)';
  const av   = isMe ? (S.user?.emoji || '😊') : emoji;
  const replyHtml = S.replyTo
    ? `<div style="background:rgba(14,165,233,0.08);border-left:3px solid #0ea5e9;border-radius:8px;padding:5px 10px;margin-bottom:6px;font-size:12px;color:#93c5d8;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:200px">↩ ${esc(S.replyTo)}</div>` : '';

  wrap.innerHTML = `
    <div class="msg-row ${isMe ? 'me' : 'them'}">
      <div class="msg-av" style="background:${avBg}">${av}</div>
      <div class="msg-body">
        ${!isMe && sender ? `<div class="msg-sender-name">${esc(sender)}</div>` : ''}
        <div class="bubble-outer">
          <div class="react-trigger">
            <button class="react-btn" onclick="addReact(this,'❤️')">❤️</button>
            <button class="react-btn" onclick="addReact(this,'😂')">😂</button>
            <button class="react-btn" onclick="addReact(this,'👍')">👍</button>
            <button class="react-btn" onclick="addReact(this,'🔥')">🔥</button>
            <button class="react-btn" onclick="addReact(this,'😮')">😮</button>
          </div>
          <div class="bubble">${replyHtml}${esc(text)}</div>
        </div>
        <div class="reactions-row"></div>
        <div class="msg-footer">
          <span class="msg-time">${time}</span>
          ${isMe ? '<span class="read-tick">✓✓</span>' : ''}
        </div>
      </div>
    </div>`;

  if (!animate) wrap.style.animation = 'none';
  box.appendChild(wrap);

  // Right-click / long-press → context menu
  const row = wrap.querySelector('.msg-row');
  row.addEventListener('contextmenu', e => openCtx(e, wrap));
  let pt;
  row.addEventListener('touchstart', ev => {
    pt = setTimeout(() => {
      const t = ev.touches[0];
      openCtx({ preventDefault(){}, stopPropagation(){}, clientX:t.clientX, clientY:t.clientY }, wrap);
    }, 600);
  }, { passive:true });
  row.addEventListener('touchend',  () => clearTimeout(pt), { passive:true });
  row.addEventListener('touchmove', () => clearTimeout(pt), { passive:true });
}

/* ════════════════ TYPING ════════════════ */
function showTyping() { document.getElementById('typingBar').style.visibility = 'visible'; scrollBottom(); }
function hideTyping() { document.getElementById('typingBar').style.visibility = 'hidden'; }

/* ════════════════ REACTIONS ════════════════ */
function addReact(btn, em) {
  const row = btn.closest('.bubble-outer').parentElement.querySelector('.reactions-row');
  let chip = [...row.querySelectorAll('.rc-chip')].find(c => c.dataset.e === em);
  if (chip) {
    const n = parseInt(chip.querySelector('.rc-count').textContent) + 1;
    chip.querySelector('.rc-count').textContent = n;
  } else {
    chip = document.createElement('div');
    chip.className = 'rc-chip'; chip.dataset.e = em;
    chip.innerHTML = em + ' <span class="rc-count">1</span>';
    chip.onclick = () => {
      const n = parseInt(chip.querySelector('.rc-count').textContent) - 1;
      n < 1 ? chip.remove() : chip.querySelector('.rc-count').textContent = n;
    };
    row.appendChild(chip);
  }
}

/* ════════════════ REPLY ════════════════ */
function setReply(name, text) {
  S.replyTo = text;
  document.getElementById('replyToName').textContent  = name;
  document.getElementById('replyPreview').textContent = text.substring(0, 60);
  document.getElementById('replyStrip').classList.add('show');
  document.getElementById('msgInput').focus();
}
function clearReply() {
  S.replyTo = null;
  document.getElementById('replyStrip').classList.remove('show');
}

/* ════════════════ EMOJI ════════════════ */
function toggleEmoji() { document.getElementById('emojiPicker').classList.toggle('open'); }
function insertEmoji(e) {
  const inp = document.getElementById('msgInput');
  inp.value += e; inp.focus();
  document.getElementById('emojiPicker').classList.remove('open');
  autoResize(inp);
}
document.addEventListener('click', e => {
  if (!e.target.closest('.input-action') && !e.target.closest('#emojiPicker'))
    document.getElementById('emojiPicker').classList.remove('open');
  if (!e.target.closest('#ctxMenu')) closeCtx();
});

/* ════════════════ FILE / IMAGE ════════════════ */
function handleFile(inp) {
  if (!inp.files.length) return;
  const f = inp.files[0];
  if (f.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => {
      const box = document.getElementById('messages');
      const wrap = document.createElement('div');
      wrap.className = 'msg-wrap';
      const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      const av = S.user?.emoji || '😊';
      wrap.innerHTML = `
        <div class="msg-row me">
          <div class="msg-av" style="background:linear-gradient(135deg,#082040,#0ea5e9)">${av}</div>
          <div class="msg-body">
            <div class="bubble-outer">
              <div class="bubble" style="padding:6px">
                <img src="${ev.target.result}" class="bubble-img" onclick="openLightbox(this.src,'${esc(f.name)}')">
              </div>
            </div>
            <div class="reactions-row"></div>
            <div class="msg-footer"><span class="msg-time">${time}</span><span class="read-tick">✓✓</span></div>
          </div>
        </div>`;
      box.appendChild(wrap);
      scrollBottom();
      // context menu for image msg
      const row = wrap.querySelector('.msg-row');
      row.addEventListener('contextmenu', e => openCtx(e, wrap));
    };
    reader.readAsDataURL(f);
  } else {
    addMsg('me', '📎 ' + f.name);
    scrollBottom();
  }
  inp.value = '';
}

/* ════════════════ IMAGE LIGHTBOX ════════════════ */
function openLightbox(src, title) {
  document.getElementById('lbImg').src = src;
  document.getElementById('lbTitle').textContent = title || 'Image';
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  setTimeout(() => document.getElementById('lbImg').src = '', 300);
}
function downloadLbImg() {
  const src = document.getElementById('lbImg').src;
  if (!src) return;
  const a = document.createElement('a');
  a.href = src; a.download = 'chatadda-img.jpg'; a.click();
}

/* ════════════════ CONTEXT MENU ════════════════ */
function openCtx(e, wrap) {
  e.preventDefault(); e.stopPropagation();
  S.ctxTarget = wrap;
  const menu = document.getElementById('ctxMenu');
  const isMe = !!wrap.querySelector('.msg-row.me');
  document.getElementById('ctxDelAll').style.display = isMe ? '' : 'none';
  menu.style.display = 'block';
  // Position
  const mw = menu.offsetWidth, mh = menu.offsetHeight;
  let x = e.clientX, y = e.clientY;
  if (x + mw > window.innerWidth)  x = window.innerWidth  - mw - 8;
  if (y + mh > window.innerHeight) y = window.innerHeight - mh - 8;
  menu.style.left = x + 'px'; menu.style.top = y + 'px';
}
function closeCtx() {
  document.getElementById('ctxMenu').style.display = 'none';
}
function ctxCopy() {
  const b = S.ctxTarget?.querySelector('.bubble');
  if (b) navigator.clipboard?.writeText(b.innerText.trim());
  showToast('📋','Copied','Message copied!');
  closeCtx();
}
function ctxReply() {
  if (!S.ctxTarget) return closeCtx();
  const isMe = !!S.ctxTarget.querySelector('.msg-row.me');
  const name = isMe ? (S.user?.name || 'You') : S.room.name;
  const b = S.ctxTarget.querySelector('.bubble');
  if (b) setReply(name, b.innerText.trim());
  closeCtx();
}
function ctxDeleteMe() {
  if (!S.ctxTarget) return closeCtx();
  const wrap = S.ctxTarget;
  wrap.style.transition = 'all .3s ease';
  wrap.style.opacity = '0'; wrap.style.transform = 'scale(0.9)';
  setTimeout(() => wrap.remove(), 300);
  closeCtx();
}
function ctxDeleteAll() {
  if (!S.ctxTarget) return closeCtx();
  const b = S.ctxTarget.querySelector('.bubble');
  if (b) {
    b.innerHTML = '<span style="color:var(--muted);font-style:italic;font-size:13px">🚫 This message was deleted</span>';
    b.style.background = 'rgba(10,31,66,0.4)';
    b.style.border = '1px dashed rgba(56,189,248,0.15)';
  }
  S.ctxTarget.querySelector('.reactions-row').innerHTML = '';
  closeCtx();
}

/* ════════════════ CALL ════════════════ */
function startCall(type) {
  document.getElementById('callAv').textContent     = S.room.emoji;
  document.getElementById('callName').textContent   = S.room.name;
  document.getElementById('callStatus').textContent = type === 'video' ? '📹 Video calling...' : '📞 Calling...';
  document.getElementById('callOverlay').classList.add('active');
  let s = 0;
  S.callTimer = setInterval(() => {
    s++;
    document.getElementById('callStatus').textContent =
      String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
  }, 1000);
}
function endCall()       { clearInterval(S.callTimer); document.getElementById('callOverlay').classList.remove('active'); }
function toggleMic(b)    { b.textContent = b.textContent === '🎙️' ? '🔇' : '🎙️'; }
function toggleSpk(b)    { b.textContent = b.textContent === '🔊' ? '🔈' : '🔊'; }

/* ════════════════ PROFILES ════════════════ */
function openContactProfile() {
  const r = S.room;
  const d = CONTACTS[r.id] || CONTACTS['aria'];
  const dot = document.getElementById('ppStatusDot');
  dot.className = 'pp-status-dot' + (r.status === 'online' ? ' online' : r.status === 'away' ? ' away' : '');
  document.getElementById('ppAvatar').textContent   = r.emoji;
  document.getElementById('ppName').textContent     = r.name;
  document.getElementById('ppHandle').textContent   = d.handle;
  document.getElementById('ppStatusText').textContent =
    r.status === 'online' ? '● Online now' :
    r.status === 'away'   ? '⊙ Away' :
    r.status === 'group'  ? '👥 ' + r.sub : '○ Offline';
  document.getElementById('ppWork').textContent     = d.work;
  document.getElementById('ppLocation').textContent = d.location;
  document.getElementById('ppBio').textContent      = d.bio;
  document.getElementById('ppJoined').textContent   = d.joined;
  document.getElementById('profilePanel').classList.add('open');
  document.getElementById('profileBackdrop').classList.add('active');
}
function closeContactProfile() {
  document.getElementById('profilePanel').classList.remove('open');
  document.getElementById('profileBackdrop').classList.remove('active');
}
function openMyProfile() {
  if (S.user) {
    document.getElementById('myPpAvatar').textContent = S.user.emoji;
    document.getElementById('myPpName').textContent   = S.user.name;
    document.getElementById('myPpHandle').textContent = '@' + S.user.name.toLowerCase().replace(/\s+/g,'.');
    document.getElementById('myPpEmail').textContent  = S.user.email;
  }
  document.getElementById('myProfilePanel').classList.add('open');
  document.getElementById('myProfileBackdrop').classList.add('active');
}
function closeMyProfile() {
  document.getElementById('myProfilePanel').classList.remove('open');
  document.getElementById('myProfileBackdrop').classList.remove('active');
}

/* ════════════════ TOAST ════════════════ */
function showToast(icon, from, msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `
    <div class="toast-av" style="background:linear-gradient(135deg,#0d2b5e,#0ea5e9)">${icon}</div>
    <div class="toast-body"><div class="toast-from">${esc(from)}</div><div class="toast-msg">${esc(msg)}</div></div>
    <button class="toast-x" onclick="this.parentElement.remove()">✕</button>`;
  t.onclick = () => t.remove();
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'all .35s ease';
    t.style.opacity = '0'; t.style.transform = 'translateX(110%)';
    setTimeout(() => t.remove(), 380);
  }, 4500);
}

/* ════════════════ KEYBOARD ════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); closeCtx(); closeContactProfile(); closeMyProfile(); }
});

/* ════════════════ UTILITY ════════════════ */
function autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }
function onKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }
function scrollBottom() { const m = document.getElementById('messages'); if (m) setTimeout(() => m.scrollTop = m.scrollHeight, 50); }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function pickEmoji(s) { return ['😊','🙂','😄','😁','🤗','😎','🙌','🌟'][s.charCodeAt(0) % 8]; }