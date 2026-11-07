/* ============================================================
   序章 · 流程分发（VN 的 proStep 字段触发）
   ============================================================ */
function proDispatch(step){
  switch(step){
    case 'toGroup':      proGoGroup();      return;
    case 'toTheresaPM':  proToTheresaPM();  return;
    case 'toLoft':       proToLoft();       return;
    case 'toAnnounce':   proToAnnounce();   return;
    case 'toOffice':     proToOffice();     return;
    case 'toDeathChat':  proToDeathChat();  return;
    case 'toEndPrologue': endPrologue();    return;
    case 'prologueEnd':   prologueToDay1(); return;
  }
  // 未知步骤：安全落地到行动页
  dvnState = null;
  showScreen('screen-chat');
  switchPage('page-actions');
}

/* ============================================================
   序章结束 → 进入第一天
   序章放逐只允许"不放逐"，无结算、无怀疑
   ============================================================ */
function endPrologue(){
  // 序章不结算、不加怀疑
  dvnState = null;
  state.prologueDone = true;

  // 播放"回房 + 海伦私聊 + 十三响"
  chatMode = 'pm'; chatWho = 'helen';
  $('cdAva').src = CHARS.helen.ava; $('cdAva').style.visibility='visible';
  $('cdName').textContent = CHARS.helen.name;
  $('cdSub').textContent = '序章 · 私聊';
  showScreen('screen-chatdetail');

  var body = $('chatBody');
  body.innerHTML = '';
  PRO.pmIdx = 0;
  PRO.pmScript = N1_PM_HELEN.slice();
  PRO.pmDone = proAfterHelen;
  proHelenStep();
}

function proHelenStep(){
  if(PRO.pmIdx >= PRO.pmScript.length){
    var cb = PRO.pmDone; PRO.pmDone = null;
    if(cb) cb();
    return;
  }
  var m = PRO.pmScript[PRO.pmIdx++];
  var body = $('chatBody');
  if(m.who === 'action'){
    body.insertAdjacentHTML('beforeend','<div class="msg sys action"><div class="bubble">'+esc(m.text)+'</div></div>');
  } else if(m.who === 'me' || m.speaker === 'player'){
    body.insertAdjacentHTML('beforeend','<div class="msg right"><div class="bubble">'+esc(m.text)+'</div></div>');
  } else {
    body.insertAdjacentHTML('beforeend', bubbleFor('helen', m.text));
  }
  body.scrollTop = body.scrollHeight;
  setTimeout(proHelenStep, 650);
}

function proAfterHelen(){
  // 十三响 → 序章结束
  var seq = N1_THIRTEEN.slice();
  seq[seq.length-1] = Object.assign({}, seq[seq.length-1], { proStep:'prologueEnd' });
  dvnState = { night:1, queue:seq.slice(), pending:null, seq:true };
  $('vnBg').style.backgroundImage = 'url(' + String.fromCharCode(39) + bgUrl('bg14') + String.fromCharCode(39) + ')';
  $('vnCg').classList.remove('show');
  $('vnChapter').textContent = '序章 · 尾声';
  showScreen('screen-vn');
  dvnRender();
}

/* ============================================================
   prologueEnd → 直接进入第一天（无结算弹窗）
   ============================================================ */
function prologueToDay1(){
  dvnState = null;
  showToast('序章结束');
  enterNight(2);   // 第一天
  // 第一天开场：老本死后第一个早上
  setTimeout(function(){ startDay1Morning(); }, 300);
}

/* 第一天（night 2）早上开场 —— 文案待补，先给占位 */
function startDay1Morning(){
  var seq = [
    { bg:'bg01', who:'action', text:'〔待补·第一天早上〕雪停了一些。教堂的钟响了六下。你在椅子上醒来，门外的走廊有脚步声。' }
  ];
  playSequenceVN(seq, nightTitle('早晨'), bgUrl('bg01'));
}
