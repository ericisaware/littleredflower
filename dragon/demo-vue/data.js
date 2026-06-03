/**
 * 接龙 / 一条龙 Demo —— 数据层
 * 数据口径来源（真实素材）：
 *   - 接龙数据1114v2.xlsx（行为打分/龙等级17级/加成系数/王者门槛/锦旗）
 *   - 接龙游戏文案V3.1.xlsx（称号/签名文案）
 *   - 接龙一条龙_PRD_V1.md
 * 爱心贝体系已下线，改为「爱心盲盒」普惠激励。
 */
window.DRAGON_DATA = (function () {
  // ---------- 10 类行为（含 AI 打分标准与长度换算） ----------
  // emoji 作占位视觉；score：本次行为的演示得分；toMeter：分→米；min/max：上下限
  const BEHAVIORS = [
    {
      key: 'fund', name: '喂福报', sub: '捐款支持', icon: '🧧', kind: 'pay',
      scoreText: '1元=0.05米', minText: '9元起', maxText: '200元',
      kingText: '100元以上', kingThreshold: 100,
      desc: '为正在接龙的项目捐一笔款，1 元 = 0.05 米。',
      meterPerYuan: 0.05, defaultAmount: 30,
    },
    {
      key: 'month', name: '月捐', sub: '持续的爱', icon: '📅', kind: 'pay',
      scoreText: '专项 1元=20米', minText: '0.01元', maxText: '200元',
      kingText: '20元以上', kingThreshold: 20,
      desc: '开通月捐，1 元 = 20 米，并解锁月捐专属锦旗。',
      meterPerYuan: 20, defaultAmount: 20, flag: true,
    },
    {
      key: 'calligraphy', name: '喂书香', sub: '写一个字', icon: '🖌️', kind: 'ugc',
      scoreText: 'AI书法评分', minText: '50分', maxText: '120分',
      kingText: '110分以上', kingThreshold: 110,
      desc: '手写一个字，AI 书法评分 + OCR，分数越高龙身越酷炫。',
      min: 50, max: 120, toMeter: 0.01,
    },
    {
      key: 'smile', name: '喂微笑', sub: '捐一个笑', icon: '😄', kind: 'ugc',
      scoreText: '优图微笑识别', minText: '50分', maxText: '150分',
      kingText: '110分以上', kingThreshold: 110,
      desc: '对着镜头微笑，优图人脸识别打分，笑得越甜分越高。',
      min: 50, max: 150, toMeter: 0.01,
    },
    {
      key: 'draw', name: '喂画卷', sub: 'AI 画画', icon: '🎨', kind: 'aidraw',
      scoreText: 'AI画作评分', minText: '50分', maxText: '120分',
      kingText: '110分以上', kingThreshold: 110,
      desc: '挑选灵感词，AI 为你生成一幅公益画作并打分上龙。',
      min: 50, max: 120, toMeter: 0.01,
    },
    {
      key: 'step', name: '遛一遛', sub: '捐步数', icon: '👟', kind: 'data',
      scoreText: '70步=1分', minText: '200步', maxText: '20000步',
      kingText: '140分以上(9800步)', kingThreshold: 140,
      desc: '同步微信运动步数，70 步 = 1 分。',
      min: 200, max: 20000, perScore: 70, toMeter: 0.01, unit: '步', defaultVal: 6300,
    },
    {
      key: 'meditate', name: '静静心', sub: '冥想片刻', icon: '🧘', kind: 'data',
      scoreText: '1分钟=10分', minText: '1分钟', maxText: '20分钟',
      kingText: '100分以上', kingThreshold: 100,
      desc: '静心冥想计时，1 分钟 = 10 分。',
      min: 1, max: 20, perScore: 1 / 10, toMeter: 0.01, unit: '分钟', defaultVal: 8,
    },
    {
      key: 'quiz', name: '爱学习', sub: '公益答题', icon: '📚', kind: 'quiz',
      scoreText: '1题=25分', minText: '1题', maxText: '5题',
      kingText: '80分以上', kingThreshold: 80,
      desc: '回答公益知识题，1 题 = 25 分。',
      min: 1, max: 5, perScore: 1, scorePerUnit: 25, toMeter: 0.01, unit: '题',
    },
    {
      key: 'early', name: '早早起', sub: '早起打卡', icon: '🌅', kind: 'data',
      scoreText: '6:30前=150分', minText: '120分', maxText: '150分',
      kingText: '140分以上', kingThreshold: 140,
      desc: '早起打卡：6:30 前 = 150 分，6:30–7:30 = 120 分。',
      toMeter: 0.01, options: [{ label: '6:30 前', score: 150 }, { label: '6:30–7:30', score: 120 }],
    },
    {
      key: 'story', name: '传善举', sub: '随身好事', icon: '🌸', kind: 'story',
      scoreText: 'AI图文质量', minText: '50分', maxText: '150分',
      kingText: '120分以上', kingThreshold: 120,
      desc: '上传小红花志愿挂件 OOTD / 助人故事，得 1 元公益金 + 证书并上龙。',
      min: 50, max: 150, toMeter: 0.01, reward: '1元公益金 + 电子证书',
    },
  ];

  // ---------- 龙等级 17 级（接龙数据1114v2.xlsx） ----------
  const LEVELS = [
    { m: 0, lv: 0, name: '宝宝', luck: '好运刚刚开始', pool: '接龙池1' },
    { m: 90, lv: 1, name: '小龙', luck: '好运刚刚开始', pool: '接龙池1' },
    { m: 300, lv: 2, name: '正主', luck: '好运刚刚开始', pool: '接龙池1' },
    { m: 1000, lv: 3, name: '铜鳞', luck: '好运刚刚开始', pool: '接龙池1' },
    { m: 3000, lv: 4, name: '玉鳞', luck: '幸运突破云层', pool: '接龙池2' },
    { m: 9000, lv: 5, name: '紫鳞', luck: '幸运突破云层', pool: '接龙池2' },
    { m: 16000, lv: 6, name: '金鳞', luck: '幸运突破云层', pool: '接龙池2' },
    { m: 32000, lv: 7, name: '月光银鳞', luck: '幸运突破云层', pool: '接龙池2' },
    { m: 64000, lv: 8, name: '月光玉鳞', luck: '幸运突破大气层', pool: '接龙池3' },
    { m: 128000, lv: 9, name: '秋水紫鳞', luck: '幸运突破大气层', pool: '接龙池3' },
    { m: 256000, lv: 10, name: '秋水金鳞', luck: '幸运突破大气层', pool: '接龙池3' },
    { m: 512000, lv: 11, name: '白虹银鳞', luck: '幸运突破大气层', pool: '接龙池3' },
    { m: 1024000, lv: 12, name: '白虹玉鳞', luck: '幸运到达月球', pool: '接龙池4' },
    { m: 2048000, lv: 13, name: '红花紫鳞', luck: '幸运到达月球', pool: '接龙池4' },
    { m: 4096000, lv: 14, name: '红花金鳞', luck: '幸运到达月球', pool: '接龙池4' },
    { m: 8192000, lv: 15, name: '赤霄宝鳞', luck: '幸运到达月球', pool: '接龙池4' },
    { m: 16384000, lv: 16, name: '望云宝鳞', luck: '幸运到达月球', pool: '接龙池4' },
    { m: 32768000, lv: 17, name: '逍遥宝鳞', luck: '幸运到达月球', pool: '接龙池4' },
  ];

  // ---------- 加成系数（发起人选择的非捐款行为数）Sheet1 口径 ----------
  const BONUS = { 1: 2.0, 2: 1.4, 3: 1.2, 4: 1.0, onlyFund: 1.2 };

  // ---------- 称号 / 签名文案（接龙游戏文案V3.1.xlsx） ----------
  const TITLES = {
    two: ['善良', '优秀', '慷慨', '有爱', '好人', '益士', '热心', '慈悲', '博爱', '赤子', '暖宝', '小太阳'],
    four: ['乐善好施', '扶危济困', '积善成德', '仗义疏财', '人美心善', '古道热肠', '厚德载物', '博施济众', '菩萨心肠', '上善若水'],
    two_line: ['赠人玫瑰 手有余香', '心有猛虎 细嗅蔷薇', '网络一线牵 随手云慈善', '为众人抱薪 为世界添爱', '积善之家 必有余庆', '一花一世界 一念一天堂'],
  };

  // ---------- 灵感词（AI 画画） ----------
  const DRAW_PROMPTS = ['一棵会发光的许愿树', '海边奔跑的小狗', '城市上空的热气球', '雪山下的小红花', '星空下的萤火虫', '春日里的稻田'];

  // ---------- 龙身节点 mock 数据 ----------
  // type: ugc(画/字/笑/故事) | donate(捐款)
  const NODES = [
    { type: 'ugc', behavior: 'draw', rank: 1, name: '阿菜Eric', time: '刚刚', tag: '画卷', tagDesc: '《许愿树》', meter: 1.2, tier: 'king', likes: 328, score: 118 },
    { type: 'donate', rank: 2, name: '小红花', time: '2分钟前', money: 100, project: '乡村儿童午餐', meter: 5, tier: 'king', likes: 96 },
    { type: 'ugc', behavior: 'calligraphy', rank: 3, name: '墨非', time: '5分钟前', tag: '书香', tagDesc: '「爱」', meter: 1.1, tier: 'good', likes: 64, score: 108 },
    { type: 'ugc', behavior: 'smile', rank: 4, name: '甜筒', time: '8分钟前', tag: '微笑', tagDesc: '一个大大的笑', meter: 1.3, tier: 'king', likes: 152, score: 132 },
    { type: 'ugc', behavior: 'story', rank: 5, name: '清风', time: '12分钟前', tag: '善举', tagDesc: '扶老人过马路', meter: 0.9, tier: 'good', likes: 88, score: 95 },
    { type: 'donate', rank: 6, name: '老王', time: '15分钟前', money: 30, project: '乡村儿童午餐', meter: 1.5, tier: 'normal', likes: 21 },
    { type: 'ugc', behavior: 'draw', rank: 7, name: '蓝鲸', time: '20分钟前', tag: '画卷', tagDesc: '《热气球》', meter: 0.7, tier: 'normal', likes: 33, score: 72 },
  ];

  // ---------- 热画墙 ----------
  const HOTPICS = [
    { name: '阿菜Eric', tag: '《许愿树》', likes: 328, hue: 8 },
    { name: '甜筒', tag: '一个大大的笑', likes: 152, hue: 45 },
    { name: '蓝鲸', tag: '《热气球》', likes: 33, hue: 200 },
    { name: '晚枫', tag: '《稻田》', likes: 210, hue: 110 },
  ];

  // ---------- 榜单 ----------
  const RANKS = {
    project_day: [
      { name: '阿菜Eric', meter: 1289, avatar: '🦊' },
      { name: '甜筒', meter: 980, avatar: '🍦' },
      { name: '墨非', meter: 760, avatar: '🖋️' },
      { name: '清风', meter: 540, avatar: '🍃' },
      { name: '老王', meter: 320, avatar: '👴' },
    ],
    category: {
      疾病: [{ name: '守护心跳·先心病儿童', heat: 98230, rank: 1 }, { name: '抗癌厨房', heat: 76540, rank: 2 }, { name: '渐冻人关怀', heat: 51200, rank: 3 }],
      助学: [{ name: '乡村儿童午餐', heat: 120300, rank: 1 }, { name: '点亮乡村图书馆', heat: 88900, rank: 2 }, { name: '大山里的音乐课', heat: 67800, rank: 3 }],
      扶贫: [{ name: '一起种下脱贫果', heat: 56700, rank: 1 }, { name: '助农直通车', heat: 43200, rank: 2 }],
      '环保及其他': [{ name: '守护江豚', heat: 71000, rank: 1 }, { name: '蚂蚁森林联名', heat: 65400, rank: 2 }],
    },
    star: [
      { name: '星·公益应援团', meter: 4096520, avatar: '⭐', fans: '红蔷薇' },
      { name: '萤火虫应援', meter: 2048300, avatar: '✨', fans: '萤火虫' },
      { name: '向日葵后援会', meter: 1024100, avatar: '🌻', fans: '向日葵' },
    ],
  };

  // 上周冠军 Banner
  const LAST_WEEK_CHAMPION = { name: '乡村儿童午餐', category: '助学', heat: 120300 };

  // ---------- 盲盒奖池 ----------
  const BLINDBOX = [
    { type: 'fund', label: '5 元公益金', icon: '💰', weight: 30, rare: 'n' },
    { type: 'fund', label: '1 元公益金', icon: '🪙', weight: 35, rare: 'n' },
    { type: 'merch', label: '小红花冰箱贴', icon: '🧲', weight: 12, rare: 'r' },
    { type: 'merch', label: '小红花帆布袋', icon: '👜', weight: 8, rare: 'r' },
    { type: 'merch', label: '小红花联名挂件', icon: '🌸', weight: 5, rare: 'sr' },
    { type: 'honor', label: '「古道热肠」称号', icon: '🏅', weight: 7, rare: 'r' },
    { type: 'honor', label: '荣誉徽章 · 暖光', icon: '🎖️', weight: 3, rare: 'sr' },
  ];

  // ---------- 当前接龙（龙首/项目） ----------
  const DRAGON = {
    project: '乡村儿童午餐',
    category: '助学',
    initiator: '腾讯公益 × 小红花',
    bgRgb: '#4cb4eb',
    title: '一起为山里孩子接一条午餐龙',
    topWord: '和 1.2 万人一起，把午餐龙接成王者龙！',
    meter: 13860, // 当前龙长度（米）
    people: 12480,
    // 发起人选择的可参与行为（key 列表）；非捐款行为数 = 4 → 加成 ×1.0
    enabledBehaviors: ['fund', 'draw', 'calligraphy', 'smile', 'story'],
  };

  // ---------- 个人中心 ----------
  const MY = {
    nickname: '阿菜Eric',
    avatar: '🦊',
    created: [
      { project: '一起为山里孩子接一条午餐龙', time: '06-01', people: 12480, meter: 13860 },
    ],
    joined: [
      { project: '守护江豚', time: '05-28', people: 8900, meter: 9200 },
      { project: '点亮乡村图书馆', time: '05-20', people: 3400, meter: 3100 },
    ],
    titles: ['古道热肠', '热心'],
    flags: ['月捐专属锦旗', '捐款3级锦旗'],
    balls: 14,
    boxes: 6,
  };

  // ---------- 工具：根据龙长度求等级 ----------
  function levelOf(meter) {
    let cur = LEVELS[0];
    for (const L of LEVELS) if (meter >= L.m) cur = L;
    const next = LEVELS.find((L) => L.m > meter) || null;
    return { cur, next };
  }
  function bonusFactor(enabled) {
    const nonFund = enabled.filter((k) => k !== 'fund' && k !== 'month').length;
    if (nonFund === 0) return BONUS.onlyFund;
    if (nonFund >= 4) return BONUS[4];
    return BONUS[nonFund] || 1;
  }

  return {
    BEHAVIORS, LEVELS, BONUS, TITLES, DRAW_PROMPTS, NODES, HOTPICS,
    RANKS, LAST_WEEK_CHAMPION, BLINDBOX, DRAGON, MY,
    levelOf, bonusFactor,
    behaviorByKey: (k) => BEHAVIORS.find((b) => b.key === k),
  };
})();
