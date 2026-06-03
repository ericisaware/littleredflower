/* RuleShareDialog —— 规则弹层 / 分享海报弹层（二合一，按 mode 切换） */
Vue.component('rule-share-dialog', {
  props: { mode: String, meter: Number, themeColor: String, people: Number },
  computed: {
    cur() { return window.DRAGON_DATA.levelOf(this.meter).cur; },
    dragon() { return window.DRAGON_DATA.DRAGON; },
    meterText() { return window.GY_FMT.meterText(this.meter); },
  },
  methods: { fmt(n) { return window.GY_FMT.fmt(n); }, close() { this.$emit('close'); } },
  template: `
  <div class="mask show" @click.self="close">
    <div class="sheet">
      <!-- 规则 -->
      <template v-if="mode==='rule'">
        <div class="sheet-head"><h3>📜 接龙玩法规则</h3><button class="x" @click="close">×</button></div>
        <div class="rule-text">
          <h4>怎么让龙变长？</h4>
          做好事就能让龙变长：捐款、写字、画画、捐微笑、捐步数、早起、静心、答题、随身好事…… 共 10 类。UGC 由 AI 打分，<b>分数越高，龙身展示越酷炫，贡献的龙长度越多</b>。
          <h4>龙等级（共 17 级）</h4>
          龙长度达到阈值即升级：宝宝 → 小龙 → 铜鳞 → … → 逍遥宝鳞（32,768,000 米）。等级越高，绑定的接龙抽奖池越好（池1→池4）。
          <h4>爱心盲盒</h4>
          每完成一次好事，得 1 次爱心盲盒机会，可开出公益金、小红花周边（冰箱贴/帆布袋/挂件）、荣誉称号徽章。
          <h4>首页流量奖励</h4>
          每个自然周，极热接龙榜 4 个子榜（疾病/助学/扶贫/环保及其他）热度前 5 的项目，次周获 24h 腾讯公益首页推荐；前 2 名额外再 +24h。
          <div class="muted" style="margin-top:10px;">* 周日 23:59 后冲榜数据可能因延迟无法并入排行。</div>
        </div>
      </template>
      <!-- 分享 -->
      <template v-else>
        <div class="sheet-head"><h3>📤 分享接龙海报</h3><button class="x" @click="close">×</button></div>
        <div :style="{ background: 'linear-gradient(160deg,' + themeColor + ',#fff)', borderRadius: '16px', padding: '20px', textAlign: 'center', color: '#fff' }">
          <div style="font-size:46px;">🐉</div>
          <div style="font-weight:900;font-size:18px;margin:6px 0;text-shadow:0 1px 2px rgba(0,0,0,.2);">{{ dragon.title }}</div>
          <div style="background:#fff;color:var(--c-red);display:inline-block;padding:4px 12px;border-radius:999px;font-weight:800;">Lv.{{ cur.lv }} {{ cur.name }} · {{ meterText }}</div>
          <div style="margin-top:10px;font-size:13px;">已有 {{ fmt(people) }} 人次一起做好事</div>
          <div style="margin-top:14px;display:flex;justify-content:center;gap:8px;align-items:center;">
            <div style="width:64px;height:64px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:30px;">🔳</div>
            <div style="text-align:left;font-size:11px;">长按识别二维码<br/>和我一起接龙</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:14px;">
          <button class="btn ghost sm" @click="close">取消</button>
          <button class="btn block" @click="$emit('saved')">保存海报并分享</button>
        </div>
      </template>
    </div>
  </div>`,
});
