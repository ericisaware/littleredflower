/* BehaviorGrid —— 10 类做好事选择网格（未开启行为加锁） */
Vue.component('behavior-grid', {
  props: {
    enabled: { type: Array, required: true },
    behaviors: { type: Array, default: () => window.DRAGON_DATA.BEHAVIORS },
  },
  template: `
    <div class="behavior-grid">
      <div v-for="b in behaviors" :key="b.key" class="bhv" @click="$emit('pick', b.key)">
        <div class="emoji">{{ b.icon }}</div>
        <div class="nm">{{ b.name }}</div>
        <div class="sb">{{ b.sub }}</div>
        <div class="lock" v-if="!isOn(b.key)">🔒</div>
      </div>
    </div>`,
  methods: { isOn(k) { return this.enabled.indexOf(k) >= 0; } },
});
