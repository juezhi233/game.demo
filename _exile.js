/* ============================================================ 放逐页 */
var exileSel=null;
var exileMode='exile';

function setExileMode(m){
  exileMode=m;
  if($('modeExile')) $('modeExile').classList.toggle('on', m==='exile');
  if($('modeSpare')) $('modeSpare').classList.toggle('on', m==='spare');
  if($('exileGo')){
    $('exileGo').textContent = m==='exile' ? '确 认 放 逐' : '确 认 不 放 逐';
    $('exileGo').onclick = function(){ confirmExile(); };
  }
  renderExile();
}

// 放逐是否有线索支撑 → 怀疑不涨
function hasEvidenceAgainst(k){
  if(k==='theresa') return slotState('motive')==='confirmed';
  if(k==='priest')  return isClueConfirmed('C_CONFESS');
  if(k==='samuel')  return hasSecondary('S_SAMUEL_BURY');
  if(k==='mary')    return hasSecondary('S_MARY_BOTTLE');
  if(k==='margaret')return hasSecondary('S_MARGARET');
  if(k==='agnes')   return hasSecondary('S_AGNES');
  return false;
}

function renderExile(){
  var list=$('exileList'); if(!list) return;
  var hint=$('exileHint');
  var n=state.night;
  if(hint){
    hint.innerHTML = '放逐 = 关进地窖，不是处死。被放逐者活着、退出白天、不能保护别人，可以探视。' +
      '<br>前四夜可放逐 / 不放逐；第五夜不再放逐，直接指认。';
  }
  var go=$('exileGo');
  if(n>=5){
    list.innerHTML='<div style="color:#8a8794;text-align:center;padding:30px;line-height:1.8;">第五夜不放逐了。<br>去大厅，直接指认。</div>';
    if(go){ go.disabled=false; go.textContent='去 大 厅 指 认'; go.onclick=function(){ startAccusation(); }; }
    return;
  }
  if(go){ go.onclick=function(){ confirmExile(); }; go.textContent = exileMode==='exile' ? '确 认 放 逐' : '确 认 不 放 逐'; }

  if(exileMode==='spare'){
    list.innerHTML='<div style="color:#8a8794;padding:18px;font-size:12.5px;line-height:1.9;">' +
      '今夜不放逐任何人。<br>· 怀疑 +1（可花 1 行动点出示证据，怀疑 -1，每夜一次）<br>· 审判恐惧不涨<br>· 保护网保持完整</div>';
    if(go) go.disabled=false;
    return;
  }
  var pool=(CANDIDATE_POOL[n]||[]).slice();
  var html='';
  pool.forEach(function(k){
    var c=CHARS[k]; if(!c) return;
    var gone=isGone(k);
    var locked=(k==='theresa' && slotState('motive')!=='confirmed');
    var dis=gone||locked;
    var sel=(exileSel===k);
    var status='';
    if(isExiled(k)) status='<div class="estatus">已在地窖中</div>';
    else if(!isAlive(k)) status='<div class="estatus" style="color:#ff7a84;">已故</div>';
    else if(locked) status='<div class="estatus" style="color:#8a8794;">证据不足，无法锁定</div>';
    else if(hasEvidenceAgainst(k)) status='<div class="estatus" style="color:#e8a878;">有线索指向</div>';
    else status='<div class="estatus" style="color:#8a8794;">无凭据（怀疑 +1）</div>';
    html += '<div class="exile-card'+(sel?' sel':'')+(dis?' dis':'')+'" ' +
      (dis?'':'onclick="pickExile(\''+k+'\')"')+'>' +
      '<img class="eava" src="'+c.ava+'" alt="" onerror="this.style.visibility=\'hidden\'">' +
      '<div style="flex:1;"><div class="ename">'+esc(c.name)+'</div><div class="erole">'+esc(c.role)+'</div>'+status+'</div></div>';
  });
  list.innerHTML=html;
  if(go) go.disabled = !exileSel;
}

function pickExile(k){ exileSel = (exileSel===k)? null : k; renderExile(); }

function confirmExile(){
  var n=state.night;
  if(n>=5){ startAccusation(); return; }
  if(exileMode==='exile' && !exileSel){ showToast('请选择要放逐的人'); return; }
  var target = (exileMode==='exile') ? exileSel : null;

  // —— 社会反应 ——
  if(target){
    state.everExiled = true;
    if(state.exiled.indexOf(target)<0) state.exiled.push(target);
    if(hasEvidenceAgainst(target)){
      showToast('有线索指向 '+CHARS[target].name+'：怀疑不涨');
    } else {
      addSuspicion(1);
      showToast('无凭据放逐：怀疑 +1');
    }
    if(target==='peter'){ addSuspicion(1); showToast('放逐了彼得：怀疑额外 +1'); }
    var innocent = !(target==='theresa');
    if(innocent){ addFear(1); showToast('放逐了无辜者：审判恐惧 +1'); }
  } else {
    addSuspicion(1);
    showToast('今夜不放逐：怀疑 +1');
  }

  // —— 夜间结算 ——
  var res = computeNightResult(n, target);
  state.nightResult = res;

  // 上一夜受伤的人恢复（本次新伤保留）
  Object.keys(state.injured).forEach(function(k){
    if(state.injured[k] && res.injured!==k) state.injured[k]=false;
  });
  if(res.dead && state.dead.indexOf(res.dead)<0) state.dead.push(res.dead);
  if(res.dead) state.alive[res.dead]=false;
  if(res.injured) state.injured[res.injured]=true;

  // 被放逐的人不再受伤/被杀
  exileSel=null;

  // 第四夜结束后，夜结算已经全部走完 → 由玩家点「进入指认」
  switchPage('page-home');
  renderHome();
}

// 计算某夜结算：保护网 + 凶手优先级（取消背景住客死亡）
function computeNightResult(n, exiledKey){
  var dead=null, injured=null, cause='', target=null, protector=null;

  // 1) 还活着、没被放逐、优先级最高的人
  target = KILL_ORDER.filter(function(k){ return isAlive(k) && !isExiled(k); })[0] || null;

  if(target){
    protector = PROTECT[target] || null;
    var protectorOK = protector && isAlive(protector) && !isInjured(protector) && !isExiled(protector);
    if(protectorOK){
      injured = protector;
      cause = CHARS[protector].name + '替' + CHARS[target].name + '挡下了这一刀，受了伤。';
    } else {
      dead = target;
      var why = '';
      if(protector){
        if(isExiled(protector)) why = '——'+CHARS[protector].name+'在地窖里';
        else if(isInjured(protector)) why = '——'+CHARS[protector].name+'自己还带着伤';
        else if(!isAlive(protector)) why = '——'+CHARS[protector].name+'已经死了';
      } else {
        why = '——没有人护着他';
      }
      cause = CHARS[target].name + '死了。(' + why.replace(/^——/,'') + ')';
    }
  } else {
    cause = '没有人可杀。这一夜无人死亡。';
  }

  if(exiledKey){ cause = CHARS[exiledKey].name + '被关进了地窖。' + cause; }
  return { night:n, dead:dead, injured:injured, cause:cause, target:target, protector:protector, exiled:exiledKey, mode:exileMode };
}

// 出示证据：花 1 行动点，怀疑 -1（每夜一次）
function presentEvidence(){
  if(state.evidenceUsedNight===state.night){ showToast('今夜已经出示过证据了'); return; }
  if(state.ap<=0){ showToast('行动点不足'); return; }
  if(!clueAny() && !Object.keys(SECONDARY).some(function(k){ return hasSecondary(k); })){ showToast('你手上还没有任何线索'); return; }
  state.ap--; state.evidenceUsedNight=state.night;
  addSuspicion(-1);
  toastStat(); if($('page-actions').classList.contains('active')) renderActions();
  showToast('你出示了证据：怀疑 -1');
}
