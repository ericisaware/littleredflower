import{r as t,j as e}from"./global-CMhyKqyP.js";const i=`
<div class="status-bar">
    <img class="time-icon" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/time.svg" alt="time">
    <div class="right-icons">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/signal.svg" alt="signal">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/wifi.svg" alt="wifi">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/battery.svg" alt="battery">
    </div>
  </div>

  
  <nav class="nav-bar">
    <div class="nav-left">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/back.svg" alt="返回">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/home.svg" alt="主页">
    </div>
    <div class="nav-capsule">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-close.svg" alt="关闭">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-divider.svg" alt="">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-more.svg" alt="更多">
    </div>
  </nav>

  
  <div class="header-bg">
    <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/hero/header-bg-v2.png?v=2026-04-20b" alt="bg">
  </div>
  <div class="deco-left"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/decoration/deco-left-outer.svg" alt=""></div>
  <div class="deco-right"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/decoration/deco-right-outer.svg" alt=""></div>

  
  <div class="hero-section">
    <div class="hero-title">一对一帮助</div>
  </div>

  
  <a href="my-oto.html" style="text-decoration:none;">
  <div class="stats-bar">
    <div class="stats-bar__left">
      <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/hero/stats-flower.svg" alt="花">
      <span class="stats-bar__text">我已帮助 8 次，累计捐赠 88,000 元</span>
    </div>
    <img class="stats-bar__arrow" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/hero/stats-arrow.svg" alt="→">
  </div>
  </a>

  
  <div class="content-area">

    
    <div class="feature-cards">
      
      <div class="feature-card card-project" onclick="location.href='project-list.html'" style="cursor:pointer;">
        <div class="feature-card__content">
          <div class="feature-card__title">
            <span>一对一项目</span>
            <img class="feature-card__title-arrow" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/feature-card/arrow-project.svg" alt=">">
          </div>
          <div class="feature-card__desc">定向帮助，<br>让爱心落在实处</div>
        </div>
        <div class="feature-card__images">
          <img class="img-back" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/feature-card/photo-stack-back.png" alt="">
          <img class="img-front" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/feature-card/photo-stack-front.png" alt="">
        </div>
        <img class="feature-card__flower" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/feature-card/flower-deco.svg" alt="">
      </div>

      
      <div class="feature-card card-hometown" id="hometownCard" onclick="handleHometownClick()" style="cursor:pointer;">
        <div class="feature-card__content">
          <div class="feature-card__title">
            <span id="hometownTitle">找找家乡的一对一</span>
            <img class="feature-card__title-arrow" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/feature-card/arrow-hometown.svg" alt=">">
          </div>
          <div class="feature-card__desc" id="hometownDesc">覆盖19个省，<br>其中有你的家乡吗？</div>
        </div>
      </div>
    </div>

    
    <div class="filter-bar">
      <div class="filter-item filter-item--active" onclick="openFilterSheet()" style="cursor:pointer;">
        <span class="filter-item__text" id="filterProvText">甘肃</span>
        <img class="filter-item__arrow" id="filterProvArrow" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-active.svg" alt="▼">
      </div>
      <div class="filter-item" onclick="openTypeSheet()" style="cursor:pointer;">
        <span class="filter-item__text" id="filterTypeText">捐物</span>
        <img class="filter-item__arrow" id="filterTypeArrow" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default.svg" alt="▼">
      </div>
      <div class="filter-item" onclick="openAmountSheet()" style="cursor:pointer;">
        <span class="filter-item__text" id="filterAmountText">金额</span>
        <img class="filter-item__arrow" id="filterAmountArrow" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default-2.svg" alt="▼">
      </div>
    </div>

    
    <div id="cardsContainer">

      
      <div class="student-card" onclick="goDetail(event,'donate-detail-before.html')" style="cursor:pointer;">
        <div class="card-cert-header">
          <div class="card-cert-header__badge">
            <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/cert-shield.svg" alt="✓">
            <span>受助人实名认证，数字化善款拨付</span>
          </div>
        </div>
        <div class="card-body">
          <div class="student-info">
            <div class="student-info__left">
              <img class="student-avatar" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/avatar-liu.svg" alt="">
              <span class="student-name">刘同学</span>
              <span class="student-detail"><span class="sep">｜</span>15岁女孩 · 高二</span>
            </div>
            <div class="waiting-info">
              <span>已等待30+天</span>
              <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/clock-1.svg" alt="">
            </div>
          </div>
          <div class="tags-row">
            <span class="tag tag--gray">甘肃省武威市巫溪县</span>
            <span class="tag tag--gray">阳光第一中学</span>
            <span class="tag tag--hometown">来自家乡</span>
          </div>
          <div class="tags-row">
            <span class="tag tag--blue">善款执行率98%</span>
            <span class="tag tag--blue">筹满到执行天数 15 天</span>
          </div>
          <div class="story-text">家庭情况：我是单亲家庭，父亲十五年前工厂打工发生意外去世，当时母亲还怀着妹妹，厂房赔偿20万...</div>
          <div class="image-gallery">
            <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/photos/story-photo-1.png" alt="">
            <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/photos/story-photo-2.png" alt="">
            <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/photos/story-photo-3.png" alt="">
          </div>
          <div class="card-divider"></div>
          <div class="card-footer">
            <div>
              <div class="fund-amount">1,888元捐助一学期助学金</div>
              <div class="fund-org">由「深圳壹基金公益基金会」接收善款</div>
            </div>
            <button class="btn-help" onclick="event.stopPropagation();openPaySheet()">我要帮助</button>
          </div>
        </div>
      </div>

      
      <div class="student-card" onclick="goDetail(event,'donate-detail-no-progress.html')" style="cursor:pointer;">
        <div class="card-cert-header">
          <div class="card-cert-header__badge">
            <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/cert-shield.svg" alt="✓">
            <span>受助人实名认证，数字化善款拨付</span>
          </div>
        </div>
        <div class="card-body">
          <div class="student-info">
            <div class="student-info__left">
              <img class="student-avatar" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/avatar-li.svg" alt="">
              <span class="student-name">李同学</span>
              <span class="student-detail"><span class="sep">｜</span>12岁男孩 · 六年级</span>
            </div>
            <div class="waiting-info">
              <span>已等待30+天</span>
              <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/clock-2.svg" alt="">
            </div>
          </div>
          <div class="tags-row">
            <span class="tag tag--gray">甘肃省武威市巫溪县</span>
            <span class="tag tag--gray">阳光第一小学</span>
          </div>
          <div class="tags-row">
            <span class="tag tag--blue">善款执行率98%</span>
            <span class="tag tag--blue">筹满到执行天数 15 天</span>
          </div>
          <div class="story-text">家庭情况：我是单亲家庭，父亲十五年前工厂打工发生意外去世，当时母亲还怀着妹妹，厂房赔偿20万...</div>
          <div class="card-divider"></div>
          <div class="card-footer">
            <div>
              <div class="fund-amount">1,888元捐助一学期助学金</div>
              <div class="fund-org">由「深圳壹基金公益基金会」接收善款</div>
            </div>
            <button class="btn-help" onclick="event.stopPropagation();openPaySheet()">我要帮助</button>
          </div>
        </div>
      </div>

      
      <div class="student-card student-card--simple" onclick="goDetail(event,'donate-detail-with-progress.html')" style="cursor:pointer;">
        <div class="card-body">
          <div class="student-info">
            <div class="student-info__left">
              <img class="student-avatar" src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/avatar-project.svg" alt="">
              <span class="student-name">上义中学净水器</span>
            </div>
            <div class="waiting-info">
              <span>已等待30+天</span>
              <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/student-card/clock-3.svg" alt="">
            </div>
          </div>
          <div class="tags-row">
            <span class="tag tag--gray">广东省河源市紫金县</span>
            <span class="tag tag--gray">紫金八刀小学</span>
          </div>
          <div class="story-text">善款用于支持为乡村学校安装净水设备，配置三年滤芯物料及设备维护服务，确保饮用水质达标适喝喝...</div>
          <div class="card-divider"></div>
          <div class="card-footer">
            <div>
              <div class="fund-amount">13,800元捐助一台净水器</div>
              <div class="fund-org">由「深圳壹基金公益基金会」接收善款</div>
            </div>
            <button class="btn-help" onclick="event.stopPropagation();openPaySheet()">我要帮助</button>
          </div>
        </div>
      </div>

    </div>

    
    <div class="load-more" id="loadMoreBtn" onclick="loadMoreCards()">
      <span>下拉加载更多受助对象</span>
    </div>

    
    <div class="page-footer" id="pageFooter" style="display:none;">
      <div class="footer-divider">
        <div class="footer-line footer-line--left"></div>
        <span>没有更多了</span>
        <div class="footer-line footer-line--right"></div>
      </div>
      <div class="footer-logo">
        <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/footer/logo-icon.svg" alt="">
        <div class="footer-logo__text">
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/footer/logo-char-teng.svg" alt="腾">
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/footer/logo-char-xun.svg" alt="讯">
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/footer/logo-char-gong.svg" alt="公">
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/footer/logo-char-yi.svg" alt="益">
        </div>
      </div>
    </div>

  </div>

  
  <div id="hometownModal" class="hometown-overlay" onclick="if(event.target===this)closeHometown()">
    <div class="hometown-sheet">
      
      <div class="hometown-header">
        <span class="hometown-header__title">标记我的家乡</span>
        <span class="hometown-header__close" onclick="closeHometown()">✕</span>
      </div>

      
      <div class="hometown-tabs">
        <div class="hometown-tab hometown-tab--active" data-level="province">省份</div>
        <div class="hometown-tab" data-level="city">城市</div>
        <div class="hometown-tab" data-level="district">区县</div>
      </div>

      
      <div class="hometown-list" id="hometownList"></div>

      
      <div class="hometown-footer">
        <button class="hometown-btn hometown-btn--disabled" id="hometownConfirmBtn" onclick="confirmHometown()">确定</button>
      </div>
    </div>
  </div>

  
  <div class="filter-overlay" id="filterOverlay" onclick="if(event.target===this)closeFilterSheet()">
    <div class="filter-sheet">
      <div class="filter-sheet__nav">
        <div class="filter-sheet__status"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/time.svg" alt=""><div class="r"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/signal.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/wifi.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/battery.svg" alt=""></div></div>
        <div class="filter-sheet__navbar"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/back.svg" alt="" onclick="closeFilterSheet()"><span class="filter-sheet__navbar-title">腾讯公益</span><div class="nav-capsule"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-close.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-divider.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-more.svg" alt=""></div></div>
      </div>
      
      <div class="filter-sheet__bar">
        <div class="filter-sheet__bar-item filter-sheet__bar-item--active">
          <span>地区</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-active.svg" alt="▼">
        </div>
        <div class="filter-sheet__bar-item" onclick="closeFilterSheet();openTypeSheet()" style="cursor:pointer;">
          <span id="provBarType">捐物</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default.svg" alt="▼">
        </div>
        <div class="filter-sheet__bar-item" onclick="closeFilterSheet();openAmountSheet()" style="cursor:pointer;">
          <span id="provBarAmount">金额</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default-2.svg" alt="▼">
        </div>
      </div>
      
      <div class="filter-sheet__title">选择所在地</div>
      
      <div class="filter-sheet__tags" id="filterTags"></div>
      
      <div class="filter-sheet__actions">
        <button class="filter-sheet__btn filter-sheet__btn--reset" onclick="resetFilter()">重置</button>
        <button class="filter-sheet__btn filter-sheet__btn--confirm" onclick="confirmFilter()">查看</button>
      </div>
    </div>
  </div>

  
  <div class="filter-overlay" id="typeOverlay" onclick="if(event.target===this)closeTypeSheet()">
    <div class="filter-sheet">
      <div class="filter-sheet__nav">
        <div class="filter-sheet__status"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/time.svg" alt=""><div class="r"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/signal.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/wifi.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/battery.svg" alt=""></div></div>
        <div class="filter-sheet__navbar"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/back.svg" alt="" onclick="closeTypeSheet()"><span class="filter-sheet__navbar-title">腾讯公益</span><div class="nav-capsule"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-close.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-divider.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-more.svg" alt=""></div></div>
      </div>
      <div class="filter-sheet__bar">
        <div class="filter-sheet__bar-item" onclick="closeTypeSheet();openFilterSheet()" style="cursor:pointer;">
          <span id="typeBarProv">甘肃</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default.svg" alt="▼">
        </div>
        <div class="filter-sheet__bar-item filter-sheet__bar-item--active">
          <span id="typeBarLabel">捐物</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-active.svg" alt="▼">
        </div>
        <div class="filter-sheet__bar-item" onclick="closeTypeSheet();openAmountSheet()" style="cursor:pointer;">
          <span>金额</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default-2.svg" alt="▼">
        </div>
      </div>
      
      <div class="filter-sheet__title">类型</div>
      <div class="filter-sheet__tags" id="typeTags"></div>
      
      <div id="genderSection" style="display:none;">
        <div class="filter-sheet__title">性别</div>
        <div class="filter-sheet__tags" id="genderTags"></div>
      </div>
      
      <div id="ageSection" style="display:none;">
        <div class="filter-sheet__title">年龄</div>
        <div class="filter-sheet__tags" id="ageTags"></div>
      </div>
      <div class="filter-sheet__actions">
        <button class="filter-sheet__btn filter-sheet__btn--reset" onclick="resetType()">重置</button>
        <button class="filter-sheet__btn filter-sheet__btn--confirm" onclick="confirmType()">查看</button>
      </div>
    </div>
  </div>

  
  <div class="filter-overlay" id="amountOverlay" onclick="if(event.target===this)closeAmountSheet()">
    <div class="filter-sheet">
      <div class="filter-sheet__nav">
        <div class="filter-sheet__status"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/time.svg" alt=""><div class="r"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/signal.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/wifi.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/status-bar/battery.svg" alt=""></div></div>
        <div class="filter-sheet__navbar"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/back.svg" alt="" onclick="closeAmountSheet()"><span class="filter-sheet__navbar-title">腾讯公益</span><div class="nav-capsule"><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-close.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-divider.svg" alt=""><img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/navbar/capsule-more.svg" alt=""></div></div>
      </div>
      <div class="filter-sheet__bar">
        <div class="filter-sheet__bar-item" onclick="closeAmountSheet();openFilterSheet()" style="cursor:pointer;">
          <span id="amountBarProv">甘肃</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default.svg" alt="▼">
        </div>
        <div class="filter-sheet__bar-item" onclick="closeAmountSheet();openTypeSheet()" style="cursor:pointer;">
          <span id="amountBarType">捐物</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-default.svg" alt="▼">
        </div>
        <div class="filter-sheet__bar-item filter-sheet__bar-item--active">
          <span>金额</span>
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/filter/dropdown-active.svg" alt="▼">
        </div>
      </div>
      <div class="filter-sheet__title">金额范围</div>
      <div class="filter-sheet__tags" id="amountTags"></div>
      <div class="filter-sheet__actions">
        <button class="filter-sheet__btn filter-sheet__btn--reset" onclick="resetAmount()">重置</button>
        <button class="filter-sheet__btn filter-sheet__btn--confirm" onclick="confirmAmount()">查看</button>
      </div>
    </div>
  </div>

  
  <div class="pay-overlay" id="payOverlay" onclick="if(event.target===this)closePaySheet()">
    <div class="pay-sheet">
      <div class="pay-body">
        <div class="pay-header">
          <span class="pay-header__close" onclick="closePaySheet()">
            <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/pay-sheet/close.svg" alt="关闭">
          </span>
          <div class="pay-header__title">
            为重庆市巫溪县阳光小学 欧阳**同学<br>捐出<span class="red"> 1,250.00 元</span>，帮助我继续上半年学
          </div>
        </div>
        <div class="pay-fund-highlight">
          <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/pay-sheet/fund-icon.svg" alt="">
          <span>受助人可收到 1,200 元助学金</span>
        </div>
        <div class="pay-fund-detail">
          以下为使用说明：<br>
          <b>（1,200元）</b>用于资助困境孩子高中阶段年的学习、生活补助；<br>
          <b>（600元）</b>用于面向困境孩子开展成长陪伴服务，包括心理辅导课堂、减压课堂等，包含入户走访、校园关怀、成长档案、心理跟踪服务；<br>
          <b>（180元）</b>用于项目管理、项目运营和实施的必要成本。
        </div>
        <div class="pay-options">
          <div class="pay-option" onclick="togglePayOption(this)">
            <div class="pay-option__circle checked"></div>
            <span class="pay-option__text">第一时间获取进展</span>
          </div>
          <div class="pay-option" onclick="togglePayOption(this)">
            <div class="pay-option__circle"></div>
            <span class="pay-option__text">匿名捐助</span>
            <span class="pay-option__help">
              <img src="https://ssv-design.ssv.tencent.com/oto/v3.3/icons/pay-sheet/help-icon.svg" alt="?">
            </span>
          </div>
        </div>
      </div>
      <div class="pay-footer">
        <button type="button" class="pay-footer__btn" onclick="event.preventDefault();event.stopPropagation();confirmPay(event);return false;">确认支付 1,800 元</button>
      </div>
    </div>
  </div>

  
  <div class="toast" id="toast"><span class="toast__icon"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6.2l2.5 2.5L10 3.2" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span id="toastText">支付成功</span></div>
`;function o(){const s=t.useRef(null);return e.jsx("div",{ref:s,className:"legacy-page legacy-page--oto-home",dangerouslySetInnerHTML:{__html:i}})}export{o as default};
