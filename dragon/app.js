/* ===================================================================
   接龙 · 一条龙 Demo — 交互逻辑（6.25 视觉还原 v2）
   4 种行为入口 + 按行为变色龙脊 + 节点 badge
   =================================================================== */
(function () {
  var D = window.DRAGON_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 运行时状态 ---------- */
  var S = {
    nodes: D.NODES.slice(),
    people: D.DRAGON.people,
  };

  /* ---------- 工具 ---------- */
  function fmt(n) { return Number(n).toLocaleString('en-US'); }

  function toast(msg) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.78);color:#fff;padding:8px 20px;border-radius:20px;font-size:13px;z-index:200;pointer-events:none;transition:opacity .4s;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; }, 1400);
    setTimeout(function () { t.remove(); }, 1900);
  }

  function confetti() {
    var emojis = ['🌸', '🎉', '✨', '💛', '🧡', '🐉'];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('div');
      s.textContent = emojis[i % emojis.length];
      s.style.cssText = 'position:fixed;top:-20px;left:' + (Math.random() * 100) + '%;font-size:' + (16 + Math.random() * 14) + 'px;z-index:300;pointer-events:none;animation:confetti-fall ' + (1.4 + Math.random() * 1.2) + 's ease-out ' + (Math.random() * 0.3) + 's forwards;';
      document.body.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 3000); })(s);
    }
  }

  if (!$('#confetti-kf')) {
    var st = document.createElement('style');
    st.id = 'confetti-kf';
    st.textContent = '@keyframes confetti-fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(360deg);opacity:0}}';
    document.head.appendChild(st);
  }

  /* ---------- 头像行 ---------- */
  function renderAvatars() {
    var el = $('#av-row');
    if (!el) return;
    var faces = ['🦊', '🍦', '🖋️', '🍃', '👴', '😊'];
    el.innerHTML = faces.map(function (f) {
      return '<div class="av" style="background:' + ['#e8ecfa','#fee0c0','#ffdce2','#def0e8','#e6e0f4','#fddad8'][faces.indexOf(f)] + '">' + f + '</div>';
    }).join('') + '<div class="av" style="background:#eee">…</div>';
  }
  function renderJoinCount() {
    var el = $('#join-count');
    if (el) el.textContent = fmt(S.people);
  }

  /* ---------- 热门好事墙 ---------- */
  function renderHotWall() {
    var el = $('#hot-scroll');
    if (!el) return;
    el.innerHTML = D.HOTPICS.map(function (h) {
      return '<div class="hot-pic" data-hotpic="' + h.name + '">' +
        '<div class="pic" style="background:linear-gradient(135deg,hsl(' + h.hue + ',72%,68%),hsl(' + h.hue + ',65%,50%))"><span class="badge">优选</span>🎨</div>' +
        '<div class="name">' + h.name + '</div>' +
        '<div class="likes">❤️ ' + h.likes + '</div>' +
      '</div>';
    }).join('');
  }

  /* ---------- 行为标签映射 ---------- */
  var BHVMAP = {
    draw:     { label: '捐副画',  icon: '🎨', cls: 'draw', color: '#9ca0ea' },
    calligraphy: { label: '捐个字', icon: '🖌️', cls: 'calligraphy', color: '#f16f32' },
    smile:    { label: '捐微笑',  icon: '😄', cls: 'smile', color: '#f98e99' },
    donate:   { label: '捐款',    icon: '💝', cls: 'donate', color: '#d71e17' },
    story:    { label: '传善举',  icon: '🌸', cls: 'draw', color: '#9ca0ea' },
  };

  /* ---------- 龙身节点渲染 ---------- */
  function renderBody() {
    var el = $('#dragon-body');
    if (!el) return;
    el.innerHTML = S.nodes.map(function (n, i) {
      var ring = i === 0 ? '' : '<div class="link-ring"></div>';
      var segClass = i % 2 === 0 ? '' : 'seg-offset';
      var bhv = n.behavior || (n.type === 'donate' ? 'donate' : 'story');
      var mapper = BHVMAP[bhv] || BHVMAP.draw;
      var hook = '<div class="seg-hook"><i></i><i></i></div>';

      /* 捐款节点 */
      if (n.type === 'donate') {
        var flag = n.tier !== 'normal' ? '<div class="donate-banner"><span>博施济众</span></div>' : '';
        return ring + '<div class="dragon-seg ' + segClass + '" data-bhv="donate" data-node="' + i + '">' +
          hook +
          '<div class="node ' + n.tier + '">' +
            '<span class="node-badge donate">捐款</span>' +
            '<span class="node-num">NO.' + n.rank + '</span>' +
            (n.tier === 'king' ? '<div class="king-fx">👑</div><div class="king-ornament">满分花花</div>' : '') +
            '<div class="node-row">' +
              '<div class="av">🙂</div>' +
              '<div class="mid">' +
                '<div class="nm">' + n.name + '<span class="time">' + n.time + '</span></div>' +
                '<div class="act">捐赠了 <b>' + n.money + '</b> 元钱</div>' +
              '</div>' +
              '<div class="like" data-like="' + i + '"><div class="heart">🤍</div><div class="n">' + n.likes + '</div></div>' +
            '</div>' +
            '<div class="node-foot"><span class="meter">+' + n.meter + 'm</span><span>' + n.time + '</span></div>' +
            flag +
          '</div>' +
        '</div>';
      }

      /* UGC 节点 */
      var hueMap = { draw: 240, calligraphy: 22, smile: 350, story: 320 };
      var hue = hueMap[bhv] || 200;
      return ring + '<div class="dragon-seg ' + segClass + '" data-bhv="' + mapper.cls + '" data-node="' + i + '">' +
        hook +
        '<div class="node ' + n.tier + '">' +
          '<span class="node-badge ' + mapper.cls + '">' + mapper.label + '</span>' +
          '<span class="node-num">NO.' + n.rank + '</span>' +
          (n.tier === 'king' ? '<div class="king-fx">👑</div><div class="king-ornament">满分花花</div>' : '') +
          '<div class="node-pic" style="background:linear-gradient(135deg,hsl(' + hue + ',68%,68%),hsl(' + hue + ',62%,48%))">' + mapper.icon + '</div>' +
          '<div class="node-row">' +
            '<div class="av">' + n.name.charAt(0) + '</div>' +
            '<div class="mid">' +
              '<div class="nm">' + n.name + '<span class="time">' + n.time + '</span></div>' +
              '<div class="act">做了1个<b>' + (n.score || '?') + '分</b>' + n.tagDesc + '</div>' +
            '</div>' +
            '<div class="like" data-like="' + i + '"><div class="heart">🤍</div><div class="n">' + n.likes + '</div></div>' +
          '</div>' +
          '<div class="node-foot"><span class="meter">+' + n.meter + 'm</span><span>' + n.time + '</span></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ---------- 参与流程 ---------- */
  var BEHAVIORS_AVAILABLE = {
    draw:         { icon: '🎨', name: '捐副画', bhv: 'draw', desc: 'AI 为你生成一幅公益画作', scoreRange: [50, 120], tierThreshold: 110 },
    calligraphy:  { icon: '🖌️', name: '捐个字', bhv: 'calligraphy', desc: '写一个字 AI 书法评分打分', scoreRange: [50, 120], tierThreshold: 110 },
    smile:        { icon: '😄', name: '捐微笑', bhv: 'smile', desc: '对镜头微笑，优图识别评分', scoreRange: [50, 150], tierThreshold: 110 },
    donate:       { icon: '💝', name: '捐款', bhv: 'donate', desc: '为项目捐一笔款', amount: 30 },
  };

  function participate(type) {
    var b = BEHAVIORS_AVAILABLE[type];
    if (!b) return;
    toast(b.icon + ' ' + b.name + ' — 处理中…');

    setTimeout(function () {
      var node, tier, meter;

      if (type === 'donate') {
        meter = b.amount * 0.05;
        tier = b.amount >= 100 ? 'king' : b.amount >= 50 ? 'good' : 'normal';
        node = {
          type: 'donate', behavior: 'donate', rank: 1,
          name: '我', time: '刚刚', money: b.amount,
          project: D.DRAGON.project, meter: meter, tier: tier, likes: 0
        };
      } else {
        var score = Math.round(b.scoreRange[0] + Math.random() * (b.scoreRange[1] - b.scoreRange[0]));
        meter = +(score * 0.01).toFixed(2);
        tier = score >= b.tierThreshold ? 'king' : score >= (b.scoreRange[0] + (b.scoreRange[1] - b.scoreRange[0]) * 0.35) ? 'good' : 'normal';
        node = {
          type: 'ugc', behavior: type, rank: 1,
          name: '我', time: '刚刚',
          tag: b.name, tagDesc: b.name,
          meter: meter, tier: tier, likes: 0, score: score
        };
      }

      S.nodes.unshift(node);
      S.nodes.forEach(function (n, i) { n.rank = i + 1; });
      S.people += 1;

      renderBody();
      renderJoinCount();
      confetti();

      var tierText = { normal: '普通', good: '优秀', king: '王者 👑' }[tier];
      toast('🐲 上龙成功！' + tierText + ' · +' + meter + ' 米');
    }, 1000);
  }

  /* ---------- 规则弹窗 ---------- */
  var overlay = $('#rule-overlay');
  function openRule() { if (overlay) overlay.classList.add('show'); }
  function closeRule() { if (overlay) overlay.classList.remove('show'); }

  /* ---------- 热画预览 ---------- */
  function previewHotPic(name) {
    var h = D.HOTPICS.find(function (x) { return x.name === name; }) || D.HOTPICS[0];
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;';
    box.innerHTML =
      '<div style="position:relative;width:85%;max-width:340px;background:#fff;border-radius:18px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,.3);text-align:center;">' +
        '<div style="font-size:52px;">🎨</div>' +
        '<div style="font-size:18px;font-weight:800;margin:8px 0;">' + h.name + ' 的作品</div>' +
        '<div style="font-size:14px;">' + h.tag + '</div>' +
        '<div style="font-size:13px;color:#90a4ae;">❤️ ' + h.likes + '</div>' +
        '<div style="margin-top:16px;"><button class="btn" style="background:#df2413;min-width:120px;" id="hp-close">关闭</button></div>' +
      '</div>';
    document.body.appendChild(box);
    box.querySelector('#hp-close').onclick = function () { box.remove(); };
    box.onclick = function (e) { if (e.target === box) box.remove(); };
  }

  /* ========== 事件代理 ========== */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var actEl = t.closest('[data-act]');

    if (actEl) {
      var act = actEl.dataset.act;
      if (act === 'rule')        { openRule(); return; }
      if (act === 'close-rule')  { closeRule(); return; }
      if (act === 'share')       { toast('📤 分享海报生成中…'); return; }
      if (act === 'draw')        { participate('draw'); return; }
      if (act === 'calligraphy') { participate('calligraphy'); return; }
      if (act === 'smile')       { participate('smile'); return; }
      if (act === 'donate')      { participate('donate'); return; }

      if (act === 'join-quick') {
        var menu = document.createElement('div');
        menu.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:flex-end;justify-content:center;';
        var items = [
          { a: 'draw', i: '🎨', n: '捐副画' },
          { a: 'calligraphy', i: '🖌️', n: '捐个字' },
          { a: 'smile', i: '😄', n: '捐微笑' },
          { a: 'donate', i: '💝', n: '捐款' },
        ];
        menu.innerHTML =
          '<div style="width:100%;max-width:400px;background:#fff;border-radius:20px 20px 0 0;padding:20px;">' +
            '<div style="text-align:center;font-weight:800;font-size:16px;margin-bottom:14px;">🐲 选一种好事接龙</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
              items.map(function (it) {
                return '<div class="act-card act-' + it.a + '" data-act="' + it.a + '" style="border-radius:12px;padding:16px 10px;text-align:center;">' +
                  '<span style="font-size:28px;">' + it.i + '</span>' +
                  '<div style="font-weight:800;font-size:14px;">' + it.n + '</div>' +
                '</div>';
              }).join('') +
            '</div>' +
            '<div style="text-align:center;margin-top:14px;"><button id="menu-cancel" style="border:none;background:none;color:#90a4ae;font-size:14px;cursor:pointer;">取消</button></div>' +
          '</div>';
        document.body.appendChild(menu);
        menu.querySelector('#menu-cancel').onclick = function () { menu.remove(); };
        menu.querySelectorAll('[data-act]').forEach(function (el) {
          el.onclick = function () { menu.remove(); participate(el.dataset.act); };
        });
        menu.onclick = function (ev) { if (ev.target === menu) menu.remove(); };
        return;
      }
    }

    /* 点赞 */
    var likeEl = t.closest('[data-like]');
    if (likeEl) {
      var idx = +likeEl.dataset.like;
      var node = S.nodes[idx];
      if (!node) return;
      var heartEl = likeEl.querySelector('.heart');
      var nEl = likeEl.querySelector('.n');
      if (node._liked) {
        node._liked = false;
        node.likes--;
        heartEl.textContent = '🤍';
      } else {
        node._liked = true;
        node.likes++;
        heartEl.textContent = '❤️';
      }
      nEl.textContent = node.likes;
      return;
    }

    /* 热画 */
    var hpEl = t.closest('[data-hotpic]');
    if (hpEl) { previewHotPic(hpEl.dataset.hotpic); return; }

    /* 规则遮罩 */
    if (t === overlay) { closeRule(); return; }
  });

  /* ========== 初始化 ========== */
  renderAvatars();
  renderJoinCount();
  renderHotWall();
  renderBody();

  setTimeout(function () { toast('点击任意行为卡片即可参与接龙 🐲'); }, 600);
})();
