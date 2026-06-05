/* ===================================================================
   接龙 · 一条龙 Demo —— 交互逻辑（6.25 视觉还原版）
   匹配 index.html 结构：Banner → Entry → HotWall → DragonBody → RuleCard → RuleOverlay
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

  /* ---------- 工具函数 ---------- */
  function fmt(n) { return Number(n).toLocaleString('en-US'); }

  /* ---------- 头像行 ---------- */
  function renderAvatars() {
    var el = $('#avatar-row');
    if (!el) return;
    var faces = ['🦊', '🍦', '🖋️', '🍃', '👴', '😊'];
    el.innerHTML = faces.map(function (f) {
      return '<div class="av">' + f + '</div>';
    }).join('') + '<div class="av">…</div>';
  }

  /* ---------- 参与人次 ---------- */
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
        '<div class="img" style="background:linear-gradient(135deg,hsl(' + h.hue + ',70%,72%),hsl(' + h.hue + ',65%,55%))">🎨</div>' +
        '<div class="cap"><b>' + h.name + '</b></div>' +
        '<div class="lk">❤️ ' + h.likes + '</div>' +
      '</div>';
    }).join('');
  }

  /* ---------- 龙身节点 ---------- */
  function renderBody() {
    var el = $('#dragon-body');
    if (!el) return;
    el.innerHTML = S.nodes.map(function (n, i) {
      var ring = i === 0 ? '' : '<div class="link-ring"></div>';
      var segClass = i % 2 === 0 ? 'seg-main' : 'seg-offset';
      var hook = '<div class="seg-hook"><i></i><i></i></div>';

      if (n.type === 'donate') {
        var flag = n.tier !== 'normal' ? '<div class="donate-banner"><span>倾囊相助</span></div>' : '';
        var ribbonCls = n.tier === 'king' ? '' : ' donate';
        return ring + '<div class="dragon-seg ' + segClass + '" data-node="' + i + '">' +
          hook +
          '<div class="node donate-node ' + n.tier + '">' +
            '<div class="ribbon' + ribbonCls + '">第 ' + n.rank + ' 位</div>' +
            (n.tier === 'king' ? '<div class="king-fx">👑</div>' : '') +
            '<div class="node-row" style="margin-top:14px;">' +
              '<div class="av">🙂</div>' +
              '<div class="mid">' +
                '<div class="nm">' + n.name + '<span class="tm">' + n.time + '</span></div>' +
                '<div class="ttl">捐赠 <b>' + n.money + '</b> 元支持《' + n.project + '》</div>' +
              '</div>' +
              '<div class="like" data-like="' + i + '"><div class="heart">🤍</div><div class="n">' + n.likes + '</div></div>' +
            '</div>' +
            '<div class="node-meter-line">+' + n.meter + ' 米</div>' +
            flag +
          '</div>' +
        '</div>';
      }

      /* UGC 节点（画/字/笑/故事） */
      var b = D.behaviorByKey(n.behavior) || {};
      var hueMap = { draw: 200, calligraphy: 28, smile: 45, story: 330 };
      var hue = hueMap[n.behavior] || 200;
      var icon = b.icon || '🎨';

      return ring + '<div class="dragon-seg ' + segClass + '" data-node="' + i + '">' +
        hook +
        '<div class="node ' + n.tier + '">' +
          '<div class="ribbon">第 ' + n.rank + ' 位</div>' +
          (n.tier === 'king' ? '<div class="king-fx">👑</div>' : '') +
          '<div class="node-pic" style="background:linear-gradient(135deg,hsl(' + hue + ',70%,70%),hsl(' + hue + ',60%,52%))">' + icon + '</div>' +
          '<div class="node-row">' +
            '<div class="av">' + n.name.charAt(0) + '</div>' +
            '<div class="mid">' +
              '<div class="nm">' + n.name + '<span class="tm">' + n.time + '</span></div>' +
              '<div class="ttl">送 <b>' + n.tag + '</b> ' + n.tagDesc + '　<span class="meter">+' + n.meter + '米</span>' + (n.score ? ' · ' + n.score + '分' : '') + '</div>' +
            '</div>' +
            '<div class="like" data-like="' + i + '"><div class="heart">🤍</div><div class="n">' + n.likes + '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ---------- 简易 Toast ---------- */
  function toast(msg) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.78);color:#fff;padding:8px 20px;border-radius:20px;font-size:13px;z-index:200;pointer-events:none;transition:opacity .4s;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; }, 1400);
    setTimeout(function () { t.remove(); }, 1900);
  }

  /* ---------- 规则弹窗 ---------- */
  var overlay = $('#rule-overlay');
  function openRule() { if (overlay) overlay.classList.add('show'); }
  function closeRule() { if (overlay) overlay.classList.remove('show'); }

  /* ---------- 撒花 ---------- */
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

  /* 注入撒花关键帧（仅一次） */
  if (!$('#confetti-keyframes')) {
    var style = document.createElement('style');
    style.id = 'confetti-keyframes';
    style.textContent = '@keyframes confetti-fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(360deg);opacity:0}}';
    document.head.appendChild(style);
  }

  /* ---------- 参与行为（简化弹窗） ---------- */
  function participate(type) {
    var bMap = {
      draw: { icon: '🎨', name: '画画接龙', desc: 'AI 为你生成一幅公益画作并打分上龙' },
      donate: { icon: '💝', name: '捐款接龙', desc: '为正在接龙的项目捐一笔款，1 元 = 0.05 米' },
    };
    var b = bMap[type];
    if (!b) return;

    /* 模拟参与流程 */
    toast(b.icon + ' ' + b.name + ' — AI 评分中…');

    setTimeout(function () {
      var tier, meter, tag, tagDesc, score;
      if (type === 'donate') {
        meter = 1.5;
        tier = 'normal';
      } else {
        score = Math.round(50 + Math.random() * 70);
        meter = +(score * 0.01).toFixed(2);
        tier = score >= 110 ? 'king' : score >= 80 ? 'good' : 'normal';
        tag = '画卷';
        tagDesc = '《公益画作》';
      }

      /* 插入新节点 */
      var node = type === 'donate'
        ? { type: 'donate', rank: 1, name: '我', time: '刚刚', money: 30, project: D.DRAGON.project, meter: meter, tier: tier, likes: 0 }
        : { type: 'ugc', behavior: 'draw', rank: 1, name: '我', time: '刚刚', tag: tag, tagDesc: tagDesc, meter: meter, tier: tier, likes: 0, score: score };

      S.nodes.unshift(node);
      S.nodes.forEach(function (n, i) { n.rank = i + 1; });
      S.people += 1;

      renderBody();
      renderJoinCount();
      confetti();

      var tierText = { normal: '普通', good: '优秀', king: '王者 👑' }[tier];
      toast('🐲 上龙成功！' + tierText + ' · +' + meter + ' 米');
    }, 1200);
  }

  /* ---------- 热画预览弹窗 ---------- */
  function previewHotPic(name) {
    var h = D.HOTPICS.find(function (x) { return x.name === name; }) || D.HOTPICS[0];
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;';
    box.innerHTML =
      '<div style="position:relative;width:85%;max-width:340px;background:#fff;border-radius:16px;padding:20px;box-shadow:0 10px 40px rgba(0,0,0,.3);">' +
        '<div style="font-size:52px;text-align:center;">🎨</div>' +
        '<div style="font-size:18px;font-weight:800;text-align:center;margin:8px 0;">' + h.name + ' 的作品</div>' +
        '<div style="text-align:center;font-size:14px;margin:6px 0;">' + h.tag + '</div>' +
        '<div style="text-align:center;font-size:13px;color:#90a4ae;">❤️ ' + h.likes + '</div>' +
        '<div style="text-align:center;margin-top:14px;"><button class="btn" id="hp-close" style="min-width:120px;">关闭</button></div>' +
      '</div>';
    document.body.appendChild(box);
    box.querySelector('#hp-close').onclick = function () { box.remove(); };
    box.onclick = function (e) { if (e.target === box) box.remove(); };
  }

  /* ========== 事件代理 ========== */
  document.addEventListener('click', function (e) {
    var t = e.target;

    /* 规则弹窗 */
    var actEl = t.closest('[data-act]');
    if (actEl) {
      var act = actEl.dataset.act;
      if (act === 'rule') { openRule(); return; }
      if (act === 'close-rule') { closeRule(); return; }
      if (act === 'share') { toast('📤 分享海报生成中…'); return; }
      if (act === 'draw') { participate('draw'); return; }
      if (act === 'donate') { participate('donate'); return; }
      if (act === 'join-quick') {
        /* 弹出选择菜单 */
        var menu = document.createElement('div');
        menu.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:flex-end;justify-content:center;';
        menu.innerHTML =
          '<div style="width:100%;max-width:400px;background:#fff;border-radius:20px 20px 0 0;padding:20px;">' +
            '<div style="text-align:center;font-weight:800;font-size:16px;margin-bottom:14px;">🐲 选一种好事接龙</div>' +
            '<div style="display:flex;gap:10px;">' +
              '<div class="entry-item c-draw" style="flex:1;height:80px;cursor:pointer;" data-act="draw"><div class="entry-icon">🎨</div><div class="entry-btn">画画接龙</div></div>' +
              '<div class="entry-item c-donate" style="flex:1;height:80px;cursor:pointer;" data-act="donate"><div class="entry-icon">💝</div><div class="entry-btn">捐款接龙</div></div>' +
            '</div>' +
            '<div style="text-align:center;margin-top:14px;"><button style="border:none;background:none;color:#90a4ae;font-size:14px;cursor:pointer;" id="menu-cancel">取消</button></div>' +
          '</div>';
        document.body.appendChild(menu);
        menu.querySelector('#menu-cancel').onclick = function () { menu.remove(); };
        menu.querySelector('[data-act="draw"]').onclick = function () { menu.remove(); participate('draw'); };
        menu.querySelector('[data-act="donate"]').onclick = function () { menu.remove(); participate('donate'); };
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

    /* 热画点击 */
    var hpEl = t.closest('[data-hotpic]');
    if (hpEl) { previewHotPic(hpEl.dataset.hotpic); return; }

    /* 规则遮罩点击关闭 */
    if (t === overlay) { closeRule(); return; }
  });

  /* ========== 初始化 ========== */
  renderAvatars();
  renderJoinCount();
  renderHotWall();
  renderBody();

  setTimeout(function () { toast('点击「画画接龙」或「捐款接龙」即可参与 🐲'); }, 600);
})();
