/* BlindBox —— 爱心盲盒（按权重抽取公益金/小红花周边/称号） */
Vue.component('blind-box', {
  props: { boxes: Number, meter: Number },
  data() { return { state: 'idle', shaking: false, prize: null }; },
  computed: {
    pool() { return window.DRAGON_DATA.levelOf(this.meter).cur.pool; },
    rareTxt() { return { n: '普通', r: '稀有', sr: '超稀有' }; },
  },
  methods: {
    pick() {
      const list = window.DRAGON_DATA.BLINDBOX;
      const total = list.reduce((s, p) => s + p.weight, 0);
      let r = Math.random() * total;
      for (const p of list) { if ((r -= p.weight) <= 0) return p; }
      return list[0];
    },
    open() {
      if (this.boxes <= 0) { this.$emit('toast', '盲盒机会用完啦，去做好事获取～'); return; }
      this.shaking = true; this.state = 'opening';
      setTimeout(() => {
        this.shaking = false;
        this.prize = this.pick();
        this.state = 'prize';
        this.$emit('consume');
      }, 900);
    },
    again() { this.prize = null; this.state = 'idle'; },
    close() { this.$emit('close'); },
  },
  template: `
  <div class="mask center show" @click.self="close">
    <div class="sheet center">
      <template v-if="state !== 'prize'">
        <div class="sheet-head"><h3>🎁 爱心盲盒</h3><button class="x" @click="close">×</button></div>
        <p class="desc">你有 {{ boxes }} 次盲盒机会　当前 {{ pool }}</p>
        <div class="box-stage">
          <div class="gift-box" :class="{ shake: shaking }" @click="open">🎁</div>
          <div class="muted" style="margin-top:10px;">{{ state==='opening' ? '开启中…' : '点击盲盒开启' }}</div>
        </div>
        <button class="btn block" :disabled="state==='opening'" @click="open">开启盲盒（剩余 {{ boxes }} 次）</button>
      </template>
      <template v-else>
        <div class="sheet-head"><h3>🎉 恭喜获得</h3><button class="x" @click="close">×</button></div>
        <div class="prize-card">
          <div class="pic">{{ prize.icon }}</div>
          <div class="nm">{{ prize.label }}</div>
          <div class="rare" :class="'rare-'+prize.rare">{{ rareTxt[prize.rare] }}</div>
        </div>
        <div style="display:flex;gap:10px;margin-top:6px;">
          <button class="btn ghost sm" @click="again">再开一次（{{ boxes }}）</button>
          <button class="btn block" @click="close">收下</button>
        </div>
      </template>
    </div>
  </div>`,
});
