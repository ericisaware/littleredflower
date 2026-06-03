/* CreatePanel —— 发起接龙（配置好事 → 实时加成系数 → 选主题色） */
Vue.component('create-panel', {
  data() {
    return {
      sel: ['fund', 'draw', 'calligraphy'],
      themeColor: window.DRAGON_DATA.DRAGON.bgRgb,
      colors: ['#4cb4eb', '#d81800', '#f5b316', '#8e5cf2', '#2fae6b', '#ff7aa8'],
      behaviors: window.DRAGON_DATA.BEHAVIORS,
    };
  },
  computed: {
    nonFund() { return this.sel.filter((k) => k !== 'fund' && k !== 'month').length; },
    factor() { return window.DRAGON_DATA.bonusFactor(this.sel); },
  },
  methods: {
    toggle(k) {
      if (k === 'fund') this.$emit('toast', '捐款为默认基础行为，建议保留');
      const i = this.sel.indexOf(k);
      if (i >= 0) { if (this.sel.length > 1) this.sel.splice(i, 1); }
      else { if (this.sel.length >= 5) { this.$emit('toast', '最多选 5 类好事'); return; } this.sel.push(k); }
    },
    isOn(k) { return this.sel.indexOf(k) >= 0; },
  },
  template: `
    <section>
      <div class="banner"><div class="title" style="font-size:20px;">发起一条龙</div></div>
      <div class="card paper-edge">
        <div class="sec-title"><i class="bar"></i>选择公益项目</div>
        <div class="proj-card">
          <div class="cover">🍱</div>
          <div><div style="font-weight:800;">乡村儿童午餐</div><div class="muted">助学 · 腾讯公益 × 小红花</div></div>
        </div>
      </div>
      <div class="card paper-edge">
        <div class="sec-title"><i class="bar"></i>配置可参与的好事</div>
        <div class="muted" style="margin-bottom:8px;">选择越少行为，单次贡献加成越高（聚焦做深）</div>
        <div class="behavior-grid">
          <div v-for="b in behaviors" :key="b.key" class="bhv" :class="{ on: isOn(b.key) }" @click="toggle(b.key)">
            <div class="emoji">{{ b.icon }}</div><div class="nm">{{ b.name }}</div>
            <div class="king-tag" v-if="isOn(b.key)">✓</div>
          </div>
        </div>
        <div class="bonus-tip">已选 {{ sel.length }} 类好事（其中非捐款 {{ nonFund }} 类）→ 龙长度加成 <b>×{{ factor }}</b><br><span class="muted">聚焦少数好事做深，单次贡献更高</span></div>
      </div>
      <div class="card paper-edge">
        <div class="sec-title"><i class="bar"></i>选择龙的主题色</div>
        <div class="color-pick">
          <div v-for="c in colors" :key="c" class="color-dot" :class="{ on: c === themeColor }" :style="{ background: c }" @click="themeColor = c"></div>
        </div>
      </div>
      <div style="text-align:center;margin:18px 0;">
        <button class="btn block" @click="$emit('create', themeColor)">🐉 创建接龙并分享</button>
      </div>
    </section>`,
});
