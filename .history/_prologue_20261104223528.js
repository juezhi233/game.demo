/* ============================================================
   序章（night 1）· 流程调度
   顺序：门口 → 见神父 → 群聊 → 大厅 → 巡夜 → 阁楼 → 大厅公告
        → 神父办公室 → 回房群聊 → 自由行动 → 放逐(只有不放逐)
        → 海伦私聊 + 十三响 → 第一天
   ============================================================ */

var PRO = {};   // 序章状态：选项结果等

// ---------- 入口：启动序章 ----------
function startPrologue(){
  state.night = 1;
  state.ap = state.maxAp;
  state.clock = 18;
  if(!state.flags) state.flags = {};
  state.flags.helpedPhilip = false;
  PRO = { ben:null, philip:null, actDone:0 };

  var seq = N1_OPENING.slice();
  // 最后一句推进后弹门口选择
  seq[seq.length-1] = Object.assign({}, seq[seq.length-1], {
    choice:[
      { text:'推门进去', after:[] , effect:{go:1} },
      { text:'转身走',   after:[] }
    ]
  });
  // 用自定义 choice 处理（dvnChoose 的 after 不够，需要分流）
  dvnState = { night:1, queue:seq.slice(), pending:null, seq:true };
  $('vnBg').style.backgroundImage = 'url(' + String.fromCharCode(39) + bgUrl('bg01') + String.fromCharCode(39) + ')';
  $('vnCg').style.backgroundImage=''; $('vnCg').classList.remove('show');
  $('vnChapter').textContent = '序章 · 盲人之死';
  $('vnEmote').classList.remove('show');
  showScreen('screen-vn');
  PRO.doorMode = true;
  dvnRender();
}

// ---------- 门口二选一（拦截） ----------
var _origDvnChoose = dvnChoose;
dvnChoose = function(i){
  // 序章：门口选择
  if(PRO && PRO.doorMode && dvnState && dvnCurrent() && dvnCurrent().choice){
    dvnState.queue.shift();
    PRO.doorMode = false;
    if(i === 1){
      // 转身走 → 结局
      dvnState = null;
      triggerEndingByName('frozen');
      return;
    }
    // 推门进去
    var seq = N1_PRIEST.slice();
    seq[seq.length-1] = Object.assign({}, seq[seq.length-1], { proStep:'toGroup' });
    dvnState.queue = seq;
    dvnRender();
    return;
  }
  return _origDvnChoose(i);
};

// ---------- 神父段结束 → 群聊 ----------
function proGoGroup(){
  dvnState = null;
  state.groupRead[1] = true;
  chatMode = 'group'; chatWho = null;
  $('cdAva').src = IMG.avt.group; $('cdAva').style.visibility = 'visible';
  $('cdName').textContent = '晚祷群';
  $('cdSub').textContent = '序章 · 共 ' + N1_GROUP.length + ' 条';
  showScreen('screen-chatdetail');

  var body = $('chatBody');
  body.innerHTML = '';
  PRO.groupIdx = 0;
  PRO.groupScript = N1_GROUP.slice();
  proGroupStep();
  renderMsgList();
}

function proGroupStep(){
  if(PRO.groupIdx >= PRO.groupScript.length){
    proShowIntroChoice();
    return;
  }
  var m = PRO.groupScript[PRO.groupIdx++];
  var body = $('chatBody');
  body.insertAdjacentHTML('beforeend', groupBubble(m));
  body.scrollTop = body.scrollHeight;
  setTimeout(proGroupStep, 650);
}

// ---------- 自我介绍 ----------
function proShowIntroChoice(){
  var box = $('chatInput'); if(!box) return;
  box.innerHTML = '';
  renderChatChoices([{ text: N1_INTRO_TEXT, onclick: 'proDoIntro()' }]);
}

function proDoIntro(){
  hideChatChoices();
  var body = $('chatBody');
  body.insertAdjacentHTML('beforeend', '<div class="msg right"><div class="bubble">'+esc(N1_INTRO_TEXT)+'</div></div>');
  body.scrollTop = body.scrollHeight;
  PRO.groupScript = N1_GROUP_AFTER_INTRO.slice();
  PRO.groupIdx = 0;
  PRO.groupDone = function(){
    unlockClueById('C_AGNES');
    var box = $('chatInput'); if(!box) return;
    box.innerHTML = '';
    renderChatChoices([{ text:'大家有需要可以找我，以后请多关照了。', onclick:'proGroupFinal()' }]);
  };
  setTimeout(proGroupStep, 550);
}

function proGroupFinal(){
  hideChatChoices();
  var body = $('chatBody');
  body.insertAdjacentHTML('beforeend', '<div class="msg right"><div class="bubble">大家有需要可以找我，以后请多关照了。</div></div>');
  body.insertAdjacentHTML('beforeend', groupBubble({speaker:'henry', text:'谈不上关照，大家彼此帮助。'}));
  body.insertAdjacentHTML('beforeend', groupBubble({speaker:'peter', text:'以后可能要麻烦您，先说一声谢谢。'}));
  body.insertAdjacentHTML('beforeend', groupBubble({speaker:'action', text:'群里安静了一会儿。你翻了翻聊天记录，看不到进群之前的。'}));
  body.scrollTop = body.scrollHeight;
  var box = $('chatInput'); if(!box) return;
  box.innerHTML = '';
  renderChatChoices([{ text:'去大厅看看', onclick:'proGoHall()' }]);
}

// ---------- 大厅 ----------
function proGoHall(){
  hideChatChoices();
  var seq = N1_HALL_OPEN.slice();
  seq[seq.length-1] = Object.assign({}, seq[seq.length-1], {
    choice: N1_BEN_CHOICES.map(function(c,i){ return { text:c.t, _benIdx:i }; })
  });
  dvnState = { night:1, queue:seq.slice(), pending:null, seq:true };
  $('vnBg').style.backgroundImage = 'url(' + String.fromCharCode(39) + bgUrl('bg02') + String.fromCharCode(39) + ')';
  $('vnCg').classList.remove('show');
  $('vnChapter').textContent = '序章 · 大厅';
  showScreen('screen-vn');
  PRO.benMode = true;
  dvnRender();
}

// ---------- 老本三选一（拦截） ----------
var _origChoose2 = dvnChoose;
dvnChoose = function(i){
  if(PRO && PRO.benMode && dvnState && dvnCurrent() && dvnCurrent().choice){
    dvnState.queue.shift();
    PRO.benMode = false;
    var c = N1_BEN_CHOICES[i];
    PRO.ben = c ? c.key : null;
    var seq = (c ? c.then.slice() : []);
    N1_HALL_JOSEPH.forEach(function(l){ seq.push(l); });
    N1_HALL_AGNES.forEach(function(l){ seq.push(l); });
    N1_HALL_CHILD.forEach(function(l){ seq.push(l); });
    seq[seq.length-1] = Object.assign({}, seq[seq.length-1], { proStep:'toTheresaPM' });
    dvnState.queue = seq;
    dvnRender();
    return;
  }
  return _origChoose2(i);
};

// ---------- 特蕾莎私聊 → 出发巡夜 ----------
function proToTheresaPM(){
  dvnState = null;
  chatMode = 'pm'; chatWho = 'theresa';
  $('cdAva').src = CHARS.theresa.ava; $('cdAva').style.visibility='visible';
  $('cdName').textContent = CHARS.theresa.name;
  $('cdSub').textContent = '序章 · 私聊';
  showScreen('screen-chatdetail');
  var body = $('chatBody');
  body.innerHTML = '';
  PRO.pmIdx = 0; PRO.pmScript = N1_PM_THERESA.slice();
  proPMStep();
}

function proPMStep(){
  if(PRO.pmIdx >= PRO.pmScript.length){
    unlockClueById('S_THERESA');
    var box = $('chatInput'); if(!box) return;
    box.innerHTML = '';
    renderChatChoices([{ text:'拿起手电，出发巡夜', onclick:'proStartPatrol()' }]);
    return;
  }
  var m = PRO.pmScript[PRO.pmIdx++];
  var body = $('chatBody');
  if(m.who === 'action'){
    body.insertAdjacentHTML('beforeend', '<div class="msg sys action"><div class="bubble">'+esc(m.text)+'</div></div>');
  } else if(m.who === 'me'){
    body.insertAdjacentHTML('beforeend', '<div class="msg right"><div class="bubble">'+esc(m.text)+'</div></div>');
  } else {
    body.insertAdjacentHTML('beforeend', bubbleFor('theresa', m.text));
  }
  body.scrollTop = body.scrollHeight;
  setTimeout(proPMStep, 650);
}

// ---------- 巡夜：钟楼 → 后门廊 ----------
function proStartPatrol(){
  hideChatChoices();
  var seq = N1_TOWER.concat(N1_PHILIP_OPEN);
  seq[seq.length-1] = Object.assign({}, seq[seq.length-1], {
    choice: N1_PHILIP_CHOICES.map(function(c,i){ return { text:c.t, _pidx:i }; })
  });
  PRO.philipMode = true;
  dvnState = { night:1, queue:seq.slice(), pending:null, seq:true };
  $('vnBg').style.backgroundImage = 'url(' + String.fromCharCode(39) + bgUrl('bg07') + String.fromCharCode(39) + ')';
  $('vnCg').classList.remove('show');
  $('vnChapter').textContent = '序章 · 巡夜';
  showScreen('screen-vn');
  dvnRender();
}

// ---------- 菲利普三选一（拦截） ----------
var _origChoose3 = dvnChoose;
dvnChoose = function(i){
  if(PRO && PRO.philipMode && dvnState && dvnCurrent() && dvnCurrent().choice){
    dvnState.queue.shift();
    PRO.philipMode = false;
    var c = N1_PHILIP_CHOICES[i];
    if(c && c.setFlag) state.flags[c.setFlag] = true;
    PRO.philip = c ? c.key : null;
    var seq = (c ? c.then.slice() : []).concat(N1_PHILIP_AFTER);
    seq[seq.length-1] = Object.assign({}, seq[seq.length-1], { proStep:'toLoft' });
    dvnState.queue = seq;
    dvnRender();
    return;
  }
  return _origChoose3(i);
};

// ---------- 阁楼：发现尸体 ----------
function proToLoft(){
  var seq = N1_LOFT.slice();
  seq[seq.length-1] = Object.assign({}, seq[seq.length-1], { proStep:'toAnnounce' });
  dvnState = { night:1, queue:seq.slice(), pending:null, seq:true };
  $('vnBg').style.backgroundImage = 'url(' + String.fromCharCode(39) + bgUrl('bg03') + String.fromCharCode(39) + ')';
  $('vnCg').style.backgroundImage = 'url(' + String.fromCharCode(39) + cgUrl('oldbenBody') + String.fromCharCode(39) + ')';
  $('vnCg').classList.add('show');
  $('vnChapter').textContent = '序章 · 阁楼';
  dvnRender();
}

// ---------- 大厅公告 ----------
function proToAnnounce(){
  var seq = N1_HALL_ANNOUNCE.slice();
  seq[seq.length-1] = Object.assign({}, seq[seq.length-1], { proStep:'toOffice' });
  dvnState = { night:1, queue:seq.slice(), pending:null, seq:true };
  $('vnBg').style.backgroundImage = 'url(' + String.fromCharCode(39) + bgUrl('bg02') + String.fromCharCode(39) + ')';
  $('vnCg').classList.remove('show');
  $('vnChapter').textContent = '序章 · 大厅';
  dvnRender();
}

// ---------- 神父办公室 ----------
function proToOffice(){
  var seq = N1_OFFICE.slice();
  if(state.flags.helpedPhilip){
    N1_PHILIP_ROOM.forEach(function(l){ seq.push(l); });
  }
  seq = seq.concat(N1_RETURN_ROOM);
  seq[seq.length-1] = Object.assign({}, seq[seq.length-1], { proStep:'toDeathChat' });
  dvnState = { night:1, queue:seq.slice(), pending:null, seq:true };
  $('vnBg').style.backgroundImage = 'url(' + String.fromCharCode(39) + bgUrl('bg13') + String.fromCharCode(39) + ')';
  $('vnCg').classList.remove('show');
  $('vnChapter').textContent = '序章 · 神父办公室';
  dvnRender();
}

// ---------- 回房：群里公布死讯 ----------
function proToDeathChat(){
  dvnState = null;
  state.groupRead[1] = true;
  chatMode = 'group';
  $('cdAva').src = IMG.avt.group; $('cdAva').style.visibility='visible';
  $('cdName').textContent = '晚祷群';
  $('cdSub').textContent = '序章 · 群聊';
  showScreen('screen-chatdetail');
  var body = $('chatBody');
  body.innerHTML = '';
  PRO.groupIdx = 0; PRO.groupScript = N1_GROUP_DEATH.slice();
  PRO.groupDone = proShowActionChoice;
  proGroupStep();
}

// ---------- 群聊结束 → 自由行动 ----------
function proShowActionChoice(){
  var box = $('chatInput'); if(!box) return;
  box.innerHTML = '';
  renderChatChoices([{ text:'去行动（还剩 2 件事）', onclick:'proGoActions()' }]);
}

function proGoActions(){
  hideChatChoices();
  switchPage('page-actions');
  showScreen('screen-chat');
  renderActions();
}
