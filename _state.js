function freshState(){
  return {
    night:1,
    ap:2,                 // 每夜 2 行动点
    maxAp:2,
    actionsDone:[],       // 本夜已执行的主行动 id
    patrolled:false,      // 本夜是否已完成强制巡查
    clock:18,
    walletOpened:false,
    suspicion:0,          // 怀疑 0-3（满 3 触发坏结局）
    fear:0,               // 审判恐惧 0-4
    evidenceUsedNight:0,  // 最近一次「出示证据」的夜次
    clues:{               // 三槽：found = 拿到东西；confirmed = 有证人/笔记解释
      opportunity:{ found:false, confirmed:false },
      motive:     { found:false, confirmed:false },
      identity:   { found:false, confirmed:false }
    },
    secondary:{},         // 次要线索
    evidence:{},
    flags:{},
    favor:{ helen:0, philip:0 },
    alive:{},
    injured:{},           // 受伤：持续一夜
    exiled:[],            // 已放逐（地窖，活着）
    dead:[],
    everExiled:false,
    groupRead:{},
    groupPlayed:{},
    groupShown:{},
    pmSeen:{},
    confessSeen:{},
    pendingPM:{},
    vnDone:{},
    nightResult:null,
    ending:null
  };
}

function initGame(){
  state = freshState();
  RESIDENTS.forEach(k=>{ state.alive[k]=true; });
  state.alive['ben']=false;
}

/* ============================================================ 工具 */
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function isAlive(k){ return !!state.alive[k]; }
function isExiled(k){ return state.exiled.indexOf(k)>=0; }
function isInjured(k){ return !!state.injured[k]; }
function isGone(k){ return !isAlive(k) || isExiled(k); }
function hasEv(id){ return !!(state.clues[id] && state.clues[id].found) || !!state.flags['ev_'+id]; }
function giveEv(id){ giveClue(id); }

// —— 线索 ——
function giveClue(id){
  var def=CLUES[id]; if(!def) return;
  if(def.slot){
    var s=state.clues[def.slot];
    if(s.found) return;
    s.found=true;
    showToast('找到线索：'+def.name);
  } else {
    if(state.flags['ev_'+id]) return;
    state.flags['ev_'+id]=true;
    showToast('获得：'+def.name);
  }
  toastStat();
}
function confirmClue(id){
  var def=CLUES[id]; if(!def) return;
  if(!def.slot){ giveClue(id); return; }
  var s=state.clues[def.slot];
  if(s.confirmed) return;
  s.found=true; s.confirmed=true;
  showToast('确认线索：'+def.name);
  toastStat();
}
function isClueFound(id){ return hasEv(id); }
function isClueConfirmed(id){
  var def=CLUES[id];
  if(def && def.slot) return !!state.clues[def.slot].confirmed;
  return !!state.flags['ev_'+id];
}
function slotState(slot){
  var s=state.clues[slot];
  if(s.confirmed) return 'confirmed';
  if(s.found) return 'found';
  return 'none';
}
function clueAny(){ return Object.keys(state.clues).some(function(k){ return state.clues[k].found||state.clues[k].confirmed; }); }
function clueScore(){
  var n=0;
  Object.keys(state.clues).forEach(function(k){ if(state.clues[k].confirmed) n++; });
  return n;                        // 0 / 1 / 2 / 3
}
function scoreText(){
  var n=clueScore();
  if(n>0) return n+'/3';
  return clueAny() ? '1/3' : '0/3';
}
var DESTROY_KEYS = { S_MARY_BOTTLE:1, S_HENRY_REG:1, S_SAMUEL_BURY:1, S_MARGARET:1 };
function giveSecondary(key){
  if(!key || !SECONDARY[key] || DESTROY_KEYS[key] || state.secondary[key]) return;
  state.secondary[key]=true;
  if(showToast) showToast('旁证：'+SECONDARY[key].name);
}
function secondaryDead(key){
  for(var who in DESTROY){ if(DESTROY[who].lose===key && isGone(who)) return who; }
  return null;
}
function hasSecondary(key){
  if(secondaryDead(key)) return false;
  return !!state.secondary[key];
}

// —— 怀疑 / 恐惧 ——
function addSuspicion(n){
  if(!n) return;
  state.suspicion = Math.max(0, Math.min(3, state.suspicion + n));
  toastStat();
  if(state.suspicion>=3) checkSuspicionBust();
}
function addFear(n){
  if(!n) return;
  state.fear = Math.max(0, Math.min(4, state.fear + n));
  toastStat();
}
function addSlip(n){ if(n>0) addSuspicion(n); else toastStat(); }
function addFavor(k,n){ state.favor[k]=Math.max(0,Math.min(2,(state.favor[k]||0)+n)); }
function toastStat(){
  if($('statAP')) $('statAP').textContent = Math.max(0,state.ap||0);
  if($('statSus')) $('statSus').textContent = state.suspicion||0;
  if($('statFear')) $('statFear').textContent = state.fear||0;
  if($('statKey')) $('statKey').textContent = clueScore();
}

// 怀疑满 3：直接触发坏结局
function checkSuspicionBust(){
  if(state.ending) return;
  showEnding(isExiled('theresa') ? ENDING_DEFS.bellnot : ENDING_DEFS.guest13);
}
