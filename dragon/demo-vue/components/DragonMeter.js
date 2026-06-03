/* DragonMeter —— 龙长度 / 等级进度条（对齐 solitaire_v2 头部信息区） */
Vue.component('dragon-meter', {
  props: { meter: { type: Number, required: true } },
  computed: {
    level() { return window.DRAGON_DATA.levelOf(this.meter); },
    cur() { return this.level.cur; },
    next() { return this.level.next; },
    pct() {
      if (!this.next) return 100;
      return Math.min(100, ((this.meter - this.cur.m) / (this.next.m - this.cur.m)) * 100);
    },
    meterText() { return window.GY_FMT.meterText(this.meter); },
  },
  template: `
    <div class="card paper-edge dragon-meter">
      <div class="lv-badge">Lv.{{ cur.lv }} {{ cur.name }} · {{ cur.pool }}</div>
      <div class="big">{{ meterText }}</div>
      <div class="muted">{{ cur.luck }}</div>
      <div class="progress"><i :style="{ width: pct + '%' }"></i></div>
      <div class="muted" v-if="next">距 Lv.{{ next.lv }}「{{ next.name }}」还差 {{ fmt(next.m - meter) }} 米</div>
      <div class="muted" v-else>已达最高等级 · 逍遥宝鳞 🐉</div>
    </div>`,
  methods: { fmt(n) { return window.GY_FMT.fmt(Math.round(n)); } },
});
