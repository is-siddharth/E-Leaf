function toast(message){
  let el=$('#appToast');
  if(!el){
    el=document.createElement('div'); el.id='appToast'; el.className='app-toast'; el.setAttribute('role','status'); document.body.appendChild(el);
  }
  el.textContent=message; el.classList.add('show');
  clearTimeout(window.__eLeafToastTimer);
  window.__eLeafToastTimer=setTimeout(()=>el.classList.remove('show'),2400);
}
function demoAction(message){ toast(message||'This is a demonstration action. No real data was changed.'); }
function isBackendReady(){return Boolean(supabaseClient&&SUPABASE_URL&&SUPABASE_KEY)}
function setAuthBusy(busy){const button=$('#authSubmit');if(!button)return;button.disabled=busy;button.setAttribute('aria-busy',String(busy));button.textContent=busy?'Please wait...':($('#signupTab').classList.contains('active')?'Create account':'Log in')}
function friendlyAuthError(error){const message=String(error?.message||'').toLowerCase();if(message.includes('invalid login credentials'))return 'That email or password did not match an E-Leaf account.';if(message.includes('already registered')||message.includes('already been registered'))return 'An account already exists for this email. Try logging in instead.';if(message.includes('email not confirmed'))return 'Please confirm your email, then try logging in.';if(message.includes('network')||message.includes('fetch'))return 'We could not reach the account service. Check your connection and try again.';return error?.message||'Something went wrong. Please try again.';}
function icon(name){
  const icons={
    home:`<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>`,
    classes:`<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>`,
    learn:`<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6M9 18h4"/>`,
    explore:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9M12 3c-3 3-4 6-4 9s1 6 4 9"/>`,
    community:`<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="10" r="2.6"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M14.5 20c.3-2.4 1.8-4.3 3.9-5"/>`,
    library:`<path d="M4 4h5v16H4zM11 4h5v16h-5zM18 4h2v16h-2z"/>`,
    note:`<path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h8M8 17h5"/>`,
    teach:`<path d="m3 9 9-5 9 5-9 5z"/><path d="M6 12v5M12 14v5M18 12v5M3 21h18"/>`,
    college:`<path d="m3 9 9-5 9 5-9 5z"/><path d="M5 11v6M9 13v6M15 13v6M19 11v6M3 21h18"/>`,
    globe:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9M12 3c-3 3-4 6-4 9s1 6 4 9"/>`,
    building:`<path d="M5 21V5l7-2 7 2v16M3 21h18"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>`,
    question:`<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.7 1.6c-.8.9-2.2 1.2-2.2 2.8M12 17h.01"/>`,
    logout:`<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 16l4-4-4-4M20 12H9"/>`,
    journey:`<path d="M5 19V5h14v14"/><path d="M8 9h8M8 13h5"/>`,
    search:`<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>`
  };
  if(name==='leaf') return `<svg viewBox="0 0 64 64" aria-hidden="true" class="icon-leaf icon-organic"><path d="M32 6C46 11 54 22 54 34C54 48 44 58 32 58C20 58 10 48 10 34C10 22 18 11 32 6Z"/><path d="M32 10v44M32 24c-4 2-8 5-8 5M32 34c-5 2-9 6-9 6M32 44c-5 2-8 5-8 5" class="leaf-vein"/></svg>`;
  if(name==='tree') return `<svg viewBox="0 0 64 64" aria-hidden="true" class="icon-tree icon-organic"><circle cx="24" cy="26" r="12"/><circle cx="40" cy="26" r="12"/><circle cx="32" cy="18" r="13"/><rect x="28" y="34" width="8" height="18" rx="2"/><circle cx="22" cy="20" r="2.3" class="tree-highlight"/><circle cx="34" cy="13" r="2.1" class="tree-highlight"/><circle cx="43" cy="23" r="2" class="tree-highlight"/><path d="M31 38v12M35 42l-3 3M29 46l3 3" class="tree-vein"/></svg>`;
  const paths=icons[name]||icons.home;
  return `<svg viewBox="0 0 24 24" aria-hidden="true" class="icon-${name}">${paths}</svg>`;
}
function brandMark(){
  return `<span class="app-brand-mark" aria-hidden="true"><svg viewBox="0 0 64 64"><use href="#ic-leaf"></use></svg></span>`;
}
function contextOrientation(){
  const global=context.world==='global';
  const tree=context.role==='tree';
  const worldLabel=global?'GLOBAL':'INSTITUTION';
  const worldCopy=global?'Beyond your institution':(context.institution||'Your institution');
  const modeLabel=tree?'TREE':'LEAF';
  const modeCopy=tree?'Teaching within this space':'Learning within this space';
  return `<section class="context-orientation" aria-label="Current E-Leaf context">
    <div class="orientation-symbol orientation-${tree?'tree':'leaf'}">${icon(tree?'tree':'leaf')}</div>
    <div class="orientation-copy"><div class="orientation-kicker"><span>${worldLabel}</span><i aria-hidden="true">·</i><strong>${modeLabel}</strong></div><p>${escapeHtml(worldCopy)} <span>·</span> ${modeCopy}.</p></div>
    <div class="orientation-hint">${global?'The wider E-Leaf community':'Your academic community'}</div>
    <button type="button" class="orientation-space-switch" id="changeContextMobile" aria-label="Change E-Leaf world"><span>${icon(global?'globe':'building')}</span><span>Change world</span></button>
  </section>`;
}

function navIcon(name){return `<span class="nav-icon nav-icon-${name}">${icon(name)}</span>`}
function navItems(){
  if(context.world==='institution') return context.role==='tree'
    ? [['home','Home'],['classes','Classes'],['teach','Teach'],['community','Community'],['college','College']]
    : [['home','Home'],['classes','Classes'],['learn','Learn'],['note','Notes'],['community','Community'],['college','College']];
  return context.role==='tree'
    ? [['home','Home'],['explore','Explore'],['teach','Teach'],['community','Community'],['library','Library'],['journey','Journey']]
    : [['home','Home'],['explore','Explore'],['learn','Learn'],['community','Community'],['library','Library'],['journey','Journey']];
}
function setNav(active){
  const nav=$('#appNav');
  if(!nav)return;
  nav.innerHTML=navItems().map(([key,label])=>`<button class="${active===key?'active':''}" data-nav="${key}">${navIcon(key)}<span>${label}</span></button>`).join('');
  nav.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>routeApp(button.dataset.nav)));
}
function roleKey(world){
  return session ? `e_leaf_last_role:${session.user.id}:${world}` : null;
}
function rememberedRole(world){
  if(!session)return 'leaf';
  const saved=store.get(roleKey(world),null);
  return saved==='tree' && treeUnlockedForWorld(world) ? 'tree' : 'leaf';
}
function treeUnlockedForWorld(world){
  if(!session)return false;
  const institution=userProfile?.institution||'Your institution';
  const key=world==='global' ? `e_leaf_global_growth:${session.user.id}` : `e_leaf_institution_growth:${session.user.id}:${institution}`;
  return !!store.get(key,{unlocked:false}).unlocked;
}
function setRememberedRole(role){
  if(session&&context.world)store.set(roleKey(context.world),role);
}
function transitionSpace(targetWorld){
  if(!session)return;
  if(!context.world){
    context.world=targetWorld;
    context.institution=targetWorld==='institution'?(userProfile?.institution||'Your institution'):null;
    openRole(targetWorld,context.institution);
    return;
  }
  if(context.world===targetWorld){renderApp();return;}
  const overlay=$('#spaceTransition');
  $('#spaceTransitionMark').innerHTML=icon(targetWorld==='global'?'globe':'building');
  $('#spaceTransitionEyebrow').textContent=targetWorld==='global'?'GLOBAL SPACE':'INSTITUTIONAL SPACE';
  $('#spaceTransitionTitle').textContent=targetWorld==='global'?'Stepping into the wider world.':'Coming back to your college space.';
  $('#spaceTransitionCopy').textContent=targetWorld==='global'?'There is more to explore beyond one curriculum.':'Your learning returns to the people, classes, and resources of your institution.';
  hideAllOverlays(); overlay.classList.remove('hidden','out');
  setTimeout(()=>{
    context.world=targetWorld;
    context.institution=targetWorld==='institution'?(userProfile?.institution||'Your institution'):null;
    context.role=rememberedRole(targetWorld);
    store.set(`e_leaf_last_context:${session.user.id}`,context);
    renderApp();
    overlay.classList.add('out');
    setTimeout(()=>{overlay.classList.add('hidden');overlay.classList.remove('out')},430);
  },900);
}
function transitionRole(targetRole){
  if(context.role===targetRole){renderApp();return;}
  const overlay=$('#roleTransition');
  const toTree=targetRole==='tree';
  $('#roleTransitionMark').innerHTML=icon(toTree?'tree':'leaf');
  $('#roleTransitionEyebrow').textContent=toTree?`${context.world==='global'?'GLOBAL':'INSTITUTION'} · TREE`:`${context.world==='global'?'GLOBAL':'INSTITUTION'} · LEAF`;
  $('#roleTransitionTitle').textContent=toTree?'Moving into your teaching space.':'Returning to your learning space.';
  $('#roleTransitionCopy').textContent=toTree?'You can keep learning, and now you can teach here too.':'Teaching stays available to you. For now, you are here to learn.';
  hideAllOverlays(); overlay.classList.remove('hidden','out','to-tree','to-leaf'); overlay.classList.add(toTree?'to-tree':'to-leaf');
  setTimeout(()=>{
    context.role=targetRole; setRememberedRole(targetRole); store.set('e_leaf_last_context:'+session.user.id,context); renderApp(); overlay.classList.add('out');
    setTimeout(()=>{overlay.classList.add('hidden');overlay.classList.remove('out')},430);
  },850);
}

function setPasswordVisibility(inputSelector,toggleSelector){
  const input=$(inputSelector),button=$(toggleSelector); if(!input||!button)return;
  const reveal=input.type==='password';
  input.type=reveal?'text':'password';
  button.setAttribute('aria-pressed',String(reveal));
  button.setAttribute('aria-label',reveal?'Hide password':'Show password');
  button.classList.toggle('is-visible',reveal);
}
function resetPasswordToggle(inputSelector,toggleSelector){
  const input=$(inputSelector),button=$(toggleSelector); if(!input||!button)return;
  input.type='password'; button.setAttribute('aria-pressed','false'); button.setAttribute('aria-label','Show password'); button.classList.remove('is-visible');
}
function openAuth(mode='signup',action=null){
  pendingAction=action;
  show($('#authOverlay'));
  setAuthMode(mode);
  setTimeout(()=>$(mode==='signup'?'#authName':'#authEmail')?.focus(),50);
}
function closeAuth(){hide($('#authOverlay'));$('#authMessage').textContent='';setAuthBusy(false);}
function setAuthMode(mode){
  const signup=mode==='signup';
  $('#signupTab').classList.toggle('active',signup);
  $('#loginTab').classList.toggle('active',!signup);
  $('#nameField').classList.toggle('hidden',!signup);
  $('#confirmPasswordField').classList.toggle('hidden',!signup);
  $('#authPassword').setAttribute('autocomplete',signup?'new-password':'current-password');
  $('#authPasswordConfirm').value='';
  resetPasswordToggle('#authPassword','#passwordToggle');
  resetPasswordToggle('#authPasswordConfirm','#confirmPasswordToggle');
  $('#authTitle').textContent=signup?'Join E-Leaf':'Log in';
  $('#authCopy').textContent=signup?'Create an account when you are ready to become part of the learning community.':'Log in to continue into your E-Leaf space.';
  $('#authSubmit').textContent=signup?'Create account':'Log in';
}
async function submitAuth(e){
  e.preventDefault();
  $('#authMessage').textContent='';
  if(!isBackendReady()){ $('#authMessage').textContent='Account access is not configured for this demo build. Please use the configured demonstration environment.'; return; }
  if(!$('#authForm').reportValidity()) return;
  setAuthBusy(true);
  const email=$('#authEmail').value.trim(),password=$('#authPassword').value;
  const signup=$('#signupTab').classList.contains('active');
  try{
    if(signup){
      const confirmation=$('#authPasswordConfirm').value;
      if(password.length < 6) throw Error('Password must be at least 6 characters.');
      if(password!==confirmation) throw Error('Passwords do not match.');
    }
    let result;
    if(signup){
      const name=$('#authName').value.trim();
      if(!name) throw Error('Please enter your name.');
      result=await supabaseClient.auth.signUp({email,password,options:{data:{full_name:name}}});
      if(result.error) throw result.error;
      if(!result.data.session){
        $('#authMessage').style.color='var(--leaf-dark)';
        $('#authMessage').textContent='Account created. Check your email if confirmation is required, then log in.';
        return;
      }
    }else{
      result=await supabaseClient.auth.signInWithPassword({email,password});
      if(result.error) throw result.error;
    }
    session=result.data.session;
    userProfile=loadProfile(session.user);
    closeAuth();
    showContext();
  }catch(err){
    $('#authMessage').style.color='var(--danger)';
    $('#authMessage').textContent=friendlyAuthError(err);
  }finally{setAuthBusy(false);}
}
function showContext(){hideAllOverlays();show($('#contextOverlay'));}
function hideAllOverlays(){$$('.overlay').forEach(hide)}
function openInstitution(){
  transitionSpace('institution');
}
function openRole(world,institution=null){
  context.world=world;
  context.institution=world==='institution'?(institution||userProfile?.institution||'Your institution'):null;
  hide($('#contextOverlay'));
  $('#roleEyebrow').textContent=world==='global'?'Global world':'Institutional world';
  $('#roleTitle').textContent=world==='global'?'Step into the wider E-Leaf':'Step into your institution';
  $('#roleCopy').textContent=world==='global'
    ?'Choose how you want to participate in the wider learning community today.'
    :`You are part of ${context.institution}. Choose how you want to enter it today.`;
  $('#enterTree').classList.toggle('hidden',!treeUnlockedForContext());
  show($('#roleOverlay'));
}
function enterApp(role){
  if(!session){toast('Please log in before entering E-Leaf.');openAuth('login');return;}
  if(role==='tree'&&!treeUnlockedForContext()){toast('Your Tree teaching space is not ready yet. Complete the three demo growth steps first.');return;}
  if(context.role===role){setRememberedRole(role);store.set('e_leaf_last_context:'+session.user.id,context);hideAllOverlays();renderApp();return;}
  transitionRole(role);
}
function recordGrowthAction(action){
  if(context.role!=='leaf'||!session||treeUnlockedForContext())return;
  const state=growthState();
  if(state.actions.includes(action)){
    toast('That contribution is already part of your growth.');
    return;
  }
  state.actions.push(action);
  if(state.actions.length>=3){
    // Demo rule: the third contribution makes the Tree READY, not automatically active.
    state.unlocked=true;
    store.set(contextKey(),state);
    renderGrowthDock(true);
    toast('Your Tree is ready. You can enter your teaching space when you choose.');
    if(document.body.dataset.eLeafPage==='home') {
      const dock=$('#growthDock .growth-tree-dock');
      if(dock){ dock.classList.remove('growth-home-shake'); void dock.offsetWidth; dock.classList.add('growth-home-shake'); }
    }
  } else {
    store.set(contextKey(),state);
    renderGrowthDock(true);
    toast('Saved. Keep going with your learning.');
  }
}
function startLeafToTreeTransition(){
  const overlay=$('#growthTransition'); if(!overlay)return;
  hideAllOverlays(); overlay.className='growth-transition phase-1'; document.body.classList.add('transitioning-growth');
  setTimeout(()=>overlay.classList.add('phase-2'),620);
  setTimeout(()=>overlay.classList.add('phase-3'),1320);
  setTimeout(()=>{ context.role='tree'; store.set('e_leaf_last_context:'+session.user.id,context); renderApp(); overlay.classList.add('exit'); },2050);
  setTimeout(()=>{overlay.className='growth-transition hidden';document.body.classList.remove('transitioning-growth')},2700);
}
function renderApp(){
  hide($('#publicView'));
  const name=userProfile?.name||'Learner';
  const worldClass=context.world==='global'?'space-global':'space-institutional';
  const roleClass=context.role==='tree'?'role-tree':'role-leaf';
  const contextName=context.world==='global'?'Global':context.institution||'Institutional';
  const roleName=context.role==='tree'?'Tree':'Leaf';
  const spaceLine=context.world==='global'?'The wider E-Leaf community':'Your institution';
  $('#appView').innerHTML=`<div class="app-shell ${worldClass} ${roleClass}">
    <div class="space-ambient" aria-hidden="true"><span class="particle p1">${context.world==='global'?'◦':'❧'}</span><span class="particle p2">${context.world==='global'?'·':'❧'}</span><span class="particle p3">${context.world==='global'?'◦':'❧'}</span><span class="particle p4">${context.world==='global'?'·':'❧'}</span><span class="particle p5">${context.world==='global'?'◦':'❧'}</span></div>
    <header class="app-top"><div class="app-top-inner">
      <button class="app-brand" id="appBrand" aria-label="E-Leaf home">${brandMark()}<span>E-Leaf</span></button>
      <div class="context-identity"><span class="context-icon">${icon(context.world==='global'?'globe':'building')}</span><div><strong>${escapeHtml(contextName)}</strong><small>${spaceLine}</small></div></div>
      <div class="app-actions"><button class="btn btn-soft" id="changeContext">Change world</button><button class="role-switch" id="changeRole" aria-label="Switch to ${context.role==='tree'?'Leaf':'Tree'} mode"><span class="role-switch-icon">${icon(context.role==='tree'?'tree':'leaf')}</span><span>${roleName}</span></button><button class="profile-btn" id="profileBtn"><span class="profile-avatar">${initials(name)}</span><span>${escapeHtml(name)}</span></button><button class="btn btn-soft" id="logoutBtn">Log out</button></div>
    </div></header>
    <main class="app-body"><div class="demo-notice" role="status"><strong>Demonstration build</strong><span>Sample content and growth actions are simulated. Account access uses the configured Supabase project.</span></div>${contextOrientation()}<nav class="app-nav" id="appNav"></nav><div id="appContent" class="app-content"></div></main><div id="growthDock"></div>
  </div>`;
  show($('#appView'));
  $('#appBrand').onclick=()=>renderHome();
  $('#changeContext').onclick=()=>showContext();
  $('#changeContextMobile').onclick=()=>showContext();
  $('#changeRole').onclick=()=>openRole(context.world,context.institution);
  $('#logoutBtn').onclick=requestLogout;
  renderHome();
  renderGrowthDock();
}
function renderGrowthDock(animate=false){
  const dock=$('#growthDock');
  if(!dock)return;
  if(!session||context.role!=='leaf'){dock.replaceChildren();return;}
  const growth=growthState();
  const done=growthDone(), pct=growthPercent();
  // The growth Tree is a persistent qualification companion. Its geometry is
  // derived from one canonical progress value; completion is always a true
  // 100% state rather than an approximation.
  const fillY=done===3 ? 0 : 204-(Math.max(0,Math.min(100,pct))*1.87);
  const complete=done===3;
  const previousWater=dock.querySelector('.growth-water');
  const previousY=previousWater ? Number(previousWater.getAttribute('y')||fillY) : null;
  dock.innerHTML=`<aside class="growth-tree-dock growth-stage-${done} ${complete?'growth-complete':''}" aria-label="Your growth${complete?' is complete':''}" tabindex="0" title="${complete?'Demo Tree threshold reached.':'Demo growth: three contributions reveal the Tree transition.'}">
    <div class="growth-tree-wrap">
      <svg class="growth-tree-art" viewBox="0 0 180 220" role="img" aria-label="${complete?'A fully grown tree':'A growing tree'}">
        <defs><clipPath id="growthTreeClip"><path d="M90 204V121C90 101 74 91 59 81C46 72 41 57 48 43C55 28 72 25 84 34C88 20 100 12 113 17C126 22 132 34 128 47C144 47 155 58 155 71C155 87 142 97 125 98C119 99 113 102 110 111C106 122 105 138 105 155V204Z"/></clipPath></defs>
        <path class="growth-tree-outline" d="M90 204V121C90 101 74 91 59 81C46 72 41 57 48 43C55 28 72 25 84 34C88 20 100 12 113 17C126 22 132 34 128 47C144 47 155 58 155 71C155 87 142 97 125 98C119 99 113 102 110 111C106 122 105 138 105 155V204"/>
        <g clip-path="url(#growthTreeClip)"><rect class="growth-water" x="24" y="${fillY}" width="132" height="220" rx="12"/><path class="growth-water-ripple" d="M20 ${fillY} C48 ${fillY-5}, 69 ${fillY+5}, 90 ${fillY} S132 ${fillY-5}, 160 ${fillY}"/></g>
        <path class="growth-trunk-line" d="M90 204V125M90 154 69 135M90 168l22-25M90 141l-13-17M90 183l15-13"/>
      </svg>
      <div class="growth-tree-copy"><span>${complete?'TREE READY':'TREE GROWTH'}</span>${complete?'<strong>Your Tree is ready.</strong><button type="button" class="growth-ready-cta">Enter Tree</button>':`<small>${done} of 3 demo steps</small><div class="growth-step-actions"><button type="button" data-growth-action="learn" class="growth-step ${growth.actions.includes('learn')?'done':''}"><span>1</span>Learn</button><button type="button" data-growth-action="share" class="growth-step ${growth.actions.includes('share')?'done':''}"><span>2</span>Share</button><button type="button" data-growth-action="help" class="growth-step ${growth.actions.includes('help')?'done':''}"><span>3</span>Help</button></div>`}</div>
    </div>
  </aside>`;
  const tree=dock.querySelector('.growth-tree-dock');
  tree.querySelectorAll('[data-growth-action]').forEach(button=>button.addEventListener('click',e=>{
    e.stopPropagation();
    recordGrowthAction(button.dataset.growthAction);
  }));
  if(animate && previousY!==null){
    const water=tree.querySelector('.growth-water');
    water.style.y=`${previousY}px`;
    requestAnimationFrame(()=>{ water.style.y=`${fillY}px`; });
  }
  if(complete && location.hash!=='#tree'){
    const readyCta=tree.querySelector('.growth-ready-cta');
    if(readyCta) readyCta.addEventListener('click',e=>{e.stopPropagation();enterApp('tree')});
    tree.addEventListener('click',()=>enterApp('tree'));
    tree.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterApp('tree')}});
    if(document.body.dataset.eLeafPage==='home') { tree.classList.remove('growth-home-shake'); void tree.offsetWidth; tree.classList.add('growth-home-shake'); }
  }
}

function renderHome(){
  document.body.dataset.eLeafPage='home';
  setNav('home');
  renderGrowthDock();
  const name=userProfile?.name||'Learner';
  if(context.world==='institution')return renderInstitutionHome(name);
  return renderGlobalHome(name);
}
function renderInstitutionHome(name){
  if(context.role==='tree'){
    $('#appContent').innerHTML=`<div class="welcome institution-welcome"><div><div class="eyebrow">YOUR COLLEGE · TREE</div><h1>Welcome back, ${escapeHtml(name)}.</h1><p>You can still learn here. You can also open the classroom for others.</p></div><button class="btn btn-tree" onclick="routeApp('teach')">Open teaching</button></div>
    <div class="institution-home-grid"><section><div class="app-card featured-class"><div class="big-meta">Next teaching space</div><h2>Python Fundamentals</h2><p>Your upcoming class · Friday · 4:00 PM</p><div class="card-action-row"><button class="btn btn-tree" onclick="routeApp('teach')">Prepare class</button><span class="quiet">12 learners enrolled</span></div></div><div class="institution-card-row"><button class="app-card small-action" onclick="routeApp('classes')"><span class="eyebrow">Classes</span><strong>See college classes</strong><span>Teach or join what is happening now.</span></button><button class="app-card small-action" onclick="routeApp('community')"><span class="eyebrow">Community</span><strong>Help your classmates</strong><span>Questions, notes, and conversations.</span></button><button class="app-card small-action" onclick="routeApp('college')"><span class="eyebrow">College</span><strong>Stay oriented</strong><span>Schedule, library, and college notices.</span></button></div></section><aside><div class="tree-panel role-tree-panel"><div class="tree-symbol">${icon('tree')}</div><div class="eyebrow">YOUR TREE</div><h3>Teaching is a responsibility.</h3><p>Your Tree capability here is specific to this institutional space. You can still enter the Global space as a Leaf.</p></div></aside></div>`;
  }else{
    $('#appContent').innerHTML=`<div class="welcome institution-welcome"><div><div class="eyebrow">YOUR COLLEGE · LEAF</div><h1>Welcome back, ${escapeHtml(name)}.</h1><p>Your college is your learning world. Start with what is happening around you.</p></div><button class="btn btn-leaf" onclick="routeApp('classes')">See classes</button></div>
    <div class="institution-home-grid"><section><div class="app-card featured-class"><div class="big-meta">Happening in your college</div><h2>Python Fundamentals</h2><p>Live with Arun · Today · 4:00 PM</p><div class="card-action-row"><button class="btn btn-leaf" onclick="routeApp('classes')">Join class</button><span class="quiet">Your classmate is teaching</span></div></div><div class="institution-card-row"><button class="app-card small-action" onclick="routeApp('classes')"><span class="eyebrow">Classes</span><strong>Upcoming learning</strong><span>See sessions, subjects, and who is teaching.</span></button><button class="app-card small-action" onclick="routeApp('community')"><span class="eyebrow">Community</span><strong>Notes & questions</strong><span>Learn with people from your college.</span></button><button class="app-card small-action" onclick="routeApp('college')"><span class="eyebrow">College</span><strong>More than classes</strong><span>Exam dates, library, notices, and campus resources.</span></button></div></section><aside><div class="leaf-panel"><div class="leaf-symbol">${icon('leaf')}</div><div class="eyebrow">LEAF</div><h3>A place to learn.</h3><p>You can explore freely inside your college. The people, subjects, curriculum, and resources stay within this community.</p></div></aside></div>`;
  }
}
function renderGlobalHome(name){
  const tree=context.role==='tree';
  $('#appContent').innerHTML=`<div class="welcome global-welcome"><div><div class="eyebrow">GLOBAL · ${tree?'TREE':'LEAF'}</div><h1>${tree?'Teach where your knowledge fits.':'What would you like to learn?'}</h1><p>${tree?'The wider E-Leaf is open to you. Keep learning as a Leaf while teaching only within your approved areas.':'The world is your learning space. Learn from people, classes, and ideas beyond one institution.'}</p></div><button class="btn ${tree?'btn-tree':'btn-global'}" onclick="routeApp('${tree?'teach':'explore'}')">${tree?'Open teaching':'Explore learning'}</button></div>
  <section class="global-search-card"><div><span class="eyebrow">FIND YOUR NEXT THING</span><h2>Search the wider E-Leaf.</h2><p>Look across subjects, Trees, courses, classes, notes, and questions.</p></div><div class="global-search-wrap"><span class="search-mark">${icon('search')}</span><input id="homeGlobalSearch" aria-label="Search Global E-Leaf" placeholder="Try “physics”, “probability”, or a subject…"><button class="btn ${tree?'btn-tree':'btn-global'}" id="homeSearchButton">Search</button></div></section>
  <div class="global-home-grid"><section><div class="section-inline-heading"><div><div class="eyebrow">CONTINUE</div><h2>${tree?'Your next teaching space':'Keep learning'}</h2></div><button class="text-button" onclick="routeApp('${tree?'teach':'learn'}')">Open</button></div><div class="app-card global-feature"><div class="big-meta">${tree?'NEXT TEACHING SPACE':'CURRENT LEARNING'}</div><h2>${tree?'Thinking clearly about probability':'Python Fundamentals'}</h2><p>${tree?'Prepare a short session for people exploring evidence and uncertainty.':'Lesson 4 · Functions and practical problem solving'}</p>${tree?'':'<div class="progress"><span></span></div>'}<div class="card-action-row"><button class="btn ${tree?'btn-tree':'btn-global'}" onclick="routeApp('${tree?'teach':'learn'}')">${tree?'Prepare session':'Continue'}</button><span class="quiet">${tree?'Global learners':'8 lessons'}</span></div></div></section>
  <aside><div class="app-card next-step-card"><div class="eyebrow">A GOOD NEXT STEP</div><h3>${tree?'Help a learner outside your classroom.':'Learn something, then make it useful to someone else.'}</h3><p>${tree?'Answer a question where your approved teaching area fits.':'Your journey is not only about finishing lessons. Contribution is part of learning here.'}</p><button class="btn ${tree?'btn-tree':'btn-global'}" onclick="routeApp('${tree?'community':'journey'}')">${tree?'Open community':'See your journey'}</button></div></aside></div>
  <section class="global-discovery-strip"><div class="section-inline-heading"><div><div class="eyebrow">DISCOVER</div><h2>Learning without one curriculum.</h2></div><button class="text-button" onclick="routeApp('explore')">Explore all</button></div><div class="discovery-grid"><button class="app-card discovery-card" onclick="routeApp('explore')"><span class="discovery-icon">${icon('explore')}</span><strong>Explore subjects</strong><span>Move between programming, physics, philosophy, music, and more.</span></button><button class="app-card discovery-card" onclick="routeApp('community')"><span class="discovery-icon">${icon('community')}</span><strong>${tree?'Questions to help':'Learn with the world'}</strong><span>${tree?'Find conversations where your subject knowledge can help.':'Ask questions, read useful explanations, and learn with people anywhere.'}</span></button><button class="app-card discovery-card" onclick="routeApp('library')"><span class="discovery-icon">${icon('library')}</span><strong>Keep what matters</strong><span>Save lessons, notes, and ideas you want to return to.</span></button></div></section>
  <section class="tree-trust-banner ${tree?'is-tree':''}"><div class="trust-symbol">${icon(tree?'tree':'leaf')}</div><div><div class="eyebrow">${tree?'GLOBAL TREE':'GLOBAL LEAF'}</div><h3>${tree?'Teaching is scoped, not unlimited.':'Every Tree starts here as a learner.'}</h3><p>${tree?'Your demo Tree capability is shown with an approved teaching area. In production, teaching authority will come from qualification and review.':'Learn, share, and help. For this presentation demo, three simple actions demonstrate how the Tree transition works.'}</p></div><button class="btn ${tree?'btn-tree':'btn-global'}" onclick="routeApp('journey')">${tree?'View capability':'View journey'}</button></section>`;
  const input=$('#homeGlobalSearch'), button=$('#homeSearchButton');
  if(input&&button){ const go=()=>renderExplore(input.value.trim()); button.onclick=go; input.addEventListener('keydown',e=>{if(e.key==='Enter')go();}); }
}
function routeApp(page){
  document.body.dataset.eLeafPage=page||'home';
  if(page==='home')return renderHome();
  renderGrowthDock();
  setNav(page);
  const pages={explore:renderExplore,learn:renderLearn,community:renderCommunity,library:renderLibrary,note:renderLibrary,journey:renderJourney,teach:renderTeach,classes:renderClasses,college:renderCollege};
  (pages[page]||renderHome)();
}
function renderClasses(){
  const inst=context.world==='institution';
  const title=inst?'Classes in your college':'Classes across E-Leaf';
  const copy=inst?'See what is happening in your curriculum and community.':'Choose a subject, teacher, or live session from anywhere in the wider community.';
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${inst?'COLLEGE':'GLOBAL'} · CLASSES</div><h1>${title}</h1><p>${copy}</p></div></div><div class="course-grid">${DEMO_COURSES.map(c=>`<button class="course" style="text-align:left" onclick="routeApp(context.role==='tree'?'teach':'learn')"><span class="course-tag">${c.subject}</span><h3>${c.title}</h3><p>${c.detail}</p><div class="course-meta"><span>${inst?'College class':'Global class'}</span><span>${c.meta.split(' · ')[1]}</span></div><span class="course-action ${context.role==='tree'?'course-action-tree':'course-action-leaf'}">${context.role==='tree'?'Prepare':'Join'}</span></button>`).join('')}</div>`;
}
function renderCollege(){
  if(context.world!=='institution')return renderLibrary();
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">YOUR COLLEGE</div><h1>Everything around learning.</h1><p>Your college space is more than classes. Keep the practical things close.</p></div></div><div class="college-grid"><div class="app-card"><span class="eyebrow">Schedule</span><h3>Exam dates</h3><p>Mid-term examinations begin 14 October.</p><button class="btn btn-neutral" onclick="demoAction('Exam schedule is represented in this presentation demo.')">View dates</button></div><div class="app-card"><span class="eyebrow">Library</span><h3>College library</h3><p>Books, references, and reserved reading for your subjects.</p><button class="btn btn-neutral" onclick="routeApp('college');demoAction('College library preview is represented here.')">Open library</button></div><div class="app-card"><span class="eyebrow">Notices</span><h3>College updates</h3><p>Important notices and events from your institution.</p><button class="btn btn-neutral" onclick="demoAction('College notices are represented in this presentation demo.')">View notices</button></div></div>`;
}
function renderExplore(query=''){
  const inst=context.world==='institution';
  const q=String(query||'').trim().toLowerCase();
  const courses=DEMO_COURSES.filter(c=>!q||[c.subject,c.title,c.detail,c.meta].join(' ').toLowerCase().includes(q));
  const trees=[['Willow Peer','Biology','Visual explanations connecting biology to the world outside the classroom.'],['Elias Grove','Astronomy','Stars, scale, and the questions that make the night sky worth studying.'],['Mira Fern','Philosophy','Arguments, uncertainty, and learning to ask better questions.']].filter(t=>!q||t.join(' ').toLowerCase().includes(q));
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${inst?'COLLEGE':'GLOBAL'} · EXPLORE</div><h1>${inst?'Explore what your college can teach you.':'Explore without a fixed curriculum.'}</h1><p>${inst?'Follow subjects and people inside your institution.':'Search by what you want to learn, then choose a subject, Tree, class, note, or question.'}</p></div></div><div class="explore-search"><span>${icon('search')}</span><input id="exploreSearch" value="${escapeHtml(query)}" aria-label="Search Explore" placeholder="Search subjects, Trees, courses, classes…"><button class="btn btn-neutral" id="exploreSearchButton">Search</button></div><div class="explore-results-head"><div><div class="eyebrow">${q?`RESULTS FOR “${escapeHtml(query)}”`:'START EXPLORING'}</div><h2>${q?`${courses.length+trees.length} demo matches`:'Subjects and people'}</h2></div></div><div class="course-grid">${courses.map(c=>`<button class="course" style="text-align:left" onclick="${context.role==='tree' ? 'demoAction(\'Course details are represented in this presentation demo.\')' : 'routeApp(\'learn\')'}"><span class="course-tag">${c.subject}</span><h3>${c.title}</h3><p>${c.detail}</p><div class="course-meta"><span>${c.meta.split(' · ')[0]}</span><span>${inst?'Your college':'Global'}</span></div></button>`).join('')||'<div class="empty-state"><strong>Nothing matched yet.</strong><span>Try a subject such as physics, programming, or philosophy.</span></div>'}</div><div class="explore-people"><div class="eyebrow">TREES</div><h2>Learn from people, not just content.</h2><div class="people-mini-grid">${trees.map(([name,subject,desc])=>`<article class="person-mini"><div class="person-avatar avatar-sage">${initials(name)}</div><div><span>${subject} · ${inst?'Your college':'Global'}</span><h3>${name}</h3><p>${desc}</p><button class="btn btn-neutral" onclick="demoAction('Tree profile is represented in this presentation demo.')">View Tree</button></div></article>`).join('')||'<div class="empty-state"><strong>No Tree matches.</strong><span>Try searching for a subject.</span></div>'}</div></div>`;
  const input=$('#exploreSearch'), button=$('#exploreSearchButton');
  if(input&&button){const go=()=>renderExplore(input.value.trim());button.onclick=go;input.addEventListener('keydown',e=>{if(e.key==='Enter')go();});}
}
function renderLearn(){
  const inst=context.world==='institution';
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${inst?'COLLEGE':'GLOBAL'} · LEARN</div><h1>Keep one clear next step.</h1><p>${inst?'Learn through classes and resources connected to your college.':'Learn from wherever your curiosity takes you.'}</p></div><button class="btn ${context.role==='tree'?'btn-tree':inst?'btn-leaf':'btn-global'}" onclick="${context.role==='tree'?"demoAction('Lesson opened in this presentation demo.')":"recordGrowthAction('learn')"}">${context.role==='tree'?'Continue learning':'Complete lesson'}</button></div><div class="app-grid"><section><div class="app-card"><div class="eyebrow">Current course</div><h2 style="font-size:27px;margin-top:10px">Python Fundamentals</h2><p>Lesson 4 · Functions and practical problem solving</p><div class="progress"><span></span></div><div class="list"><div class="list-item"><div><strong>Lesson 4 · Functions</strong><small>Continue where you stopped.</small></div><button class="btn ${context.role==='tree'?'btn-tree':inst?'btn-leaf':'btn-global'}" onclick="${context.role==='tree'?"demoAction('Lesson opened in this presentation demo.')":"recordGrowthAction('learn')"}">${context.role==='tree'?'Continue':'Open'}</button></div><div class="list-item"><div><strong>Practice · Small problem</strong><small>Try the idea before moving on.</small></div><button class="btn btn-neutral" onclick="demoAction('Practice is represented as the next learning step in this presentation demo.')">Try</button></div></div></div></section><aside><div class="app-card"><div class="eyebrow">Around this course</div><h3>People are learning this too.</h3><p>Questions, notes, and discussion stay connected to what you are learning.</p><button class="btn btn-neutral" onclick="routeApp('community')">Open community</button></div></aside></div>`;
}
function renderCommunity(){
  const inst=context.world==='institution';
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${inst?'COLLEGE':'GLOBAL'} · COMMUNITY</div><h1>Learn with other people.</h1><p>${inst?'Talk with people from your college, where the curriculum and community meet.':'Learn with people from anywhere in E-Leaf.'}</p></div><button class="btn ${context.role==='tree'?'btn-tree':inst?'btn-leaf':'btn-global'}" onclick="${context.role==='tree'?"demoAction('Help actions are represented in this presentation demo.')":"recordGrowthAction('help')"}">Help a learner</button></div><div class="list"><div class="list-item"><div><strong>How do functions help organize a program?</strong><small>Programming · 3 replies · active</small></div><button class="btn ${context.role==='tree'?'btn-tree':'btn-leaf'}" onclick="${context.role==='tree'?"demoAction('Question opened in this presentation demo.')":"recordGrowthAction('help')"}">Open</button></div><div class="list-item"><div><strong>What is the difference between mass and weight?</strong><small>Physics · 5 replies · useful</small></div><button class="btn btn-neutral" onclick="demoAction('This discussion opens in the full community experience.')">Open</button></div><div class="list-item"><div><strong>A simple way to think about epistemic doubt</strong><small>Philosophy · shared note</small></div><button class="btn btn-neutral" onclick="demoAction('This shared note opens in the full reading experience.')">Read</button></div></div>`;
}
function renderLibrary(){
  const inst=context.world==='institution';
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${inst?'Notes':'Library'}</div><h1>${inst?'Notes worth keeping.':'Things worth returning to.'}</h1><p>${inst?'Useful notes and learning material from your college, kept close to the work.':'Your saved lessons, notes, and ideas in one quiet place.'}</p></div><button class="btn ${context.role==='tree'?'btn-tree':inst?'btn-leaf':'btn-global'}" onclick="${context.role==='tree'?"demoAction('Note sharing is represented in this presentation demo.')":"recordGrowthAction('share')"}">Share a note</button></div><div class="list"><div class="list-item"><div><strong>Python Fundamentals</strong><small>Continue learning · Lesson 4</small></div><button class="btn btn-neutral" onclick="demoAction('This saved item opens in the full library experience.')">Open</button></div><div class="list-item"><div><strong>The mathematics of uncertainty</strong><small>Saved learning session</small></div><button class="btn btn-neutral" onclick="demoAction('This saved item opens in the full library experience.')">Open</button></div></div>`;
}
function renderJourney(){
  const tree=context.role==='tree';
  const inst=context.world==='institution';
  const worldLabel=inst?'INSTITUTION':'GLOBAL';
  const growth=growthState();
  const done=Math.min(3,growth.actions.length);
  const steps=[['learn','Learn','Attend a learning session from another Tree.'],['share','Share','Plant something useful in your library.'],['help','Help','Help another learner through a useful conversation.']];
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${worldLabel} · JOURNEY</div><h1>${tree?'Keep learning. Keep teaching.':'See how learning can become contribution.'}</h1><p>${tree?'You have crossed the demo threshold. The Tree space adds teaching without taking away your learner identity.':'For this presentation demo, three simple actions show the transition from Leaf to Tree. Production qualification will be much more rigorous.'}</p></div><button class="btn ${tree?'btn-tree':'btn-global'}" onclick="${tree?"routeApp('teach')":"routeApp('learn')"}">${tree?'Open teaching':'Start learning'}</button></div>
  <div class="journey-layout"><section class="journey-card"><div class="journey-header"><div><div class="eyebrow">DEMO GROWTH PATH</div><h2>Learn → Share → Help → Teach</h2></div><span class="journey-count">${tree?3:done} / 3</span></div><div class="journey-steps">${steps.map(([key,title,desc],i)=>`<div class="journey-step ${growth.actions.includes(key)?'done':''} ${!tree&&i===done?'current':''}"><span class="journey-step-mark">${growth.actions.includes(key)?'✓':i+1}</span><div><strong>${title}</strong><p>${desc}</p></div>${!tree&&!growth.actions.includes(key)?`<button class="btn ${tree?'btn-tree':inst?'btn-leaf':'btn-global'}" data-journey-action="${key}">Do this</button>`:'<span class="journey-status">'+(growth.actions.includes(key)?'Complete':'Next')+'</span>'}</div>`).join('')}</div>${tree?'<div class="journey-unlocked"><div class="trust-symbol">'+icon('tree')+'</div><div><div class="eyebrow">TREE READY · DEMO</div><strong>Teaching capability is now visible.</strong><p>This prototype intentionally uses three simple actions so the transition can be demonstrated in a presentation.</p></div></div>':''}</section><aside><div class="tree-panel ${tree?'is-tree':''}"><div class="tree-symbol">${icon(tree?'tree':'leaf')}</div><div class="eyebrow">${worldLabel} ${tree?'TREE':'LEAF'} CAPABILITY</div><h3>${tree?'Approved area: Physics · Demo':'Your growth stays yours.'}</h3><p>${tree?'In production, this would be backed by a reviewed qualification and scoped teaching areas.':'The same E-Leaf identity remains a learner. The demo only reveals the teaching transition after three contributions.'}</p><button class="btn ${tree?'btn-tree':inst?'btn-leaf':'btn-global'}" onclick="${tree?"routeApp('teach')":"routeApp('community')"}">${tree?'View teaching space':'Help someone'}</button></div></aside></div>`;
  $$('#appContent [data-journey-action]').forEach(b=>b.onclick=()=>recordGrowthAction(b.dataset.journeyAction));
}
function renderTeach(){
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${context.world==='institution'?'COLLEGE':'GLOBAL'} · TEACH</div><h1>Help people learn well.</h1><p>Your teaching space should be about learners, sessions, and useful explanations, not vanity metrics.</p></div><button class="btn btn-primary" onclick="demoAction('Session planning is represented in this presentation demo.')">Plan a session</button></div><div class="app-grid"><section><div class="app-card"><div class="eyebrow">Next session</div><h2 style="margin-top:9px">Thinking clearly about probability</h2><p>Prepare a small learning session for people exploring evidence and uncertainty.</p><button class="btn btn-primary" onclick="demoAction('The session workspace is represented in this presentation demo.')">Open session</button></div><div class="card-row"><button class="app-card small-action" onclick="demoAction('Learner management is represented in this presentation demo.')"><span class="eyebrow">Learners</span><strong>See your learners</strong><span>Questions, attendance, and follow-up.</span></button><button class="app-card small-action" onclick="demoAction('Creation tools are represented in this presentation demo.')"><span class="eyebrow">Create</span><strong>Make a learning experience</strong><span>Class, lesson, or useful resource.</span></button><button class="app-card small-action" onclick="routeApp('community')"><span class="eyebrow">Help</span><strong>Answer a question</strong><span>Contribute where your subject knowledge fits.</span></button></div></section><aside><div class="tree-panel"><div class="tree-symbol">${icon('tree')}</div><div class="eyebrow">CAPABILITY</div><h3>Physics · Demo teaching area</h3><p>This presentation build shows a scoped Tree capability. Production teaching areas will be granted through qualification and review.</p></div></aside></div>`;
}
function requestLogout(){
  const modal=$('#logoutConfirm');
  if(!modal)return performLogout();
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  setTimeout(()=>$('#logoutCancel')?.focus(),40);
}
function closeLogout(){
  const modal=$('#logoutConfirm');
  if(!modal)return;
  modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true');
}
async function performLogout(){
  const button=$('#logoutConfirmButton'); if(button){button.disabled=true;button.textContent='Logging out...';}
  try{if(supabaseClient) {const {error}=await supabaseClient.auth.signOut();if(error)throw error;}}catch(err){toast('We could not reach the account service. This device has been signed out locally.');}
  finally{closeLogout();session=null;userProfile=null;context={world:null,institution:null,role:'leaf'};hide($('#appView'));show($('#publicView'));window.scrollTo(0,0);if(button){button.disabled=false;button.textContent='Log out';}}
}

$('#logoutCancel').onclick=closeLogout;
$('#logoutConfirmButton').onclick=performLogout;
$('#logoutConfirm').addEventListener('click',e=>{if(e.target.id==='logoutConfirm')closeLogout()});
$('#loginBtn').onclick=()=>openAuth('login');
$('#joinBtn').onclick=()=>openAuth('signup');
$('#heroJoin').onclick=()=>openAuth('signup');
$('#finalJoin').onclick=()=>openAuth('signup');
$('#heroExplore').onclick=()=>document.querySelector('#explore').scrollIntoView({behavior:'smooth'});
$('#authClose').onclick=closeAuth;
$('#signupTab').onclick=()=>setAuthMode('signup');
$('#loginTab').onclick=()=>setAuthMode('login');
$('#authForm').onsubmit=submitAuth;
$('#passwordToggle').onclick=()=>setPasswordVisibility('#authPassword','#passwordToggle');
$('#confirmPasswordToggle').onclick=()=>setPasswordVisibility('#authPasswordConfirm','#confirmPasswordToggle');
$('#globalChoice').onclick=()=>{if(session)transitionSpace('global');};
$('#institutionChoice').onclick=()=>{if(session)transitionSpace('institution');};
$('#roleClose').onclick=()=>{hide($('#roleOverlay'));show($('#contextOverlay'))};
$('#enterLeaf').onclick=()=>enterApp('leaf');
$('#enterTree').onclick=()=>enterApp('tree');
$$('[data-public-action="course"]').forEach(b=>b.onclick=()=>openAuth('signup','course'));
if(supabaseClient){
  supabaseClient.auth.getSession().then(({data})=>{if(data.session){session=data.session;userProfile=loadProfile(data.session.user)}});
  supabaseClient.auth.onAuthStateChange((_event,s)=>{session=s;if(s)userProfile=loadProfile(s.user)});
}

window.addEventListener('unhandledrejection',event=>{console.error('E-Leaf action failed',event.reason);toast('That action could not be completed. Please try again.');});
window.addEventListener('error',event=>{console.error('E-Leaf interface error',event.error||event.message);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!$('#logoutConfirm')?.classList.contains('hidden'))closeLogout();else if(!$('#authOverlay')?.classList.contains('hidden'))closeAuth();else if(!$('#roleOverlay')?.classList.contains('hidden')){hide($('#roleOverlay'));show($('#contextOverlay'));}}});

// Public growth story: the four steps are an explorable visual, not a passive card grid.
(function bindPublicGrowthStory(){
  const steps=document.querySelectorAll('.growth-story-step');
  const art=document.querySelector('.growth-story-svg');
  if(!steps.length||!art)return;
  const stages=[...art.querySelectorAll('.story-stage')];
  function showStage(index){
    steps.forEach((step,i)=>step.classList.toggle('active',i===index));
    stages.forEach((stage,i)=>stage.classList.toggle('is-current',i===index));
  }
  steps.forEach((step,index)=>{
    step.addEventListener('click',()=>showStage(index));
    step.addEventListener('focus',()=>showStage(index));
  });
  showStage(0);
})();
