// ==================== 設定檔 ====================
// 修改這裡就能自訂所有參數，不需要動其他檔案

const CONFIG = {
    // 離職目標日
    targetDate: '2026-07-31T00:00:00',

    // 倒數起算日
    startDate: '2026-04-02T00:00:00',

    // 預設主題：midnight | sunset | ocean | forest
    defaultTheme: 'midnight',

    // localStorage key 前綴（避免跟其他網站衝突）
    storagePrefix: 'gone',

    // 粒子數量
    particleCount: 30,

    // 倒數歸零時的 confetti 數量
    celebrationConfettiCount: 100,

    // 打卡時的 confetti 數量
    checkinConfettiCount: 30,

    // 打卡日曆顯示天數
    calendarDays: 28,

    // 心情歷史顯示天數
    moodHistoryDays: 14,

    // Confetti 顏色
    confettiColors: ['#ffd200', '#f7971e', '#e94560', '#00d2ff', '#95d5b2', '#ff6b6b', '#feca57'],

    // 心情選項
    moods: {
        great: { emoji: '😆', label: '超開心' },
        good:  { emoji: '😊', label: '還不錯' },
        okay:  { emoji: '😐', label: '普通' },
        bad:   { emoji: '😩', label: '很累' },
        angry: { emoji: '🤬', label: '想翻桌' },
    },

    // 底部輪播訊息
    messages: [
        '再撐一下，自由就在前方 ✨',
        '每一秒都在靠近新的開始 🚀',
        '倒數中… 未來的你會感謝現在的你 💪',
        '自由的空氣越來越近了 🌊',
        '新的冒險即將展開 🗺️',
        '你值得更好的生活 🌟',
        '堅持住，黎明就在眼前 🌅',
    ],

    // 每日名言（根據一年中的第幾天輪播）
    quotes: [
        { text: '生命不是要等待暴風雨過去，而是要學會在雨中跳舞。', author: '薇薇安・乃乃 Greene' },
        { text: '如果你不喜歡某件事，就改變它。如果你不能改變它，就改變你的態度。', author: 'Maya Angelou' },
        { text: '最困難的路，往往通往最美麗的風景。', author: '佚名' },
        { text: '不要害怕放棄好的，去追求更好的。', author: 'John D. Rockefeller' },
        { text: '當一扇門關閉，另一扇門就會打開。', author: 'Alexander Graham Bell' },
        { text: '做你害怕做的事，恐懼就會消失。', author: 'Ralph Waldo Emerson' },
        { text: '人生苦短，不要把時間浪費在不值得的事情上。', author: '佚名' },
        { text: '改變不會自己來，你就是改變。', author: 'Barack Obama' },
        { text: '每一天都是一個新的開始，把握機會重新出發。', author: '佚名' },
        { text: '你的時間有限，不要浪費在過別人的生活。', author: 'Steve Jobs' },
        { text: '勇氣不是沒有恐懼，而是判斷有比恐懼更重要的事。', author: 'Ambrose Redmoon' },
        { text: '世界上最勇敢的事，就是對自己誠實。', author: '佚名' },
        { text: '人生就像騎自行車，要保持平衡就得不斷前進。', author: 'Albert Einstein' },
        { text: '如果你正經歷地獄，那就繼續走下去。', author: 'Winston Churchill' },
        { text: '成功不是終點，失敗也不是末日，重要的是繼續前進的勇氣。', author: 'Winston Churchill' },
        { text: '有時候你必須放手，才能看看是否值得抓住。', author: '佚名' },
        { text: '最好的投資就是投資自己。', author: 'Warren Buffett' },
        { text: '與其擔心未來，不如好好把握現在。', author: '佚名' },
        { text: '自由不是做你想做的事，而是有能力不做你不想做的事。', author: 'Jean-Jacques Rousseau' },
        { text: '今天的忍耐，是為了明天的精彩。', author: '佚名' },
        { text: '凡事起頭難，但不起頭更難。', author: '佚名' },
        { text: '未來屬於那些相信夢想之美的人。', author: 'Eleanor Roosevelt' },
        { text: '如果機會不來敲門，那就自己建一扇門。', author: 'Milton Berle' },
        { text: '不是因為事情困難我們才不敢做，而是因為我們不敢做事情才困難。', author: 'Seneca' },
        { text: '生活不會因為你的恐懼而變得更簡單，但會因為你的勇敢而變得更精彩。', author: '佚名' },
        { text: '放棄安穩的路，才能發現更遼闊的風景。', author: '佚名' },
        { text: '你不需要看到整段階梯，只要踏出第一步。', author: 'Martin Luther King Jr.' },
        { text: '世界上沒有絕路，只有想不通的人。', author: '佚名' },
        { text: '離開，是為了更好的相遇。', author: '佚名' },
        { text: '能夠說「我不幹了」的人，往往是最有勇氣的人。', author: '佚名' },
    ],
};
