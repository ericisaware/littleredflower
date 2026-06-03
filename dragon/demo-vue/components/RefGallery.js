/* RefGallery —— 视觉参考画廊（嵌入原始设计稿） */
Vue.component('ref-gallery', {
  data() {
    return {
      cur: 'jiaohu',
      boards: [
        { key: 'jiaohu', name: '交互终稿', files: ['jiaohu_0.jpg', 'jiaohu_1.jpg'], hint: '接龙-视觉方案：发起 → 主接龙页 → 挑战浮层 → UGC 评分上龙 → 排行榜（含 1–4 级龙）' },
        { key: 'shijue', name: '视觉方案 8.30', files: ['shijue_0.jpg', 'shijue_1.jpg'], hint: '接龙2.0 视觉方案：打榜与接龙合并、龙色自由选、剪纸/纸袋材质、个人中心、多榜单' },
        { key: 'flow', name: '10种互动流程', files: ['flow_0.jpg'], hint: '10 种做好事互动的完整流程图' },
        { key: 'star', name: '明星接龙', files: ['star_0.jpg', 'star_1.jpg', 'star_2.jpg', 'star_3.jpg', 'star_4.jpg', 'star_5.jpg'], hint: '明星应援接龙（3–4 级龙）龙身展示参考' },
      ],
    };
  },
  computed: { board() { return this.boards.find((b) => b.key === this.cur); } },
  template: `
  <div id="ref-gallery" class="show">
    <div class="ref-bar"><span class="ref-title">原始设计稿 · 视觉参考</span><button class="ref-close" @click="$emit('close')">×</button></div>
    <div class="ref-tabs">
      <button v-for="b in boards" :key="b.key" class="rt" :class="{ on: cur===b.key }" @click="cur=b.key">{{ b.name }}</button>
    </div>
    <div class="ref-scroll">
      <img v-for="f in board.files" :key="f" loading="lazy" :src="'assets/ref/'+f" :alt="board.name" />
      <div class="ref-hint">{{ board.hint }}</div>
    </div>
  </div>`,
});
