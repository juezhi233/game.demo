/* ============================================================
   角色状态模型 + 判定函数（放逐 / 地窖机制）
   ============================================================ */

// 放逐池：只有这些角色可能被放逐
// 永远不在池：philip（恋爱线）、helen（山下）、ben（已死）
// henry / johndoe：亨利是受害者需保护，约翰是旁观老人，均不进池
const EXILE_POOL = ['joseph','samuel','agnes','peter','mary','margaret','priest','theresa'];

// 剧情锁：满足条件后才可放逐
// theresa 需要第四夜证据够了；priest 第三夜之后
const EXILE_LOCK = {
  theresa: function(){ return state.night >= 4 && confirmedCount() >= 2; },
  priest:  function(){ return state.night >= 3; }
};

// 是否可被放逐
function canExile(id){
  if(EXILE_POOL.indexOf(id) < 0) return false;
  if(isDead(id) || isExiled(id)) return false;
  var lock = EXILE_LOCK[id];
  if(lock && !lock()) return false;
  return isAlive(id);
}

// ---------- 五个核心判定 ----------
// 是否出现在公共场景
function canAppearPublic(id){
  return isAlive(id) && !isDead(id) && !isExiled(id);
}
// 是否出现在群聊
function canSpeakInGroup(id){
  return isAlive(id) && !isDead(id) && !isExiled(id);
}
// 是否在地窖
function isInCellar(id){
  return isAlive(id) && !isDead(id) && isExiled(id);
}
// 是否能保护别人
function canProtect(id){
  return isAlive(id) && !isDead(id) && !isExiled(id) && !isInjured(id);
}
// 是否能被凶手攻击
function canBeTarget(id){
  return isAlive(id) && !isDead(id) && !isExiled(id);
}

// ---------- 放逐操作 ----------
function exileCharacter(id, hadEvidence){
  if(!canExile(id)) return false;
  state.exiled.push(id);
  state.ever_exiled = true;
  state.exileLog.push({ night: state.night, who: id, hadEvidence: !!hadEvidence });
  if(state.favor) state.favor = state.favor;

  // 社会反应
  if(!hadEvidence){
    addSuspicion(1);
  }
  if(id === 'peter') addSuspicion(1);          // 放逐小孩额外 +1
  // 放逐无辜者（不是特蕾莎，也不是已证明有罪的神父）→ 审判恐惧 +1
  var guilty = (id === 'theresa') || (id === 'priest');
  if(!guilty) addFear(1);

  showToast(CHARS[id] ? CHARS[id].name + ' 被关进了地窖' : '被关进了地窖');
  toastStat();
  return true;
}

// 放出（最终指认用）
function releaseFromCellar(id){
  var k = state.exiled.indexOf(id);
  if(k >= 0) state.exiled.splice(k, 1);
}

// ---------- 地窖探视（每夜免费 1 次） ----------
function cellarFreeUsed(){
  return !!state.freeCellarVisitUsed;
}
function canVisitCellar(){
  return state.exiled.length > 0;
}
// 本次探视是否要付行动点
function cellarVisitCost(){
  if(!cellarFreeUsed()) return 0;
  return 1;
}
// 执行一次探视，返回 true 表示可以进入
function beginCellarVisit(){
  var cost = cellarVisitCost();
  if(cost > 0){
    if(state.ap < cost){
      showToast('行动点不足');
      return false;
    }
    state.ap -= cost;
  } else {
    state.freeCellarVisitUsed = true;
  }
  state.visitedCellar[state.night] = true;
  toastStat();
  return true;
}

// ---------- 角色状态标签 ----------
function charStatusTags(id){
  var tags = [];
  if(isDead(id)) tags.push({cls:'dead', text:'死亡'});
  else if(isInCellar(id)) tags.push({cls:'cellar', text:'在地窖'});
  if(isInjured(id) && !isDead(id)) tags.push({cls:'injured', text:'受伤'});
  return tags;
}
function charStatusText(id){
  if(isDead(id)) return '死亡';
  if(isInCellar(id)) return '在地窖';
  if(isInjured(id)) return '受伤';
  return '在场';
}
