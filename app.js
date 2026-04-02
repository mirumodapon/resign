// ==================== 從 config 讀取 ====================
const TARGET_DATE = new Date(CONFIG.targetDate);
const START_DATE = new Date(CONFIG.startDate);
const STORAGE = CONFIG.storagePrefix;

// ==================== Helpers ====================
function storageKey(name) {
    return STORAGE + '-' + name;
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getWorkingDays(start, end) {
    let count = 0;
    const cur = new Date(start);
    while (cur < end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++;
        cur.setDate(cur.getDate() + 1);
    }
    return count;
}

// ==================== Theme ====================
function setTheme(theme) {
    document.documentElement.className = 'theme-' + theme;
    document.querySelectorAll('.theme-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.theme === theme)
    );
    localStorage.setItem(storageKey('theme'), theme);
    const pc = document.getElementById('particles');
    pc.innerHTML = '';
    createParticles();
}

function initTheme() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });
    const saved = localStorage.getItem(storageKey('theme'));
    if (saved) setTheme(saved);
}

// ==================== Quotes ====================
function setDailyQuote() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const q = CONFIG.quotes[dayOfYear % CONFIG.quotes.length];
    document.getElementById('quoteText').textContent = '「' + q.text + '」';
    document.getElementById('quoteAuthor').textContent = '— ' + q.author;
}

// ==================== Milestones ====================
function renderMilestones(progress) {
    const marks = [
        { pct: 0, label: '起點' },
        { pct: 25, label: '25%' },
        { pct: 50, label: '一半！' },
        { pct: 75, label: '75%' },
        { pct: 100, label: '自由！' },
    ];
    const container = document.getElementById('milestones');
    container.innerHTML = marks.map(m =>
        `<div class="milestone ${progress >= m.pct ? 'reached' : ''}">${m.label}</div>`
    ).join('');
}

// ==================== Check-in ====================
function getCheckins() {
    return JSON.parse(localStorage.getItem(storageKey('checkins')) || '[]');
}

function saveCheckins(arr) {
    localStorage.setItem(storageKey('checkins'), JSON.stringify(arr));
}

function doCheckin() {
    const checkins = getCheckins();
    const today = todayStr();
    if (checkins.includes(today)) return;
    checkins.push(today);
    saveCheckins(checkins);
    renderCheckin();
    launchConfetti(CONFIG.checkinConfettiCount);
}

function getStreak(checkins) {
    if (!checkins.length) return 0;
    const sorted = [...checkins].sort().reverse();
    const today = todayStr();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const cur = new Date(sorted[i]);
        const diff = (prev - cur) / 86400000;
        if (diff === 1) streak++;
        else break;
    }
    return streak;
}

function renderCheckin() {
    const checkins = getCheckins();
    const today = todayStr();
    const btn = document.getElementById('checkinBtn');

    if (checkins.includes(today)) {
        btn.disabled = true;
        btn.textContent = '今天已打卡 ✓';
    } else {
        btn.disabled = false;
        btn.textContent = '打卡！又撐過一天';
    }

    const streak = getStreak(checkins);
    document.getElementById('streakBadge').textContent = streak + ' 天連續';
    document.getElementById('totalCheckins').textContent = checkins.length;

    // Calendar
    const cal = document.getElementById('checkinCalendar');
    cal.innerHTML = '';
    for (let i = CONFIG.calendarDays - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const ds = d.toISOString().split('T')[0];
        const div = document.createElement('div');
        div.classList.add('cal-day');
        if (checkins.includes(ds)) div.classList.add('checked');
        if (ds === today) div.classList.add('today');
        div.title = ds;
        cal.appendChild(div);
    }
}

// ==================== Mood ====================
function getMoods() {
    return JSON.parse(localStorage.getItem(storageKey('moods')) || '{}');
}

function setMood(mood) {
    const moods = getMoods();
    moods[todayStr()] = mood;
    localStorage.setItem(storageKey('moods'), JSON.stringify(moods));
    renderMood();
}

function renderMood() {
    const moods = getMoods();
    const today = todayStr();
    const todayMood = moods[today];

    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.mood === todayMood);
    });

    const moodConfig = CONFIG.moods[todayMood];
    document.getElementById('moodLabel').textContent = moodConfig
        ? '今天的心情：' + moodConfig.label
        : '選一個心情吧';

    // Mood history
    const history = document.getElementById('moodHistory');
    history.innerHTML = '';
    for (let i = CONFIG.moodHistoryDays - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
        const m = moods[d];
        const span = document.createElement('span');
        span.classList.add('mood-dot');
        span.textContent = m ? CONFIG.moods[m].emoji : '·';
        span.title = d;
        history.appendChild(span);
    }
}

// ==================== Bucket list ====================
function getBuckets() {
    return JSON.parse(localStorage.getItem(storageKey('buckets')) || '[]');
}

function saveBuckets(arr) {
    localStorage.setItem(storageKey('buckets'), JSON.stringify(arr));
}

function addBucket() {
    const input = document.getElementById('bucketInput');
    const text = input.value.trim();
    if (!text) return;
    const buckets = getBuckets();
    buckets.push({ text, done: false, id: Date.now() });
    saveBuckets(buckets);
    input.value = '';
    renderBuckets();
}

function toggleBucket(id) {
    const buckets = getBuckets();
    const item = buckets.find(b => b.id === id);
    if (item) item.done = !item.done;
    saveBuckets(buckets);
    renderBuckets();
}

function deleteBucket(id) {
    const buckets = getBuckets().filter(b => b.id !== id);
    saveBuckets(buckets);
    renderBuckets();
}

function renderBuckets() {
    const buckets = getBuckets();
    const list = document.getElementById('bucketList');
    list.innerHTML = buckets.map(b => `
        <li class="bucket-item ${b.done ? 'done' : ''}">
            <input type="checkbox" ${b.done ? 'checked' : ''} onchange="toggleBucket(${b.id})">
            <span class="bucket-text">${escapeHtml(b.text)}</span>
            <button class="bucket-delete" onclick="deleteBucket(${b.id})" title="刪除">×</button>
        </li>
    `).join('');
}

// ==================== Fun stats ====================
function renderFunStats(diffMs) {
    const days = diffMs / (1000 * 60 * 60 * 24);
    const hours = diffMs / (1000 * 60 * 60);
    const minutes = diffMs / (1000 * 60);

    const stats = [
        { label: '相當於看幾部電影（2hr）', value: Math.floor(hours / 2) + ' 部' },
        { label: '大約還要睡幾覺', value: Math.floor(days) + ' 覺' },
        { label: '還要吃幾頓午餐', value: Math.floor(days) + ' 頓' },
        { label: '剩餘通勤次數（來回）', value: Math.floor(getWorkingDays(new Date(), TARGET_DATE)) * 2 + ' 趟' },
        { label: '相當於幾首歌（3.5min）', value: Math.floor(minutes / 3.5).toLocaleString() + ' 首' },
        { label: '還要開幾次週會', value: Math.floor(days / 7) + ' 次' },
    ];

    document.getElementById('funStats').innerHTML = stats.map(s =>
        `<div class="fun-stat"><span>${s.label}</span><span class="fun-stat-val">${s.value}</span></div>`
    ).join('');
}

// ==================== Confetti ====================
function launchConfetti(count) {
    const colors = CONFIG.confettiColors;
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 6) + 'px';
        piece.style.height = (Math.random() * 8 + 6) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
    }
}

// ==================== Main countdown ====================
function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        document.getElementById('progressBar').style.width = '100%';
        document.getElementById('progressText').textContent = '100%';
        document.getElementById('message').textContent = '🎉 恭喜！你自由了！新的旅程開始了！🎉';
        document.getElementById('app').classList.add('celebration');
        renderMilestones(100);
        launchConfetti(CONFIG.celebrationConfettiCount);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Stats
    document.getElementById('workDays').textContent = getWorkingDays(now, TARGET_DATE);

    let payCount = 0;
    const tempDate = new Date(now);
    while (tempDate < TARGET_DATE) {
        tempDate.setMonth(tempDate.getMonth() + 1);
        const lastDay = new Date(tempDate.getFullYear(), tempDate.getMonth(), 0);
        if (lastDay <= TARGET_DATE) payCount++;
    }
    document.getElementById('paydays').textContent = payCount;
    document.getElementById('survivedDays').textContent = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));

    // Progress
    const totalDuration = TARGET_DATE - START_DATE;
    const elapsed = now - START_DATE;
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    document.getElementById('progressBar').style.width = progress.toFixed(2) + '%';
    document.getElementById('progressText').textContent = progress.toFixed(1) + '%';
    renderMilestones(progress);

    // Message
    const msgIndex = Math.floor(seconds / 9) % CONFIG.messages.length;
    document.getElementById('message').textContent = CONFIG.messages[msgIndex];

    // Fun stats (update every 10 seconds)
    if (seconds % 10 === 0) renderFunStats(diff);
}

// ==================== Particles ====================
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ==================== Init ====================
function init() {
    initTheme();
    createParticles();
    setDailyQuote();
    renderCheckin();
    renderMood();
    renderBuckets();
    updateCountdown();
    renderFunStats(TARGET_DATE - new Date());
    setInterval(updateCountdown, 1000);
}

init();
