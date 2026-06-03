/* RankBoard —— 多榜单（对齐 solitaire_v2 rank_table 多 board tab） */
Vue.component('rank-board', {
  data() {
    return {
      tab: 'project_day',
      champ: window.DRAGON_DATA.LAST_WEEK_CHAMPION,
      tabs: [
        { k: 'project_day', t: '本龙日榜' },
        { k: 'cat_助学', t: '助学' },
        { k: 'cat_疾病', t: '疾病' },
        { k: 'cat_扶贫', t: '扶贫' },
        { k: 'cat_环保及其他', t: '环保及其他' },
        { k: 'star', t: '明星榜 ⭐' },
      ],
    };
  },
  computed: {
    rows() {
      const R = window.DRAGON_DATA.RANKS, k = this.tab;
      if (k === 'project_day') return R.project_day.map((r, i) => ({ no: i + 1, av: r.avatar, name: r.name, sub: '本龙贡献', val: window.GY_FMT.meterText(r.meter) }));
      if (k === 'star') return R.star.map((r, i) => ({ no: i + 1, av: r.avatar, name: r.name, sub: r.fans + ' 应援', val: window.GY_FMT.meterText(r.meter) }));
      const cat = k.replace('cat_', '');
      return R.category[cat].map((r) => ({ no: r.rank, av: '🔥', name: r.name, sub: cat, val: '热度 ' + window.GY_FMT.fmt(r.heat) }));
    },
    showReward() { return this.tab.indexOf('cat_') === 0; },
  },
  methods: {
    noCls(n) { return n === 1 ? 'top1' : n === 2 ? 'top2' : n === 3 ? 'top3' : ''; },
    fmt(n) { return window.GY_FMT.fmt(n); },
  },
  template: `
    <section>
      <div class="banner"><div class="title" style="font-size:20px;">极热接龙榜</div></div>
      <div class="card paper-edge">
        <div class="champ-banner">
          <div class="cup">🏆</div>
          <div><div class="muted" style="color:#6a4a00;">上周冠军 · {{ champ.category }}</div><b>{{ champ.name }}</b> · 热度 {{ fmt(champ.heat) }}</div>
        </div>
      </div>
      <div class="rank-tabs">
        <button v-for="t in tabs" :key="t.k" class="rank-tab" :class="{ on: tab === t.k }" @click="tab = t.k">{{ t.t }}</button>
      </div>
      <div class="card paper-edge">
        <div class="rank-item" v-for="r in rows" :key="r.no + r.name">
          <div class="rank-no" :class="noCls(r.no)">{{ r.no }}</div>
          <div class="av">{{ r.av }}</div>
          <div class="mid"><div class="t">{{ r.name }}</div><div class="s">{{ r.sub }}</div></div>
          <div class="val">{{ r.val }}</div>
        </div>
        <div class="reward-tip" v-if="showReward">📢 本周该子榜热度前 5 名，次周获 24h 腾讯公益首页流量推荐；前 2 名额外再 +24h。</div>
      </div>
    </section>`,
});
