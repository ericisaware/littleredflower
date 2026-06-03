/* 接龙一条龙 —— Vue2 版根应用（对齐 solitaire_v2 App.vue 的数据流：
   getGlobalConf → getDragonByID → getDragonInfo → 状态 → 子组件渲染） */

// 全局格式化工具（供子组件复用）
window.GY_FMT = {
  fmt: (n) => Number(n).toLocaleString('en-US'),
  meterText: (m) => (m >= 10000 ? (m / 10000).toFixed(2) + ' 万米' : Number(Math.round(m)).toLocaleString('en-US') + ' 米'),
};

new Vue({
  el: '#app',
  data() {
    const D = window.DRAGON_DATA;
    return {
      D,
      tab: 'home',
      meter: D.DRAGON.meter,
      people: D.DRAGON.people,
      nodes: D.NODES.slice(),
      enabled: D.DRAGON.enabledBehaviors.slice(),
      balls: D.MY.balls,
      boxes: D.MY.boxes,
      themeColor: D.DRAGON.bgRgb,
      // 弹层状态
      activeBehavior: null,   // BehaviorDialog 的 behaviorKey
      showBox: false,
      ruleShareMode: null,    // 'rule' | 'share' | null
      showRef: false,
      showJoinMenu: false,
      toastMsg: '', toastTimer: null,
      dragon: D.DRAGON,
    };
  },
  computed: {
    enabledBehaviors() { return this.D.BEHAVIORS.filter((b) => this.enabled.indexOf(b.key) >= 0); },
    avatars() { return ['🦊', '🍦', '🖋️', '🍃', '👴']; },
  },
  methods: {
    fmt(n) { return window.GY_FMT.fmt(n); },
    // ---- 通用 ----
    toast(msg) {
      this.toastMsg = msg;
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toastMsg = ''; }, 1800);
    },
    confetti() {
      const e = ['🌸', '🎉', '✨', '💛', '🧡', '🐉'];
      for (let i = 0; i < 24; i++) {
        const s = document.createElement('div');
        s.className = 'confetti'; s.textContent = e[i % e.length];
        s.style.left = Math.random() * 100 + '%';
        s.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
        s.style.animationDelay = Math.random() * 0.3 + 's';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 3200);
      }
    },
    // ---- 行为入口 ----
    pickBehavior(key) {
      if (this.enabled.indexOf(key) < 0) { this.toast('发起人未开启该好事，换一个试试～'); return; }
      this.showJoinMenu = false;
      this.activeBehavior = key;
    },
    // ---- 上龙 ----
    onUp(r) {
      const prevLv = this.D.levelOf(this.meter).cur.lv;
      this.meter += r.meter; this.people += 1;
      const node = r.donate
        ? { type: 'donate', rank: 1, name: this.D.MY.nickname, time: '刚刚', money: r.money, project: this.dragon.project, meter: r.meter, tier: r.tier, likes: 0 }
        : { type: 'ugc', behavior: r.behavior, rank: 1, name: this.D.MY.nickname, time: '刚刚', tag: r.tag, tagDesc: r.tagDesc, meter: r.meter, tier: r.tier, likes: 0, score: r.rawScore };
      this.nodes.unshift(node);
      this.nodes.forEach((n, i) => { n.rank = i + 1; });
      this.balls += 1; this.boxes += 1;
      this.activeBehavior = null;
      this.confetti();
      const nowLv = this.D.levelOf(this.meter).cur.lv;
      if (nowLv > prevLv) {
        const L = this.D.levelOf(this.meter).cur;
        this.toast('🐉 龙升级！Lv.' + L.lv + ' ' + L.name + ' · ' + L.pool);
        setTimeout(() => { this.showBox = true; }, 500);
      } else {
        setTimeout(() => { this.showBox = true; }, 400);
      }
    },
    likeNode(i) { this.nodes[i].likes++; },
    previewHot(h) {
      // 简单用 toast 反馈（点赞在墙上即时 +1）
      h.likes++;
      this.toast('❤️ 为 ' + h.name + ' 的作品点了赞');
    },
    // ---- 盲盒 ----
    consumeBox() { if (this.boxes > 0) this.boxes -= 1; },
    // ---- 发起 ----
    doCreate(themeColor) {
      this.themeColor = themeColor;
      this.toast('🎉 接龙创建成功！正在生成分享海报…');
      setTimeout(() => { this.ruleShareMode = 'share'; }, 800);
    },
    onShareSaved() { this.ruleShareMode = null; this.toast('🎉 海报已生成，快去分享给好友吧'); },
  },
  mounted() {
    setTimeout(() => this.toast('点击任意「好事」即可参与接龙 🐉'), 600);
  },
  template: `
  <div id="phone">
    <div class="statusbar"><span>9:41</span><span>腾讯公益 · 接龙（Vue2）</span><span class="dots">📶 🔋</span></div>

    <!-- 龙身首页 -->
    <section class="view" :class="{ active: tab==='home' }" v-show="tab==='home'">
      <div class="banner">
        <div class="ops">
          <button class="op" @click="ruleShareMode='share'">📤</button>
          <button class="op" @click="ruleShareMode='rule'">📜</button>
        </div>
        <div class="title">{{ dragon.title }}</div>
        <div class="topword">{{ dragon.topWord }}</div>
      </div>

      <dragon-meter :meter="meter"></dragon-meter>

      <div class="card paper-edge">
        <div class="sec-title"><i class="bar"></i>做个好事，让龙变长</div>
        <behavior-grid :enabled="enabled" @pick="pickBehavior"></behavior-grid>
        <div class="people-row">
          <span class="txt">已有 {{ fmt(people) }} 人次参与接龙互动</span>
          <div class="avatars"><span v-for="(a,i) in avatars" :key="i">{{ a }}</span><span>…</span></div>
        </div>
      </div>

      <dragon-list :nodes="nodes" @like="likeNode"></dragon-list>

      <hot-wall @preview="previewHot"></hot-wall>

      <div class="card paper-edge dragon-rule-card compact-card">
        <div class="sec-title"><i class="bar"></i>上龙展示规则</div>
        <div class="tier-board">
          <div class="tier-row head"><span>卡片分为 5 档</span><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></div>
          <div class="tier-row"><span>捐微笑 / 画 / 字</span><em>1</em><em>2</em><em>3</em><em>－</em><em>－</em></div>
          <div class="tier-row"><span>捐钱</span><em>－</em><em>－</em><em>1</em><em>2</em><em>3</em></div>
        </div>
        <div class="muted">高分内容会上更高档位，王者档会带金光特效。</div>
      </div>

      <div style="text-align:center;margin:18px 0;">
        <button class="btn block" @click="showJoinMenu=true">🐲 我也接一棒</button>
      </div>
    </section>

    <!-- 榜单 -->
    <rank-board v-show="tab==='rank'" class="view" :class="{ active: tab==='rank' }"></rank-board>

    <!-- 发起 -->
    <create-panel v-show="tab==='create'" class="view" :class="{ active: tab==='create' }" @create="doCreate" @toast="toast"></create-panel>

    <!-- 个人中心 -->
    <profile-panel v-show="tab==='me'" class="view" :class="{ active: tab==='me' }" :balls="balls" :boxes="boxes" @open-box="showBox=true"></profile-panel>

    <!-- 底部 Tab -->
    <nav class="tabbar">
      <button class="tab" :class="{ on: tab==='home' }" @click="tab='home'"><span class="ic">🐉</span>龙身</button>
      <button class="tab" :class="{ on: tab==='rank' }" @click="tab='rank'"><span class="ic">🏆</span>榜单</button>
      <button class="tab" :class="{ on: tab==='create' }" @click="tab='create'"><span class="ic">➕</span>发起</button>
      <button class="tab" :class="{ on: tab==='me' }" @click="tab='me'"><span class="ic">👤</span>我的</button>
    </nav>

    <!-- 视觉参考浮标 -->
    <button id="ref-fab" @click="showRef=true">🎨<span>设计稿</span></button>

    <!-- 接一棒选择菜单 -->
    <div class="mask show" v-if="showJoinMenu" @click.self="showJoinMenu=false">
      <div class="sheet">
        <div class="sheet-head"><h3>🐲 选一种好事接龙</h3><button class="x" @click="showJoinMenu=false">×</button></div>
        <div class="behavior-grid">
          <div v-for="b in enabledBehaviors" :key="b.key" class="bhv" @click="pickBehavior(b.key)">
            <div class="emoji">{{ b.icon }}</div><div class="nm">{{ b.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 行为弹层 -->
    <behavior-dialog v-if="activeBehavior" :behavior-key="activeBehavior" :enabled="enabled"
      @close="activeBehavior=null" @up="onUp" @toast="toast"></behavior-dialog>

    <!-- 盲盒 -->
    <blind-box v-if="showBox" :boxes="boxes" :meter="meter" @consume="consumeBox" @close="showBox=false" @toast="toast"></blind-box>

    <!-- 规则 / 分享 -->
    <rule-share-dialog v-if="ruleShareMode" :mode="ruleShareMode" :meter="meter" :theme-color="themeColor" :people="people"
      @close="ruleShareMode=null" @saved="onShareSaved"></rule-share-dialog>

    <!-- 视觉参考 -->
    <ref-gallery v-if="showRef" @close="showRef=false"></ref-gallery>

    <!-- toast -->
    <div id="toast" :class="{ show: toastMsg }">{{ toastMsg }}</div>
  </div>`,
});
