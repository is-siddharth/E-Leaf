
(function(){
  // ---- tiny defensive helpers: optional elements can be absent on some screens ----
  function $(id){ return document.getElementById(id); }
  function on(id, evt, handler){
    const el = $(id);
    if(!el){ return; }
    el.addEventListener(evt, function(e){
      try{ handler(e, el); }catch(err){ console.error('E-Leaf handler error on #' + id, err); }
    });
  }

  const screens = {
    home: $('screen-home'),
    welcome: $('screen-welcome'),
    leaf: $('screen-dashboard-leaf'),
    becomeTree: $('screen-become-tree'),
    tree: $('screen-dashboard-tree'),
    classes: $('screen-classes'),
    students: $('screen-students'),
    planLesson: $('screen-plan-lesson'),
    liveClass: $('screen-live-class'),
    notesFull: $('screen-notes-full'),
    trees: $('screen-trees'),
    chat: $('screen-chat'),
    questions: $('screen-questions'),
    leaderboard: $('screen-leaderboard'),
    progress: $('screen-progress'),
    discussion: $('screen-discussion')
  };
  const pageHierarchy = {
    notesFull: {
      leaf: ['YOUR NOTES', 'Notes.', 'Keep useful ideas close, whether you planted them or saved them.'],
      tree: ['YOUR NOTES', 'Notes.', 'Review what you have planted, saved, and learned from other Trees.']
    },
    classes: {
      leaf: ['YOUR LEARNING SPACE', 'Classes.', 'Learn from Trees, attend what matters, and keep your learning moving.'],
      tree: ['YOUR TEACHING SPACE', 'Classes.', 'Learn from other Trees, or step in and teach when you are ready.']
    },
    trees: {
      leaf: ['YOUR LEARNING COMMUNITY', 'Meet the Trees.', 'Find people whose experience can help you move forward.']
    },
    students: {
      tree: ['YOUR TEACHING COMMUNITY', 'Your students.', 'See who is learning from what you teach and where they may need help.']
    },
    questions: {
      leaf: ['LEARNING COMMUNITY', 'Questions from Trees.', 'Help where your knowledge can move another learner forward.'],
      tree: ['YOUR QUESTIONS', 'Questions you posted.', 'See what Leaves have answered and where your questions still need help.']
    },
    leaderboard: {
      leaf: ['QUIET RECOGNITION', 'Recognition.', 'A record of useful contributions, without points, positions, or a race.'],
      tree: ['QUIET RECOGNITION', 'Recognition.', 'Notice the people helping others learn, without turning help into a competition.']
    },
    chat: {
      leaf: ['ASK A TREE', 'Ask a doubt.', 'Talk through a question with someone who has experience in the subject.']
    },
    liveClass: {
      leaf: ['LIVE CLASS', 'Class in progress.', 'Stay present, learn together, and make the most of the session.'],
      tree: ['LIVE CLASS', 'Class in progress.', 'Teach clearly, stay present, and help the room move together.']
    },
    becomeTree: {
      leaf: ['YOUR NEXT STEP', 'Become a Tree.', 'Learn, share, and help. When all three are complete, you can teach.']
    }
  };

  function syncPageHierarchy(screenName){
    const screen = screens[screenName];
    if(!screen) return;
    const config = pageHierarchy[screenName]?.[currentRole] || pageHierarchy[screenName]?.leaf;
    if(!config) return;
    const main = screen.querySelector('.dash-main');
    if(!main) return;
    let hero = main.querySelector('.section-page-hero');
    if(!hero){
      hero = document.createElement('div');
      hero.className = 'personal-hero section-page-hero';
      main.insertBefore(hero, main.firstElementChild);
    }
    hero.innerHTML = `<div class="eyebrow">${escapeHtml(config[0])}</div><h1>${escapeHtml(config[1])}</h1><p>${escapeHtml(config[2])}</p>`;
    const listHead = main.querySelector('.list-head');
    if(listHead){
      const h1 = listHead.querySelector('h1');
      if(h1) h1.style.display = 'none';
    }
    if(screenName==='notesFull'){
      const notesTitle = main.querySelector('.notes-toolbar h1');
      if(notesTitle) notesTitle.style.display = 'none';
    }
  }

  function showScreen(name){
    Object.keys(screens).forEach(k => { if(screens[k]) screens[k].classList.remove('active'); });
    if(screens[name]) screens[name].classList.add('active');
    const appScreens=['leaf','tree','classes','students','planLesson','notesFull','trees','chat','questions','leaderboard','progress','discussion','liveClass','becomeTree'];
    applyIdentityUI();
    if(appScreens.includes(name)) closePanel();
    // Keep role styling consistent across every Leaf/Tree section, including new screens.
    Object.values(screens).forEach(el => { if(el) el.classList.remove('role-tree'); });
    if(screens[name]) screens[name].classList.toggle('role-tree', currentRole === 'tree' && !['becomeTree','progress','discussion'].includes(name));
    syncDesktopSidebars(name);
    syncTopNavbars();
    syncPageHierarchy(name);
    updateGlobalModeSwitch(name);
    syncRoleLogo(name);
    syncQuickNotesAssistant(name);
    window.scrollTo(0,0);
    if(name === 'leaf'){ renderNotes(); renderLeafPreviews(); renderPersonalHome(); }
    if(name === 'tree'){ renderTreeHome(); }
    if(name === 'classes') renderClasses();
    if(name === 'students') renderStudents();
    if(name === 'planLesson') renderPlanLesson();
    if(name === 'notesFull') renderNotesFull();
    if(name === 'trees') renderTreesDirectory();
    if(name === 'chat') renderChatMessages();
    if(name === 'questions') renderQuestions();
    if(name === 'leaderboard') renderLeaderboard();
    if(name === 'progress') renderProgressTracker();
    if(name === 'discussion') renderDiscussionPage();
    updateMobileNav(name);
    if(name === 'leaf' || name === 'becomeTree') renderGrowthState();
    if(name === 'home') updateHomePath();
  }
  window.showScreen = showScreen;


  // Keep the top application bar structurally identical on every dashboard screen.
  // The bar owns its identity controls; page-specific body rendering cannot remove them.
  function syncTopNavbars(){
    const appScreens=['leaf','tree','classes','students','planLesson','notesFull','trees','chat','questions','leaderboard','progress','discussion','liveClass','becomeTree'];
    appScreens.forEach(name=>{
      const nav=screens[name]?.querySelector('.dash-nav');
      if(!nav) return;

      let logo=nav.querySelector('.dash-logo');
      if(!logo){
        logo=document.createElement('div'); logo.className='dash-logo';
        logo.innerHTML='<svg><use href="#ic-leaf" xlink:href="#ic-leaf"></use></svg><span>E-Leaf</span>';
        nav.prepend(logo);
      }

      // Every dashboard screen gets the same role/path marker. This is
      // application chrome, not page content, so Discussion/Progress/etc.
      // cannot accidentally lose it.
      let pill=nav.querySelector('.path-pill');
      if(!pill){
        pill=document.createElement('div');
        pill.className='path-pill persistent-path-pill';
        nav.insertBefore(pill, nav.querySelector('.nav-right') || null);
      }
      // Home is the only Leaf screen that carries the growth path.
      // Once a Leaf has become eligible to teach, all other section screens
      // use their page title here instead of showing a stale/incomplete path.
      const sectionTitles = {
        classes:'CLASSES',
        students:'STUDENTS',
        planLesson:'PLAN LESSON',
        notesFull:'NOTES',
        trees:'TREES',
        chat:'ASK A DOUBT',
        questions:'QUESTIONS',
        leaderboard:'RECOGNITION',
        progress:'PROGRESS',
        discussion:'DISCUSSION',
        liveClass:'LIVE CLASS',
        becomeTree:'BECOME A TREE'
      };

      if(currentRole==='tree' && name==='tree'){
        pill.classList.remove('growth-path-pill');
        pill.innerHTML='GROWN INTO A TREE';
        pill.style.background='var(--bark-pale)';
        pill.style.color='var(--bark-deep)';
      }else if(currentRole==='tree'){
        pill.classList.remove('growth-path-pill');
        pill.innerHTML=sectionTitles[name] || 'E-LEAF';
        pill.style.background='var(--bark-pale)';
        pill.style.color='var(--bark-deep)';
      }else if(name==='leaf'){
        pill.classList.add('growth-path-pill');
        pill.innerHTML='PATH TO TREE<div class="path-track"><div class="growth-path-fill"></div></div><span class="growth-path-count">0/3</span>';
        pill.style.background='var(--cream-2)';
        pill.style.color='var(--ink-soft)';
      }else{
        pill.classList.remove('growth-path-pill');
        pill.innerHTML=sectionTitles[name] || 'E-LEAF';
        pill.style.background='var(--cream-2)';
        pill.style.color='var(--ink-soft)';
      }

      let right=nav.querySelector('.nav-right');
      if(!right){
        right=document.createElement('div');
        right.className='nav-right';
        nav.appendChild(right);
      }
      if(!right.querySelector('.logout-btn')){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='logout-btn';
        btn.title='Log out';
        btn.setAttribute('aria-label','Log out');
        btn.innerHTML='<svg><use href="#ic-logout" xlink:href="#ic-logout"></use></svg>';
        right.appendChild(btn);
      }
    });
    // Keep Leaf growth progress in every persistent PATH TO TREE pill.
    renderGrowthState();
  }

  // Keep each role's desktop navigation stable on every section screen.
  // Navigating changes only the main page; the sidebar itself does not change shape.
  function syncDesktopSidebars(screenName){
    const dashboardScreens=['leaf','tree','classes','students','planLesson','notesFull','trees','chat','questions','leaderboard','progress','discussion','liveClass','becomeTree'];
    if(!dashboardScreens.includes(screenName)) return;
    const screen=screens[screenName];
    const side=screen?.querySelector('.dash-side');
    if(!side) return;

    const navItem=(target,icon,label,active=false,extra='') =>
      `<button type="button" class="side-link${active?' active':''}${extra?' '+extra:''}" data-role-nav="${target}"><svg><use href="#${icon}" xlink:href="#${icon}"/></svg>${label}</button>`;
    const actionItem=(action,icon,label,extra='') =>
      `<button type="button" class="side-link${extra?' '+extra:''}" data-role-action="${action}"><svg><use href="#${icon}" xlink:href="#${icon}"/></svg>${label}</button>`;

    if(currentRole==='tree'){
      // Matches the Tree Home sidebar exactly; no Leaf-only Trees/Growth links are injected.
      side.innerHTML =
        navItem('tree','ic-home','Home',screenName==='tree')+
        actionItem('leafMode','ic-leaf','Leaf Dashboard',`leaf-dashboard-link${screenName==='tree'?' active':''}`)+
        navItem('notesFull','ic-note','Notes',screenName==='notesFull')+
        navItem('classes','ic-class','Classes',screenName==='classes')+
        actionItem('takeClass','ic-chalk','Take Class')+
        actionItem('uploadNotes','ic-upload','Upload Notes')+
        navItem('planLesson','ic-cal','Plan Lesson',screenName==='planLesson')+
        navItem('students','ic-students','Students',screenName==='students')+
        actionItem('postQuestion','ic-sparkle','Post a Question')+
        navItem('questions','ic-sparkle','Questions',screenName==='questions')+
        navItem('leaderboard','ic-students','Recognition',screenName==='leaderboard')+
        '<div class="side-quote">“A tree gives shade it will never sit in.”</div>';
    }else{
      // Matches the Leaf Home sidebar exactly.
      side.innerHTML =
        navItem('leaf','ic-home','Home',screenName==='leaf')+
        (canTeach
          ? actionItem('treeMode','ic-tree','Tree Dashboard',`tree-dashboard-link${screenName==='leaf'?' active':''}`)
          : '')+
        navItem('notesFull','ic-note','Notes',screenName==='notesFull')+
        navItem('classes','ic-class','Classes',screenName==='classes')+
        navItem('trees','ic-tree','Trees',screenName==='trees')+
        navItem('questions','ic-sparkle','Questions',screenName==='questions')+
        navItem('discussion','ic-students','Discussion',screenName==='discussion')+
        navItem('progress','ic-chalk','Progress',screenName==='progress')+
        navItem('leaderboard','ic-students','Recognition',screenName==='leaderboard')+
        (canTeach
          ? ''
          : navItem('becomeTree','ic-sparkle','Become a Tree',screenName==='becomeTree','highlight'));
    }
  }

  document.addEventListener('click',(e)=>{
    const logout=e.target.closest('.logout-btn');
    if(logout){ e.preventDefault(); showScreen('home'); return; }
    const navBtn=e.target.closest('[data-role-nav]');
    if(navBtn){ showScreen(navBtn.dataset.roleNav); return; }
    const actionBtn=e.target.closest('[data-role-action]');
    if(!actionBtn) return;
    const action=actionBtn.dataset.roleAction;
    if(action==='leafMode'){ switchToLeafMode(); return; }
    if(action==='treeMode'){ growToTree(); return; }
    if(action==='takeClass'){ openQuickStartModal(); return; }
    if(action==='uploadNotes'){ openAddNoteModal('tree'); return; }
    if(action==='scheduleClass'){ openScheduleClassModal(); return; }
    if(action==='postQuestion'){ openPostQuestionModal(); return; }
  });

  // ---- persistent desktop mode switch ----
  function updateGlobalModeSwitch(screenName){
    const wrap=$('globalModeSwitch'), btn=$('globalModeButton');
    if(!wrap || !btn) return;
    const appScreens=['leaf','tree','classes','students','planLesson','notesFull','trees','chat','questions','leaderboard','progress','discussion','liveClass','becomeTree'];
    const visible=appScreens.includes(screenName) && (currentRole==='tree' || canTeach);
    wrap.classList.toggle('visible',visible);
    if(!visible) return;
    btn.classList.remove('role-switch-leaf','role-switch-tree');
    if(currentRole==='tree'){
      btn.classList.add('role-switch-tree');
      btn.setAttribute('aria-label','Current mode: Tree. Switch to Leaf mode');
      btn.title='Switch to Leaf mode';
    }else{
      btn.classList.add('role-switch-leaf');
      btn.setAttribute('aria-label','Current mode: Leaf. Switch to Tree mode');
      btn.title='Switch to Tree mode';
    }
  }

  // ---- mobile navigation ----
  function updateMobileNav(screenName){
    const nav=$('mobileNav');
    if(!nav) return;
    const dashboardScreens=['leaf','tree','classes','students','planLesson','notesFull','trees','chat','questions','leaderboard','progress','discussion','liveClass','becomeTree'];
    nav.classList.toggle('app-mobile-nav-visible', dashboardScreens.includes(screenName));
    // Visibility is owned by responsive CSS. JS only updates state/classes.
    nav.removeAttribute('style');
    const completedSteps = Object.values(growthProgress).filter(Boolean).length;
    const readyToTeach = completedSteps === 3;
    const fifthIsGrowth = currentRole === 'leaf' && !canTeach && !readyToTeach;
    const active = screenName === 'leaf' || screenName === 'tree' ? 'home'
      : ['notesFull','classes','progress','liveClass'].includes(screenName) ? 'learn'
      : ['trees','students','discussion'].includes(screenName) ? 'people'
      : ['questions','leaderboard'].includes(screenName) ? 'questions'
      : screenName === 'becomeTree' && fifthIsGrowth ? 'mode'
      : '';
    ['mobileHome','mobileLearn','mobilePeople','mobileQuestions','mobileMode'].forEach(id => $(id)?.classList.remove('active'));
    const activeId={home:'mobileHome',learn:'mobileLearn',people:'mobilePeople',questions:'mobileQuestions',mode:'mobileMode'}[active];
    if(activeId) $(activeId)?.classList.add('active');
    const indicator=$('mobileNavIndicator');
    const indexMap={home:0,learn:1,people:2,questions:3,mode:4};
    if(indicator){ const idx=indexMap[active]; indicator.style.transform = idx == null ? 'translateX(0)' : `translateX(calc(${idx} * (100% + 2px)))`; }
    const modeText=$('mobileModeText'), modeIcon=$('mobileModeIcon'), modeBtn=$('mobileMode');
    modeBtn?.classList.remove('locked','growth-ready','tree-mode','role-switch-mobile');
    if(currentRole === 'tree'){
      if(modeText) modeText.textContent='';
      if(modeIcon) modeIcon.innerHTML='<use href="#ic-leaf" xlink:href="#ic-leaf"/>';
      modeBtn?.classList.add('tree-mode','role-switch-mobile');
      modeBtn?.setAttribute('aria-label','Current mode: Tree. Switch to Leaf mode');
      if(modeBtn) modeBtn.innerHTML='<span class="mobile-role-track"><span class="mobile-role-icon leaf"><svg><use href="#ic-leaf" xlink:href="#ic-leaf"/></svg></span><span class="mobile-role-icon tree"><svg><use href="#ic-tree" xlink:href="#ic-tree"/></svg></span><span class="mobile-role-knob" aria-hidden="true"></span></span><span class="sr-only">Switch to Leaf mode</span>';
    }else if(canTeach){
      if(modeText) modeText.textContent='';
      modeBtn?.classList.add('role-switch-mobile');
      modeBtn?.setAttribute('aria-label','Current mode: Leaf. Switch to Tree mode');
      if(modeBtn) modeBtn.innerHTML='<span class="mobile-role-track"><span class="mobile-role-icon leaf"><svg><use href="#ic-leaf" xlink:href="#ic-leaf"/></svg></span><span class="mobile-role-icon tree"><svg><use href="#ic-tree" xlink:href="#ic-tree"/></svg></span><span class="mobile-role-knob" aria-hidden="true"></span></span><span class="sr-only">Switch to Tree mode</span>';
    }else if(readyToTeach){
      if(modeText) modeText.textContent='Switch';
      if(modeIcon) modeIcon.innerHTML='<use href="#ic-tree" xlink:href="#ic-tree"/>';
      modeBtn?.classList.add('growth-ready');
      modeBtn?.setAttribute('aria-label','Growth complete. Switch to Tree mode');
    }else{
      if(modeText) modeText.textContent='Growth';
      if(modeIcon) modeIcon.innerHTML='<use href="#ic-sparkle" xlink:href="#ic-sparkle"/>';
      modeBtn?.setAttribute('aria-label','View your growth progress');
    }

    // The Learn popup is the overflow navigation for pages that do not fit
    // in the five-button mobile shell. Keep it role-aware and uncluttered.
    document.querySelectorAll('#mobileLearnMenu [data-mobile-role]').forEach(btn=>{
      const role=btn.dataset.mobileRole;
      btn.style.display=(role==='both' || role===currentRole) ? '' : 'none';
    });
  }
  function closeMobileLearnMenu(){ $('mobileLearnMenu')?.classList.remove('show'); }
  on('mobileHome','click',()=>{ closeMobileLearnMenu(); showScreen(currentRole==='tree'?'tree':'leaf'); });
  on('mobileLearn','click',()=>{ const menu=$('mobileLearnMenu'); if(menu) menu.classList.toggle('show'); });
  on('mobileLearnNotes','click',()=>{ closeMobileLearnMenu(); showScreen('notesFull'); });
  on('mobileLearnClasses','click',()=>{ closeMobileLearnMenu(); showScreen('classes'); });
  on('mobileLearnQuestions','click',()=>{ closeMobileLearnMenu(); showScreen('questions'); });
  on('mobileLearnDiscussion','click',()=>{ closeMobileLearnMenu(); showScreen('discussion'); });
  on('mobileLearnProgress','click',()=>{ closeMobileLearnMenu(); showScreen('progress'); });
  on('mobileLearnRecognition','click',()=>{ closeMobileLearnMenu(); showScreen('leaderboard'); });
  on('mobileLearnPlan','click',()=>{ closeMobileLearnMenu(); showScreen('planLesson'); });
  on('mobileLearnStudents','click',()=>{ closeMobileLearnMenu(); showScreen('students'); });
  on('mobilePeople','click',()=>{ closeMobileLearnMenu(); showScreen(currentRole==='tree'?'students':'trees'); });
  on('mobileQuestions','click',()=>{ closeMobileLearnMenu(); showScreen('questions'); });
  // Light horizontal swipe support on the glass nav: move between primary sections without turning the bar into a carousel.
  let navTouchX = null;
  on('mobileNav','touchstart',(e)=>{ navTouchX = e.touches && e.touches[0] ? e.touches[0].clientX : null; }, {passive:true});
  on('mobileNav','touchend',(e)=>{
    if(navTouchX == null) return;
    const x=e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : navTouchX;
    const dx=x-navTouchX; navTouchX=null;
    if(Math.abs(dx)<45) return;
    const order=currentRole==='tree' ? ['home','learn','people','questions'] : ['home','learn','people','questions'];
    const current = document.querySelector('#mobileNav button.active');
    const activeId=current ? current.id : 'mobileHome';
    const ids=['mobileHome','mobileLearn','mobilePeople','mobileQuestions'];
    let i=Math.max(0,ids.indexOf(activeId));
    i += dx<0 ? 1 : -1;
    i=Math.max(0,Math.min(ids.length-1,i));
    $(ids[i])?.click();
  }, {passive:true});
  let mobileLockTimer;
  on('mobileMode','click',()=>{
    closeMobileLearnMenu();
    if(currentRole==='tree'){ switchToLeafMode(); }
    else if(canTeach || Object.values(growthProgress).filter(Boolean).length === 3){ growToTree(); }
    else { showScreen('becomeTree'); }
  });

  on('globalModeButton','click',()=>{ if(currentRole==='tree') switchToLeafMode(); else if(canTeach) growToTree(); });

  // ---- toast ----
  let toastTimer;
  function showToast(msg){
    const toast = $('toast');
    if(!toast) return;
    const t = $('toastText');
    if(t) t.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
  }
  window.showToast = showToast;

  // ---- home interactions ----
  let authPath = 'leaf'; // selected destination for the current authentication flow

  function updateHomePath(){
    const tree = $('treeOrb');
    const treePill = $('treePill');
    const leafPill = $('leafPill');
    if(!tree) return;
    const unlocked = !!canTeach;

    tree.classList.toggle('locked', !unlocked);
    tree.classList.toggle('unlocked', unlocked);
    tree.setAttribute('aria-label', unlocked ? 'Continue as Tree' : 'Tree path locked');

    const caption = tree.parentElement && tree.parentElement.querySelector('.orb-caption');
    if(caption) caption.textContent = unlocked ? 'Your teaching role' : 'Unlocks after you grow';

    if(leafPill){
      leafPill.textContent = unlocked ? 'Continue as Leaf' : 'Join as Learner';
      leafPill.setAttribute('aria-label', unlocked ? 'Continue as Leaf' : 'Join as Learner');
    }

    if(treePill){
      treePill.textContent = unlocked ? 'Continue as Tree' : 'Tree Locked';
      treePill.classList.toggle('is-locked', !unlocked);
      treePill.disabled = !unlocked;
      treePill.setAttribute('aria-label', unlocked ? 'Continue as Tree' : 'Tree path locked');
    }

    const lock = tree.querySelector('.lock-badge');
    if(lock) lock.style.display = unlocked ? 'none' : '';
  }

  function handleTreeOrb(){
    if(canTeach) openPanel('tree', true);
    else showToast('Every Tree begins as a Leaf. Learn, share, and help first.');
  }
  on('treeOrb', 'click', handleTreeOrb);
  on('treeOrb', 'keydown', (e) => {
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); handleTreeOrb(); }
  });
  on('treePill', 'click', () => {
    if(canTeach) openPanel('tree', true);
    else showToast('Every Tree begins as a Leaf. Learn, share, and help first.');
  });

  function openPanel(path='leaf', forceLogin=false){
    authPath = path === 'tree' ? 'tree' : 'leaf';
    setMode(false);
    const toggle = $('authModeToggle');
    if(toggle) toggle.style.display = authPath === 'tree' || canTeach ? 'none' : '';
    const panelTitle = $('panelTitle');
    const panelSub = $('panelSub');
    const finePrint = $('finePrint');
    if(authPath === 'tree'){
      if(panelTitle) panelTitle.textContent = 'Welcome back, Tree';
      if(panelSub) panelSub.textContent = 'Log in with the same credentials you use for your Leaf account.';
      if(finePrint) finePrint.textContent = 'Your Tree access is part of the same E-Leaf account.';
    }else if(canTeach){
      if(panelTitle) panelTitle.textContent = 'Welcome back';
      if(panelSub) panelSub.textContent = 'Log in to continue as a Leaf.';
      if(finePrint) finePrint.textContent = 'Use the same credentials you use for your Tree account.';
    }
    $('scrim') && $('scrim').classList.add('show');
    $('panel') && $('panel').classList.add('show');
    setTimeout(() => { const first = $('emailOrPhone'); if(first) first.focus(); }, 120);
  }
  function closePanel(){
    $('scrim') && $('scrim').classList.remove('show');
    $('panel') && $('panel').classList.remove('show');
  }

  on('leafOrb', 'click', () => openPanel('leaf', false));
  on('leafOrb', 'keydown', (e) => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openPanel('leaf', false); } });
  on('leafPill', 'click', () => openPanel('leaf', false));
  on('backBtn', 'click', closePanel);
  on('scrim', 'click', closePanel);

  // ---- auth mode toggle ----
  function setMode(signup){
    const panel = $('panel');
    const treeLogin = authPath === 'tree';
    const returningUser = !!canTeach;
    const effectiveSignup = signup && !treeLogin && !returningUser;
    if(panel) panel.classList.toggle('mode-signup', effectiveSignup);
    $('modeLogin') && $('modeLogin').classList.toggle('active', !effectiveSignup);
    $('modeSignup') && $('modeSignup').classList.toggle('active', effectiveSignup);
    const panelTitle = $('panelTitle'), panelSub = $('panelSub'), submitBtn = $('submitBtn'),
          passwordLabel = $('passwordLabel'), finePrint = $('finePrint'), toggle = $('authModeToggle');
    if(toggle) toggle.style.display = (treeLogin || returningUser) ? 'none' : '';

    if(treeLogin){
      if(panelTitle) panelTitle.textContent = 'Welcome back, Tree';
      if(panelSub) panelSub.textContent = 'Log in with the same credentials you use for your Leaf account.';
      if(submitBtn) submitBtn.textContent = 'Log in';
      if(passwordLabel) passwordLabel.textContent = 'Password';
      if(finePrint) finePrint.textContent = 'Your Tree access is part of the same E-Leaf account.';
    }else if(returningUser){
      if(panelTitle) panelTitle.textContent = 'Welcome back';
      if(panelSub) panelSub.textContent = 'Log in to continue as a Leaf.';
      if(submitBtn) submitBtn.textContent = 'Log in';
      if(passwordLabel) passwordLabel.textContent = 'Password';
      if(finePrint) finePrint.textContent = 'Use the same credentials you use for your Tree account.';
    }else if(effectiveSignup){
      if(panelTitle) panelTitle.textContent = 'Grow your Leaf account';
      if(panelSub) panelSub.textContent = 'A few details and you can start learning.';
      if(submitBtn) submitBtn.textContent = 'Create account';
      if(passwordLabel) passwordLabel.textContent = 'Choose a password';
      if(finePrint) finePrint.innerHTML = 'Already a member? <button type="button" class="auth-switch-link">Log in</button>';
    }else{
      if(panelTitle) panelTitle.textContent = 'Welcome back';
      if(panelSub) panelSub.textContent = 'Log in to keep learning where you left off.';
      if(submitBtn) submitBtn.textContent = 'Log in';
      if(passwordLabel) passwordLabel.textContent = 'Password';
      if(finePrint) finePrint.innerHTML = 'New here? <button type="button" class="auth-switch-link">Create a Leaf account</button>';
    }
  }
  window.setMode = setMode;

  on('modeLogin', 'click', () => setMode(false));
  on('modeSignup', 'click', () => setMode(true));
  on('switchToSignup', 'click', () => setMode(true));
  document.addEventListener('click', (e) => {
    if(e.target.closest('.auth-switch-link')) setMode(!$('panel').classList.contains('mode-signup'));
  });

  // ---- app state ----
  let currentRole = 'leaf'; // active mode, not permission
  let canTeach = false;
  let currentUser = { name: 'Almost Fake', id: null, email: '' };
  let liveContext = null; // { classId, isTeacher }
  let supabaseAuthUnsubscribe = null;
  const progressKey = 'e_leaf_progress_v2';
  let growthProgress = { learned:false, shared:false, helped:false };

  function normalizeDisplayName(user){
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    if(fullName && String(fullName).trim()) return String(fullName).trim();
    if(user?.email) return String(user.email).split('@')[0];
    return 'Almost Fake';
  }

  function initialsForName(name){
    const text = (name || '').trim() || 'Almost Fake';
    const parts = text.split(/\s+/).filter(Boolean);
    if(parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function applyIdentityUI(){
    const name = (currentUser.name || '').trim() || 'Almost Fake';
    const role = currentRole === 'tree' ? 'Tree' : 'Leaf';
    const avatarColor = currentRole === 'tree' ? 'var(--bark-deep)' : 'var(--moss-deep)';

    document.querySelectorAll('.who').forEach((who) => {
      const avatar = who.querySelector('.avatar');
      const nameEl = who.querySelector('.name');
      const roleEl = who.querySelector('.role');
      if(nameEl) nameEl.textContent = name;
      if(roleEl) roleEl.textContent = role;
      if(avatar){
        avatar.textContent = initialsForName(name);
        avatar.style.background = avatarColor;
      }
    });

    ['classesAvatar', 'notesFullAvatar', 'questionsAvatar', 'leaderboardAvatar'].forEach((id) => {
      const el = $(id);
      if(el){
        el.textContent = initialsForName(name);
        el.style.background = avatarColor;
      }
    });

    const welcomeName = $('welcomeUserName');
    if(welcomeName) welcomeName.textContent = name;
  }

  function mapSupabaseAuthError(error){
    const msg = (error && (error.message || error.error_description)) || 'Authentication failed.';
    if(/invalid login credentials|Invalid login credentials|invalid credentials/i.test(msg)) return 'Invalid email or password.';
    if(/weak password|Password should be|at least 8 characters/i.test(msg)) return 'Password must be at least 8 characters.';
    if(/already registered|User already registered|already exists/i.test(msg)) return 'This email is already registered. Try logging in instead.';
    if(/email not confirmed|confirm your email|confirmation/i.test(msg)) return 'Please confirm your email before logging in.';
    if(/network|Failed to fetch|api/i.test(msg)) return 'Network error while contacting Supabase. Please try again.';
    return msg;
  }

  // Initialize persistent application chrome only after all role/growth state exists.
  syncTopNavbars();
  applyIdentityUI();

  async function loadUserState(){
    try{
      if(window.ELeafSupabase && window.ELeafSupabase.ready){
        const session = await window.ELeafSupabase.getSession();
        if(session && session.user){
          currentUser.id = session.user.id || null;
          currentUser.email = session.user.email || '';
          currentUser.name = normalizeDisplayName(session.user);
          const profile = await window.ELeafSupabase.getProfile(session.user.id);
          if(profile && profile.full_name) currentUser.name = profile.full_name;
        } else {
          currentUser.id = null;
          currentUser.email = '';
          currentUser.name = 'Almost Fake';
        }

        if(!supabaseAuthUnsubscribe){
          supabaseAuthUnsubscribe = window.ELeafSupabase.listenForAuthChanges(async (event, session) => {
            if(session && session.user){
              currentUser.id = session.user.id || null;
              currentUser.email = session.user.email || '';
              currentUser.name = normalizeDisplayName(session.user);
              const profile = await window.ELeafSupabase.getProfile(session.user.id);
              if(profile && profile.full_name) currentUser.name = profile.full_name;
            } else {
              currentUser.id = null;
              currentUser.email = '';
              currentUser.name = 'Almost Fake';
            }
            applyIdentityUI();
            updateHomePath();
          });
        }
      }

      const r = await store.get(progressKey);
      if(r && r.value){
        const data = JSON.parse(r.value);
        growthProgress = { ...growthProgress, ...(data.progress || {}) };
        canTeach = !!data.canTeach;
        if(data.name && !currentUser.id) currentUser.name = data.name;
      }
    }catch(e){
      console.warn('E-Leaf: failed to restore persisted auth state', e);
    }

    applyIdentityUI();
    updateHomePath();
  }
  async function saveUserState(){
    try{ await store.set(progressKey, JSON.stringify({ name:currentUser.name, canTeach, progress:growthProgress })); }catch(e){}
  }
  async function markProgress(key){
    if(!growthProgress[key]){ growthProgress[key] = true; await saveUserState(); }
    renderGrowthState();
  }
  function growthSteps(){
    return [
      { key:'learned', title:'Learn from another Tree', sub:growthProgress.learned ? 'Completed  -  you attended a class.' : 'Attend at least one class as a Leaf.' },
      { key:'shared', title:'Share something useful', sub:growthProgress.shared ? 'Completed  -  you planted a note.' : 'Plant at least one useful note for others.' },
      { key:'helped', title:'Help another learner', sub:growthProgress.helped ? 'Completed  -  you answered a question.' : 'Answer at least one question from a Tree.' }
    ];
  }
  function renderGrowthState(){
    const done = Object.values(growthProgress).filter(Boolean).length;
    const pct = Math.round(done/3*100);
    document.querySelectorAll('.growth-path-pill').forEach(pill => {
      const fill = pill.querySelector('.growth-path-fill');
      const count = pill.querySelector('.growth-path-count');
      if(fill) fill.style.width = pct + '%';
      if(count) count.textContent = `${done}/3`;
    });
    const list = $('leafGrowthChecklist');
    const btList = $('btGrowthChecklist');
    const html = growthSteps().map(step => `
      <li>
        <div class="check-dot ${growthProgress[step.key] ? 'done' : ''}">
          ${growthProgress[step.key] ? '<svg><use href="#ic-check" xlink:href="#ic-check"/></svg>' : ''}
        </div>
        <div><div class="item-title">${escapeHtml(step.title)}</div><div class="item-sub">${escapeHtml(step.sub)}</div></div>
      </li>`).join('');
    if(list) list.innerHTML = html;
    if(btList) btList.innerHTML = html;
    ['leafProgressFill','btProgressFill'].forEach(id => { const el=$(id); if(el) el.style.width=pct+'%'; });
    ['leafProgressLabel','btProgressLabel'].forEach(id => { const el=$(id); if(el) el.textContent=`${done} of 3 complete`; });
    const ready = done === 3;
    ['miniGrowBtn','mainGrowBtn'].forEach(id => {
      const el=$(id);
      if(!el) return;
      const enabled = ready;
      el.disabled = !enabled;
      el.classList.toggle('ready', enabled);
      el.innerHTML = canTeach
        ? '<svg><use href="#ic-tree" xlink:href="#ic-tree"/></svg>Become a Tree'
        : ready
          ? '<svg><use href="#ic-tree" xlink:href="#ic-tree"/></svg>I’m ready to teach'
          : '<svg><use href="#ic-sparkle" xlink:href="#ic-sparkle"/></svg>Keep growing';
    });
    const sideBtn = $('sideBecomeTree');
    if(sideBtn){
      sideBtn.classList.toggle('tree-dashboard-link', canTeach);
      sideBtn.classList.toggle('highlight', !canTeach);
      sideBtn.classList.remove('active');
      if(canTeach && screens.leaf && screens.leaf.classList.contains('active')) sideBtn.classList.add('active');
      sideBtn.innerHTML = canTeach
        ? '<svg><use href="#ic-tree" xlink:href="#ic-tree"/></svg><span>Tree Dashboard</span>'
        : '<svg><use href="#ic-sparkle" xlink:href="#ic-sparkle"/></svg><span>Become a Tree</span>';
      if(canTeach){ sideBtn.dataset.roleAction='treeMode'; delete sideBtn.dataset.roleNav; }
      else { sideBtn.dataset.roleNav='becomeTree'; delete sideBtn.dataset.roleAction; }
    }
    const summary=$('growthSummary');
    if(summary){
      summary.innerHTML = canTeach
        ? '<strong>You are a Tree.</strong> You can still return to Leaf mode whenever you want to learn.'
        : ready
          ? '<strong>You are ready.</strong> When you choose to teach, the Tree path will unlock permanently.'
          : `<strong>${done}/3 complete.</strong> ${3-done} step${3-done===1?'':'s'} left before your Tree path opens.`;
    }
    const welcome=$('leafWelcomeText');
    if(welcome){
      welcome.textContent = canTeach
        ? 'You are a Tree now  -  and you never stop being a Leaf. Learn whenever you need to.'
        : `You have completed ${done} of 3 steps toward becoming a Tree.`;
    }
    const activeEntry = Object.entries(screens).find(([,el]) => el && el.classList.contains('active'));
    if(activeEntry) updateMobileNav(activeEntry[0]);
  }


  // ---- tiny escaping helper (safe to render user-entered text) ----
  function escapeHtml(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ---- client data access seam ----
  // UI code only talks to this adapter for persisted records. It deliberately
  // retains the prototype's storage behavior, but a future Supabase adapter can
  // replace `records` without changing screen renderers or event handlers.
  // Authentication, authorization, and ownership remain demo-only until they
  // are enforced by that backend adapter and its server-side policies.
  const persistentStorage = (() => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
    } catch (error) {
      return null;
    }
  })();
  const hasRealStorage = !!persistentStorage;
  const memoryStore = {};
  // Demo fixtures require an explicit document flag. Production must omit it;
  // this makes automatic seeding opt-in rather than a backend deployment default.
  const clientData = { isDemoMode: document.documentElement.dataset.demoMode === 'true', records: {
    async get(key){
      if(hasRealStorage){
        try {
          const stored = persistentStorage.getItem(key);
          return stored == null ? null : { key, value: stored };
        } catch (e) {
          return null;
        }
      }
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? { key, value: memoryStore[key] } : null;
    },
    async set(key, value){
      if(hasRealStorage){
        try {
          persistentStorage.setItem(key, value);
          return { key, value };
        } catch (e) {
          return null;
        }
      }
      memoryStore[key] = value; return { key, value };
    },
    async list(prefix){
      if(hasRealStorage){
        try {
          const keys = [];
          for (let index = 0; index < persistentStorage.length; index += 1) {
            const key = persistentStorage.key(index);
            if (key && key.startsWith(prefix)) keys.push(key);
          }
          return { keys };
        } catch (e) {
          return { keys: [] };
        }
      }
      return { keys: Object.keys(memoryStore).filter(k => k.startsWith(prefix)) };
    }
  }};
  const store = clientData.records;

  async function getAllByPrefix(prefix){
    let listRes;
    try{ listRes = await store.list(prefix); }catch(e){ listRes = null; }
    const keys = (listRes && listRes.keys) || [];
    const items = [];
    for(const k of keys){
      try{
        const r = await store.get(k);
        if(r && r.value) items.push(JSON.parse(r.value));
      }catch(e){ /* skip unreadable entry */ }
    }
    return items;
  }

  async function ensureDemoClass(){
    const demoId = 'c-demo-growth';
    try{
      const existing = await store.get('class:' + demoId);
      if(!existing || !existing.value){
        const demo = { id:demoId, title:'E-Leaf Demo Class', subject:'Environmental Science', date:'2026-09-06', time:'18:00', teacher:'Willow Peer', status:'scheduled', demo:true, attended:false };
        await store.set('class:' + demoId, JSON.stringify(demo));
      }
    }catch(e){}
  }

  async function seedIfNeeded(){
    if(!clientData.isDemoMode) return;
    await ensureDemoClass();
    let seeded = null;
    try{ seeded = await store.get('seeded_v1'); }catch(e){ seeded = null; }
    if(seeded) return;
    const notes = [
      { id:'n1', subject:'Biology', title:'Photosynthesis  -  First Principles', description:'How leaves turn sunlight into sugar; a gentle walkthrough with diagrams.', author:'Willow Peer', rating:4.0, createdAt: Date.now() - 90000000 },
      { id:'n2', subject:'Mathematics', title:'Linear Algebra in 20 Minutes', description:'Vectors, spans, and the geometry of transformation.', author:'Willow Peer', rating:2.0, createdAt: Date.now() - 70000000 },
      { id:'n3', subject:'Environmental Science', title:'Reading the Forest  -  Ecosystem Notes', description:'Field notes on canopy layers, understory life, and forest floor decay.', author:'Willow Peer', rating:3.0, createdAt: Date.now() - 50000000 },
      { id:'n4', subject:'Biology', title:'Cell Membranes, Explained With Traffic', description:'Using a city-traffic analogy to make transport proteins click.', author:'Maya Chen', rating:4.5, createdAt: Date.now() - 30000000 },
      { id:'n5', subject:'Mathematics', title:'Why Determinants Are Areas', description:'A visual note on why the determinant formula is really about area and volume.', author:'Sara Malik', rating:5.0, createdAt: Date.now() - 15000000 }
    ];
    for(const n of notes){ await store.set('note:' + n.id, JSON.stringify(n)); }
    const classes = [
      { id:'c1', title:'Intro to Ecosystems', subject:'Environmental Science', date:'2026-09-10', time:'16:00', teacher:'Willow Peer', status:'scheduled' },
      { id:'c2', title:'Vectors & Spans Recap', subject:'Mathematics', date:'2026-09-05', time:'11:00', teacher:'Willow Peer', status:'ended' }
    ];
    for(const c of classes){ await store.set('class:' + c.id, JSON.stringify(c)); }

    const questions = [
      { id:'q1', title:'What actually limits photosynthesis rate indoors?', body:'My classroom plants seem to stall even with grow lights on. What variable should I check first?', subject:'Biology', teacher:'Willow Peer', createdAt: Date.now() - 40000000,
        answers:[ { id:'a1', author:'Maya Chen', text:'Usually CO₂ concentration  -  grow lights fix the light limit but indoor air runs low on CO₂ fast.', createdAt: Date.now() - 30000000 } ] },
      { id:'q2', title:'Best way to explain eigenvectors intuitively?', body:'Looking for an analogy that clicks for students seeing linear algebra for the first time.', subject:'Mathematics', teacher:'Willow Peer', createdAt: Date.now() - 20000000, answers:[] }
    ];
    for(const q of questions){ await store.set('question:' + q.id, JSON.stringify(q)); }

    await store.set('seeded_v1', 'true');
  }

  const demoTrees = [
    { id:'t1', name:'Willow Peer', initials:'WP', color:'#6b4a34', expertise:['Biology','Environmental Science'], email:'willow.peer@e-leaf.demo', phone:'+91 90000 11111', availability:'Mon–Fri, 4–6pm', bio:'Field biologist turned teacher; loves ecosystem walks and slow, visual explanations.' },
    { id:'t2', name:'Elias Grove', initials:'EG', color:'#4a3324', expertise:['Mathematics'], email:'elias.grove@e-leaf.demo', phone:'+91 90000 22222', availability:'Tue & Thu, 6–8pm', bio:'Makes linear algebra feel like geometry, not memorization.' },
    { id:'t3', name:'Nadia Fern', initials:'NF', color:'#8a6b4f', expertise:['Environmental Science','Biology'], email:'nadia.fern@e-leaf.demo', phone:'+91 90000 33333', availability:'Weekends, 10am–1pm', bio:'Runs the "Reading the Forest" note series; big on real-world field notes.' }
  ];
  const currentTreeExpertise = ['Biology', 'Environmental Science'];

  const demoLeaderboardPool = [
    { name:'Maya Chen', initials:'MC', color:'#5f8c5a', score:130, answers:13 },
    { name:'Sara Malik', initials:'SM', color:'#d9a441', score:90, answers:9 },
    { name:'Rohan Iyer', initials:'RI', color:'#6b4a34', score:60, answers:6 },
    { name:'Priya Nair', initials:'PN', color:'#6b4a34', score:40, answers:4 },
    { name:'Leo Fischer', initials:'LF', color:'#5f8c5a', score:20, answers:2 }
  ];

  const demoStudents = [
    { name:'Maya Chen', subject:'Biology', classes:8, answered:5, doubts:2, initials:'MC', color:'#5f8c5a' },
    { name:'Rohan Iyer', subject:'Environmental Science', classes:5, answered:3, doubts:4, initials:'RI', color:'#6b4a34' },
    { name:'Sara Malik', subject:'Mathematics', classes:11, answered:7, doubts:1, initials:'SM', color:'#d9a441' },
    { name:'Leo Fischer', subject:'Biology', classes:4, answered:2, doubts:3, initials:'LF', color:'#5f8c5a' },
    { name:'Priya Nair', subject:'Environmental Science', classes:7, answered:4, doubts:2, initials:'PN', color:'#6b4a34' }
  ];

  function starsHtml(rating){
    const r = Number(rating) || 0;
    const full = Math.round(r);
    let s = '';
    for(let i=0;i<5;i++){ s += i < full ? '★' : '<span class="off">☆</span>'; }
    return s + ' ' + r.toFixed(1) + ' avg';
  }

  function fmtDate(dateStr, timeStr){
    if(!dateStr) return 'Date TBD';
    try{
      const d = new Date(dateStr + 'T' + (timeStr || '00:00'));
      if(isNaN(d.getTime())) return dateStr + ' ' + (timeStr || '');
      return d.toLocaleDateString(undefined, { month:'short', day:'numeric' }) + ' · ' + d.toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' });
    }catch(e){ return dateStr + ' ' + (timeStr || ''); }
  }

  let activeNotesView = 'mine';
  function savedNoteIds(){ try{return JSON.parse(localStorage.getItem('eleaf_saved_notes')||'[]')}catch(e){return []} }
  function isNoteSaved(id){ return savedNoteIds().includes(id); }
  function toggleSavedNote(id){
    const ids=savedNoteIds(); const at=ids.indexOf(id); if(at>=0) ids.splice(at,1); else ids.unshift(id);
    localStorage.setItem('eleaf_saved_notes',JSON.stringify(ids));
  }

  // ---- notes ----
  function buildNoteCardHtml(n){
    return `
      <div class="note-card">
        <div class="note-eyebrow">${escapeHtml((n.subject||'General').toUpperCase())}</div>
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.description || '')}</p>
        <div class="note-meta">by ${escapeHtml(n.author || 'You')}</div>
        <div class="stars">${starsHtml(n.rating)}</div>
        ${n.author !== currentUser.name ? `<button class="note-save-btn ${isNoteSaved(n.id)?'saved':''}" data-save-note="${escapeHtml(n.id)}">${isNoteSaved(n.id)?'Saved ✓':'Save for later'}</button>` : ''}
      </div>
    `;
  }

  async function renderNotes(){
    const grid = $('notesGrid');
    if(!grid) return;
    let notes = [];
    try{ notes = await getAllByPrefix('note:'); }catch(e){ notes = []; }
    notes.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    if(notes.length === 0){
      grid.innerHTML = '<div class="empty-state">No notes planted yet. Be the first to plant one.</div>';
      return;
    }
    grid.innerHTML = notes.slice(0,2).map(buildNoteCardHtml).join('');
  }

  async function renderNotesFull(){
    const host = $('notesFullList');
    if(!host) return;
    const screenEl = $('screen-notes-full');
    if(screenEl) screenEl.classList.toggle('role-tree', currentRole === 'tree');
    $('notesFullRoleText') && ($('notesFullRoleText').textContent = currentRole === 'tree' ? 'Tree' : 'Leaf');
    $('notesFullAvatar') && ($('notesFullAvatar').style.background = currentRole === 'tree' ? 'var(--bark-deep)' : 'var(--moss-deep)');

    let notes = [];
    try{ notes = await getAllByPrefix('note:'); }catch(e){ notes = []; }
    const allNotes = notes.slice();
    if(activeNotesView === 'mine') notes = notes.filter(n => n.author === currentUser.name);
    if(activeNotesView === 'explore') notes = notes.filter(n => n.author !== currentUser.name);
    if(activeNotesView === 'saved'){ const saved = new Set(savedNoteIds()); notes = notes.filter(n => saved.has(n.id)); }
    if(notes.length === 0){
      const emptyCopy = activeNotesView === 'mine' ? 'Your planted notes will live here.' : activeNotesView === 'saved' ? 'Nothing saved yet. Save a useful note from Explore Notes.' : 'No shared notes to explore yet.';
      host.innerHTML = '<div class="empty-state">'+emptyCopy+'</div>';
      return;
    }
    const sortMode = ($('notesSortSelect') && $('notesSortSelect').value) || 'recent';
    const sorter = sortMode === 'rating'
      ? (a,b) => (b.rating||0) - (a.rating||0)
      : (a,b) => (b.createdAt||0) - (a.createdAt||0);

    const bySubject = {};
    notes.forEach(n => {
      const subj = n.subject || 'General';
      if(!bySubject[subj]) bySubject[subj] = [];
      bySubject[subj].push(n);
    });
    const subjects = Object.keys(bySubject).sort();
    host.innerHTML = subjects.map(subj => `
      <div class="subject-group">
        <div class="subject-group-title">${escapeHtml(subj)}</div>
        <div class="notes-grid">${bySubject[subj].sort(sorter).map(buildNoteCardHtml).join('')}</div>
      </div>
    `).join('');
  }
  on('notesSortSelect', 'change', renderNotesFull);

  // ---- dashboard preview widgets (Leaf home + Tree home) ----
  let previewTreeBound=false;
  function onPreviewTreeCards(){
    const host=$('treesPreviewLeaf');
    if(!host || previewTreeBound) return;
    previewTreeBound=true;
    host.addEventListener('click',(e)=>{ if(e.target.closest('[data-tree-preview]')) showScreen('trees'); });
  }

  async function renderLeafPreviews(){
    const classesHost = $('classesPreviewLeaf');
    if(classesHost){
      let classes = [];
      try{ classes = await getAllByPrefix('class:'); }catch(e){ classes = []; }
      const upcoming = classes.filter(c => c.status === 'scheduled' || c.status === 'live')
        .sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)).slice(0,3);
      classesHost.innerHTML = upcoming.length
        ? upcoming.map(c => `
            <div class="mini-class-card">
              <div class="cc-title">${escapeHtml(c.title)}</div>
              <div class="cc-meta">${escapeHtml(c.subject)} · ${fmtDate(c.date,c.time)}</div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(c.status)}</span><span style="font-size:.7rem;color:var(--ink-soft);">by ${escapeHtml(c.teacher)}</span></div>
            </div>
          `).join('')
        : '<div class="empty-state">No classes scheduled yet.</div>';
    }

    const treesHost = $('treesPreviewLeaf');
    if(treesHost){
      treesHost.innerHTML = demoTrees.slice(0,3).map(t => `
        <button type="button" class="profile-preview-card" data-tree-preview="${escapeHtml(t.id)}">
          <div class="profile-preview-photo tree-tone" style="color:${t.color}"><svg><use href="#ic-person" xlink:href="#ic-person"/></svg></div>
          <div class="profile-preview-body">
            <h4>${escapeHtml(t.name)}</h4>
            <div class="profile-preview-meta">${escapeHtml(t.expertise.slice(0,2).join(' · '))}</div>
            <div class="profile-preview-link">Know more ></div>
          </div>
        </button>
      `).join('');
    }

    onPreviewTreeCards();

    const subjHost = $('subjectsPreviewLeaf');
    if(subjHost){
      let notes = [];
      try{ notes = await getAllByPrefix('note:'); }catch(e){ notes = []; }
      const counts = {};
      notes.forEach(n => { const s = n.subject || 'General'; counts[s] = (counts[s]||0) + 1; });
      const subjects = Object.keys(counts).length ? Object.keys(counts) : ['Biology','Mathematics','Environmental Science'];
      subjHost.innerHTML = subjects.map(s => `
        <div class="subject-chip-card" data-subject-chip="${escapeHtml(s)}" style="cursor:pointer;">
          ${escapeHtml(s)} <span class="count">${counts[s] || 0} notes</span>
        </div>
      `).join('');
    }
  }
  on('subjectsPreviewLeaf', 'click', (e) => {
    const chip = e.target.closest('[data-subject-chip]');
    if(!chip) return;
    const subject = chip.dataset.subjectChip;
    showScreen('notesFull');
    setTimeout(() => {
      const groups = document.querySelectorAll('.subject-group-title');
      for(const g of groups){ if(g.textContent === subject){ g.scrollIntoView({ behavior:'smooth', block:'start' }); break; } }
    }, 80);
  });

  function timeGreeting(){ const h=new Date().getHours(); return h<12?'Good morning':h<17?'Good afternoon':'Good evening'; }
  function journalEntries(){ try{return JSON.parse(localStorage.getItem('eleaf_journal')||'[]')}catch(e){return []} }
  function saveJournalEntry(text){ const items=journalEntries(); items.unshift({id:Date.now(),text,createdAt:Date.now()}); localStorage.setItem('eleaf_journal',JSON.stringify(items.slice(0,100))); }
  function renderLatestJournal(){
    const host=$('journalLatest'); if(!host) return; const items=journalEntries();
    host.innerHTML=items.length?`<div class="journal-date">${new Date(items[0].createdAt).toLocaleDateString(undefined,{month:'long',day:'numeric'})}</div>${escapeHtml(items[0].text)}`:'<div class="journal-empty">No reflection yet. Add one when something clicks - or doesn’t.</div>';
  }
  function openReflectionModal(){
    openModal('Add a reflection',`<form data-modal-form><div class="field"><label>What changed in your understanding?</label><textarea name="reflection" required maxlength="500" placeholder="I finally understood… / I’m still confused about…"></textarea></div><button type="submit" class="submit-btn">Keep reflection</button></form>`,fd=>{ const t=(fd.get('reflection')||'').trim(); if(!t)return; saveJournalEntry(t); closeModal(); renderLatestJournal(); showToast('Reflection added to My Learning'); });
  }
  function openJournalModal(){
    const items=journalEntries();
    openModal('My learning journal',items.length?`<div style="display:grid;gap:12px;max-height:55vh;overflow:auto">${items.map(i=>`<div class="journal-entry"><div class="journal-date">${new Date(i.createdAt).toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})}</div>${escapeHtml(i.text)}</div>`).join('')}</div>`:'<div class="empty-state">No reflections yet.</div>',null);
  }
  const leafSubjectProgress = [
    {subject:'Biology', completed:3, total:5, current:'Unit 4 · Genetics', units:['Cells & structure','Photosynthesis','Cell membranes','Genetics','Evolution']},
    {subject:'Mathematics', completed:2, total:5, current:'Unit 3 · Determinants', units:['Functions','Matrices','Determinants','Vectors','Probability']},
    {subject:'Environmental Science', completed:1, total:4, current:'Unit 2 · Ecosystems', units:['Foundations','Ecosystems','Climate systems','Conservation']},
    {subject:'Physics', completed:2, total:6, current:'Unit 3 · Motion', units:['Measurement','Vectors','Motion','Forces','Energy','Waves']},
    {subject:'Programming', completed:1, total:5, current:'Unit 2 · Loops', units:['Variables','Loops','Functions','Data structures','Projects']}
  ];
  const leafDiscussions = [
    {title:'Best way to remember the stages of mitosis?', subject:'Biology', author:'Maya Leaf', replies:8, body:'I understand each stage separately, but I keep mixing up the order during revision.'},
    {title:'Study group for determinants this week?', subject:'Mathematics', author:'Arjun Leaf', replies:5, body:'Looking for 2–3 people to work through determinant problems together.'},
    {title:'Does anyone have a simple ecosystem case study?', subject:'Environmental Science', author:'Nina Leaf', replies:3, body:'Something small enough to understand before the next class would help.'}
  ];
  function quickLeafNotes(){ try{return JSON.parse(localStorage.getItem('eleaf_quick_notes')||'[]')}catch(e){return []} }
  function saveQuickLeafNoteText(text){ const items=quickLeafNotes(); items.unshift({id:Date.now(),text,createdAt:Date.now()}); localStorage.setItem('eleaf_quick_notes',JSON.stringify(items.slice(0,100))); }
  function renderSubjectProgressPreview(){ const host=$('learningGarden'); if(!host)return; host.innerHTML=leafSubjectProgress.slice(0,3).map(s=>`<div class="subject-progress-item"><div class="subject-progress-head"><div class="subject-progress-name">${escapeHtml(s.subject)}</div><div class="subject-progress-units">${s.completed} of ${s.total} units</div></div><div class="subject-current-unit">${escapeHtml(s.current)} in progress</div><div class="unit-dots">${s.units.map((_,i)=>`<span class="unit-dot ${i<s.completed?'done':i===s.completed?'current':''}"></span>`).join('')}</div></div>`).join(''); }
  function renderProgressTracker(){ const host=$('progressTrackerGrid'); if(!host)return; host.innerHTML=leafSubjectProgress.map(s=>`<div class="tracker-card"><h3>${escapeHtml(s.subject)}</h3><div class="tracker-units">${s.completed} of ${s.total} units complete · ${escapeHtml(s.current)} in progress</div><div class="unit-list">${s.units.map((u,i)=>`<div class="unit-row ${i<s.completed?'done':i===s.completed?'current':''}"><span class="unit-marker"></span><span>${i<s.completed?'<strong>Completed</strong> · ':i===s.completed?'<strong>In progress</strong> · ':'Next · '}${escapeHtml(u)}</span></div>`).join('')}</div></div>`).join(''); }
  function renderDiscussionPreview(){ const host=$('homeDiscussionPreview'); if(!host)return; host.innerHTML=leafDiscussions.slice(0,2).map(d=>`<div class="discussion-item"><div class="discussion-topic">${escapeHtml(d.title)}</div><div class="discussion-meta">${escapeHtml(d.subject)} · ${escapeHtml(d.author)} · ${d.replies} replies</div></div>`).join(''); }
  function renderDiscussionPage(){ const host=$('discussionPageList'); if(!host)return; host.innerHTML=leafDiscussions.map(d=>`<div class="discussion-page-item"><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.body)}</p><div class="discussion-page-meta"><span>${escapeHtml(d.subject)} · started by ${escapeHtml(d.author)}</span><span>${d.replies} replies · Report</span></div></div>`).join(''); }
  async function renderPersonalHome(){
    if(!$('personalGreeting')) return;
    $('personalGreeting').textContent=`${timeGreeting()}, ${(currentUser.name||'Almost').split(' ')[0]}.`;
    let notes=[], classes=[], questions=[]; try{notes=await getAllByPrefix('note:')}catch(e){} try{classes=await getAllByPrefix('class:')}catch(e){} try{questions=await getAllByPrefix('question:')}catch(e){}
    const upcoming=classes.filter(c=>c.status==='scheduled'||c.status==='live').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    const next=upcoming[0]||classes[0];
    if(next){
      $('homeClassTitle').textContent=next.title||'Upcoming class'; $('homeClassSubject').textContent=next.subject||'General'; $('homeClassWhen').textContent=fmtDate(next.date,next.time); $('homeClassTeacher').textContent=`with ${next.teacher||next.author||'a Tree'}`;
      const live=next.status==='live'; $('homeClassStatus').classList.toggle('live',live); $('homeClassStatus').innerHTML=`<span class="class-status-dot"></span>${live?'Live now':'Upcoming'}`; $('homeClassPrimaryBtn').textContent=live?'Join now >':'Explore class >'; $('homeClassPrimaryBtn').dataset.classId=next.id||'';
      $('currentLearningSubject').textContent=`Learning ${next.subject||'something new'}`; $('currentLearningDetail').textContent=next.title||'One idea at a time.';
    }
    const recentQuestion=[...questions].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0))[0]||questions[0];
    if(recentQuestion){ $('helpQuestion').textContent=`“${recentQuestion.title}”`; $('helpQuestionSubject').textContent=recentQuestion.subject||'Community'; $('helpQuestionMeta').textContent=`Most recent community question${recentQuestion.author?' · '+recentQuestion.author:''}`; }
    const myNotes=notes.filter(n=>n.author===currentUser.name).length;
    const myAnswers=questions.reduce((n,q)=>n+(q.answers||[]).filter(a=>a.author===currentUser.name).length,0);
    const attended=classes.filter(c=>c.attended).length;
    $('gardenStats').innerHTML=`<span><strong>${myNotes}</strong> notes planted</span><span><strong>${myAnswers}</strong> questions answered</span><span><strong>${attended}</strong> classes attended</span>`;
    renderSubjectProgressPreview(); renderDiscussionPreview();
    $('waitingCount').textContent=`${[next,recentQuestion,leafDiscussions[0]].filter(Boolean).length} things waiting for you`;
  }

  async function computeTopLeafByNotes(){
    let notes = [];
    try{ notes = await getAllByPrefix('note:'); }catch(e){ notes = []; }
    const excluded = new Set(demoTrees.map(t => t.name));
    if(currentRole === 'tree') excluded.add(currentUser.name);
    const byAuthor = {};
    notes.forEach(n => {
      if(!n.author || excluded.has(n.author)) return;
      if(!byAuthor[n.author]) byAuthor[n.author] = { name:n.author, total:0, count:0 };
      byAuthor[n.author].total += Number(n.rating) || 0;
      byAuthor[n.author].count += 1;
    });
    const ranked = Object.values(byAuthor).map(x => ({ name:x.name, avg: x.total / x.count, count:x.count }));
    ranked.sort((a,b) => b.avg - a.avg);
    return ranked;
  }

  function avatarColorFor(name){
    const found = demoLeaderboardPool.find(p => p.name === name);
    if(found) return found.color;
    if(name === currentUser.name) return 'var(--gold)';
    return 'var(--moss)';
  }
  function initialsFor(name){
    const found = demoLeaderboardPool.find(p => p.name === name);
    if(found) return found.initials;
    return String(name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  }

  function treeTeachingNotes(){ try{return JSON.parse(localStorage.getItem('eleaf_tree_notes')||'[]')}catch(e){return []} }
  function saveTreeTeachingNote(text){ const items=treeTeachingNotes(); items.unshift({id:Date.now(),text,createdAt:Date.now()}); localStorage.setItem('eleaf_tree_notes',JSON.stringify(items.slice(0,100))); }
  function openTreeTeachingNoteModal(){
    openModal('Add a teaching note',`<form data-modal-form><div class="field"><label>What do you want to remember?</label><textarea name="treeNote" required maxlength="500" placeholder="A tip to teach next, an explanation that worked, or an idea for a class…"></textarea></div><button type="submit" class="submit-btn">Plant teaching note</button></form>`,fd=>{const t=(fd.get('treeNote')||'').trim();if(!t)return;saveTreeTeachingNote(t);closeModal();renderTreeHome();showToast('Teaching note planted');});
  }
  function openTreeTeachingNotes(){ const items=treeTeachingNotes(); openModal('My teaching notes',items.length?`<div style="display:grid;gap:12px;max-height:55vh;overflow:auto">${items.map(i=>`<div class="journal-entry"><div class="journal-date">${new Date(i.createdAt).toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})}</div>${escapeHtml(i.text)}</div>`).join('')}</div>`:'<div class="empty-state">No teaching notes yet. Keep the first one small.</div>',null); }

  function renderTreeTeachingProgress(myClasses){
    const host=$('treeTeachingProgress'); if(!host) return;
    const units={Biology:['Photosynthesis','Cell membranes','Ecosystems','Genetics','Evolution'],'Environmental Science':['Ecosystems','Climate systems','Biodiversity','Conservation','Field methods']};
    const counts={}; myClasses.forEach(c=>counts[c.subject]=(counts[c.subject]||0)+1);
    host.innerHTML=currentTreeExpertise.map(subject=>{ const taught=Math.min(units[subject]?.length||5, counts[subject]||0); const list=(units[subject]||['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5']); const nextUnit=list[taught]||'All planned units taught'; return `<div class="tree-subject-progress"><div class="tree-subject-progress-head"><strong>${escapeHtml(subject)}</strong><span>${taught} of ${list.length} units taught</span></div><div class="tree-unit-track"><span style="width:${Math.round(taught/list.length*100)}%"></span></div><div class="tree-unit-next">${taught<list.length?'Next: '+escapeHtml(nextUnit):'Your teaching path is complete for now.'}</div></div>`; }).join('');
  }

  async function renderTreeHome(){
    const greet=$('treePersonalGreeting'); if(greet) greet.textContent=`${timeGreeting()}, ${(currentUser.name||'Almost').split(' ')[0]}.`;
    let notes=[], classes=[], questions=[]; try{notes=await getAllByPrefix('note:')}catch(e){} try{classes=await getAllByPrefix('class:')}catch(e){} try{questions=await getAllByPrefix('question:')}catch(e){}
    const myNotes=notes.filter(n=>n.author===currentUser.name);
    const myClasses=classes.filter(c=>c.teacher===currentUser.name);
    const taught=myClasses.length;
    const attended=classes.filter(c=>c.attended && c.teacher!==currentUser.name).length;
    const scheduled=myClasses.filter(c=>c.status==='scheduled').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    const next=scheduled[0];
    const q=questions.find(x=>!(x.answers||[]).some(a=>a.author===currentUser.name))||questions[0];
    if(next){ $('treeNextClassTitle').textContent=next.title; $('treeNextClassMeta').textContent=`${next.subject} · ${fmtDate(next.date,next.time)} · your class`; $('treeFocusTitle').textContent=`Preparing ${next.title}`; $('treeFocusDetail').textContent='Your next class is already on the calendar.'; }
    else { $('treeNextClassTitle').textContent='What would you like to teach next?'; $('treeNextClassMeta').textContent='Start with a class you already know well, or make space for a new idea.'; $('treeFocusTitle').textContent='Your next teaching step'; $('treeFocusDetail').textContent='Plant an idea, prepare a class, or help a Leaf.'; }
    const qn=treeQuickNote(); if($('treeQuickNote')) $('treeQuickNote').value=qn; if($('treeQuickNoteStatus')) $('treeQuickNoteStatus').textContent=qn?'Saved privately':'Private to you'; const tn=treeTeachingNotes(); const latest=tn[0];
    $('treeStats').innerHTML=`<div class="tree-stat"><strong>${taught}</strong><span>classes taught</span></div><div class="tree-stat"><strong>${attended}</strong><span>classes attended</span></div><div class="tree-stat"><strong>${myNotes.length}</strong><span>notes planted</span></div>`;
    renderTreeTeachingProgress(myClasses);
    const recent=classes.filter(c=>c.attended && c.teacher!==currentUser.name).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)).slice(0,3); $('treeTakenClasses').innerHTML=recent.length?recent.map(c=>`<div class="tree-class-row"><strong>${escapeHtml(c.title)}</strong><span>${escapeHtml(c.subject||'Class')} · ${fmtDate(c.date,c.time)}</span></div>`).join(''):'<div class="tree-workspace-meta">No attended classes recorded yet. Keep learning from other Trees.</div>';
    const others=classes.filter(c=>c.teacher!==currentUser.name && c.status!=='ended').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,2);
    $('treeOtherClasses').innerHTML=others.length?others.map(c=>`<div class="tree-other-class-row"><div><strong>${escapeHtml(c.title)}</strong><span>${escapeHtml(c.subject||'Class')} · ${fmtDate(c.date,c.time)} · by ${escapeHtml(c.teacher||'a Tree')}</span></div><button class="tree-mini-action" data-tree-leaf-class="${escapeHtml(c.id)}">${c.status==='live'?'Join now':'View class'}</button></div>`).join(''):'<div class="tree-workspace-meta">No other Tree classes are coming up yet.</div>';
    $('treeOwnNotesTitle').textContent=`${myNotes.length} note${myNotes.length===1?'':'s'} planted`; $('treeOwnNotesMeta').textContent=myNotes.length?'Your notes are part of the knowledge you leave behind. Review them and let the best ones grow.':'Your first note can be a simple explanation, tip, or idea for a future class.'; $('treeWaitingCount').textContent=`${[next,q,latest].filter(Boolean).length || 1} ${[next,q,latest].filter(Boolean).length===1?'thing':'things'} to tend to`;
  }

  on('leaderboardPreviewTree','click',(e)=>{ if(e.target.closest('[data-leaf-preview]')) showScreen('leaderboard'); });

  // ---- trees directory ----
  async function renderTreesDirectory(){
    const grid = $('treesGrid');
    if(!grid) return;
    const screenEl = $('screen-trees');
    if(screenEl){
      screenEl.classList.toggle('role-tree', currentRole === 'tree');
      const roleEl = screenEl.querySelector('.who .role');
      const avatarEl = screenEl.querySelector('.who .avatar');
      const titleEl = screenEl.querySelector('.list-head h1');
      const pillEl = screenEl.querySelector('.path-pill');
      if(roleEl) roleEl.textContent = currentRole === 'tree' ? 'Tree' : 'Leaf';
      if(avatarEl) avatarEl.style.background = currentRole === 'tree' ? 'var(--bark-deep)' : 'var(--moss-deep)';
      if(titleEl) titleEl.textContent = currentRole === 'tree' ? 'Meet other Trees' : 'Meet the Trees';
      if(pillEl) pillEl.textContent = currentRole === 'tree' ? 'MEET OTHER TREES' : 'MEET THE TREES';
    }
    const cards = demoTrees.map(t => `
      <div class="tree-card">
        <div class="tree-card-head">
          <div class="tavatar-lg" style="background:${t.color}">${escapeHtml(t.initials)}</div>
          <div><h3>${escapeHtml(t.name)}</h3></div>
        </div>
        <div class="expertise-row">${t.expertise.map(x => `<span class="exp-chip">${escapeHtml(x)}</span>`).join('')}</div>
        <div class="avail-line">Available: ${escapeHtml(t.availability)}</div>
        <div class="contact-line">Message through E-Leaf · No public contact details</div>
        <p style="font-size:0.82rem;color:var(--ink-soft);margin:0 0 16px;">${escapeHtml(t.bio)}</p>
        <button class="pill-btn" style="margin-top:0;" data-ask-tree="${escapeHtml(t.id)}">Ask a doubt</button>
      </div>
    `);
    if(currentRole === 'tree'){
      cards.push(`
        <div class="tree-card" style="outline:2px solid var(--gold);">
          <div class="tree-card-head">
            <div class="tavatar-lg" style="background:var(--bark-deep)">AF</div>
            <div><h3>${escapeHtml(currentUser.name)} <span style="font-size:0.72rem;color:var(--ink-soft);font-weight:500;">(You)</span></h3></div>
          </div>
          <div class="expertise-row">${currentTreeExpertise.map(x => `<span class="exp-chip">${escapeHtml(x)}</span>`).join('')}</div>
          <p style="font-size:0.82rem;color:var(--ink-soft);margin:0;">This is how learners see your profile.</p>
        </div>
      `);
    }
    grid.innerHTML = cards.join('');
  }
  on('treesGrid', 'click', (e) => {
    const btn = e.target.closest('[data-ask-tree]');
    if(!btn) return;
    const tree = demoTrees.find(t => t.id === btn.dataset.askTree);
    if(tree) openChat(tree);
  });

  // ---- chat (Ask a doubt) ----
  let currentChatTree = null;
  function openChat(tree){
    currentChatTree = tree;
    const av = $('chatAvatar');
    if(av){ av.style.background = tree.color; av.textContent = tree.initials; }
    $('chatTreeName') && ($('chatTreeName').textContent = tree.name);
    showScreen('chat');
  }
  async function renderChatMessages(){
    const host = $('chatMessages');
    if(!host || !currentChatTree) return;
    const key = 'chat:' + currentChatTree.id;
    let thread = [];
    try{ const r = await store.get(key); if(r && r.value) thread = JSON.parse(r.value); }catch(e){}
    if(thread.length === 0){
      thread = [{ from:'them', text:`Hi! Ask me anything about ${currentChatTree.expertise[0] || 'the subject'}.`, ts:Date.now() }];
    }
    host.innerHTML = thread.map(m => `<div class="chat-bubble ${m.from === 'me' ? 'me' : 'them'}">${escapeHtml(m.text)}</div>`).join('');
    host.scrollTop = host.scrollHeight;
  }
  async function sendChatMessage(){
    const input = $('chatInput');
    if(!input || !currentChatTree) return;
    const text = input.value.trim();
    if(!text) return;
    const key = 'chat:' + currentChatTree.id;
    let thread = [];
    try{ const r = await store.get(key); if(r && r.value) thread = JSON.parse(r.value); }catch(e){}
    if(thread.length === 0) thread = [{ from:'them', text:`Hi! Ask me anything about ${currentChatTree.expertise[0] || 'the subject'}.`, ts:Date.now() }];
    thread.push({ from:'me', text, ts:Date.now() });
    await store.set(key, JSON.stringify(thread));
    input.value = '';
    renderChatMessages();
    const treeForReply = currentChatTree;
    setTimeout(async () => {
      let t2 = [];
      try{ const r2 = await store.get(key); if(r2 && r2.value) t2 = JSON.parse(r2.value); }catch(e){}
      t2.push({ from:'them', text: "Thanks for asking  -  I'll walk through it in our next class, or reply here shortly!", ts:Date.now() });
      await store.set(key, JSON.stringify(t2));
      if(currentChatTree && currentChatTree.id === treeForReply.id) renderChatMessages();
    }, 1000);
  }
  on('chatSendBtn', 'click', sendChatMessage);
  on('chatInput', 'keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); sendChatMessage(); } });

  // ---- questions & answers ----
  async function renderQuestions(){
    const host = $('questionsList');
    if(!host) return;
    const screenEl = $('screen-questions');
    if(screenEl) screenEl.classList.toggle('role-tree', currentRole === 'tree');
    $('questionsRoleText') && ($('questionsRoleText').textContent = currentRole === 'tree' ? 'Tree' : 'Leaf');
    $('questionsAvatar') && ($('questionsAvatar').style.background = currentRole === 'tree' ? 'var(--bark-deep)' : 'var(--moss-deep)');
    $('questionsTitle') && ($('questionsTitle').textContent = currentRole === 'tree' ? 'Questions You Posted' : 'Questions from Trees');
    const postBtn = $('postQuestionBtn');
    if(postBtn) postBtn.style.display = currentRole === 'tree' ? 'inline-block' : 'none';

    let questions = [];
    try{ questions = await getAllByPrefix('question:'); }catch(e){ questions = []; }
    questions.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    if(currentRole === 'tree'){ questions = questions.filter(q => q.teacher === currentUser.name); }

    if(questions.length === 0){
      host.innerHTML = currentRole === 'tree'
        ? "<div class=\"empty-state\">You haven't posted a question yet.</div>"
        : '<div class="empty-state">No open questions right now  -  check back soon.</div>';
      return;
    }
    host.innerHTML = questions.map(q => {
      const answers = q.answers || [];
      const answersHtml = answers.length
        ? `<div class="answers-list">${answers.map(a => `<div class="answer-row"><span class="a-author">${escapeHtml(a.author)}:</span>${escapeHtml(a.text)}</div>`).join('')}</div>`
        : `<div style="font-size:0.82rem;color:var(--ink-soft);margin-bottom:12px;">No answers yet.</div>`;
      const answerForm = currentRole === 'leaf'
        ? `<form class="answer-form" data-answer-form="${escapeHtml(q.id)}">
             <label class="answer-label">Your answer</label>
             <textarea name="answer" rows="3" placeholder="Explain what you know in a few clear sentences..." required></textarea>
             <div class="answer-form-footer"><span>Helping here counts toward your Tree path.</span><button type="submit">Share answer</button></div>
           </form>`
        : '';
      return `
        <div class="question-card">
          <div class="q-eyebrow">${escapeHtml((q.subject||'General').toUpperCase())}</div>
          <h3>${escapeHtml(q.title)}</h3>
          <div class="q-body">${escapeHtml(q.body || '')}</div>
          <div class="q-meta">Asked by ${escapeHtml(q.teacher)} · ${answers.length} answer${answers.length === 1 ? '' : 's'}</div>
          ${answersHtml}
          ${answerForm}
        </div>
      `;
    }).join('');
  }
  on('questionsList', 'submit', async (e) => {
    const form = e.target.closest('[data-answer-form]');
    if(!form) return;
    e.preventDefault();
    const qId = form.dataset.answerForm;
    const input = form.querySelector('textarea[name="answer"], input[name="answer"]');
    const text = ((input && input.value) || '').trim();
    if(!text) return;
    const r = await store.get('question:' + qId);
    if(!r || !r.value) return;
    const q = JSON.parse(r.value);
    q.answers = q.answers || [];
    q.answers.push({ id:'a' + Date.now(), author: currentUser.name, text, createdAt: Date.now() });
    await store.set('question:' + qId, JSON.stringify(q));
    await markProgress('helped');
    showToast('Answer submitted. You helped another learner grow.');
    renderQuestions();
  });

  function openPostQuestionModal(){
    openModal('Post a question', `
      <form data-modal-form>
        <div class="field"><label>Subject</label>
          <select name="subject" required>${currentTreeExpertise.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}</select>
        </div>
        <div class="field"><label>Question title</label><input name="title" required placeholder="Keep it short and specific"></div>
        <div class="field"><label>Details</label><textarea name="body" placeholder="Add any context that helps Leaves answer well"></textarea></div>
        <button type="submit" class="submit-btn">Post question</button>
      </form>
    `, async (fd) => {
      const q = {
        id: 'q' + Date.now(),
        subject: (fd.get('subject') || 'General').trim(),
        title: (fd.get('title') || 'Untitled question').trim(),
        body: (fd.get('body') || '').trim(),
        teacher: currentUser.name,
        createdAt: Date.now(),
        answers: []
      };
      await store.set('question:' + q.id, JSON.stringify(q));
      closeModal();
      showToast('Question posted  -  Leaves can answer it now');
      showScreen('questions');
    });
  }

  // ---- leaderboard ----
  async function renderLeaderboard(){
    const host = $('leaderboardList');
    if(!host) return;
    const screenEl = $('screen-leaderboard');
    if(screenEl) screenEl.classList.toggle('role-tree', currentRole === 'tree');
    $('leaderboardRoleText') && ($('leaderboardRoleText').textContent = currentRole === 'tree' ? 'Tree' : 'Leaf');
    $('leaderboardAvatar') && ($('leaderboardAvatar').style.background = currentRole === 'tree' ? 'var(--bark-deep)' : 'var(--moss-deep)');

    let questions = [];
    try{ questions = await getAllByPrefix('question:'); }catch(e){ questions = []; }
    const counts = {};
    questions.forEach(q => (q.answers || []).forEach(a => {
      counts[a.author] = (counts[a.author] || 0) + 1;
    }));
    if(currentUser.name && !counts[currentUser.name]) counts[currentUser.name] = 0;
    const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]);

    host.innerHTML = `
      <div class="side-card" style="max-width:640px;">
        <div class="eyebrow">RECOGNITION, NOT RANKING</div>
        <h3 style="font-family:'Fraunces',serif;font-weight:500;font-size:1.25rem;margin:0 0 8px;">People who helped others recently</h3>
        <p style="font-size:.84rem;color:var(--ink-soft);line-height:1.55;margin:0 0 18px;">A quiet record of useful contributions: answering, explaining, and helping someone move forward.</p>
        ${entries.length ? entries.slice(0,8).map(([name,count]) => `
          <div class="mini-leaf-card" style="margin-top:10px;">
            <div class="lavatar" style="background:${avatarColorFor(name)}">${escapeHtml(initialsFor(name))}</div>
            <div><div class="lname">${escapeHtml(name)}${name===currentUser.name?' (You)':''}</div><div class="lb-sub">${count} helpful answer${count===1?'':'s'}</div></div>
          </div>`).join('') : '<div class="empty-state">No answers yet. Help is the first contribution.</div>'}
      </div>`;
  }

  function openAddNoteModal(){
    openModal('Plant a note', `
      <form data-modal-form>
        <div class="field"><label>Subject</label><input name="subject" required placeholder="e.g. Biology"></div>
        <div class="field"><label>Title</label><input name="title" required placeholder="Note title"></div>
        <div class="field"><label>Description</label><textarea name="description" placeholder="What's this note about?"></textarea></div>
        <button type="submit" class="submit-btn">Plant note</button>
      </form>
    `, async (fd) => {
      const note = {
        id: 'n' + Date.now(),
        subject: (fd.get('subject') || 'General').trim(),
        title: (fd.get('title') || 'Untitled note').trim(),
        description: (fd.get('description') || '').trim(),
        author: currentUser.name,
        rating: 0,
        createdAt: Date.now()
      };
      await store.set('note:' + note.id, JSON.stringify(note));
      await markProgress('shared');
      closeModal();
      showToast('Note planted 🌱');
      renderNotes();
      renderNotesFull();
      renderTreeHome();
    });
  }

  function treeQuickNote(){ try{return localStorage.getItem('eleaf_tree_quick_note')||''}catch(e){return ''} }
  function saveTreeQuickNoteValue(text){ try{localStorage.setItem('eleaf_tree_quick_note',text)}catch(e){} }

  async function renderPlanLesson(){
    const grid=$('planCalendarGrid'); if(!grid) return;
    const now=new Date(); if(!window._treePlanMonth) window._treePlanMonth=new Date(now.getFullYear(),now.getMonth(),1);
    const month=window._treePlanMonth; const y=month.getFullYear(), m=month.getMonth(); $('planMonthLabel').textContent=month.toLocaleDateString(undefined,{month:'long',year:'numeric'});
    let classes=[]; try{classes=await getAllByPrefix('class:')}catch(e){}
    const own=classes.filter(c=>c.teacher===currentUser.name);
    const first=new Date(y,m,1); const start=(first.getDay()+6)%7; const days=new Date(y,m+1,0).getDate(); let html='';
    for(let i=0;i<start;i++) html+='<span class="tree-calendar-day empty"></span>';
    for(let d=1;d<=days;d++){ const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; const count=own.filter(c=>c.date===ds).length; html+=`<button class="tree-calendar-day${count?' has-class':''}" data-plan-date="${ds}"><span>${d}</span>${count?`<i>${count}</i>`:''}</button>`; }
    grid.innerHTML=html;
    const list=$('treeLessonPlanList'); list.innerHTML=currentTreeExpertise.map(subject=>`<div class="tree-lesson-row"><strong>${escapeHtml(subject)}</strong><span>5-unit teaching path</span></div>`).join('');
    const upcoming=own.filter(c=>c.status!=='ended').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,3); $('treePlanUpcoming').innerHTML=upcoming.length?upcoming.map(c=>`<div class="tree-plan-upcoming-row"><strong>${escapeHtml(c.title)}</strong><span>${fmtDate(c.date,c.time)}</span></div>`).join(''):'<div class="tree-workspace-meta">Nothing planned yet.</div>';
  }

  // ---- classes ----
  function normalizeClassStatus(c){
    if(c?.demo) return 'scheduled';
    if(!c || !c.date || !c.time) return c?.status || 'scheduled';
    const start = new Date(c.date + 'T' + c.time);
    if(isNaN(start.getTime())) return c.status || 'scheduled';
    const now = Date.now();
    const end = start.getTime() + 60*60*1000;
    if(now >= start.getTime() && now < end) return 'live';
    if(now >= end) return 'ended';
    return 'scheduled';
  }
  async function renderClasses(){
    const list = $('classList');
    if(!list) return;
    const screenEl = $('screen-classes');
    if(screenEl) screenEl.classList.toggle('role-tree', currentRole === 'tree');

    const pill = $('classesRolePill');
    if(pill){
      pill.textContent = currentRole === 'tree' ? 'ALL CLASSES' : 'ALL CLASSES';
      pill.style.background = currentRole === 'tree' ? 'var(--bark-pale)' : '';
      pill.style.color = currentRole === 'tree' ? 'var(--bark-deep)' : '';
    }
    const roleText = $('classesRoleText');
    if(roleText) roleText.textContent = currentRole === 'tree' ? 'Tree' : 'Leaf';
    const avatar = $('classesAvatar');
    if(avatar) avatar.style.background = currentRole === 'tree' ? 'var(--bark-deep)' : 'var(--moss-deep)';
    const scheduleBtn = $('scheduleClassBtn');
    if(scheduleBtn) scheduleBtn.style.display = currentRole === 'tree' ? 'inline-block' : 'none';
    const classGrowth=$('classesNavGrowth');
    if(classGrowth) classGrowth.style.display = currentRole === 'tree' ? 'none' : '';
    const classTrees=$('classesNavTrees');
    if(classTrees) classTrees.style.display = currentRole === 'tree' ? 'none' : '';
    const treeLinks=$('classesTreeLinks');
    if(treeLinks) treeLinks.classList.toggle('show', currentRole === 'tree');

    let classes = [];
    try{ classes = await getAllByPrefix('class:'); }catch(e){ classes = []; }
    classes = classes.map(c => ({...c, status: normalizeClassStatus(c)}));
    classes.sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));

    if(classes.length === 0){
      list.innerHTML = '<div class="empty-state">No classes yet.</div>';
      return;
    }

    function actionsFor(c){
      const isOwnClass = c.teacher === currentUser.name;
      if(currentRole === 'tree'){
        if(isOwnClass){
          if(c.status === 'scheduled') return `<button class="pill-btn" style="margin-top:0;background:var(--bark-deep);" data-start-class="${escapeHtml(c.id)}">Start class</button>`;
          if(c.status === 'live') return `<button class="pill-btn" style="margin-top:0;background:var(--bark-deep);" data-rejoin-class="${escapeHtml(c.id)}">Rejoin</button>`;
          return `<span style="font-size:0.8rem;color:var(--ink-soft);">Completed</span>`;
        }
        if(c.status === 'ended') return `<span style="font-size:0.8rem;color:var(--ink-soft);">Completed</span>`;
        return `<button class="pill-btn" style="margin-top:0;background:var(--ink-soft);" data-learn-class="${escapeHtml(c.id)}">${c.status === 'live' ? 'Join as Leaf' : 'Learn as Leaf'}</button>`;
      }
      if(c.demo) return c.attended
        ? `<button class="pill-btn demo-attend-btn attended" style="margin-top:0;" disabled>✓ Attended</button>`
        : `<button class="pill-btn demo-attend-btn" style="margin-top:0;" data-demo-attend="${escapeHtml(c.id)}">✓ Attend demo</button>`;
      if(c.status === 'live') return `<button class="pill-btn" style="margin-top:0;" data-join-class="${escapeHtml(c.id)}">Join now</button>`;
      if(c.status === 'scheduled') return `<span style="font-size:0.8rem;color:var(--ink-soft);">Reminders unavailable in demo</span>`;
      return `<span style="font-size:0.8rem;color:var(--ink-soft);">Completed</span>`;
    }

    function cardHtml(c){
      const badge = `<span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(c.status)}</span>`;
      return `
        <div class="class-card">
          <div>
            <div class="cc-title">${escapeHtml(c.title)}</div>
            <div class="cc-meta">${escapeHtml(c.subject)} · ${fmtDate(c.date, c.time)} · by ${escapeHtml(c.teacher)}</div>
          </div>
          <div class="class-actions">${badge}${actionsFor(c)}</div>
        </div>
      `;
    }

    const live = classes.filter(c => c.status === 'live');
    const upcoming = classes.filter(c => c.status === 'scheduled');
    const ended = classes.filter(c => c.status === 'ended');

    const sections = [];
    if(live.length) sections.push(`<div class="class-section"><div class="class-section-title"><span class="dot live"></span>Live Now</div><div class="class-list">${live.map(cardHtml).join('')}</div></div>`);
    sections.push(`<div class="class-section"><div class="class-section-title"><span class="dot upcoming"></span>Upcoming</div><div class="class-list">${upcoming.length ? upcoming.map(cardHtml).join('') : '<div class="empty-state">Nothing scheduled yet.</div>'}</div></div>`);
    if(ended.length) sections.push(`<div class="class-section"><div class="class-section-title"><span class="dot ended"></span>Completed</div><div class="class-list">${ended.map(cardHtml).join('')}</div></div>`);

    list.innerHTML = sections.join('');
  }

  on('classList', 'click', async (e) => {
    const t = e.target.closest('button');
    if(!t) return;
    if(t.dataset.demoAttend){
      const r = await store.get('class:' + t.dataset.demoAttend);
      if(r && r.value){
        const c = JSON.parse(r.value);
        c.attended = true;
        await store.set('class:' + c.id, JSON.stringify(c));
      }
      await markProgress('learned');
      showToast('Demo class attended  -  Learn step complete.');
      renderClasses();
      return;
    }
    if(t.dataset.startClass) startClass(t.dataset.startClass);
    else if(t.dataset.joinClass) joinClass(t.dataset.joinClass);
    else if(t.dataset.rejoinClass) joinClass(t.dataset.rejoinClass);
    else if(t.dataset.blockedJoin) showToast('You must join classes as a Leaf');
    else if(t.dataset.learnClass){ currentRole='leaf'; joinClass(t.dataset.learnClass); }
  });

  async function startClass(id){
    const r = await store.get('class:' + id);
    if(!r || !r.value) return;
    const c = JSON.parse(r.value);
    c.status = 'live';
    await store.set('class:' + id, JSON.stringify(c));
    openLiveClass(c, true);
  }
  async function joinClass(id){
    const r = await store.get('class:' + id);
    if(!r || !r.value) return;
    const c = JSON.parse(r.value);
    if(c.status !== 'live'){ showToast("This class hasn't started yet"); return; }
    await markProgress('learned');
    openLiveClass(c, false);
  }

  function openScheduleClassModal(){
    openModal('Plan a lesson', `
      <form data-modal-form>
        <div class="field"><label>Class title</label><input name="title" required placeholder="e.g. Intro to Ecosystems"></div>
        <div class="field"><label>Subject</label>
          <select name="subject" required>${currentTreeExpertise.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}</select>
        </div>
        <div class="field-row">
          <div class="field"><label>Date</label><input name="date" type="date" min="${new Date().toISOString().slice(0,10)}" required></div>
          <div class="field"><label>Time</label><input name="time" type="time" required></div>
        </div>
        <button type="submit" class="submit-btn">Add to teaching calendar</button>
      </form>
    `, async (fd) => {
      const c = {
        id: 'c' + Date.now(),
        title: (fd.get('title') || 'Untitled class').trim(),
        subject: (fd.get('subject') || 'General').trim(),
        date: fd.get('date') || '',
        time: fd.get('time') || '',
        teacher: currentUser.name,
        status: 'scheduled'
      };
      await store.set('class:' + c.id, JSON.stringify(c));
      closeModal();
      showToast('Lesson added to your teaching calendar');
      showScreen('classes');
    });
  }

  function openQuickStartModal(){
    openModal('Start a class now', `
      <form data-modal-form>
        <div class="field"><label>Class title</label><input name="title" required placeholder="e.g. Quick Q&amp;A: Photosynthesis"></div>
        <div class="field"><label>Subject</label>
          <select name="subject" required>${currentTreeExpertise.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}</select>
        </div>
        <button type="submit" class="submit-btn">Go live</button>
      </form>
    `, async (fd) => {
      const today = new Date();
      const c = {
        id: 'c' + Date.now(),
        title: (fd.get('title') || 'Live class').trim(),
        subject: (fd.get('subject') || 'General').trim(),
        date: today.toISOString().slice(0,10),
        time: today.toTimeString().slice(0,5),
        teacher: currentUser.name,
        status: 'live'
      };
      await store.set('class:' + c.id, JSON.stringify(c));
      closeModal();
      openLiveClass(c, true);
    });
  }

  function openLiveClass(c, isTeacher){
    liveContext = { classId: c.id, isTeacher };
    const titleEl = $('liveClassTitle'); if(titleEl) titleEl.textContent = c.title;
    const actionTitle = $('liveActionTitle'); if(actionTitle) actionTitle.textContent = isTeacher ? 'You are teaching' : 'You are attending';
    const actionDesc = $('liveActionDesc');
    if(actionDesc) actionDesc.textContent = isTeacher
      ? 'End the demo class when you are done. No attendee notifications are sent.'
      : 'This is a demo session  -  no real video or audio is connected yet.';
    const endBtn = $('liveEndBtn'); if(endBtn) endBtn.textContent = isTeacher ? 'End class' : 'Leave class';
    const liveScreenEl = $('screen-live-class');
    if(liveScreenEl) liveScreenEl.classList.toggle('role-tree', isTeacher);
    const attendeesHost = $('liveAttendees');
    if(attendeesHost){
      const demoNames = isTeacher ? ['Maya Chen', 'Rohan Iyer', 'Sara Malik'] : [c.teacher, 'Maya Chen'];
      attendeesHost.innerHTML = demoNames.map(n => `<div class="attendee-row"><span class="adot"></span>${escapeHtml(n)}</div>`).join('');
    }
    showScreen('liveClass');
  }

  on('liveEndBtn', 'click', async () => {
    if(liveContext && liveContext.isTeacher){
      const r = await store.get('class:' + liveContext.classId);
      if(r && r.value){
        const c = JSON.parse(r.value);
        c.status = 'ended';
        await store.set('class:' + c.id, JSON.stringify(c));
      }
      showToast('Class ended');
    } else {
      showToast('You left the class');
    }
    liveContext = null;
    showScreen(currentRole === 'tree' ? 'tree' : 'leaf');
  });
  on('liveBackToClasses', 'click', () => showScreen('classes'));

  // ---- students ----
  function renderStudents(){
    const grid = $('studentsGrid');
    if(!grid) return;
    grid.innerHTML = demoStudents.map(s => `
      <div class="student-card">
        <div class="savatar" style="background:${s.color}">${escapeHtml(s.initials)}</div>
        <div style="flex:1;">
          <h4>${escapeHtml(s.name)}</h4>
          <div class="ssubject">${escapeHtml(s.subject)}</div>
          <div class="student-activity-grid" aria-label="${escapeHtml(s.name)} learning activity">
            <div><strong>${s.classes}</strong><span>classes taken</span></div>
            <div><strong>${s.answered}</strong><span>questions answered</span></div>
            <div><strong>${s.doubts}</strong><span>doubts asked</span></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ---- generic modal ----
  let modalSubmitHandler = null;
  function openModal(title, bodyHtml, onSubmit){
    const modal=$('modal');
    if(modal){ modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-labelledby','modalTitle'); }
    const t = $('modalTitle'); if(t) t.textContent = title;
    const body = $('modalBody'); if(body) body.innerHTML = bodyHtml;
    modalSubmitHandler = onSubmit;
    $('modalScrim') && $('modalScrim').classList.add('show');
    $('modal') && $('modal').classList.add('show');
  }
  function closeModal(){
    $('modalScrim') && $('modalScrim').classList.remove('show');
    $('modal') && $('modal').classList.remove('show');
    modalSubmitHandler = null;
  }
  on('modalClose', 'click', closeModal);
  on('modalScrim', 'click', closeModal);
  on('modal', 'submit', (e) => {
    e.preventDefault();
    if(e.target && e.target.matches('[data-modal-form]') && modalSubmitHandler){
      modalSubmitHandler(new FormData(e.target));
    }
  });

  on('addReflectionBtn','click',openReflectionModal);
  on('viewJournalBtn','click',openJournalModal);
  on('continueLearningBtn','click',()=>showScreen('classes'));
  on('openSavedNoteBtn','click',()=>{ activeNotesView='saved'; showScreen('notesFull'); document.querySelectorAll('.notes-view-tab').forEach(b=>b.classList.toggle('active',b.dataset.notesView==='saved')); });
  on('helpQuestionBtn','click',()=>showScreen('questions'));
  on('notesFullList','click',(e)=>{ const b=e.target.closest('[data-save-note]'); if(!b)return; toggleSavedNote(b.dataset.saveNote); renderNotesFull(); renderPersonalHome(); });
  document.addEventListener('click',(e)=>{ const b=e.target.closest('.notes-view-tab'); if(!b)return; activeNotesView=b.dataset.notesView; document.querySelectorAll('.notes-view-tab').forEach(x=>x.classList.toggle('active',x===b)); renderNotesFull(); });


  // ---- persistent Quick Notes assistant ----
  let quickNotesViewRole = 'leaf';
  function quickNotesForRole(role){
    try{
      if(role==='tree'){
        let items=JSON.parse(localStorage.getItem('eleaf_tree_quick_notes')||'[]');
        if(!Array.isArray(items)) items=[];
        const legacy=localStorage.getItem('eleaf_tree_quick_note')||'';
        if(legacy && !items.some(x=>x.text===legacy)) items.unshift({id:'legacy-tree',text:legacy,createdAt:Date.now()});
        return items;
      }
      return quickLeafNotes();
    }catch(e){return []}
  }
  function saveAssistantQuickNote(role,text){
    if(role==='tree'){
      const items=quickNotesForRole('tree').filter(x=>x.id!=='legacy-tree');
      items.unshift({id:Date.now(),text,createdAt:Date.now()});
      localStorage.setItem('eleaf_tree_quick_notes',JSON.stringify(items.slice(0,100)));
      localStorage.setItem('eleaf_tree_quick_note',text);
    }else saveQuickLeafNoteText(text);
  }
  function renderQuickNotesAssistant(){
    const host=$('quickNotesList'); if(!host) return;
    document.querySelectorAll('.quick-notes-tab').forEach(b=>b.classList.toggle('active',b.dataset.quickRole===quickNotesViewRole));
    if($('quickNotesRoleHint')) $('quickNotesRoleHint').textContent=`Saving to ${quickNotesViewRole==='tree'?'Tree':'Leaf'} notes`;
    const items=quickNotesForRole(quickNotesViewRole);
    host.innerHTML=items.length?items.map(i=>`<div class="quick-note-item"><div class="quick-note-item-time">${new Date(i.createdAt||Date.now()).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</div><div class="quick-note-item-text">${escapeHtml(i.text||'')}</div></div>`).join(''):'<div class="quick-notes-empty">No quick notes here yet.</div>';
  }
  function syncQuickNotesAssistant(screenName){
    const wrap=$('quickNotesAssistant'); if(!wrap) return;
    const appScreens=['leaf','tree','classes','students','planLesson','notesFull','trees','chat','questions','leaderboard','progress','discussion','liveClass','becomeTree'];
    wrap.classList.toggle('visible',appScreens.includes(screenName));
    if(!appScreens.includes(screenName)) wrap.classList.remove('open');
    quickNotesViewRole=currentRole==='tree'?'tree':'leaf';
    renderQuickNotesAssistant();
  }
  on('quickNotesFab','click',()=>{ const w=$('quickNotesAssistant'); if(!w)return; w.classList.toggle('open'); quickNotesViewRole=currentRole==='tree'?'tree':'leaf'; renderQuickNotesAssistant(); if(w.classList.contains('open')) setTimeout(()=>$('quickNotesInput')?.focus(),60); });
  on('quickNotesClose','click',()=> $('quickNotesAssistant')?.classList.remove('open'));
  on('quickNotesSave','click',()=>{ const box=$('quickNotesInput'); const text=(box?.value||'').trim(); if(!text){showToast('Write something first.');return;} saveAssistantQuickNote(quickNotesViewRole,text); box.value=''; renderQuickNotesAssistant(); showToast('Quick note kept.'); });
  document.addEventListener('click',e=>{ const b=e.target.closest('.quick-notes-tab'); if(!b)return; quickNotesViewRole=b.dataset.quickRole; renderQuickNotesAssistant(); });

  // Keep Leaf/Tree identity visible in the top-left logo on every app page.
  function syncRoleLogo(screenName){
    const screen=screens[screenName]; if(!screen) return;
    const icon=currentRole==='tree'?'#ic-tree':'#ic-leaf';
    const roleColor=currentRole==='tree'?'var(--bark-deep)':'var(--moss-deep)';
    const logo=screen.querySelector('.dash-logo svg use');
    const svg=screen.querySelector('.dash-logo svg');
    if(logo){ logo.setAttribute('href',icon); logo.setAttribute('xlink:href',icon); }
    if(svg) svg.style.color=roleColor;
    // Carry the quiet Leaf/Tree identity into secondary pages too, without duplicating an existing home watermark.
    const main=screen.querySelector('.dash-main');
    if(main && !main.querySelector('.watermark')){
      let mark=main.querySelector('.persistent-role-mark');
      if(!mark){ mark=document.createElement('div'); mark.className='persistent-role-mark'; mark.innerHTML='<svg><use></use></svg>'; main.prepend(mark); }
      const use=mark.querySelector('use'); use.setAttribute('href',icon); use.setAttribute('xlink:href',icon); mark.style.color=roleColor;
    }
  }

  // ---- navigation bindings for the new screens ----
  on('navHomeLeaf', 'click', () => showScreen('leaf'));
  on('navDiscussionLeaf','click',()=>showScreen('discussion'));
  on('navProgressLeaf','click',()=>showScreen('progress'));
  on('openDiscussionBtn','click',()=>showScreen('discussion'));
  on('seeAllProgressBtn','click',()=>showScreen('progress'));
  on('homeAllClassesBtn','click',()=>showScreen('classes'));
  on('homeClassPrimaryBtn','click',()=>showScreen('classes'));
  on('saveQuickLeafNote','click',()=>{ const box=$('quickLeafNote'); const text=(box?.value||'').trim(); if(!text){showToast('Write something first.');return;} saveQuickLeafNoteText(text); box.value=''; if($('quickLeafNoteStatus')) $('quickLeafNoteStatus').textContent='Saved to your private quick notes'; showToast('Quick note kept.'); });
  on('startDiscussionBtn','click',()=>openModal('Start a discussion',`<form data-modal-form><div class="field"><label>Topic</label><input name="topic" required maxlength="120" placeholder="What do you want to work out together?"></div><div class="field"><label>Context</label><textarea name="body" required maxlength="500" placeholder="Add enough context for other Leaves to join in."></textarea></div><button type="submit" class="submit-btn">Start discussion</button></form>`,fd=>{ leafDiscussions.unshift({title:(fd.get('topic')||'').trim(),subject:'General',author:currentUser.name||'You',replies:0,body:(fd.get('body')||'').trim()}); closeModal(); renderDiscussionPage(); renderDiscussionPreview(); showToast('Discussion started.'); }));
  on('navNotesLeaf', 'click', () => { activeNotesView='mine'; showScreen('notesFull'); });
  on('navClassesLeaf', 'click', () => { currentRole = 'leaf'; showScreen('classes'); });
  on('classesNavNotes', 'click', () => showScreen('notesFull'));
  on('classesNavClasses', 'click', () => showScreen('classes'));
  on('classesNavTrees', 'click', () => showScreen('trees'));
  on('classesNavQuestions', 'click', () => showScreen('questions'));
  on('classesNavGrowth', 'click', () => showScreen('becomeTree'));
  on('classesTreeTake', 'click', openQuickStartModal);
  on('classesTreeUpload', 'click', openAddNoteModal);
  on('classesTreeSchedule', 'click', openScheduleClassModal);
  on('classesTreeStudents', 'click', () => showScreen('students'));
  on('classesTreePost', 'click', openPostQuestionModal);
  on('addNoteBtnLeaf', 'click', openAddNoteModal);


  on('navHomeTree', 'click', () => showScreen('tree'));
  on('navTakeClass', 'click', openQuickStartModal);
  on('cardTakeClass', 'click', openQuickStartModal);
  on('welcomeTakeClass', 'click', openQuickStartModal);
  on('navUploadNotes', 'click', openAddNoteModal);
  on('cardUploadNotes', 'click', openAddNoteModal);
  on('navScheduleClass', 'click', () => showScreen('planLesson'));
  on('cardScheduleClass', 'click', openScheduleClassModal);
  on('navStudents', 'click', () => showScreen('students'));
  on('cardStudents', 'click', () => showScreen('students'));
  on('navNotesTree', 'click', () => { activeNotesView='mine'; showScreen('notesFull'); });
  on('navClassesTree', 'click', () => showScreen('classes'));
  on('navPostQuestion', 'click', openPostQuestionModal);
  on('cardPostQuestion', 'click', openPostQuestionModal);
  on('treePlanLessonBtn','click',()=>showScreen('planLesson'));
  on('treeScheduleNextBtn','click',()=>showScreen('planLesson'));
  on('planNewLessonBtn','click',openScheduleClassModal);
  on('planPrevMonth','click',()=>{const d=window._treePlanMonth||new Date(); window._treePlanMonth=new Date(d.getFullYear(),d.getMonth()-1,1); renderPlanLesson();});
  on('planNextMonth','click',()=>{const d=window._treePlanMonth||new Date(); window._treePlanMonth=new Date(d.getFullYear(),d.getMonth()+1,1); renderPlanLesson();});
  on('treePostQuestionBtn','click',openPostQuestionModal);
  on('treeNextClassBtn','click',()=>showScreen('classes'));
  on('treeQuickNote','input',()=>{ const v=$('treeQuickNote').value.trim(); saveTreeQuickNoteValue(v); $('treeQuickNoteStatus').textContent=v?'Saved privately':'Private to you'; });
  on('saveTreeQuickNote','click',()=>{ const v=($('treeQuickNote').value||'').trim(); saveTreeQuickNoteValue(v); $('treeQuickNoteStatus').textContent=v?'Saved privately':'Private to you'; showToast(v?'Teaching note saved':'Write a note first'); });
  document.addEventListener('click',async(e)=>{ const b=e.target.closest('[data-tree-leaf-class]'); if(!b)return; const r=await store.get('class:'+b.dataset.treeLeafClass); if(!r||!r.value)return; const c=JSON.parse(r.value); currentRole='leaf'; if(c.status==='live') joinClass(c.id); else showScreen('classes'); });
  on('addTreeNoteBtn', 'click', openTreeTeachingNoteModal);
  on('viewTreeNotesBtn', 'click', openTreeTeachingNotes);
  on('treeTeachNextBtn', 'click', openQuickStartModal);
  on('treeHelpQuestionBtn', 'click', () => showScreen('questions'));
  on('treeSeeClassesBtn', 'click', () => showScreen('classes'));
  on('treeReviewNotesBtn', 'click', () => { activeNotesView='mine'; showScreen('notesFull'); });

  // ---- Notes (full), Trees directory, Chat, Questions, Leaderboard navigation ----
  on('seeMoreNotesLeaf', 'click', () => showScreen('notesFull'));
  on('seeMoreNotesTree', 'click', () => showScreen('notesFull'));
  on('seeMoreSubjectsLeaf', 'click', () => showScreen('notesFull'));
  on('seeMoreClassesLeaf', 'click', () => showScreen('classes'));
  on('seeMoreClassesTree', 'click', () => showScreen('classes'));
  on('seeMoreTreesLeaf', 'click', () => showScreen('trees'));
  on('seeMoreLeaderboardTree', 'click', () => showScreen('leaderboard'));
  on('navTreesLeaf', 'click', () => showScreen('trees'));
  on('navQuestionsLeaf', 'click', () => showScreen('questions'));
  on('navLeaderboardLeaf', 'click', () => showScreen('leaderboard'));
  on('navLeaderboardTree', 'click', () => showScreen('leaderboard'));
  on('addNoteBtnFull', 'click', openAddNoteModal);
  on('postQuestionBtn', 'click', openPostQuestionModal);

  on('notesFullBackHome', 'click', () => showScreen(currentRole === 'tree' ? 'tree' : 'leaf'));
  on('treesBackHome', 'click', () => showScreen(currentRole === 'tree' ? 'tree' : 'leaf'));
  on('chatBackToTrees', 'click', () => showScreen('trees'));
  on('questionsBackHome', 'click', () => showScreen(currentRole === 'tree' ? 'tree' : 'leaf'));
  on('leaderboardBackHome', 'click', () => showScreen(currentRole === 'tree' ? 'tree' : 'leaf'));

  on('classesBackHome', 'click', () => showScreen(currentRole === 'tree' ? 'tree' : 'leaf'));
  on('studentsBackHome', 'click', () => showScreen('tree'));
  on('scheduleClassBtn', 'click', openScheduleClassModal);

  on('logoutBtnClasses', 'click', () => logout());
  on('logoutBtnStudents', 'click', () => logout());
  on('logoutBtnLive', 'click', () => logout());
  on('logoutBtnNotesFull', 'click', () => logout());
  on('logoutBtnTrees', 'click', () => logout());
  on('logoutBtnChat', 'click', () => logout());
  on('logoutBtnQuestions', 'click', () => logout());
  on('logoutBtnLeaderboard', 'click', () => logout());

  // ---- login/signup prototype ----
  async function enterAfterAuth(isSignup){
    const treeLogin = authPath === 'tree';
    const effectiveSignup = !!isSignup && !treeLogin && !canTeach;
    const nameInput=$('name');
    const identifier=$('emailOrPhone');
    const password=$('password');
    const confirm=$('confirmPassword');

    if(effectiveSignup && !((nameInput?.value||'').trim())){ showToast('Please enter your full name'); nameInput?.focus(); return; }
    if(!((identifier?.value||'').trim())){ showToast('Enter your email'); identifier?.focus(); return; }
    if(!((password?.value||'').trim())){ showToast('Enter your password'); password?.focus(); return; }
    if(effectiveSignup && password.value.length < 8){ showToast('Password must be at least 8 characters'); password?.focus(); return; }
    if(effectiveSignup && password.value !== (confirm?.value||'')){ showToast('Passwords do not match'); confirm?.focus(); return; }

    if(!window.ELeafSupabase || !window.ELeafSupabase.ready){
      showToast('Supabase is not configured correctly. Check the project URL and anon key.');
      return;
    }

    try {
      const email = (identifier?.value || '').trim();
      const passwordValue = password?.value || '';
      const targetRole = treeLogin && canTeach ? 'tree' : 'leaf';

      if(effectiveSignup){
        const { data, error } = await window.ELeafSupabase.signUp({
          email,
          password: passwordValue,
          fullName: (nameInput?.value || '').trim()
        });

        if(error){
          showToast(mapSupabaseAuthError(error));
          return;
        }

        if(data?.session){
          currentUser.id = data.session.user?.id || null;
          currentUser.email = data.session.user?.email || email;
          currentUser.name = normalizeDisplayName(data.session.user);
          applyIdentityUI();
          closePanel();
          currentRole = targetRole;
          showScreen('welcome');
          await saveUserState();
          return;
        }

        currentUser = {
          name: (nameInput?.value || '').trim() || 'Almost Fake',
          id: data?.user?.id || null,
          email: email
        };
        applyIdentityUI();
        closePanel();
        showScreen('welcome');
        showToast('Account created. Please confirm your email, then log in with the same credentials.');
        return;
      }

      const { data, error } = await window.ELeafSupabase.signIn({ email, password: passwordValue });
      if(error){
        showToast(mapSupabaseAuthError(error));
        return;
      }

      if(data?.session){
        currentUser.id = data.session.user?.id || null;
        currentUser.email = data.session.user?.email || email;
        currentUser.name = normalizeDisplayName(data.session.user);
      }

      closePanel();
      currentRole = targetRole;
      showScreen(targetRole);
      await saveUserState();
    } catch(err) {
      console.error('E-Leaf: failed to authenticate with Supabase', err);
      showToast(mapSupabaseAuthError(err));
    }
  }
  on('welcomeContinueBtn', 'click', () => showScreen('leaf'));

  on('authForm', 'submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const signup = !!$('panel')?.classList.contains('mode-signup');
    enterAfterAuth(signup);
  });
  on('submitBtn', 'click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const signup = !!$('panel')?.classList.contains('mode-signup');
    enterAfterAuth(signup);
  });

  // ---- become a tree navigation ----


  // ---- logout ----
  async function logout(){
    if(window.ELeafSupabase && window.ELeafSupabase.ready){
      try{
        const { error } = await window.ELeafSupabase.signOut();
        if(error){
          showToast(mapSupabaseAuthError(error));
          return;
        }
      }catch(err){
        showToast('Could not log out. Please try again.');
        return;
      }
    }

    currentRole = 'leaf';
    liveContext = null;
    currentUser = { name: 'Almost Fake', id: null, email: '' };
    applyIdentityUI();
    closePanel();
    showScreen('home');
    setMode(false);
    updateHomePath();
  }
  on('logoutBtnLeaf', 'click', logout);
  on('logoutBtnBT', 'click', logout);
  on('logoutBtnTree', 'click', logout);

  // ---- growth transition ----
  async function growToTree(){
    const done = Object.values(growthProgress).filter(Boolean).length;
    if(done < 3){ showToast('Complete all three steps before becoming a Tree.'); renderGrowthState(); return; }
    const overlay = $('growth-overlay');
    if(!overlay) return;
    const firstGrowth = !canTeach;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const line = overlay.querySelector('.grow-line');
    if(line) line.textContent = firstGrowth
      ? 'You’ve become a Tree. Time to carry the responsibility forward.'
      : 'Welcome back, Tree.';

    // Reset the overlay without using a display:none state. The overlay must
    // remain mounted so the next Leaf -> Tree transition can always start.
    overlay.classList.remove('idle','quick','morph','reveal-text','complete','forward-mirror','reverse','fadeout');
    overlay.classList.add('show');

    // The first transformation uses the slower, meaningful morph.
    // The repeat transformation uses the same rhythm as the working Tree -> Leaf transition.
    if(!firstGrowth) overlay.classList.add('forward-mirror');

    if(reduce){
      overlay.classList.add('morph','reveal-text');
      await new Promise(r=>setTimeout(r,900));
    }else if(!firstGrowth){
      overlay.classList.add('quick');
      await new Promise(r=>setTimeout(r,380));
      overlay.classList.add('morph');
      await new Promise(r=>setTimeout(r,760));
      overlay.classList.add('reveal-text');
      await new Promise(r=>setTimeout(r,520));
    }else{
      await new Promise(r=>setTimeout(r,650));
      overlay.classList.add('morph');
      await new Promise(r=>setTimeout(r,1650));
      overlay.classList.add('reveal-text');
      await new Promise(r=>setTimeout(r,1450));
    }

    // Start the final visual fade and reveal the destination dashboard at the
    // exact same moment. The dashboard is rendered underneath the overlay,
    // then the overlay fades away over it. This removes the dead/empty frame
    // between the transition artwork and the dashboard.
    overlay.classList.add('fadeout');

    currentRole='tree';
    canTeach=true;
    const savePromise = saveUserState();
    showScreen('tree');
    overlay.classList.remove('show');

    // Let the overlay finish fading over the already-rendered Tree dashboard.
    await new Promise(r=>setTimeout(r,580));
    await savePromise;

    // Keep the overlay mounted and reset its visual state while hidden.
    // Never enter a display:none state: the next Leaf -> Tree transition must
    // start from the same mounted overlay.
    overlay.classList.remove('morph','reveal-text','quick','complete','forward-mirror','reverse','fadeout','show','idle');
    updateHomePath();
    renderGrowthState();
  }
  on('miniGrowBtn', 'click', growToTree);
  on('mainGrowBtn', 'click', growToTree);
  // ---- subtle Tree -> Leaf transition ----
  async function switchToLeafMode(){
    if(currentRole !== 'tree'){ showScreen('leaf'); return; }
    const overlay = $('growth-overlay');
    if(!overlay){ currentRole='leaf'; showScreen('leaf'); return; }
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const line = overlay.querySelector('.grow-line');
    if(line) line.textContent = 'Time to Learn, Leaf.';
    overlay.classList.remove('quick','morph','reveal-text','reverse');
    overlay.classList.add('reverse','show');
    if(reduce){
      overlay.classList.add('morph','reveal-text');
      await new Promise(r=>setTimeout(r,1200));
    }else{
      // Mirror the repeat Leaf -> Tree transition: show the current role first,
      // hold briefly, morph to the destination role, then reveal the message.
      overlay.classList.add('quick');
      await new Promise(r=>setTimeout(r,380));
      overlay.classList.add('morph');
      await new Promise(r=>setTimeout(r,760));
      overlay.classList.add('reveal-text');
      await new Promise(r=>setTimeout(r,520));
    }
    currentRole='leaf';
    showScreen('leaf');
    overlay.classList.remove('show','morph','reveal-text','quick','reverse');
    updateMobileNav('leaf');
    updateGlobalModeSwitch('leaf');
  }

  on('seeGrowthBtn','click',()=>showScreen('becomeTree'));

  // ---- rising particles on home ----
  const particleHost = $('risingParticles');
  if(particleHost){
    for(let i=0;i<16;i++){
      const p = document.createElement('div');
      p.className = 'rp' + (i % 2 === 0 ? ' leafy' : '');
      p.style.left = (Math.random()*100) + '%';
      p.style.bottom = (Math.random()*15) + '%';
      p.style.animationDelay = (Math.random()*12) + 's';
      p.style.animationDuration = (9 + Math.random()*7) + 's';
      particleHost.appendChild(p);
    }
  }

  // ---- initialize ----
  loadUserState().then(() => {
    updateHomePath();
    renderGrowthState();
    updateMobileNav('home');
  }).catch(()=>{});
  seedIfNeeded().catch(err => console.warn('E-Leaf: seeding skipped', err));
})();

