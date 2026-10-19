const store={
  get(k,d=null){try{const raw=localStorage.getItem(k);return raw===null?d:JSON.parse(raw)}catch(err){console.warn('E-Leaf could not read local demo state.',err);return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(err){console.warn('E-Leaf could not save local demo state.',err);if(typeof toast==='function')toast('This browser could not save demo progress.');return false}},
  remove(k){try{localStorage.removeItem(k);return true}catch(err){console.warn('E-Leaf could not clear local demo state.',err);return false}}
};
let session=null,userProfile=null,context={world:null,institution:null,role:'leaf'},pendingAction=null,isDemoSession=false;
function profileKey(id){return 'e_leaf_profile:'+id}
function loadProfile(user){const saved=store.get(profileKey(user.id),null);const profile={name:saved?.name||user.user_metadata?.full_name||user.email?.split('@')[0]||'Learner',institution:saved?.institution||null,course:saved?.course||'',year:saved?.year||'',semester:saved?.semester||'',rollNumber:saved?.rollNumber||'',interests:saved?.interests||'',avatarData:saved?.avatarData||'',setupComplete:Boolean(saved?.setupComplete)};if(!isDemoSession)store.set(profileKey(user.id),profile);return profile}
function saveProfile(){if(session&&userProfile&&!isDemoSession)store.set(profileKey(session.user.id),userProfile)}
function contextKey(){return growthKeyForWorld(context.world||'global',context.institution)}
function growthState(){return readGrowthForWorld(context.world||'global',context.institution)}
function growthDone(){return Math.min(3,growthState().actions.length)}
function growthPercent(){return Math.round((growthDone()/3)*100)}
function treeUnlockedForContext(){return growthState().status==='approved'}
