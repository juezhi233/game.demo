/* ============================================================
   游戏状态（新版）
   ============================================================ */

let state;

const SAVE_KEY = 'seventh_night_save_v2';

function freshState(){
  return {
    // 夜与时间
    night:1,
    clock:18,
    walletOpened:false,

    // 行动点：每夜 2 点，所有主行动 1 点
    ap:2,
    maxAp:2,

    // 三槽线索：机会 / 动机 / 身份
    clues:{
      opportunity:{ found:false, confirmed:false },
      motive:     { found:false, confirmed:false },
      identity:   { found:false, confirmed:false }
    },
    // 关键线索持有 {C_LOCK:true}
    items:{},
    // 次要线索持有 {S_MARY_BOTTLE:true}
    secondary:{},

    // 数值
    suspicion:0,        // 0-3 怀疑
    fear:0,             // 0-4 审判恐惧
    evidenceSpent:0,    // 本夜已花行动出示证据（每夜一次）

    // 人物状态
    alive:{},           // {henry:true}
    exiled:[],          // 已放逐（关地窖，不是死）
    dead:[],            // 已死
    injured:{},         // {mary:night} 受伤到第几夜结束

    // 记录
    ever_exiled:false,  // 全程是否放逐过任何人
    exileLog:[],        // [{night, who, hadEvidence}]
    visitedCellar:{},   // 本夜是否已探视地窖 {night:true}
    freeCellarVisitUsed:false, // 本夜免费探视是否已用

    // 好感三档：0 拒绝 / 1 犹豫 / 2 愿意帮忙
    affection:{ helen:0, philip:0 },
    ranAway:null,       // 'helen' | 'philip' | null

    // 本夜进度
    patrolDone:false,   // 强制巡查是否完成
    actionsDone:[],     // 本夜已执行的主行动 id
    freeActionsDone:[], // 本夜已执行的免费行动 id
    groupPlayed:{},     // 本夜群聊是否已播 {night:true}
    pmSeen:{},
    confessSeen:{},
    pendingPM:{},
    vnDone:{},

    // 结算
    nightResult:null,
    ending:null,

    // 兼容旧逻辑的开关位（新版不使用，但保证旧函数不报错）
    flags:{},
    favor:{ helen:0, philip:0 },
    slip:0,
    keyTalks:0,
    keyTalkMax:3,
    rewardedReset:0,
    groupRead:{}
  };
}

// 初始化
function initGame(){
  state = freshState();
  if(typeof RESIDENTS !== 'undefined'){
    RESIDENTS.forEach(k=>{ state.alive[k]=true; });
  }
  state.alive['ben']=false;   // 老本已死
  state.alive['henry']=true;
}

/* ============================================================ 工具 */
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function isAlive(k){ return !!state.alive[k]; }
function isExiled(k){ return state.exiled.indexOf(k)>=0; }
function isDead(k){ return state.dead.indexOf(k)>=0; }
function isGone(k){ return isDead(k) || isExiled(k); }

// 受伤：state.injured[k] = 该夜结束前有效
function isInjured(k){
  var n = state.injured[k];
  return typeof n === 'number' && state.night <= n;
}
function injure(k){ state.injured[k] = state.night; }

// ---------- 线索 ----------
function hasItem(id){ return !!state.items[id]; }
function hasSecondary(id){ return !!state.secondary[id]; }
function giveItem(id){
  if(!id || state.items[id]) return;
  state.items[id]=true;
  var d = (typeof CLUES!=='undefined') ? CLUES[id] : null;
  if(d){
    var slot = d.slot;
    if(slot && state.clues[slot]) state.clues[slot].found = true;
    showToast('线索：'+d.name);
  }
}
function confirmItem(id){
  if(!id) return;
  state.items[id]=true;
  var d = (typeof CLUES!=='undefined') ? CLUES[id] : null;
  if(d && d.slot && state.clues[d.slot]){
    state.clues[d.slot].found = true;
    state.clues[d.slot].confirmed = true;
  }
}
function giveSecondary(id){
  if(!id || state.secondary[id]) return;
  state.secondary[id]=true;
}
function clueState(slot){
  var c = state.clues[slot];
  if(!c) return 'none';
  if(c.confirmed) return 'confirmed';
  if(c.found) return 'found';
  return 'none';
}
function confirmedCount(){
  return ['opportunity','motive','identity'].filter(function(s){
    return state.clues[s] && state.clues[s].confirmed;
  }).length;
}
function foundCount(){
  return ['opportunity','motive','identity'].filter(function(s){
    return state.clues[s] && state.clues[s].found;
  }).length;
}
// 最终分数：3条● =3；2条● =2；1条● =1；0条● 但有○ =1；什么都没有 =0
function clueScore(){
  var c = confirmedCount();
  if(c>0) return c;
  return foundCount()>0 ? 1 : 0;
}

// ---------- 数值 ----------
function addSuspicion(n){
  var before = state.suspicion;
  state.suspicion = Math.max(0, Math.min(3, state.suspicion + n));
  toastStat();
  if(state.suspicion!==before){
    showToast('怀疑 ' + (n>0?'+':'') + n + '（' + state.suspicion + '/3）');
  }
}
function addFear(n){
  state.fear = Math.max(0, Math.min(4, state.fear + n));
  toastStat();
  if(n>0) showToast('审判恐惧 +' + n + '（' + state.fear + '/4）');
}
function addAffection(who, n){
  state.affection[who] = Math.max(0, Math.min(2, (state.affection[who]||0) + n));
  if(state.favor) state.favor[who] = state.affection[who];
  showToast((who==='helen'?'海伦':'菲利普') + ' 好感 ' + state.affection[who] + '/2');
}

// 兼容旧接口
function hasEv(id){ return hasItem(id); }
function giveEv(id){ giveItem(id); }
function addSlip(n){ addSuspicion(n); }
function addFavor(k,n){ addAffection(k,n); }

function toastStat(){
  if($('statAP')) $('statAP').textContent = Math.max(0,state.ap);
  if($('statSus')) $('statSus').textContent = state.suspicion;
  if($('statFear')) $('statFear').textContent = state.fear;
  if($('statSlip')) $('statSlip').textContent = state.suspicion;
  if($('statKey')) $('statKey').textContent = confirmedCount() + '/3';
}

