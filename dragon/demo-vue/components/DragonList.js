/* DragonList —— 龙身节点列表（对齐 solitaire_v2 DragonList：UGC 卡 type=1 / 捐款卡 type=2） */
Vue.component('dragon-list', {
  props: { nodes: { type: Array, required: true } },
  template: `
    <div>
      <div class="dragon-head">
        <div class="scale">🐉</div>
        <div class="head-copy">
          <div class="eyebrow">公益项目接龙主页面</div>
          <div class="name">龙首 · {{ project }}</div>
          <div class="sub">沿着龙身持续做好事，优质内容会被挂到龙脊上持续展示</div>
        </div>
      </div>
      <div v-for="(n, i) in nodes" :key="n.rank + '-' + i" class="dragon-seg" :class="i % 2 === 0 ? 'seg-main' : 'seg-offset'">
        <div class="link-ring" v-if="i !== 0"></div>
        <div class="seg-hook"><i></i><i></i></div>
        <!-- 捐款节点 -->
        <div v-if="n.type === 'donate'" class="node donate-node" :class="n.tier">
          <div class="ribbon donate">第 {{ n.rank }} 位</div>
          <div class="king-fx" v-if="n.tier === 'king'">👑</div>
          <div class="node-row" style="margin-top:14px;">
            <div class="av">🙂</div>
            <div class="mid">
              <div class="nm">{{ n.name }}<span class="tm">{{ n.time }}</span></div>
              <div class="ttl">捐赠 <b>{{ n.money }}</b> 元支持《{{ n.project }}》</div>
            </div>
            <div class="like" @click="$emit('like', i)"><div class="heart">❤️</div><div class="n">{{ n.likes }}</div></div>
          </div>
          <div class="node-meter-line">+{{ n.meter }} 米</div>
          <div class="donate-banner" v-if="n.tier !== 'normal'"><span>倾囊相助</span></div>
        </div>
        <!-- UGC 节点 -->
        <div v-else class="node" :class="n.tier">
          <div class="ribbon">第 {{ n.rank }} 位</div>
          <div class="king-fx" v-if="n.tier === 'king'">👑</div>
          <div class="node-pic" :style="picBg(n.behavior)">{{ icon(n.behavior) }}</div>
          <div class="node-row">
            <div class="av">{{ n.name[0] }}</div>
            <div class="mid">
              <div class="nm">{{ n.name }}<span class="tm">{{ n.time }}</span></div>
              <div class="ttl">送 <b>{{ n.tag }}</b> {{ n.tagDesc }}　<span class="meter">+{{ n.meter }}米</span><template v-if="n.score"> · {{ n.score }}分</template></div>
            </div>
            <div class="like" @click="$emit('like', i)"><div class="heart">❤️</div><div class="n">{{ n.likes }}</div></div>
          </div>
        </div>
      </div>
    </div>`,
  data() { return { project: window.DRAGON_DATA.DRAGON.project }; },
  methods: {
    icon(key) { const b = window.DRAGON_DATA.behaviorByKey(key); return b ? b.icon : '🎨'; },
    picBg(key) {
      const hue = { draw: 200, calligraphy: 28, smile: 45, story: 330 }[key] || 200;
      return { background: 'linear-gradient(135deg,hsl(' + hue + ',70%,70%),hsl(' + hue + ',60%,52%))' };
    },
  },
});
