/* ===================================================================
   接龙 / 一条龙 Demo —— 交互逻辑
   每个按钮可点击：行为参与 → AI 评分动画 → 上龙增长 → 爱心盲盒
   =================================================================== */
(function () {
  const D = window.DRAGON_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // 运行时状态
  const S = {
    meter: D.DRAGON.meter,
    people: D.DRAGON.people,
    nodes: D.NODES.slice(),
    enabled: D.DRAGON.enabledBehaviors.slice(),
    balls: D.MY.balls,
    boxes: D.MY.boxes,
    themeColor: D.DRAGON.bgRgb,
    createSel: ['fund', 'draw', 'calligraphy'],
    rankTab: 'project_day',
    meTab: 'created',
  };

  // ---------- 工具 ----------
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const meterText = (m) => (m >= 10000 ? (m / 10000).toFixed(2) + ' 万米' : fmt(Math.round(m)) + ' 米');
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 1800);
  }
  function tierOf(behavior, score) {
    if (score >= behavior.kingThreshold) return 'king';
    // 优秀：超过下限+某幅度
    const span = (behavior.max || behavior.kingThreshold) - (behavior.min || 0);
    if (behavior.min != null && score >= behavior.min + span * 0.4) return 'good';
    if (behavior.min == null && score >= behavior.kingThreshold * 0.85) return 'good';
    return 'normal';
  }
  const tierName = { normal: '普通 · 标准节点', good: '优秀 · 高亮动效', king: '王者 · 专属金光特效 👑' };

  // ---------- 弹层 ----------
  const mask = $('#mask'), sheet = $('#sheet');
  function openSheet(html, center = false) {
    sheet.innerHTML = html;
    mask.classList.toggle('center', center);
    sheet.classList.toggle('center', center);
    mask.classList.add('show');
  }
  function closeSheet() { mask.classList.remove('show'); }
  mask.addEventListener('click', (e) => { if (e.target === mask) closeSheet(); });

  // 撒花
  function confetti() {
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
  }

  // =================================================================
  //  渲染：首页
  // =================================================================
  function renderHome() {
    $('#home-title').textContent = D.DRAGON.title;
    $('#home-topword').textContent = D.DRAGON.topWord;
    renderMeter();
    renderBehaviorGrid();
    $('#people-txt').textContent = `已有 ${fmt(S.people)} 人次参与接龙互动`;
    $('#avatars').innerHTML = ['🦊', '🍦', '🖋️', '🍃', '👴'].map((a) => `<span>${a}</span>`).join('') + '<span>…</span>';
    renderHotWall();
    renderBody();
  }

  function renderMeter() {
    const { cur, next } = D.levelOf(S.meter);
    const pct = next ? Math.min(100, ((S.meter - cur.m) / (next.m - cur.m)) * 100) : 100;
    $('#meter-card').innerHTML = `
      <div class="lv-badge">Lv.${cur.lv} ${cur.name} · ${cur.pool}</div>
      <div class="big">${meterText(S.meter)}</div>
      <div class="muted">${cur.luck}</div>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <div class="muted">${next ? `距 Lv.${next.lv}「${next.name}」还差 ${fmt(Math.round(next.m - S.meter))} 米` : '已达最高等级 · 逍遥宝鳞 🐉'}</div>
    `;
  }

  function renderBehaviorGrid() {
    $('#behavior-grid').innerHTML = D.BEHAVIORS.map((b) => {
      const on = S.enabled.includes(b.key);
      return `<div class="bhv ${on ? '' : ''}" data-bhv="${b.key}">
        <div class="emoji">${b.icon}</div>
        <div class="nm">${b.name}</div>
        <div class="sb">${b.sub}</div>
        ${on ? '' : '<div class="lock">🔒</div>'}
      </div>`;
    }).join('');
  }

  function renderHotWall() {
    $('#hot-scroll').innerHTML = D.HOTPICS.map((h) => `
      <div class="hot-pic" data-hotpic="${h.name}">
        <div class="img" style="background:linear-gradient(135deg,hsl(${h.hue},70%,72%),hsl(${h.hue},65%,55%))">🎨</div>
        <div class="cap"><b>${h.name}</b></div>
        <div class="lk">❤️ ${h.likes}</div>
      </div>`).join('');
  }

  function renderBody() {
    $('#dragon-body').innerHTML = S.nodes.map((n, i) => {
      const ring = i === 0 ? '' : '<div class="link-ring"></div>';
      const segClass = i % 2 === 0 ? 'seg-main' : 'seg-offset';
      const hook = '<div class="seg-hook"><i></i><i></i></div>';
      if (n.type === 'donate') {
        const flag = n.tier !== 'normal' ? '<div class="donate-banner"><span>倾囊相助</span></div>' : '';
        return `${ring}<div class="dragon-seg ${segClass}" data-node="${i}">
          ${hook}
          <div class="node donate-node ${n.tier}">
            <div class="ribbon donate">第 ${n.rank} 位</div>
            ${n.tier === 'king' ? '<div class="king-fx">👑</div>' : ''}
            <div class="node-row" style="margin-top:14px;">
              <div class="av">🙂</div>
              <div class="mid">
                <div class="nm">${n.name}<span class="tm">${n.time}</span></div>
                <div class="ttl">捐赠 <b>${n.money}</b> 元支持《${n.project}》</div>
              </div>
              <div class="like" data-like="${i}"><div class="heart">❤️</div><div class="n">${n.likes}</div></div>
            </div>
            <div class="node-meter-line">+${n.meter} 米</div>
            ${flag}
          </div>
        </div>`;
      }
      const b = D.behaviorByKey(n.behavior) || {};
      const hue = { draw: 200, calligraphy: 28, smile: 45, story: 330 }[n.behavior] || 200;
      return `${ring}<div class="dragon-seg ${segClass}" data-node="${i}">
        ${hook}
        <div class="node ${n.tier}">
          <div class="ribbon">第 ${n.rank} 位</div>
          ${n.tier === 'king' ? '<div class="king-fx">👑</div>' : ''}
          <div class="node-pic" style="background:linear-gradient(135deg,hsl(${hue},70%,70%),hsl(${hue},60%,52%))">${b.icon || '🎨'}</div>
          <div class="node-row">
            <div class="av">${n.name[0]}</div>
            <div class="mid">
              <div class="nm">${n.name}<span class="tm">${n.time}</span></div>
              <div class="ttl">送 <b>${n.tag}</b> ${n.tagDesc}　<span class="meter">+${n.meter}米</span>${n.score ? ` · ${n.score}分` : ''}</div>
            </div>
            <div class="like" data-like="${i}"><div class="heart">❤️</div><div class="n">${n.likes}</div></div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // =================================================================
  //  行为参与流程
  // =================================================================
  function startBehavior(key) {
    if (!S.enabled.includes(key)) {
      toast('发起人未开启该好事，换一个试试～'); return;
    }
    const b = D.behaviorByKey(key);
    const map = {
      fund: payFlow, month: payFlow,
      calligraphy: padFlow, draw: aiDrawFlow, smile: smileFlow,
      step: dataFlow, meditate: dataFlow, early: earlyFlow,
      quiz: quizFlow, story: storyFlow,
    };
    (map[b.kind === 'pay' ? key : key] || dataFlow)(b);
  }

  // ---- 头部模板（行为弹层通用） ----
  function headHtml(b) {
    return `<div class="sheet-head"><h3>${b.icon} ${b.name}</h3><button class="x" data-x>×</button></div>
      <p class="desc">${b.desc}</p>`;
  }

  // ---- 捐款 / 月捐 ----
  function payFlow(b) {
    const amounts = b.key === 'month' ? [10, 20, 50, 100] : [9, 30, 100, 200];
    let amt = b.defaultAmount;
    openSheet(`${headHtml(b)}
      <div class="field"><label>选择金额（元）</label>
        <div class="amount-row" id="amt-row">
          ${amounts.map((a) => `<button class="chip ${a === amt ? 'on' : ''}" data-amt="${a}">${a} 元</button>`).join('')}
        </div>
      </div>
      ${b.key === 'month' ? '<div class="reward-tip">月捐 1 元 = 20 米，并解锁月捐专属锦旗 🏵️</div>' : '<div class="reward-tip">捐款 1 元 = 0.05 米</div>'}
      <button class="btn block" id="pay-go" style="margin-top:14px;">确认支付 <span id="pay-amt">${amt}</span> 元</button>`);
    $$('#amt-row .chip').forEach((c) => c.onclick = () => {
      amt = +c.dataset.amt;
      $$('#amt-row .chip').forEach((x) => x.classList.toggle('on', x === c));
      $('#pay-amt').textContent = amt;
    });
    $('#pay-go').onclick = () => {
      const meter = amt * b.meterPerYuan;
      const score = b.key === 'fund' ? amt : amt;
      const tier = amt >= b.kingThreshold ? 'king' : amt >= b.kingThreshold * 0.5 ? 'good' : 'normal';
      showScore(b, { rawScore: amt, scoreLabel: amt + ' 元', meter, tier, donate: true, money: amt });
    };
  }

  // ---- 书法（canvas 手写） ----
  function padFlow(b) {
    openSheet(`${headHtml(b)}
      <div class="field"><label>用手指在下方写一个字 ✍️</label>
        <canvas class="pad" id="pad"></canvas>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn ghost sm" id="pad-clear">重写</button>
        <button class="btn block" id="pad-go">提交给 AI 评分</button>
      </div>`);
    const cv = $('#pad'); const rect = cv.getBoundingClientRect();
    cv.width = rect.width * 2; cv.height = rect.height * 2;
    const ctx = cv.getContext('2d'); ctx.scale(2, 2);
    ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#2a2118';
    let drawing = false, has = false;
    const pos = (e) => { const r = cv.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return [t.clientX - r.left, t.clientY - r.top]; };
    const down = (e) => { drawing = true; has = true; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); e.preventDefault(); };
    const move = (e) => { if (!drawing) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); e.preventDefault(); };
    const up = () => { drawing = false; };
    cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    cv.addEventListener('touchstart', down); cv.addEventListener('touchmove', move); cv.addEventListener('touchend', up);
    $('#pad-clear').onclick = () => { ctx.clearRect(0, 0, cv.width, cv.height); has = false; };
    $('#pad-go').onclick = () => {
      if (!has) { toast('先写一个字吧 ✍️'); return; }
      runUGCScore(b, '书香', '「爱」');
    };
  }

  // ---- AI 画画（多步） ----
  function aiDrawFlow(b) {
    let picked = D.DRAW_PROMPTS[0];
    openSheet(`${headHtml(b)}
      <div class="field"><label>第一步 · 挑一个灵感词</label>
        <div class="chips" id="prompt-chips">
          ${D.DRAW_PROMPTS.map((p, i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-p="${p}">${p}</button>`).join('')}
        </div>
      </div>
      <button class="btn block" id="draw-gen">✨ 让 AI 开始画</button>`);
    $$('#prompt-chips .chip').forEach((c) => c.onclick = () => {
      picked = c.dataset.p; $$('#prompt-chips .chip').forEach((x) => x.classList.toggle('on', x === c));
    });
    $('#draw-gen').onclick = () => {
      openSheet(`${headHtml(b)}
        <div class="score-stage">
          <div style="font-size:60px;animation:spin 2s linear infinite;display:inline-block;">🎨</div>
          <div class="tierline" style="margin-top:12px;">AI 正在为「${picked}」作画…</div>
        </div>`);
      setTimeout(() => {
        openSheet(`${headHtml(b)}
          <div class="node-pic" style="height:180px;border-radius:14px;background:linear-gradient(135deg,hsl(200,70%,70%),hsl(280,60%,60%));font-size:64px;">🖼️</div>
          <div class="muted" style="text-align:center;margin:8px 0;">《${picked}》</div>
          <div style="display:flex;gap:10px;">
            <button class="btn ghost sm" id="draw-again">换一换</button>
            <button class="btn block" id="draw-ok">就它了，AI 评分</button>
          </div>`);
        $('#draw-again').onclick = () => aiDrawFlow(b);
        $('#draw-ok').onclick = () => runUGCScore(b, '画卷', '《' + picked + '》');
      }, 1400);
    };
  }

  // ---- 捐微笑 ----
  function smileFlow(b) {
    openSheet(`${headHtml(b)}
      <div class="smile-cam"><div class="frame"></div>😊</div>
      <button class="btn block" id="smile-go" style="margin-top:14px;">📸 对镜头笑一个</button>`);
    $('#smile-go').onclick = () => {
      $('#smile-go').textContent = '优图识别中…'; $('#smile-go').disabled = true;
      setTimeout(() => runUGCScore(b, '微笑', '一个甜甜的笑'), 1100);
    };
  }

  // ---- 捐步 / 静心（滑块数据） ----
  function dataFlow(b) {
    let val = b.defaultVal != null ? b.defaultVal : b.min;
    const calc = (v) => {
      let score;
      if (b.key === 'step') score = v / b.perScore;
      else if (b.key === 'meditate') score = v * 10;
      else score = v;
      return Math.round(score);
    };
    openSheet(`${headHtml(b)}
      <div class="field"><label>${b.key === 'step' ? '同步今日步数' : '静心时长'}</label>
        <div class="range-row">
          <input type="range" id="rg" min="${b.min}" max="${b.max}" value="${val}" />
          <span class="val" id="rgv">${fmt(val)} ${b.unit}</span>
        </div>
      </div>
      <div class="reward-tip">${b.scoreText} · 王者门槛 ${b.kingText}</div>
      <button class="btn block" id="data-go" style="margin-top:14px;">提交</button>`);
    $('#rg').oninput = (e) => { val = +e.target.value; $('#rgv').textContent = fmt(val) + ' ' + b.unit; };
    $('#data-go').onclick = () => {
      const score = calc(val);
      finishScore(b, score, b.name.replace(/^.*?\//, ''), `${fmt(val)}${b.unit}`);
    };
  }

  // ---- 早起（二选一） ----
  function earlyFlow(b) {
    openSheet(`${headHtml(b)}
      <div class="field"><label>你今天几点起？</label>
        <div class="chips" id="early-opt">
          ${b.options.map((o, i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-s="${o.score}">${o.label} · ${o.score}分</button>`).join('')}
        </div>
      </div>
      <button class="btn block" id="early-go">打卡</button>`);
    let sc = b.options[0].score;
    $$('#early-opt .chip').forEach((c) => c.onclick = () => { sc = +c.dataset.s; $$('#early-opt .chip').forEach((x) => x.classList.toggle('on', x === c)); });
    $('#early-go').onclick = () => finishScore(b, sc, '早起', '清晨打卡');
  }

  // ---- 答题 ----
  function quizFlow(b) {
    const QS = [
      { q: '“小红花”是腾讯公益的什么标识？', opts: ['爱心捐赠的公益符号', '一种花卉品种', '游戏道具'], right: 0 },
      { q: '99 公益日通常在每年的哪个月？', opts: ['3 月', '9 月', '12 月'], right: 1 },
      { q: '下列哪种行为也能让接龙的龙变长？', opts: ['只能靠捐款', '写字 / 画画 / 捐微笑等好事', '什么都不做'], right: 1 },
    ];
    let correct = 0, idx = 0;
    function render() {
      const q = QS[idx];
      openSheet(`${headHtml(b)}
        <div class="muted">第 ${idx + 1} / ${QS.length} 题</div>
        <div class="quiz-q">${q.q}</div>
        <div id="quiz-opts">${q.opts.map((o, i) => `<button class="quiz-opt" data-o="${i}">${o}</button>`).join('')}</div>`);
      let answered = false;
      $$('#quiz-opts .quiz-opt').forEach((op) => op.onclick = () => {
        if (answered) return; answered = true;
        const o = +op.dataset.o;
        $$('#quiz-opts .quiz-opt').forEach((x) => x.classList.add(+x.dataset.o === q.right ? 'right' : (x === op ? 'wrong' : '')));
        if (o === q.right) correct++;
        setTimeout(() => {
          idx++;
          if (idx >= QS.length) {
            const score = Math.min(correct * b.scorePerUnit + 25, 125); // 1题=25分 + 基础分
            finishScore(b, score, '知识', `答对 ${correct}/${QS.length} 题`);
          } else render();
        }, 700);
      });
    }
    render();
  }

  // ---- 随身好事 / 故事 ----
  function storyFlow(b) {
    openSheet(`${headHtml(b)}
      <div class="field"><label>上传小红花挂件 OOTD / 助人故事</label>
        <div class="node-pic" id="story-up" style="height:140px;border:2px dashed var(--c-line);background:#fff;color:var(--c-sub);font-size:30px;cursor:pointer;">＋ 点击上传照片</div>
      </div>
      <div class="field"><label>写两句你的善举（选填）</label>
        <textarea id="story-txt" rows="2" style="width:100%;border:1.5px solid var(--c-line);border-radius:12px;padding:10px;font-family:inherit;font-size:14px;" placeholder="今天扶了一位老人过马路…"></textarea>
      </div>
      <div class="reward-tip">联动「随身好事·小红花同行」：审核通过得 ${b.reward}，并换算高额分数上龙</div>
      <button class="btn block" id="story-go" style="margin-top:6px;" disabled>上传后提交审核</button>`);
    let up = false;
    $('#story-up').onclick = () => {
      up = true; $('#story-up').style.cssText = 'height:140px;border-radius:12px;background:linear-gradient(135deg,#ffd6e7,#ff9ec4);color:#fff;font-size:40px;'; $('#story-up').textContent = '🌸';
      $('#story-go').disabled = false; $('#story-go').textContent = '提交审核并上龙';
    };
    $('#story-go').onclick = () => {
      if (!up) return;
      toast('🌸 已发放 1 元公益金 + 电子证书');
      runUGCScore(b, '善举', '随身好事打卡');
    };
  }

  // ---- UGC 评分（随机区间） ----
  function runUGCScore(b, tag, tagDesc) {
    openSheet(`${headHtml(b)}
      <div class="score-stage">
        <div style="font-size:54px;animation:spin 1.5s linear infinite;display:inline-block;">🤖</div>
        <div class="tierline" style="margin-top:10px;">AI 评分中…</div>
      </div>`);
    setTimeout(() => {
      const score = Math.round(b.min + Math.random() * (b.max - b.min));
      finishScore(b, score, tag, tagDesc);
    }, 1200);
  }

  // ---- 统一评分结算 → 展示分数 + 上龙 ----
  function finishScore(b, score, tag, tagDesc) {
    const meterRaw = score * (b.toMeter || 0.01);
    const bonus = D.bonusFactor(S.enabled);
    const meter = +(meterRaw * bonus).toFixed(2);
    const tier = tierOf(b, score);
    showScore(b, { rawScore: score, scoreLabel: score + ' 分', meter, tier, bonus, tag, tagDesc });
  }

  function showScore(b, r) {
    const tierCls = 'tier-' + r.tier;
    openSheet(`${headHtml(b)}
      <div class="score-stage">
        <div class="num" id="score-num">0<small>${r.donate ? '元' : '分'}</small></div>
        <div class="tierline ${tierCls}">${tierName[r.tier]}</div>
        <div class="gain">本次为龙贡献 <b id="gain-m">+${r.meter}</b> 米${r.bonus && r.bonus !== 1 ? ` <span class="muted">(×${r.bonus} 加成)</span>` : ''}</div>
      </div>
      <button class="btn block" id="confirm-up">🐲 确认上龙</button>`, false);
    // 数字滚动
    const target = r.rawScore; const el = $('#score-num'); let cur = 0;
    const step = Math.max(1, Math.round(target / 24));
    const unit = r.donate ? '元' : '分';
    const tk = setInterval(() => {
      cur += step; if (cur >= target) { cur = target; clearInterval(tk); }
      el.innerHTML = cur + `<small>${unit}</small>`;
    }, 28);
    $('#confirm-up').onclick = () => upToDragon(b, r);
  }

  // ---- 上龙：插入节点 + 增长 + 升级判定 + 盲盒 ----
  function upToDragon(b, r) {
    const prev = D.levelOf(S.meter).cur.lv;
    S.meter += r.meter; S.people += 1;
    const node = r.donate
      ? { type: 'donate', rank: 1, name: D.MY.nickname, time: '刚刚', money: r.money, project: D.DRAGON.project, meter: r.meter, tier: r.tier, likes: 0 }
      : { type: 'ugc', behavior: b.key, rank: 1, name: D.MY.nickname, time: '刚刚', tag: r.tag, tagDesc: r.tagDesc, meter: r.meter, tier: r.tier, likes: 0, score: r.rawScore };
    S.nodes.unshift(node);
    S.nodes.forEach((n, i) => n.rank = i + 1);
    S.balls += 1; S.boxes += 1;
    renderMeter(); renderBody();
    $('#people-txt').textContent = `已有 ${fmt(S.people)} 人次参与接龙互动`;
    confetti();
    const now = D.levelOf(S.meter).cur.lv;
    closeSheet();
    if (now > prev) {
      const L = D.levelOf(S.meter).cur;
      setTimeout(() => openSheet(`
        <div class="sheet-head"><h3>🐉 龙升级啦！</h3><button class="x" data-x>×</button></div>
        <div class="sheet-emoji">🐲</div>
        <div style="text-align:center;font-size:22px;font-weight:900;color:var(--c-red);">Lv.${L.lv} ${L.name}</div>
        <div class="muted" style="text-align:center;margin:6px 0 14px;">${L.luck} · 抽奖升级为 ${L.pool}</div>
        <button class="btn block" data-act="open-box">打开爱心盲盒 🎁</button>`, true), 400);
    } else {
      setTimeout(() => boxFlow(true), 400);
    }
  }

  // =================================================================
  //  爱心盲盒 + 龙珠抽奖
  // =================================================================
  function pickPrize() {
    const total = D.BLINDBOX.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    for (const p of D.BLINDBOX) { if ((r -= p.weight) <= 0) return p; }
    return D.BLINDBOX[0];
  }
  function boxFlow(earned) {
    const { cur } = D.levelOf(S.meter);
    openSheet(`
      <div class="sheet-head"><h3>🎁 爱心盲盒</h3><button class="x" data-x>×</button></div>
      <p class="desc">${earned ? '完成一次好事，获得 1 次盲盒机会！' : `你有 ${S.boxes} 次盲盒机会`}　当前 ${cur.pool}</p>
      <div class="box-stage">
        <div class="gift-box" id="gift">🎁</div>
        <div class="muted" id="box-hint" style="margin-top:10px;">点击盲盒开启</div>
      </div>
      <button class="btn block" id="box-open">开启盲盒（剩余 ${S.boxes} 次）</button>`, true);
    const open = () => {
      if (S.boxes <= 0) { toast('盲盒机会用完啦，去做好事获取～'); return; }
      const gift = $('#gift'); gift.classList.add('shake'); $('#box-hint').textContent = '开启中…';
      $('#box-open').disabled = true;
      setTimeout(() => {
        S.boxes -= 1;
        const p = pickPrize();
        const rareTxt = { n: '普通', r: '稀有', sr: '超稀有' }[p.rare];
        openSheet(`
          <div class="sheet-head"><h3>🎉 恭喜获得</h3><button class="x" data-x>×</button></div>
          <div class="prize-card">
            <div class="pic">${p.icon}</div>
            <div class="nm">${p.label}</div>
            <div class="rare rare-${p.rare}">${rareTxt}</div>
          </div>
          <div style="display:flex;gap:10px;margin-top:6px;">
            <button class="btn ghost sm" id="box-more">再开一次（${S.boxes}）</button>
            <button class="btn block" data-x>收下</button>
          </div>`, true);
        confetti();
        updateMeBox();
        $('#box-more').onclick = () => boxFlow(false);
      }, 900);
    };
    $('#gift').onclick = open; $('#box-open').onclick = open;
  }

  // =================================================================
  //  榜单
  // =================================================================
  function renderRank() {
    const c = D.LAST_WEEK_CHAMPION;
    $('#champ-banner').innerHTML = `<div class="cup">🏆</div>
      <div><div class="muted" style="color:#6a4a00;">上周冠军 · ${c.category}</div><b>${c.name}</b> · 热度 ${fmt(c.heat)}</div>`;
    const tabs = [
      { k: 'project_day', t: '本龙日榜' },
      { k: 'cat_助学', t: '助学' },
      { k: 'cat_疾病', t: '疾病' },
      { k: 'cat_扶贫', t: '扶贫' },
      { k: 'cat_环保及其他', t: '环保及其他' },
      { k: 'star', t: '明星榜 ⭐' },
    ];
    $('#rank-tabs').innerHTML = tabs.map((t) => `<button class="rank-tab ${S.rankTab === t.k ? 'on' : ''}" data-rk="${t.k}">${t.t}</button>`).join('');
    renderRankBody();
  }
  function renderRankBody() {
    const k = S.rankTab; let rows = '', tip = '';
    if (k === 'project_day') {
      rows = D.RANKS.project_day.map((r, i) => rankRow(i + 1, r.avatar, r.name, '本龙贡献', meterText(r.meter))).join('');
    } else if (k === 'star') {
      rows = D.RANKS.star.map((r, i) => rankRow(i + 1, r.avatar, r.name, r.fans + ' 应援', meterText(r.meter))).join('');
    } else {
      const cat = k.replace('cat_', '');
      rows = D.RANKS.category[cat].map((r) => rankRow(r.rank, '🔥', r.name, cat, '热度 ' + fmt(r.heat))).join('');
      tip = `<div class="reward-tip">📢 本周该子榜热度前 5 名，次周获 24h 腾讯公益首页流量推荐；前 2 名额外再 +24h。</div>`;
    }
    $('#rank-body').innerHTML = rows + tip;
  }
  function rankRow(no, av, name, sub, val) {
    const cls = no === 1 ? 'top1' : no === 2 ? 'top2' : no === 3 ? 'top3' : '';
    return `<div class="rank-item">
      <div class="rank-no ${cls}">${no}</div>
      <div class="av">${av}</div>
      <div class="mid"><div class="t">${name}</div><div class="s">${sub}</div></div>
      <div class="val">${val}</div>
    </div>`;
  }

  // =================================================================
  //  发起接龙
  // =================================================================
  function renderCreate() {
    $('#create-grid').innerHTML = D.BEHAVIORS.map((b) => {
      const on = S.createSel.includes(b.key);
      return `<div class="bhv ${on ? 'on' : ''}" data-csel="${b.key}">
        <div class="emoji">${b.icon}</div><div class="nm">${b.name}</div>
        ${on ? '<div class="king-tag">✓</div>' : ''}
      </div>`;
    }).join('');
    const nonFund = S.createSel.filter((k) => k !== 'fund' && k !== 'month').length;
    const f = D.bonusFactor(S.createSel);
    $('#bonus-tip').innerHTML = `已选 ${S.createSel.length} 类好事（其中非捐款 ${nonFund} 类）→ 龙长度加成 <b>×${f}</b><br><span class="muted">聚焦少数好事做深，单次贡献更高</span>`;
    const colors = ['#4cb4eb', '#d81800', '#f5b316', '#8e5cf2', '#2fae6b', '#ff7aa8'];
    $('#color-pick').innerHTML = colors.map((c) => `<div class="color-dot ${c === S.themeColor ? 'on' : ''}" data-color="${c}" style="background:${c}"></div>`).join('');
  }

  // =================================================================
  //  个人中心
  // =================================================================
  function renderMe() {
    $('#me-avatar').textContent = D.MY.avatar;
    $('#me-name').textContent = D.MY.nickname;
    $('#me-stats').innerHTML = `
      <div class="stat"><div class="v">${D.MY.created.length + D.MY.joined.length}</div><div class="l">参与的龙</div></div>
      <div class="stat"><div class="v">${S.balls}</div><div class="l">龙珠</div></div>
      <div class="stat"><div class="v">${S.boxes}</div><div class="l">盲盒</div></div>`;
    $('#me-badges').innerHTML =
      D.MY.titles.map((t) => `<span class="badge title">${t}</span>`).join('') +
      D.MY.flags.map((t) => `<span class="badge">🏵️ ${t}</span>`).join('');
    renderMeList();
    updateMeBox();
  }
  function renderMeList() {
    const list = S.meTab === 'created' ? D.MY.created : D.MY.joined;
    $('#me-list').innerHTML = list.map((it) => `
      <div class="list-item">
        <div class="ico">🐉</div>
        <div class="mid"><div class="t">${it.project}</div><div class="s">${it.time} · ${fmt(it.people)} 人次</div></div>
        <div class="val" style="color:var(--c-red);font-weight:800;">${meterText(it.meter)}</div>
      </div>`).join('');
  }
  function updateMeBox() { const e = $('#me-box-n'); if (e) e.textContent = S.boxes; }

  // =================================================================
  //  规则 / 分享 / 预览
  // =================================================================
  function showRule() {
    openSheet(`
      <div class="sheet-head"><h3>📜 接龙玩法规则</h3><button class="x" data-x>×</button></div>
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
      </div>`);
  }
  function shareFlow() {
    const { cur } = D.levelOf(S.meter);
    openSheet(`
      <div class="sheet-head"><h3>📤 分享接龙海报</h3><button class="x" data-x>×</button></div>
      <div style="background:linear-gradient(160deg,${S.themeColor},#fff);border-radius:16px;padding:20px;text-align:center;color:#fff;">
        <div style="font-size:46px;">🐉</div>
        <div style="font-weight:900;font-size:18px;margin:6px 0;text-shadow:0 1px 2px rgba(0,0,0,.2);">${D.DRAGON.title}</div>
        <div style="background:#fff;color:var(--c-red);display:inline-block;padding:4px 12px;border-radius:999px;font-weight:800;">Lv.${cur.lv} ${cur.name} · ${meterText(S.meter)}</div>
        <div style="margin-top:10px;font-size:13px;">已有 ${fmt(S.people)} 人次一起做好事</div>
        <div style="margin-top:14px;display:flex;justify-content:center;gap:8px;align-items:center;">
          <div style="width:64px;height:64px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:30px;">🔳</div>
          <div style="text-align:left;font-size:11px;">长按识别二维码<br/>和我一起接龙</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px;">
        <button class="btn ghost sm" data-x>取消</button>
        <button class="btn block" id="share-go">保存海报并分享</button>
      </div>`);
    $('#share-go').onclick = () => { closeSheet(); toast('🎉 海报已生成，快去分享给好友吧'); };
  }
  function previewHotPic(name) {
    const h = D.HOTPICS.find((x) => x.name === name) || D.HOTPICS[0];
    openSheet(`
      <div class="sheet-head"><h3>${h.name} 的作品</h3><button class="x" data-x>×</button></div>
      <div class="node-pic" style="height:200px;border-radius:14px;background:linear-gradient(135deg,hsl(${h.hue},70%,70%),hsl(${h.hue},60%,52%));font-size:64px;">🎨</div>
      <div style="text-align:center;margin:10px 0;font-weight:700;">${h.tag}</div>
      <div style="display:flex;gap:10px;">
        <button class="btn ghost sm" id="hp-like">❤️ 点赞 ${h.likes}</button>
        <button class="btn block" data-act="share">为 TA 接一棒</button>
      </div>`);
    $('#hp-like').onclick = () => { h.likes++; $('#hp-like').textContent = `❤️ 点赞 ${h.likes}`; renderHotWall(); };
  }

  // =================================================================
  //  事件绑定
  // =================================================================
  function switchTab(name) {
    $$('.view').forEach((v) => v.classList.remove('active'));
    $('#view-' + name).classList.add('active');
    $$('.tabbar .tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === name));
    if (name === 'rank') renderRank();
    if (name === 'create') renderCreate();
    if (name === 'me') renderMe();
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    // 关闭弹层
    if (t.closest('[data-x]')) { closeSheet(); return; }
    // Tab
    const tab = t.closest('.tabbar .tab'); if (tab) { switchTab(tab.dataset.tab); return; }
    // 行为入口
    const bhv = t.closest('[data-bhv]'); if (bhv) { startBehavior(bhv.dataset.bhv); return; }
    // 发起：选择行为
    const csel = t.closest('[data-csel]');
    if (csel) {
      const k = csel.dataset.csel;
      if (k === 'fund') { toast('捐款为默认基础行为，建议保留'); }
      const i = S.createSel.indexOf(k);
      if (i >= 0) { if (S.createSel.length > 1) S.createSel.splice(i, 1); }
      else { if (S.createSel.length >= 5) { toast('最多选 5 类好事'); return; } S.createSel.push(k); }
      renderCreate(); return;
    }
    // 发起：颜色
    const col = t.closest('[data-color]'); if (col) { S.themeColor = col.dataset.color; renderCreate(); return; }
    // 榜单 tab
    const rk = t.closest('[data-rk]'); if (rk) { S.rankTab = rk.dataset.rk; renderRank(); return; }
    // 个人 subtab
    const mt = t.closest('[data-mtab]'); if (mt) { S.meTab = mt.dataset.mtab; $$('#me-subtab button').forEach((b) => b.classList.toggle('on', b === mt)); renderMeList(); return; }
    // 热画
    const hp = t.closest('[data-hotpic]'); if (hp) { previewHotPic(hp.dataset.hotpic); return; }
    // 节点点赞
    const lk = t.closest('[data-like]');
    if (lk) { const n = S.nodes[+lk.dataset.like]; n.likes++; lk.querySelector('.n').textContent = n.likes; return; }
    // 各类 act
    const act = t.closest('[data-act]'); if (!act) return;
    switch (act.dataset.act) {
      case 'share': shareFlow(); break;
      case 'rule': showRule(); break;
      case 'join-quick': {
        // 弹出可参与行为菜单
        openSheet(`<div class="sheet-head"><h3>🐲 选一种好事接龙</h3><button class="x" data-x>×</button></div>
          <div class="behavior-grid">${D.BEHAVIORS.filter((b) => S.enabled.includes(b.key)).map((b) => `<div class="bhv" data-bhv="${b.key}"><div class="emoji">${b.icon}</div><div class="nm">${b.name}</div></div>`).join('')}</div>`);
        break;
      }
      case 'do-create': {
        closeSheet();
        toast('🎉 接龙创建成功！正在生成分享海报…');
        setTimeout(shareFlow, 800);
        break;
      }
      case 'open-box': boxFlow(false); break;
    }
  });

  // =================================================================
  //  视觉参考画廊（嵌入原始设计稿）
  // =================================================================
  const REF_BOARDS = [
    { key: 'jiaohu', name: '交互终稿', files: ['jiaohu_0.jpg', 'jiaohu_1.jpg'], hint: '接龙-视觉方案：发起 → 主接龙页 → 挑战浮层 → UGC 评分上龙 → 排行榜（含 1–4 级龙）' },
    { key: 'shijue', name: '视觉方案 8.30', files: ['shijue_0.jpg', 'shijue_1.jpg'], hint: '接龙2.0 视觉方案：打榜与接龙合并、龙色自由选、剪纸/纸袋材质、个人中心、多榜单' },
    { key: 'flow', name: '10种互动流程', files: ['flow_0.jpg'], hint: '10 种做好事互动的完整流程图' },
    { key: 'star', name: '明星接龙', files: ['star_0.jpg', 'star_1.jpg', 'star_2.jpg', 'star_3.jpg', 'star_4.jpg', 'star_5.jpg'], hint: '明星应援接龙（3–4 级龙）龙身展示参考' },
  ];
  let refCur = 'jiaohu';
  function renderRefGallery() {
    $('#ref-tabs').innerHTML = REF_BOARDS.map((b) => `<button class="rt ${b.key === refCur ? 'on' : ''}" data-rt="${b.key}">${b.name}</button>`).join('');
    const b = REF_BOARDS.find((x) => x.key === refCur);
    $('#ref-scroll').innerHTML =
      b.files.map((f) => `<img loading="lazy" src="assets/ref/${f}" alt="${b.name}" />`).join('') +
      `<div class="ref-hint">${b.hint}</div>`;
    $('#ref-scroll').scrollTop = 0;
  }
  function openRef() { renderRefGallery(); $('#ref-gallery').classList.add('show'); }
  function closeRef() { $('#ref-gallery').classList.remove('show'); }
  $('#ref-fab').onclick = openRef;
  $('#ref-close').onclick = closeRef;
  $('#ref-tabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-rt]'); if (!t) return;
    refCur = t.dataset.rt; renderRefGallery();
  });

  // 初始化：先替换静态占位符，再渲染动态内容
  $('#view-home').innerHTML = $('#view-home').innerHTML.replace('{{head}}', D.DRAGON.project);
  renderHome();

  // 提示
  setTimeout(() => toast('点击任意「好事」即可参与接龙 🐉'), 600);
})();
