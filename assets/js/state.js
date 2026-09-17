const store={
  get(k,d=null){
    try{const raw=localStorage.getItem(k);return raw===null?d:JSON.parse(raw)}
    catch(err){console.warn('E-Leaf could not read local demo state.',err);return d}
  },
  set(k,v){
    try{localStorage.setItem(k,JSON.stringify(v));return true}
    catch(err){console.warn('E-Leaf could not save local demo state.',err);toast?.('This browser could not save demo progress.');return false}
  },
  remove(k){try{localStorage.removeItem(k);return true}catch(err){console.warn('E-Leaf could not clear local demo state.',err);return false}}
};
let session=null;
let userProfile=null;
let context={world:null,institution:null,role:'leaf'};
let pendingAction=null;
function profileKey(id){return 'e_leaf_profile:'+id}
function loadProfile(user){
  const saved=store.get(profileKey(user.id),null);
  const profile={name:saved?.name||user.user_metadata?.full_name||user.email?.split('@')[0]||'Learner',institution:saved?.institution||null};
  store.set(profileKey(user.id),profile);return profile;
}
function saveProfile(){if(session&&userProfile)store.set(profileKey(session.user.id),userProfile)}
function contextKey(){return 'e_leaf_growth_v1:'+(session?.user?.id||'anonymous')+':'+(context.world||'global')+':'+(context.institution||'')}
function growthState(){
  const state=store.get(contextKey(),{actions:[],unlocked:false});
  return {actions:Array.isArray(state.actions)?state.actions.slice(0,3):[],unlocked:state.unlocked===true};
}
function growthDone(){return Math.min(3,growthState().actions.length)}
function growthPercent(){return Math.round((growthDone()/3)*100)}
function treeUnlockedForContext(){return !!growthState().unlocked}
