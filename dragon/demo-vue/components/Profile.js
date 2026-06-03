/* Profile —— 个人中心（对齐 solitaire myact_new：我发起的 / 我参与的） */
Vue.component('profile-panel', {
  props: { balls: Number, boxes: Number },
  data() { return { tab: 'created', my: window.DRAGON_DATA.MY }; },
  computed: {
    list() { return this.tab === 'created' ? this.my.created : this.my.joined; },
  },
  methods: { fmt(n) { return window.GY_FMT.fmt(n); }, meterText(m) { return window.GY_FMT.meterText(m); } },
  template: `
    <section>
      <div class="banner" style="text-align:left;">
        <div class="profile-head">
          <div class="pa">{{ my.avatar }}</div>
          <div><div class="pn">{{ my.nickname }}</div><div class="pm">做好事，会上瘾 ✨</div></div>
        </div>
      </div>
      <div class="card paper-edge">
        <div class="stat-row">
          <div class="stat"><div class="v">{{ my.created.length + my.joined.length }}</div><div class="l">参与的龙</div></div>
          <div class="stat"><div class="v">{{ balls }}</div><div class="l">龙珠</div></div>
          <div class="stat"><div class="v">{{ boxes }}</div><div class="l">盲盒</div></div>
        </div>
      </div>
      <div class="card paper-edge">
        <div class="sec-title"><i class="bar"></i>我的称号 & 锦旗</div>
        <div class="badge-wrap">
          <span class="badge title" v-for="t in my.titles" :key="t">{{ t }}</span>
          <span class="badge" v-for="f in my.flags" :key="f">🏵️ {{ f }}</span>
        </div>
      </div>
      <div class="card paper-edge">
        <div class="subtab">
          <button :class="{ on: tab === 'created' }" @click="tab = 'created'">我发起的</button>
          <button :class="{ on: tab === 'joined' }" @click="tab = 'joined'">我参与的</button>
        </div>
        <div>
          <div class="list-item" v-for="it in list" :key="it.project">
            <div class="ico">🐉</div>
            <div class="mid"><div class="t">{{ it.project }}</div><div class="s">{{ it.time }} · {{ fmt(it.people) }} 人次</div></div>
            <div class="val" style="color:var(--c-red);font-weight:800;">{{ meterText(it.meter) }}</div>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin:18px 0;">
        <button class="btn block blue" @click="$emit('open-box')">🎁 我的爱心盲盒（{{ boxes }}）</button>
      </div>
    </section>`,
});
