function toast(message){
  let el=$('#appToast');
  if(!el){
    el=document.createElement('div'); el.id='appToast'; el.className='app-toast'; el.setAttribute('role','status'); el.setAttribute('aria-live','polite'); el.setAttribute('aria-atomic','true'); document.body.appendChild(el);
  }
  el.textContent=message; el.classList.add('show');
  clearTimeout(window.__eLeafToastTimer);
  window.__eLeafToastTimer=setTimeout(()=>el.classList.remove('show'),2400);
}
function demoAction(message){ toast(message||'This is a demonstration action. No real data was changed.'); }
function updateSkipTarget(target){const link=document.querySelector('.skip-link');if(link)link.setAttribute('href',target)}
function setTransitionControlsBusy(busy){
  ['#changeContext','#changeContextMobile','#changeRole','#logoutBtn'].forEach(selector=>{
    const button=$(selector);
    if(!button)return;
    button.disabled=busy;
    button.setAttribute('aria-disabled',String(busy));
  });
}
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
  // Keep primary navigation stable across worlds; secondary destinations live inside Home and relevant workspaces.
  return [['home','Home'],[context.role==='tree'?'teach':'learn',context.role==='tree'?'Teach':'Learn'],['community','Community'],['journey','Journey']];
}
function setNav(active){
  const nav=$('#appNav');
  if(!nav)return;
  const primaryActive=({classes:context.role==='tree'?'teach':'learn',explore:context.role==='tree'?'teach':'learn',library:context.role==='tree'?'teach':'learn',note:'learn',college:'home',review:'journey'})[active]||active;
  nav.innerHTML=navItems().map(([key,label])=>`<button type="button" class="${primaryActive===key?'active':''}" ${primaryActive===key?'aria-current="page"':''} data-nav="${key}">${navIcon(key)}<span>${label}</span></button>`).join('');
  nav.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>routeApp(button.dataset.nav)));
}
function roleKey(world){return session ? `e_leaf_last_role:${session.user.id}:${world}` : null;}
function growthKeyForWorld(world,institution=null){
  const userId=session?.user?.id||'anonymous';
  const institutionName=world==='institution'?(institution||userProfile?.institution||'Your institution'):'';
  return `${E_LEAF_DEMO_GROWTH_KEY||'e_leaf_growth_v1'}:${userId}:${world}:${institutionName}`;
}
function defaultGrowthState(){return {actions:[],status:'learning',approvedSubjects:[],submittedAt:null,decisionNote:'',updatedAt:null};}
function readGrowthForWorld(world,institution=null){
  const raw=store.get(growthKeyForWorld(world,institution),null);
  if(!raw)return defaultGrowthState();
  const result={...defaultGrowthState(),...raw,actions:Array.isArray(raw.actions)?raw.actions:[],approvedSubjects:Array.isArray(raw.approvedSubjects)?raw.approvedSubjects:[]};
  if(raw.unlocked===true&&!['pending_review','approved','declined'].includes(result.status))result.status='ready_for_review';
  if(result.actions.length>=3&&result.status==='learning')result.status='ready_for_review';
  return result;
}
function writeGrowthState(value,world=context.world,institution=context.institution){value.updatedAt=new Date().toISOString();return store.set(growthKeyForWorld(world,institution),value);}
function rememberedRole(world){if(!session)return 'leaf';const saved=store.get(roleKey(world),null);return saved==='tree'&&treeUnlockedForWorld(world)?'tree':'leaf';}
function treeUnlockedForWorld(world){if(!session)return false;return readGrowthForWorld(world,world==='institution'?(userProfile?.institution||'Your institution'):null).status==='approved';}
function setRememberedRole(role){
  if(session&&context.world)store.set(roleKey(context.world),role);
}
function beginPageReveal(){
  const content=$('#appContent');
  if(!content||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  content.classList.remove('page-enter');
  void content.offsetWidth;
  content.classList.add('page-enter');
  clearTimeout(window.__eLeafPageRevealTimer);
  window.__eLeafPageRevealTimer=setTimeout(()=>content.classList.remove('page-enter'),520);
}
function transitionSpace(targetWorld){
  if(!session)return;
  if(context.world===targetWorld){renderApp();return;}
  if(document.body.classList.contains('e-leaf-transitioning'))return;
  const overlay=$('#spaceTransition');
  $('#spaceTransitionMark').innerHTML=icon(targetWorld==='global'?'globe':'building');
  $('#spaceTransitionEyebrow').textContent=targetWorld==='global'?'GLOBAL SPACE':'INSTITUTIONAL SPACE';
  $('#spaceTransitionTitle').textContent=targetWorld==='global'?'Stepping into the wider world.':'Coming back to your college space.';
  $('#spaceTransitionCopy').textContent=targetWorld==='global'?'There is more to explore beyond one curriculum.':'Your learning returns to the people, classes, and resources of your institution.';
  document.body.classList.add('e-leaf-transitioning');
  setTransitionControlsBusy(true);
  hideAllOverlays(); overlay.classList.remove('hidden','out');
  setTimeout(()=>{
    context.world=targetWorld;
    context.institution=targetWorld==='institution'?(userProfile?.institution||'Your institution'):null;
    context.role=rememberedRole(targetWorld);
    store.set(`e_leaf_last_context:${session.user.id}`,context);
    document.body.dataset.eLeafPage='home';
    renderApp();
    setTransitionControlsBusy(true);
    overlay.classList.add('out');
  },1450);
  setTimeout(()=>{overlay.classList.add('hidden');overlay.classList.remove('out');document.body.classList.remove('e-leaf-transitioning');setTransitionControlsBusy(false)},2150);
}
function transitionRole(targetRole){
  if(context.role===targetRole){renderApp();return;}
  if(document.body.classList.contains('e-leaf-transitioning'))return;
  const overlay=$('#roleTransition');
  const toTree=targetRole==='tree';
  $('#roleTransitionMark').innerHTML=icon(toTree?'tree':'leaf');
  $('#roleTransitionEyebrow').textContent=toTree?`${context.world==='global'?'GLOBAL':'INSTITUTION'} · TREE`:`${context.world==='global'?'GLOBAL':'INSTITUTION'} · LEAF`;
  $('#roleTransitionTitle').textContent=toTree?'Moving into your teaching space.':'Returning to your learning space.';
  $('#roleTransitionCopy').textContent=toTree?'You can keep learning, and now you can teach here too.':'Teaching stays available to you. For now, you are here to learn.';
  document.body.classList.add('e-leaf-transitioning');
  setTransitionControlsBusy(true);
  hideAllOverlays(); overlay.classList.remove('hidden','out','to-tree','to-leaf'); overlay.classList.add(toTree?'to-tree':'to-leaf');
  setTimeout(()=>{
    context.role=targetRole; setRememberedRole(targetRole); store.set(`e_leaf_last_context:${session.user.id}`,context); renderApp(); setTransitionControlsBusy(true);
  },1850);
  setTimeout(()=>{overlay.classList.add('out')},1980);
  setTimeout(()=>{overlay.classList.add('hidden');overlay.classList.remove('out','to-tree','to-leaf');document.body.classList.remove('e-leaf-transitioning');setTransitionControlsBusy(false)},2750);
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
    isDemoSession=false;
    userProfile=loadProfile(session.user);
    closeAuth();
    if(userProfile.setupComplete)showContext();else showOnboarding();
  }catch(err){
    $('#authMessage').style.color='var(--danger)';
    $('#authMessage').textContent=friendlyAuthError(err);
  }finally{setAuthBusy(false);}
}
function showContext(){hideAllOverlays();show($('#contextOverlay'));$('#contextClose')?.focus();}
let onboardingDraft={},onboardingStepIndex=0;
function onboardingStages(){
  const base=[{key:'name',title:'What should we call you?',copy:'Your learning space should feel like yours from the beginning.',placeholder:'Your name',required:true,max:80},
    {key:'world',title:'Where would you like to begin?',copy:'Your choice shapes the space we set up for you.',kind:'world',required:true}];
  if(onboardingDraft.world==='institution')base.push(
    {key:'institution',title:'Where are you studying?',copy:'Choose the college community you belong to.',placeholder:'College or institution name',required:true,max:120},
    {key:'course',title:'What course are you pursuing?',copy:'We will use this to make your academic space more relevant.',placeholder:'e.g. B.Tech Computer Science',required:true,max:100},
    {key:'year',title:'Which year are you in?',copy:'This helps E-Leaf understand your academic context.',kind:'select',options:['1st year','2nd year','3rd year','4th year','5th year or above','Not applicable'],optional:true},
    {key:'semester',title:'Which semester are you in?',copy:'You can update this whenever your semester changes.',kind:'select',options:['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8','Not applicable'],optional:true},
    {key:'rollNumber',title:'Would you like to add your roll number?',copy:'This is optional. You can leave it blank and add it later if your institution needs it.',placeholder:'Roll number (optional)',optional:true,max:40});
  base.push({key:'interests',title:'What are you curious about?',copy:'Add a few subjects or interests. You can change these any time.',placeholder:'e.g. Python, psychology, astronomy',optional:true,max:240});
  return base;
}
function showOnboarding(){hideAllOverlays();fillOnboarding();show($('#onboardingOverlay'));renderOnboardingStep();}
function fillOnboarding(){const p=userProfile||{};onboardingDraft={name:p.name==='Demo Learner'?'':(p.name||''),world:'',institution:p.institution||'',course:p.course||'',year:p.year||'',semester:p.semester||'',rollNumber:p.rollNumber||'',interests:p.interests||''};onboardingStepIndex=0;$('#onboardingMessage').textContent='';}
function renderOnboardingStep(){
  const stages=onboardingStages();onboardingStepIndex=Math.max(0,Math.min(onboardingStepIndex,stages.length-1));const step=stages[onboardingStepIndex];
  $('#onboardingStepLabel').textContent=`STEP ${onboardingStepIndex+1} OF ${stages.length}`;$('#onboardingProgressFill').style.width=`${((onboardingStepIndex+1)/stages.length)*100}%`;
  $('#onboardingTitle').textContent=step.title;$('#onboardingCopy').textContent=step.copy;$('#onboardingMessage').textContent='';
  const host=$('#onboardingStepContent');
  if(step.kind==='world')host.innerHTML=`<div class="onboarding-world-options"><button type="button" class="onboarding-world-choice ${onboardingDraft.world==='institution'?'selected':''}" data-onboarding-world="institution"><span class="onboarding-choice-icon">${icon('building')}</span><strong>Institutional</strong><small>Learn with your college community.</small></button><button type="button" class="onboarding-world-choice ${onboardingDraft.world==='global'?'selected':''}" data-onboarding-world="global"><span class="onboarding-choice-icon">${icon('globe')}</span><strong>Global</strong><small>Explore interests beyond one institution.</small></button></div>`;
  else if(step.kind==='select')host.innerHTML=`<label class="onboarding-step-label" for="onboardingStepInput">${step.key==='year'?'Academic year':'Semester'}</label><select id="onboardingStepInput" class="onboarding-step-input"><option value="">Choose later</option>${step.options.map(v=>`<option ${onboardingDraft[step.key]===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select>`;
  else host.innerHTML=`<label class="onboarding-step-label" for="onboardingStepInput">${step.key==='name'?'Your name':step.key==='institution'?'College or institution':step.key==='course'?'Course or degree':step.key==='rollNumber'?'Roll number':'Subjects and interests'}</label><input id="onboardingStepInput" class="onboarding-step-input" ${step.required?'required':''} maxlength="${step.max||240}" value="${escapeHtml(onboardingDraft[step.key]||'')}" placeholder="${escapeHtml(step.placeholder||'')}" autocomplete="${step.key==='name'?'name':'off'}">`;
  $('#onboardingBack').disabled=onboardingStepIndex===0;$('#onboardingBack').style.visibility=onboardingStepIndex===0?'hidden':'visible';$('#onboardingSkip').classList.toggle('hidden',!step.optional);$('#onboardingContinue').textContent=onboardingStepIndex===stages.length-1?'Finish setup':'Continue';
  host.querySelectorAll('[data-onboarding-world]').forEach(button=>button.addEventListener('click',()=>{onboardingDraft.world=button.dataset.onboardingWorld;const current=onboardingStages();onboardingStepIndex=Math.min(onboardingStepIndex,current.length-1);renderOnboardingStep();}));
  const input=$('#onboardingStepInput');if(input)input.focus();
}
function captureOnboardingStep(){const stages=onboardingStages(),step=stages[onboardingStepIndex],input=$('#onboardingStepInput');if(step.kind==='world'&&!onboardingDraft.world){$('#onboardingMessage').textContent='Choose where you would like to begin.';return false;}if(input){const value=input.value.trim();if(step.required&&!value){$('#onboardingMessage').textContent=step.key==='name'?'Please enter the name you want to use on E-Leaf.':`Please add your ${step.key==='institution'?'college':step.key==='course'?'course':'answer'} to continue.`;input.focus();return false;}onboardingDraft[step.key]=value;}return true;}
function nextOnboardingStep(skip=false){if(!skip&&!captureOnboardingStep())return;const stages=onboardingStages();if(onboardingStepIndex<stages.length-1){onboardingStepIndex++;renderOnboardingStep();return;}saveOnboarding();}
function saveOnboarding(){const name=(onboardingDraft.name||'').trim();if(!name){$('#onboardingMessage').textContent='Please enter the name you want to use on E-Leaf.';onboardingStepIndex=0;renderOnboardingStep();return;}userProfile={...(userProfile||{}),name,institution:onboardingDraft.world==='institution'?(onboardingDraft.institution||'').trim()||null:null,course:(onboardingDraft.course||'').trim(),year:onboardingDraft.year||'',semester:onboardingDraft.semester||'',rollNumber:(onboardingDraft.rollNumber||'').trim(),interests:(onboardingDraft.interests||'').trim(),setupComplete:true};if(isDemoSession){userProfile.avatarData='';}else saveProfile();hide($('#onboardingOverlay'));context.world=onboardingDraft.world||'institution';context.institution=context.world==='institution'?(userProfile.institution||'Your institution'):null;openRole(context.world,context.institution);}

function startDemoSession(){
  isDemoSession=true;
  // A fresh demo session is intentionally ephemeral and starts with no Leaf-to-Tree activity.
  session={user:{id:'demo-user',email:null,user_metadata:{full_name:'Demo Learner'}}};
  userProfile={name:'',institution:null,course:'',year:'',semester:'',rollNumber:'',interests:'',avatarData:'',setupComplete:false};
  try{Object.keys(localStorage).filter(key=>key.startsWith('e_leaf_growth_v1:demo-user:')).forEach(key=>localStorage.removeItem(key));}catch(err){}
  store.remove('e_leaf_last_context:demo-user');store.remove('e_leaf_last_role:demo-user:institution');store.remove('e_leaf_last_role:demo-user:global');
  context={world:null,institution:null,role:'leaf'};
  closeAuth();showOnboarding();
}
function openProfile(){if(!session)return;const p=userProfile||{};$('#profileName').value=p.name||'';$('#profileCollege').value=p.institution||'';$('#profileCourse').value=p.course||'';$('#profileYear').value=p.year||'';$('#profileSemester').value=p.semester||'';$('#profileRoll').value=p.rollNumber||'';$('#profileInterests').value=p.interests||'';$('#profileMessage').textContent='';renderProfilePhoto();show($('#profileOverlay'));}
function renderProfilePhoto(){const el=$('#profilePhotoPreview');if(!el)return;const p=userProfile||{};el.innerHTML=p.avatarData?`<img src="${p.avatarData}" alt="Profile photo preview">`:escapeHtml(initials(p.name||'Learner'));}
function saveProfileForm(e){e.preventDefault();userProfile={...(userProfile||{}),name:$('#profileName').value.trim(),institution:$('#profileCollege').value.trim()||null,course:$('#profileCourse').value.trim(),year:$('#profileYear').value,semester:$('#profileSemester').value,rollNumber:$('#profileRoll').value.trim(),interests:$('#profileInterests').value.trim(),setupComplete:true};if(!userProfile.name){$('#profileMessage').textContent='Please enter your name.';return;}saveProfile();hide($('#profileOverlay'));if(context.world==='institution')context.institution=userProfile.institution||'Your institution';renderApp();toast(isDemoSession?'Profile updated for this demo session.':'Profile updated on this browser.');}
function handlePhotoUpload(e){const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){toast('Choose an image file.');return;}if(file.size>1*1024*1024){toast('Choose an image smaller than 1 MB.');e.target.value='';return;}const reader=new FileReader();reader.onload=()=>{userProfile={...(userProfile||{}),avatarData:String(reader.result||'')};renderProfilePhoto();};reader.readAsDataURL(file);}
function closeContext(){hide($('#contextOverlay'));if(context.world){renderApp();}else{show($('#publicView'));hide($('#appView'));updateSkipTarget('#publicMain');}}
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
    ?(treeUnlockedForWorld(world)?'Choose how you want to participate in the wider learning community today.':'Everyone starts as a Leaf. Tree becomes available after readiness review and administrator approval.')
    :(treeUnlockedForWorld(world)?`You are part of ${context.institution}. Choose how you want to enter it today.`:`You are part of ${context.institution}. Start as a Leaf; Tree access follows readiness review and administrator approval.`);
  $('#enterTree').classList.toggle('hidden',!treeUnlockedForWorld(world));
  show($('#roleOverlay'));
}
function enterApp(role){
  if(!session){toast('Please log in before entering E-Leaf.');openAuth('login');return;}
  if(role==='tree'&&!treeUnlockedForContext()){toast('Tree access opens after an administrator approves your review.');return;}
  if(context.role===role){setRememberedRole(role);store.set('e_leaf_last_context:'+session.user.id,context);hideAllOverlays();renderApp();return;}
  transitionRole(role);
}
function recordGrowthAction(action){
  if(context.role!=='leaf'||!session)return;
  const state=growthState();
  if(['pending_review','approved'].includes(state.status))return;
  if(state.actions.includes(action)){toast('That activity is already reflected in your learning journey.');return;}
  state.actions.push(action);
  // Illustrative demo signals only; this is not a production ML assessment.
  if(state.actions.length>=3&&state.status!=='declined')state.status='ready_for_review';
  else if(state.status==='declined')state.status='learning';
  writeGrowthState(state);
  renderGrowthDock(true);
  if(document.body.dataset.eLeafPage==='journey')renderJourney();
  toast(state.status==='ready_for_review'?'Your learning journey is ready to be submitted for administrator review.':'Activity saved. Your learning journey continues to develop.');
}
function submitTreeReview(){
  const value=growthState();
  if(value.status!=='ready_for_review'){toast('Keep participating as a Leaf. Your review will become available when the demo assessment is ready.');return;}
  value.status='pending_review';value.submittedAt=new Date().toISOString();value.decisionNote='';writeGrowthState(value);renderGrowthDock();renderJourney();toast('Submitted to the administrator review queue.');
}
function renderReviewQueue(){
  const value=growthState(),subjects=['Python fundamentals','Physics','Programming'];
  const date=value.submittedAt?new Date(value.submittedAt).toLocaleString():'Not submitted';
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">DEMO ADMIN WORKSPACE · REVIEW QUEUE</div><h1>Review Tree eligibility.</h1><p>Illustrative administrator flow for this presentation build. Decisions and subject permissions are stored locally in this browser; this is not production admin authorization.</p></div><button class="btn btn-neutral" onclick="routeApp('journey')">Back to learning journey</button></div><div class="review-layout"><section class="app-card review-candidate"><div class="review-topline"><span class="review-avatar">${escapeHtml(initials(userProfile?.name||'Learner'))}</span><div><div class="eyebrow">CANDIDATE</div><h2>${escapeHtml(userProfile?.name||'Learner')}</h2><p>${escapeHtml(session?.user?.email||'Demo account')} · ${context.world==='institution'?'Institutional':'Global'} World</p></div><span class="review-status ${value.status==='pending_review'?'is-pending':value.status==='approved'?'is-approved':''}">${value.status.replaceAll('_',' ')}</span></div><div class="review-evidence"><div><span class="eyebrow">ASSESSMENT SUMMARY</span><h3>Learning pattern review</h3><p>Review the overall learning journey and the available demonstration signals. The exact eligibility criteria are intentionally not shown as a fixed checklist.</p></div><div class="review-evidence-grid"><div><strong>${value.actions.length?'Recorded':'No'} activity</strong><span>Learning journey activity</span></div><div><strong>${value.status==='pending_review'?'Ready for review':value.status==='approved'?'Approved':'In progress'}</strong><span>Assessment state</span></div><div><strong>${date}</strong><span>Submission time</span></div></div></div>${value.status==='pending_review'?`<div class="review-decision"><h3>Teaching scope</h3><p>Select subject areas to authorize if the candidate is approved.</p><div class="review-subjects">${subjects.map(subject=>`<label><input type="checkbox" name="reviewSubject" value="${escapeHtml(subject)}" ${value.approvedSubjects.includes(subject)?'checked':''}> <span>${escapeHtml(subject)}</span></label>`).join('')}</div><label class="review-note-label" for="reviewNote">Optional review note</label><textarea id="reviewNote" rows="3" placeholder="Add a brief internal note (optional)">${escapeHtml(value.decisionNote||'')}</textarea><div class="review-actions"><button class="btn btn-neutral" id="declineReview">Decline for now</button><button class="btn btn-tree" id="approveReview">Approve Tree</button></div></div>`:value.status==='approved'?`<div class="review-result success"><strong>Tree approved</strong><p>Approved subjects: ${escapeHtml(value.approvedSubjects.join(', ')||'No subject assigned')}.</p><button class="btn btn-tree" onclick="enterApp('tree')">Open approved Tree space</button></div>`:value.status==='declined'?`<div class="review-result"><strong>Review declined</strong><p>${escapeHtml(value.decisionNote||'The candidate can continue learning and be reconsidered later.')}</p><button class="btn btn-neutral" onclick="routeApp('journey')">Return to journey</button></div>`:`<div class="review-result"><strong>No application is waiting for review.</strong><p>Return to the Leaf journey and submit once the demonstration assessment is ready.</p><button class="btn btn-leaf" onclick="routeApp('journey')">Open learning journey</button></div>`}</section><aside class="tree-panel review-principle"><div class="tree-symbol">${icon('tree')}</div><div class="eyebrow">HUMAN REVIEW</div><h3>Readiness is not authorization.</h3><p>The assessment can surface a candidate for review. An administrator makes the final decision and grants teaching scope by subject.</p></aside></div>`;
  $('#approveReview')?.addEventListener('click',()=>{const selected=$$('#appContent input[name="reviewSubject"]:checked').map(input=>input.value);if(!selected.length){toast('Select at least one subject before approving Tree access.');return;}value.status='approved';value.approvedSubjects=selected;value.decisionNote=$('#reviewNote')?.value.trim()||'';value.reviewedAt=new Date().toISOString();writeGrowthState(value);store.set(roleKey(context.world),'tree');toast('Tree approved with subject permissions.');renderApp();routeApp('review');});
  $('#declineReview')?.addEventListener('click',()=>{value.status='declined';value.decisionNote=$('#reviewNote')?.value.trim()||'Not approved at this time. Continue learning and return when ready.';value.reviewedAt=new Date().toISOString();writeGrowthState(value);renderReviewQueue();toast('Review decision saved in the demo queue.');});
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
  updateSkipTarget('#appContentStart');
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
      <div class="app-actions"><button class="btn btn-soft" id="changeContext">Change world</button><button class="role-switch" id="changeRole" aria-label="Switch to ${context.role==='tree'?'Leaf':'Tree'} mode"><span class="role-switch-icon">${icon(context.role==='tree'?'tree':'leaf')}</span><span>${roleName}</span></button><button type="button" class="profile-btn" id="profileBtn" aria-label="Edit profile for ${escapeHtml(name)}"><span class="profile-avatar">${userProfile?.avatarData?`<img src="${userProfile.avatarData}" alt="">`:initials(name)}</span><span>${escapeHtml(name)}</span></button><button class="btn btn-soft" id="logoutBtn">Log out</button></div>
    </div></header>
    <main id="appContentStart" class="app-body dashboard-layout" tabindex="-1"><aside class="app-sidebar"><div class="sidebar-space-label">${icon(context.world==='global'?'globe':'building')}<span><strong>${escapeHtml(contextName)}</strong><small>${context.world==='global'?'Global Commons':'Institutional Space'}</small></span></div><div class="sidebar-orientation">${contextOrientation()}</div><nav class="app-nav" id="appNav" aria-label="Primary navigation"></nav><div id="growthDock" class="sidebar-growth"></div></aside><section class="app-main"><aside class="demo-notice" role="note" aria-label="Demonstration build notice"><strong>Preview environment</strong><span>${isDemoSession?'Demo session · no email or backend required. Progress resets on a new demo session.':'Sample learning content is illustrative. Account access uses Supabase; Tree review is simulated in this build.'}</span></aside><div id="appContent" class="app-content"></div></section></main>
  </div>`;
  show($('#appView'));
  $('#appBrand').onclick=()=>routeApp('home');
  $('#changeContext').onclick=()=>showContext();
  $('#changeContextMobile').onclick=()=>showContext();
  $('#changeRole').onclick=()=>openRole(context.world,context.institution);
  $('#logoutBtn').onclick=requestLogout;
  $('#profileBtn').onclick=openProfile;
  const validPages=context.role==='tree'
    ? ['home','teach','community','journey','classes','college','explore','library']
    : ['home','learn','community','journey','classes','college','explore','note','library'];
  const page=validPages.includes(document.body.dataset.eLeafPage)?document.body.dataset.eLeafPage:'home';
  routeApp(page);
}
function renderGrowthDock(animate=false){
  const dock=$('#growthDock');if(!dock)return;
  if(!session||context.role!=='leaf'){dock.replaceChildren();return;}
  const growth=growthState(),done=growthDone(),fillY=done===3?0:204-(Math.max(0,Math.min(100,growthPercent()))*1.87);
  const ready=['ready_for_review','pending_review','approved'].includes(growth.status);
  const label=growth.status==='approved'?'TREE APPROVED':growth.status==='pending_review'?'IN REVIEW':growth.status==='ready_for_review'?'READY FOR REVIEW':'TREE LOCKED';
  const detail=growth.status==='approved'?'Your Tree capability is approved.':growth.status==='pending_review'?'An administrator is reviewing your journey.':growth.status==='ready_for_review'?'Submit your journey for administrator review.':'Start as a Leaf. Tree access follows review and approval.';
  const previousWater=dock.querySelector('.growth-water'),previousY=previousWater?Number(previousWater.getAttribute('y')||fillY):null;
  dock.innerHTML=`<aside class="growth-tree-dock growth-stage-${done} ${ready?'growth-complete':''} ${growth.status==='approved'?'is-approved':''}" aria-label="Tree growth status"><div class="growth-tree-wrap"><svg class="growth-tree-art" viewBox="0 0 180 220" role="img" aria-label="Tree growth illustration"><defs><clipPath id="growthTreeClip"><path d="M90 204V121C90 101 74 91 59 81C46 72 41 57 48 43C55 28 72 25 84 34C88 20 100 12 113 17C126 22 132 34 128 47C144 47 155 58 155 71C155 87 142 97 125 98C119 99 113 102 110 111C106 122 105 138 105 155V204Z"/></clipPath></defs><path class="growth-tree-outline" d="M90 204V121C90 101 74 91 59 81C46 72 41 57 48 43C55 28 72 25 84 34C88 20 100 12 113 17C126 22 132 34 128 47C144 47 155 58 155 71C155 87 142 97 125 98C119 99 113 102 110 111C106 122 105 138 105 155V204"/><g clip-path="url(#growthTreeClip)"><rect class="growth-water" x="24" y="${fillY}" width="132" height="220" rx="12"/><path class="growth-water-ripple" d="M20 ${fillY} C48 ${fillY-5},69 ${fillY+5},90 ${fillY} S132 ${fillY-5},160 ${fillY}"/></g><path class="growth-trunk-line" d="M90 204V125M90 154 69 135M90 168l22-25M90 141l-13-17M90 183l15-13"/></svg><div class="growth-tree-copy"><span>${label}</span><small>${detail}</small><button type="button" class="growth-ready-cta">${growth.status==='approved'?(context.role==='tree'?'View journey':'Switch to Tree'):growth.status==='pending_review'?'View review status':growth.status==='ready_for_review'?'Review journey':'View growth journey'}</button></div></div></aside>`;
  const tree=dock.querySelector('.growth-tree-dock');dock.querySelector('.growth-ready-cta')?.addEventListener('click',()=>growth.status==='approved'?(context.role==='tree'?routeApp('journey'):enterApp('tree')):routeApp('journey'));
  if(animate&&previousY!==null){const water=tree.querySelector('.growth-water');water.style.y=`${previousY}px`;requestAnimationFrame(()=>{water.style.y=`${fillY}px`;});}
}

function renderHome(){
  document.body.dataset.eLeafPage='home';
  setNav('home');
  renderGrowthDock();
  const name=userProfile?.name||'Learner';
  if(context.world==='institution')renderInstitutionHome(name);
  else renderGlobalHome(name);
}
function dashboardSubjectCards(tree,inst,subjects){
  const all=Array.isArray(DEMO_COURSES)?DEMO_COURSES:[];
  const scoped=tree&&subjects.length?all.filter(c=>subjects.some(subject=>[c.subject,c.title].some(v=>String(v).toLowerCase().includes(String(subject).toLowerCase())||String(subject).toLowerCase().includes(String(v).toLowerCase())))):all;
  if(tree&&!subjects.length)return `<div class="dashboard-empty"><span class="dashboard-empty-mark">${icon('tree')}</span><strong>Your teaching scope will appear here.</strong><p>Approved subjects determine what you can teach. Open your teaching space to explore the demo workflow.</p><button class="btn btn-tree" onclick="routeApp('teach')">Open teaching space</button></div>`;
  if(!scoped.length)return `<div class="dashboard-empty"><strong>No subjects match your approved scope.</strong><p>Check your assigned teaching subjects in Your Journey.</p><button class="btn btn-neutral" onclick="routeApp('journey')">View journey</button></div>`;
  return `<div class="dashboard-subject-grid">${scoped.map((c,i)=>`<button class="dashboard-subject-card" onclick="routeApp('${tree?'teach':inst?'classes':'learn'}')"><span class="subject-card-top"><span class="subject-code">${escapeHtml(inst?['CS 101','PHYS 110','PHIL 102'][i%3]:'OPEN SUBJECT')}</span><span class="subject-card-arrow" aria-hidden="true">↗</span></span><strong>${escapeHtml(c.title)}</strong><p>${escapeHtml(c.detail)}</p><span class="subject-card-divider"></span><span class="subject-card-meta"><span>${tree?'Teaching workspace':c.meta.split(' · ')[0]}</span><span>${tree?'Open subject':'Continue'} →</span></span></button>`).join('')}</div>`;
}
function renderDashboardHome(name,inst){
  const tree=context.role==='tree',subjects=growthState().approvedSubjects||[],interests=(userProfile?.interests||'').split(',').map(v=>v.trim()).filter(Boolean).slice(0,3);
  const title=tree?`Welcome back, ${escapeHtml(name)}.`:inst?`Good to see you, ${escapeHtml(name)}.`:`What would you like to learn, ${escapeHtml(name)}?`;
  const copy=tree?'Your teaching workspace is focused on approved subjects, learner questions, and useful explanations.':inst?'Continue a subject, ask a question, or learn with your college community.':'Explore ideas, subjects, and people beyond one institution.';
  const action=tree?'Open teaching space':inst?'Explore curriculum':'Explore subjects';
  const actionRoute=tree?'teach':inst?'classes':'explore';
  const eyebrow=`${inst?'INSTITUTIONAL':'GLOBAL'} · ${tree?'TREE':'LEAF'} WORKSPACE`;
  const sectionTitle=tree?'Your teaching subjects':inst?'Curriculum subjects':'Subjects to explore';
  const sectionCopy=tree?'Support learners in the subject areas approved for you.':inst?'Each subject is a learning journey. Move at your own pace, ask for help, and learn with peers.':'Choose a subject to start learning, find alternate explanations, and share what you discover.';
  const shortcuts=tree?[['community','Learner questions','Answer a question or support a learner.','community'],['journey','Your journey','Review your teaching scope and growth.','journey'],['teach','Teaching space','Prepare an explanation or learning session.','teach']]:[['community','Peer questions','Ask questions and learn with other people.','community'],['journey','Your journey','See your progress and what comes next.','journey'],[inst?'college':'library',inst?'College space':'Your library',inst?'Academic resources and college context.':'Keep useful notes and ideas close.','library']];
  $('#appContent').innerHTML=`<section class="reference-dashboard"><div class="dashboard-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${copy}</p></div><button class="btn ${tree?'btn-tree':inst?'btn-leaf':'btn-global'}" onclick="routeApp('${actionRoute}')">${action} <span aria-hidden="true">→</span></button></div><div class="dashboard-section-heading"><div><h2>${sectionTitle}</h2><p>${sectionCopy}</p></div><button class="dashboard-text-action" onclick="routeApp('${actionRoute}')">${tree?'View teaching space':'View all'} <span aria-hidden="true">→</span></button></div>${dashboardSubjectCards(tree,inst,subjects)}<div class="dashboard-lower-heading"><div><h2>${tree?'Where you can help':'Keep your learning moving'}</h2><p>${tree?'Choose a useful next step for the people you teach.':interests.length?`Based on your interests: ${escapeHtml(interests.join(', '))}.`:'Small next steps make learning easier to return to.'}</p></div></div><div class="dashboard-shortcut-grid">${shortcuts.map(([route,label,desc,ico])=>`<button class="dashboard-shortcut" onclick="routeApp('${route}')"><span class="dashboard-shortcut-icon">${icon(ico)}</span><span><strong>${label}</strong><small>${desc}</small></span><span class="dashboard-shortcut-arrow" aria-hidden="true">→</span></button>`).join('')}</div></section>`;
}
function renderInstitutionHome(name){renderDashboardHome(name,true)}
function renderGlobalHome(name){renderDashboardHome(name,false)}
function routeApp(page){
  document.body.dataset.eLeafPage=page||'home';
  if(page==='home'){renderHome();beginPageReveal();return;}
  renderGrowthDock();
  setNav(page);
  const pages={explore:renderExplore,learn:renderLearn,community:renderCommunity,library:renderLibrary,note:renderLibrary,journey:renderJourney,teach:renderTeach,classes:renderClasses,college:renderCollege,review:renderReviewQueue};
  (pages[page]||renderHome)();
  beginPageReveal();
}
function renderClasses(){
  const inst=context.world==='institution';
  const title=inst?'Classes in your college':'Classes across E-Leaf';
  const copy=inst?'See what is happening in your curriculum and community.':'Choose a subject, teacher, or live session from anywhere in the wider community.';
  const approved=growthState().approvedSubjects.map(x=>x.toLowerCase());
  const courses=context.role==='tree'?DEMO_COURSES.filter(c=>approved.some(subject=>subject.includes(c.subject.toLowerCase())||subject.includes(c.title.toLowerCase())||c.title.toLowerCase().includes(subject))):DEMO_COURSES;
  const empty=context.role==='tree'?'<div class="empty-state"><strong>No matching teaching area.</strong><span>Your administrator-approved subjects determine which classes you can prepare.</span></div>':'';
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${inst?'COLLEGE':'GLOBAL'} · CLASSES</div><h1>${title}</h1><p>${context.role==='tree'?'Prepare classes only within the teaching subjects approved for you.':copy}</p></div></div><div class="course-grid">${courses.map(c=>`<button class="course" style="text-align:left" onclick="routeApp(context.role==='tree'?'teach':'learn')"><span class="course-tag">${c.subject}</span><h3>${c.title}</h3><p>${c.detail}</p><div class="course-meta"><span>${inst?'College class':'Global class'}</span><span>${c.meta.split(' · ')[1]}</span></div><span class="course-action ${context.role==='tree'?'course-action-tree':'course-action-leaf'}">${context.role==='tree'?'Prepare':'Join'}</span></button>`).join('')}${courses.length?'':empty}</div>`;
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
  const tree=context.role==='tree',inst=context.world==='institution',worldLabel=inst?'INSTITUTION':'GLOBAL',growth=growthState();
  const statusMap={learning:['Learning pattern developing','E-Leaf considers learning behaviour over time. Exact eligibility criteria are not displayed as a fixed checklist.'],ready_for_review:['Ready to request review','Your demo assessment has reached the review stage. Submit it to the administrator queue for a human decision.'],pending_review:['Awaiting administrator review','Your request has been submitted. Tree access stays locked until an administrator approves it.'],approved:['Tree approved','Your teaching capability is active for the subjects assigned by the administrator.'],declined:['Not approved at this time','You can continue learning as a Leaf. Review decisions are part of this demonstration flow.']};
  const [statusTitle,statusCopy]=statusMap[growth.status]||statusMap.learning,canSubmit=growth.status==='ready_for_review';
  const actionButtons=tree?'':`<div class="journey-activity-actions"><button class="btn btn-leaf" onclick="routeApp('${inst?'classes':'learn'}')">Continue learning</button><button class="btn btn-neutral" onclick="routeApp('${inst?'note':'library'}')">Share a useful note</button><button class="btn btn-neutral" onclick="routeApp('community')">Help in the community</button></div>`;
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${worldLabel} · YOUR JOURNEY</div><h1>${tree?'Keep learning. Keep teaching.':'Join as a Leaf. Grow through learning.'}</h1><p>${tree?'Your Tree capability adds teaching responsibility without taking away your learner identity.':'Your learning journey can open the possibility of becoming a Tree. The decision is based on an evolving assessment and final administrator review.'}</p></div><button class="btn ${tree?'btn-tree':inst?'btn-leaf':'btn-global'}" onclick="${tree?"routeApp('teach')":`routeApp('${inst?'classes':'learn'}')`}">${tree?'Open teaching':'Continue learning'}</button></div><div class="journey-layout"><section class="journey-card"><div class="journey-header"><div><div class="eyebrow">YOUR GROWTH JOURNEY</div><h2>${tree?'Your teaching capability':'Learning becomes contribution'}</h2></div><span class="journey-status-pill ${growth.status==='approved'?'is-approved':growth.status==='pending_review'?'is-pending':''}">${statusTitle}</span></div><div class="journey-status-panel"><div class="journey-status-icon">${icon(tree?'tree':'leaf')}</div><div><strong>${tree?'You are a Tree and still a Leaf.':statusTitle}</strong><p>${statusCopy}</p></div></div><div class="journey-principles"><div><span class="journey-principle-mark">01</span><strong>Learn with intention</strong><p>Build understanding through subjects, classes, and questions.</p></div><div><span class="journey-principle-mark">02</span><strong>Reflect and contribute</strong><p>Make what you understand useful to someone else.</p></div><div><span class="journey-principle-mark">03</span><strong>Earn teaching trust</strong><p>Readiness is assessed over time, then reviewed by a person.</p></div></div>${actionButtons}${canSubmit?`<div class="journey-submit-panel"><div><strong>Your journey is ready for review.</strong><p>Submit it to the administrator review queue. Approval is not automatic.</p></div><button class="btn btn-leaf" id="submitTreeReview">Submit for review</button></div>`:''}${growth.status==='pending_review'?`<div class="journey-submit-panel"><div><strong>Review requested</strong><p>Your request is waiting in the administrator queue. You remain a Leaf until approval.</p></div><button class="btn btn-neutral" id="previewReviewQueue">View review queue (demo)</button></div>`:''}${growth.status==='approved'?`<div class="journey-submit-panel approved-panel"><div><strong>${tree?'Your Tree capability is active':'Tree capability approved'}</strong><p>Teaching subjects: ${escapeHtml(growth.approvedSubjects.join(', ')||'No subject assigned')}.</p></div>${tree?`<button class="btn btn-tree" onclick="routeApp('teach')">Open teaching space</button>`:`<button class="btn btn-tree" onclick="enterApp('tree')">Switch to Tree</button>`}</div>`:''}${growth.status==='declined'?`<div class="journey-submit-panel"><div><strong>You can keep growing.</strong><p>The review did not grant Tree access this time. Continue learning and revisit your journey later.</p></div><button class="btn btn-leaf" id="continueAfterDecline">Continue journey</button></div>`:''}</section><aside><div class="tree-panel ${tree?'is-tree':''}"><div class="tree-symbol">${icon(tree?'tree':'leaf')}</div><div class="eyebrow">${worldLabel} ${tree?'TREE':'LEAF'} CAPABILITY</div><h3>${tree?'Approved teaching scope':'A possibility, not a promise.'}</h3><p>${tree?`You are authorised to teach: ${escapeHtml(growth.approvedSubjects.join(', ')||'No subject assigned')}. You can still switch back to Leaf mode whenever you want to learn.`:'E-Leaf looks at patterns in how people learn, reflect, and contribute. The exact decision criteria stay private and can evolve with the assessment model.'}</p>${tree?`<button class="btn btn-tree" onclick="routeApp('teach')">View teaching space</button>`:`<div class="journey-trust-note"><strong>Human review stays in the loop.</strong><span>An administrator makes the final decision and assigns the subjects you may teach.</span></div>`}</div></aside></div>`;
  $('#submitTreeReview')?.addEventListener('click',submitTreeReview);$('#previewReviewQueue')?.addEventListener('click',()=>routeApp('review'));
  $('#continueAfterDecline')?.addEventListener('click',()=>{const next=growthState();next.status='learning';next.actions=[];next.submittedAt=null;next.approvedSubjects=[];next.decisionNote='';writeGrowthState(next);renderJourney();toast('Your learning journey is open again.');});
}

function renderTeach(){
  const growth=growthState();
  $('#appContent').innerHTML=`<div class="welcome"><div><div class="eyebrow">${context.world==='institution'?'COLLEGE':'GLOBAL'} · TEACH</div><h1>Help people learn well.</h1><p>Your teaching space should be about learners, sessions, and useful explanations, not vanity metrics.</p></div><button class="btn btn-primary" onclick="demoAction('Session planning is represented in this presentation demo.')">Plan a session</button></div><div class="app-grid"><section><div class="app-card"><div class="eyebrow">Next session</div><h2 style="margin-top:9px">Thinking clearly about probability</h2><p>Prepare a small learning session for people exploring evidence and uncertainty.</p><button class="btn btn-primary" onclick="demoAction('The session workspace is represented in this presentation demo.')">Open session</button></div><div class="card-row"><button class="app-card small-action" onclick="demoAction('Learner management is represented in this presentation demo.')"><span class="eyebrow">Learners</span><strong>See your learners</strong><span>Questions, attendance, and follow-up.</span></button><button class="app-card small-action" onclick="demoAction('Creation tools are represented in this presentation demo.')"><span class="eyebrow">Create</span><strong>Make a learning experience</strong><span>Class, lesson, or useful resource.</span></button><button class="app-card small-action" onclick="routeApp('community')"><span class="eyebrow">Help</span><strong>Answer a question</strong><span>Contribute where your subject knowledge fits.</span></button></div></section><aside><div class="tree-panel"><div class="tree-symbol">${icon('tree')}</div><div class="eyebrow">CAPABILITY</div><h3>${escapeHtml(growth.approvedSubjects.join(', ')||'Approved teaching subjects')}</h3><p>Your teaching workspace is limited to the subject areas approved by the administrator. You can return to Leaf mode to keep learning.</p></div></aside></div>`;
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
  closeLogout();
  if(!isDemoSession){try{await supabaseClient?.auth.signOut();}catch(err){console.warn('Supabase sign-out did not complete; clearing the local interface session.',err);}}
  session=null;userProfile=null;isDemoSession=false;context={world:null,institution:null,role:'leaf'};
  hide($('#appView'));show($('#publicView'));updateSkipTarget('#publicMain');window.scrollTo(0,0);
}

$('#logoutCancel').onclick=closeLogout;
$('#logoutConfirmButton').onclick=performLogout;
$('#logoutConfirm').addEventListener('click',e=>{if(e.target.id==='logoutConfirm')closeLogout()});
$('#loginBtn').onclick=()=>openAuth('login');
$('#joinBtn').onclick=()=>openAuth('signup');
$('#heroJoin').onclick=()=>openAuth('signup');
$('#finalJoin').onclick=()=>openAuth('signup');
$('#heroExplore').onclick=()=>document.querySelector('#model').scrollIntoView({behavior:'smooth'});
$('#authClose').onclick=closeAuth;
$('#signupTab').onclick=()=>setAuthMode('signup');
$('#loginTab').onclick=()=>setAuthMode('login');
$('#authForm').onsubmit=submitAuth;
$('#demoLoginBtn').onclick=startDemoSession;
$('#onboardingForm').onsubmit=(e)=>{e.preventDefault();nextOnboardingStep(false);};
$('#onboardingBack').onclick=()=>{if(onboardingStepIndex>0){captureOnboardingStep();onboardingStepIndex--;renderOnboardingStep();}};
$('#onboardingSkip').onclick=()=>nextOnboardingStep(true);
$('#profileClose').onclick=()=>hide($('#profileOverlay'));
$('#profileCancel').onclick=()=>hide($('#profileOverlay'));
$('#profileForm').onsubmit=saveProfileForm;
$('#profilePhotoInput').onchange=handlePhotoUpload;
$('#passwordToggle').onclick=()=>setPasswordVisibility('#authPassword','#passwordToggle');
$('#confirmPasswordToggle').onclick=()=>setPasswordVisibility('#authPasswordConfirm','#confirmPasswordToggle');
$('#globalChoice').onclick=()=>{if(session)transitionSpace('global');};
$('#institutionChoice').onclick=()=>{if(session)transitionSpace('institution');};
$('#roleClose').onclick=()=>{hide($('#roleOverlay'));show($('#contextOverlay'));$('#institutionChoice')?.focus()};
$('#contextClose').onclick=closeContext;
$('#enterLeaf').onclick=()=>enterApp('leaf');
$('#enterTree').onclick=()=>enterApp('tree');
$$('[data-public-action="course"]').forEach(b=>b.onclick=()=>openAuth('signup','course'));
if(supabaseClient){
  supabaseClient.auth.getSession().then(({data})=>{if(data.session){session=data.session;isDemoSession=false;userProfile=loadProfile(data.session.user);if(userProfile.setupComplete)showContext();else showOnboarding();}}).catch(()=>{});
  supabaseClient.auth.onAuthStateChange((_event,s)=>{session=s;if(s)userProfile=loadProfile(s.user)});
}

window.addEventListener('unhandledrejection',event=>{console.error('E-Leaf action failed',event.reason);toast('That action could not be completed. Please try again.');});
window.addEventListener('error',event=>{console.error('E-Leaf interface error',event.error||event.message);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!$('#logoutConfirm')?.classList.contains('hidden'))closeLogout();else if(!$('#authOverlay')?.classList.contains('hidden'))closeAuth();else if(!$('#roleOverlay')?.classList.contains('hidden')){hide($('#roleOverlay'));show($('#contextOverlay'));$('#institutionChoice')?.focus();}else if(!$('#profileOverlay')?.classList.contains('hidden'))hide($('#profileOverlay'));else if(!$('#onboardingOverlay')?.classList.contains('hidden')){hide($('#onboardingOverlay'));show($('#contextOverlay'));}else if(!$('#contextOverlay')?.classList.contains('hidden'))closeContext();}});

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
