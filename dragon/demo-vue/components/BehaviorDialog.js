/* BehaviorDialog —— 单个做好事行为的完整弹层（对齐 challenge_dialog + CreateAIDraw 多步）
   step: pick(配置) → generating(AI) → scoring(评分动画) → result(确认上龙)
   通过 @up 把 { behavior, rawScore, scoreLabel, meter, tier, tag, tagDesc, donate, money, bonus } 抛给父级 */
Vue.component('behavior-dialog', {
  props: { behaviorKey: String, enabled: Array },
  data() {
    return {
      step: 'pick',
      // 通用输入
      amount: 30, sliderVal: 0, earlyScore: 0, picked: '',
      padHas: false, storyUp: false,
      // 答题
      quizIdx: 0, quizCorrect: 0, quizLocked: false, quizPickedIdx: -1,
      // 评分结果
      result: null, animScore: 0,
      prompts: window.DRAGON_DATA.DRAW_PROMPTS,
      quiz: [
        { q: '“小红花”是腾讯公益的什么标识？', opts: ['爱心捐赠的公益符号', '一种花卉品种', '游戏道具'], right: 0 },
        { q: '99 公益日通常在每年的哪个月？', opts: ['3 月', '9 月', '12 月'], right: 1 },
        { q: '下列哪种行为也能让接龙的龙变长？', opts: ['只能靠捐款', '写字 / 画画 / 捐微笑等好事', '什么都不做'], right: 1 },
      ],
    };
  },
  computed: {
    b() { return window.DRAGON_DATA.behaviorByKey(this.behaviorKey); },
    amounts() { return this.behaviorKey === 'month' ? [10, 20, 50, 100] : [9, 30, 100, 200]; },
    curQuiz() { return this.quiz[this.quizIdx]; },
    tierName() { return { normal: '普通 · 标准节点', good: '优秀 · 高亮动效', king: '王者 · 专属金光特效 👑' }; },
  },
  mounted() {
    const b = this.b;
    this.amount = b.defaultAmount || 30;
    this.sliderVal = b.defaultVal != null ? b.defaultVal : (b.min || 0);
    this.picked = this.prompts[0];
    if (b.options) this.earlyScore = b.options[0].score;
    this.$nextTick(() => { if (this.behaviorKey === 'calligraphy') this.initPad(); });
  },
  methods: {
    fmt(n) { return window.GY_FMT.fmt(n); },
    close() { this.$emit('close'); },
    // ---- 书法 canvas ----
    initPad() {
      const cv = this.$refs.pad; if (!cv) return;
      const rect = cv.getBoundingClientRect();
      cv.width = rect.width * 2; cv.height = rect.height * 2;
      const ctx = cv.getContext('2d'); ctx.scale(2, 2);
      ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#2a2118';
      let drawing = false;
      const pos = (e) => { const r = cv.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return [t.clientX - r.left, t.clientY - r.top]; };
      const down = (e) => { drawing = true; this.padHas = true; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); e.preventDefault(); };
      const move = (e) => { if (!drawing) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); e.preventDefault(); };
      const up = () => { drawing = false; };
      cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
      cv.addEventListener('touchstart', down); cv.addEventListener('touchmove', move); cv.addEventListener('touchend', up);
      this._padCtx = ctx; this._padCv = cv;
    },
    clearPad() { if (this._padCtx) { this._padCtx.clearRect(0, 0, this._padCv.width, this._padCv.height); this.padHas = false; } },
    // ---- AI 画 ----
    genDraw() {
      this.step = 'generating';
      setTimeout(() => { this.step = 'drawn'; }, 1400);
    },
    redraw() { this.step = 'pick'; },
    // ---- 故事上传 ----
    doUpload() { this.storyUp = true; },
    // ---- 答题 ----
    pickOpt(i) {
      if (this.quizLocked) return;
      this.quizLocked = true; this.quizPickedIdx = i;
      if (i === this.curQuiz.right) this.quizCorrect++;
      setTimeout(() => {
        this.quizIdx++;
        if (this.quizIdx >= this.quiz.length) {
          const score = Math.min(this.quizCorrect * this.b.scorePerUnit + 25, 125);
          this.finish(score, '知识', '答对 ' + this.quizCorrect + '/' + this.quiz.length + ' 题');
        } else { this.quizLocked = false; this.quizPickedIdx = -1; }
      }, 700);
    },
    optClass(i) {
      if (this.quizPickedIdx < 0) return '';
      if (i === this.curQuiz.right) return 'right';
      if (i === this.quizPickedIdx) return 'wrong';
      return '';
    },
    // ---- 各类提交 ----
    payGo() {
      const b = this.b, amt = this.amount;
      const meter = amt * b.meterPerYuan;
      const tier = amt >= b.kingThreshold ? 'king' : amt >= b.kingThreshold * 0.5 ? 'good' : 'normal';
      this.showResult({ rawScore: amt, unit: '元', meter, tier, donate: true, money: amt });
    },
    sliderGo() {
      const b = this.b; let score;
      if (b.key === 'step') score = this.sliderVal / b.perScore;
      else if (b.key === 'meditate') score = this.sliderVal * 10;
      else score = this.sliderVal;
      this.finish(Math.round(score), b.name.replace(/^.*?\//, ''), this.fmt(this.sliderVal) + b.unit);
    },
    earlyGo() { this.finish(this.earlyScore, '早起', '清晨打卡'); },
    smileGo() { setTimeout(() => this.runUGC('微笑', '一个甜甜的笑'), 1000); this.step = 'generating'; },
    padGo() { if (!this.padHas) { this.$emit('toast', '先写一个字吧 ✍️'); return; } this.runUGC('书香', '「爱」'); },
    drawOk() { this.runUGC('画卷', '《' + this.picked + '》'); },
    storyGo() { if (!this.storyUp) return; this.$emit('toast', '🌸 已发放 1 元公益金 + 电子证书'); this.runUGC('善举', '随身好事打卡'); },
    // UGC 随机评分
    runUGC(tag, tagDesc) {
      this.step = 'scoring-ugc'; this._ugc = { tag, tagDesc };
      setTimeout(() => {
        const b = this.b;
        const score = Math.round(b.min + Math.random() * (b.max - b.min));
        this.finish(score, tag, tagDesc);
      }, 1200);
    },
    // 统一评分→结果
    finish(score, tag, tagDesc) {
      const b = this.b;
      const meterRaw = score * (b.toMeter || 0.01);
      const bonus = window.DRAGON_DATA.bonusFactor(this.enabled);
      const meter = +(meterRaw * bonus).toFixed(2);
      const tier = this.tierOf(b, score);
      this.showResult({ rawScore: score, unit: '分', meter, tier, bonus, tag, tagDesc });
    },
    tierOf(b, score) {
      if (score >= b.kingThreshold) return 'king';
      const span = (b.max || b.kingThreshold) - (b.min || 0);
      if (b.min != null && score >= b.min + span * 0.4) return 'good';
      if (b.min == null && score >= b.kingThreshold * 0.85) return 'good';
      return 'normal';
    },
    showResult(r) {
      this.result = r; this.step = 'result'; this.animScore = 0;
      const target = r.rawScore; const step = Math.max(1, Math.round(target / 24));
      const tk = setInterval(() => { this.animScore += step; if (this.animScore >= target) { this.animScore = target; clearInterval(tk); } }, 28);
    },
    confirmUp() {
      const b = this.b, r = this.result;
      this.$emit('up', {
        behavior: b.key, donate: !!r.donate, money: r.money,
        meter: r.meter, tier: r.tier, rawScore: r.rawScore,
        tag: r.tag, tagDesc: r.tagDesc,
      });
    },
  },
  template: `
  <div class="mask show" @click.self="close">
    <div class="sheet">
      <div class="sheet-head"><h3>{{ b.icon }} {{ b.name }}</h3><button class="x" @click="close">×</button></div>

      <!-- 捐款 / 月捐 -->
      <template v-if="(behaviorKey==='fund'||behaviorKey==='month') && step==='pick'">
        <p class="desc">{{ b.desc }}</p>
        <div class="field"><label>选择金额（元）</label>
          <div class="amount-row">
            <button v-for="a in amounts" :key="a" class="chip" :class="{ on: a===amount }" @click="amount=a">{{ a }} 元</button>
          </div>
        </div>
        <div class="reward-tip" v-if="behaviorKey==='month'">月捐 1 元 = 20 米，并解锁月捐专属锦旗 🏵️</div>
        <div class="reward-tip" v-else>捐款 1 元 = 0.05 米</div>
        <button class="btn block" style="margin-top:14px;" @click="payGo">确认支付 {{ amount }} 元</button>
      </template>

      <!-- 书法 -->
      <template v-else-if="behaviorKey==='calligraphy' && step==='pick'">
        <p class="desc">{{ b.desc }}</p>
        <div class="field"><label>用手指在下方写一个字 ✍️</label><canvas class="pad" ref="pad"></canvas></div>
        <div style="display:flex;gap:10px;">
          <button class="btn ghost sm" @click="clearPad">重写</button>
          <button class="btn block" @click="padGo">提交给 AI 评分</button>
        </div>
      </template>

      <!-- AI 画画 -->
      <template v-else-if="behaviorKey==='draw'">
        <template v-if="step==='pick'">
          <p class="desc">{{ b.desc }}</p>
          <div class="field"><label>第一步 · 挑一个灵感词</label>
            <div class="chips">
              <button v-for="p in prompts" :key="p" class="chip" :class="{ on: p===picked }" @click="picked=p">{{ p }}</button>
            </div>
          </div>
          <button class="btn block" @click="genDraw">✨ 让 AI 开始画</button>
        </template>
        <template v-else-if="step==='generating'">
          <div class="score-stage">
            <div style="font-size:60px;animation:spin 2s linear infinite;display:inline-block;">🎨</div>
            <div class="tierline" style="margin-top:12px;">AI 正在为「{{ picked }}」作画…</div>
          </div>
        </template>
        <template v-else-if="step==='drawn'">
          <div class="node-pic" style="height:180px;border-radius:14px;background:linear-gradient(135deg,hsl(200,70%,70%),hsl(280,60%,60%));font-size:64px;">🖼️</div>
          <div class="muted" style="text-align:center;margin:8px 0;">《{{ picked }}》</div>
          <div style="display:flex;gap:10px;">
            <button class="btn ghost sm" @click="redraw">换一换</button>
            <button class="btn block" @click="drawOk">就它了，AI 评分</button>
          </div>
        </template>
      </template>

      <!-- 微笑 -->
      <template v-else-if="behaviorKey==='smile' && step==='pick'">
        <p class="desc">{{ b.desc }}</p>
        <div class="smile-cam"><div class="frame"></div>😊</div>
        <button class="btn block" style="margin-top:14px;" @click="smileGo">📸 对镜头笑一个</button>
      </template>

      <!-- 捐步 / 静心 滑块 -->
      <template v-else-if="(behaviorKey==='step'||behaviorKey==='meditate') && step==='pick'">
        <p class="desc">{{ b.desc }}</p>
        <div class="field"><label>{{ behaviorKey==='step' ? '同步今日步数' : '静心时长' }}</label>
          <div class="range-row">
            <input type="range" :min="b.min" :max="b.max" v-model.number="sliderVal" />
            <span class="val">{{ fmt(sliderVal) }} {{ b.unit }}</span>
          </div>
        </div>
        <div class="reward-tip">{{ b.scoreText }} · 王者门槛 {{ b.kingText }}</div>
        <button class="btn block" style="margin-top:14px;" @click="sliderGo">提交</button>
      </template>

      <!-- 早起 -->
      <template v-else-if="behaviorKey==='early' && step==='pick'">
        <p class="desc">{{ b.desc }}</p>
        <div class="field"><label>你今天几点起？</label>
          <div class="chips">
            <button v-for="o in b.options" :key="o.score" class="chip" :class="{ on: earlyScore===o.score }" @click="earlyScore=o.score">{{ o.label }} · {{ o.score }}分</button>
          </div>
        </div>
        <button class="btn block" @click="earlyGo">打卡</button>
      </template>

      <!-- 答题 -->
      <template v-else-if="behaviorKey==='quiz' && step==='pick'">
        <div class="muted">第 {{ quizIdx + 1 }} / {{ quiz.length }} 题</div>
        <div class="quiz-q">{{ curQuiz.q }}</div>
        <div>
          <button v-for="(o,i) in curQuiz.opts" :key="i" class="quiz-opt" :class="optClass(i)" @click="pickOpt(i)">{{ o }}</button>
        </div>
      </template>

      <!-- 随身好事 -->
      <template v-else-if="behaviorKey==='story' && step==='pick'">
        <p class="desc">{{ b.desc }}</p>
        <div class="field"><label>上传小红花挂件 OOTD / 助人故事</label>
          <div class="node-pic" @click="doUpload" :style="storyUp ? 'height:140px;border-radius:12px;background:linear-gradient(135deg,#ffd6e7,#ff9ec4);color:#fff;font-size:40px;' : 'height:140px;border:2px dashed var(--c-line);background:#fff;color:var(--c-sub);font-size:30px;cursor:pointer;'">{{ storyUp ? '🌸' : '＋ 点击上传照片' }}</div>
        </div>
        <div class="field"><label>写两句你的善举（选填）</label>
          <textarea rows="2" style="width:100%;border:1.5px solid var(--c-line);border-radius:12px;padding:10px;font-family:inherit;font-size:14px;" placeholder="今天扶了一位老人过马路…"></textarea>
        </div>
        <div class="reward-tip">联动「随身好事·小红花同行」：审核通过得 {{ b.reward }}，并换算高额分数上龙</div>
        <button class="btn block" style="margin-top:6px;" :disabled="!storyUp" @click="storyGo">{{ storyUp ? '提交审核并上龙' : '上传后提交审核' }}</button>
      </template>

      <!-- UGC 评分中（微笑/书法/画/故事） -->
      <template v-if="step==='scoring-ugc' || (step==='generating' && behaviorKey==='smile')">
        <div class="score-stage">
          <div style="font-size:54px;animation:spin 1.5s linear infinite;display:inline-block;">🤖</div>
          <div class="tierline" style="margin-top:10px;">AI 评分中…</div>
        </div>
      </template>

      <!-- 评分结果 -->
      <template v-if="step==='result' && result">
        <div class="score-stage">
          <div class="num">{{ animScore }}<small>{{ result.unit }}</small></div>
          <div class="tierline" :class="'tier-'+result.tier">{{ tierName[result.tier] }}</div>
          <div class="gain">本次为龙贡献 <b>+{{ result.meter }}</b> 米<span class="muted" v-if="result.bonus && result.bonus!==1"> (×{{ result.bonus }} 加成)</span></div>
        </div>
        <button class="btn block" @click="confirmUp">🐲 确认上龙</button>
      </template>
    </div>
  </div>`,
});
