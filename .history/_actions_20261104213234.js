/* ============================================================
   行动执行引擎：4 选 2
   ============================================================ */

let pendingAction = null;

// 本夜已完成的行动 id 列表
function nightDoneActions(){
  if(!state.doneActions) state.doneActions = {};
  if(!state.doneActions[state.night]) state.doneActions[state.night] = [];
  return state.doneActions[state.night];
}

function isActionDone(id){
  return nightDoneActions().indexOf(id) >= 0;
}

function nightDoneCount(){
  return nightDoneActions().length;
}

// 本夜还能做几个主行动（行动点即次数）
function actionsLeft(){
  return Math.max(0, state.ap);
}

function nightActions(){
  return ACTIONS[state.night] || [];
}

// 该行动是否可执行
function canDoAction(a){
  if(!a) return false;
  if(isActionDone(a.id)) return false;
  if(state.ap < 1) return false;
  return true;
}

function nightActionsExhausted(){
  var list = nightActions();
  if(!list.length) return true;
  if(actionsLeft() <= 0) return true;
  return list.every(function(a){ return isActionDone(a.id); });
}

/* ---------- 执行一个行动 ---------- */
function doAction(id){
  var list = nightActions();
  var a = null;
  for(var i=0;i<list.length;i++){ if(list[i].id===id){ a=list[i]; break; } }
  if(!a){ showToast('找不到这个行动'); return; }
  if(isActionDone(id)){ showToast('这一夜已经做过这件事了'); return; }
  if(!spendActionPoint()) return;

  markActionDone(id);
  renderActions();

  var cellarTarget = actionCellarTarget(a);
  if(cellarTarget){
    gotoCellarScene(cellarTarget, a);
    return;
  }
  playActionSequence(a);
}

function spendActionPoint(){
  if(state.ap < 1){ showToast('行动点不够了'); return false; }
  state.ap -= 1;
  toastStat();
  return true;
}

function markActionDone(id){
  var d = nightDoneActions();
  if(d.indexOf(id) < 0) d.push(id);
  state.flags['act_'+state.night+'_'+id] = true;
}

/* ---------- 行动主角 → 判断是否被放逐 ---------- */
const ACTION_OWNER = {
  a1_mary:'mary',    a2_mary:'mary',      a3_mary:'mary',    a4_mary:'mary',
  a1_samuel:'samuel',a2_samuel:'samuel',  a3_samuel:'samuel',a4_samuel:'samuel',
  a1_hall:'agnes',   a2_agnes:'agnes',    a3_agnes:'agnes',
  a2_henry:'henry',  a3_henry:'henry',
  a2_peter:'peter',  a3_peter:'peter',
  a2_margaret:'margaret', a3_margaret:'margaret',
  a2_joseph:'joseph'
};

function actionCellarTarget(a){
  var owner = ACTION_OWNER[a.id];
  if(!owner) return null;
  if(isInCellar(owner)) return owner;
  return null;
}

/* ---------- 播放行动 ---------- */
function playActionSequence(a){
  pendingAction = a;
  if(!a.seq || !a.seq.length){
    grantActionLoot(a);
    showToast('（这个场景的剧情还没写）');
    pendingAction = null;
    return;
  }
  var seq = [];
  a.seq.forEach(function(line){ seq.push(line); });
  var last = {};
  for(var k in seq[seq.length-1]) last[k] = seq[seq.length-1][k];
  last.__endAction = a.id;
  seq[seq.length-1] = last;

  var bgUrl = a.bg && IMG.bg[a.bg] ? IMG.bg[a.bg] : null;
  playSequenceVN(seq, a.name, bgUrl);
}

/* ---------- 给予行动奖励 ---------- */
function grantActionLoot(a){
  if(!a) return [];
  var gotNames = [];
  (a.clues||[]).forEach(function(cid){
    if(CLUES[cid] && !hasClue(cid)){
      giveItem(cid);
      gotNames.push(CLUES[cid].name);
    }
  });
  (a.secondary||[]).forEach(function(sid){
    if(SECONDARY[sid] && !hasSecondary(sid)){
      giveSecondary(sid);
      gotNames.push(SECONDARY[sid].name);
    }
  });
  if(gotNames.length) showToast('拿到：' + gotNames.join('、'));
  return gotNames;
}

/* ---------- 行动结束后结算 ---------- */
function finishAction(a){
  if(!a) return;
  grantActionLoot(a);
  pendingAction = null;
  renderActions();
}

/* ---------- 行动卡片渲染 ---------- */
function renderActionCards(){
  var grid = $('actGrid');
  if(!grid) return;
  var list = nightActions();
  var left = actionsLeft();

  if(!list.length){
    grid.innerHTML = '<div class="act-empty">这一夜没有可去的地方。</div>';
    return;
  }

  var html = '';
  list.forEach(function(a){
    var done = isActionDone(a.id);
    var cellarId = actionCellarTarget(a);
    var disabled = done || left < 1;
    var cls = 'act-card' + (done?' done':'') + (disabled?' disabled':'') + (cellarId?' cellar-go':'');

    var name = a.name;
    var sub = a.sub || '';
    if(cellarId){
      name = '去地窖找' + shortName(cellarId);
      sub = '他在地窖里';
    }

    html += '<div class="'+cls+'"'+(disabled?'':' onclick="doAction(\''+a.id+'\')"')+'>' +
              '<button class="act-check'+(done?' on':'')+'" onclick="event.stopPropagation();return false;"></button>' +
              '<div class="act-name">' + esc(name) + '</div>' +
              '<div class="act-sub">' + esc(sub) + '</div>' +
              (cellarId ? '<span class="edtag cellar">在地窖</span>' : '') +
            '</div>';
  });
  grid.innerHTML = html;
}

/* ---------- 剩余行动提示 ---------- */
function renderActionHint(){
  var box = $('actHint');
  if(!box) return;
  var left = actionsLeft();
  var html = '';
  for(var i=0;i<state.maxAp;i++){
    html += '<span class="ap-dot'+(i<left?' on':'')+'"></span>';
  }
  html += '<span class="ap-text">还能做 <b>'+left+'</b> 件事</span>';
  box.innerHTML = html;
}
