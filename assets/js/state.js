const store={
  get(k,d=null){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))},
  remove(k){localStorage.removeItem(k)}
};
let session=null;
let userProfile=null;
let pendingAction=null;
let context={world:null,institution:null,role:'leaf'};

function profileKey(id){return 'e_leaf_profile:'+id}
function loadProfile(user){
  const key=profileKey(user.id);
  const profile=store.get(key,{name:user.user_metadata?.full_name||user.email?.split('@')[0]||'Learner'});
  if(!profile.institution) profile.institution='Northfield College';
  return profile;
}
function saveProfile(){if(session&&userProfile)store.set(profileKey(session.user.id),userProfile)}
function contextKey(){
  if(!session||!context.world)return null;
  return context.world==='global'
    ? 'e_leaf_global_growth:'+session.user.id
    : 'e_leaf_institution_growth:'+session.user.id+':'+(context.institution||'institution');
}
function growthState(){return store.get(contextKey(),{actions:[],unlocked:false})}
function growthDone(){return Math.min(3,growthState().actions.length)}
function growthPercent(){return Math.round((growthDone()/3)*100)}
function treeUnlockedForContext(){return !!growthState().unlocked}
