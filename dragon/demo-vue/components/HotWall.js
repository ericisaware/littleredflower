/* HotWall —— 热门好事墙（对齐 solitaire_v2 HotList 热画墙） */
Vue.component('hot-wall', {
  props: { list: { type: Array, default: () => window.DRAGON_DATA.HOTPICS } },
  template: `
    <div class="card paper-edge">
      <div class="sec-title"><i class="bar"></i>热门好事墙 🔥</div>
      <div class="hot-scroll">
        <div class="hot-pic" v-for="h in list" :key="h.name" @click="$emit('preview', h)">
          <div class="img" :style="bg(h.hue)">🎨</div>
          <div class="cap"><b>{{ h.name }}</b></div>
          <div class="lk">❤️ {{ h.likes }}</div>
        </div>
      </div>
    </div>`,
  methods: {
    bg(hue) { return { background: 'linear-gradient(135deg,hsl(' + hue + ',70%,72%),hsl(' + hue + ',65%,55%))' }; },
  },
});
