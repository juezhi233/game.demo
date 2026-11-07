function startPatrolRoute(which){
  state.flags['patrolRoute']=which;
  let seq=null, chapter='第'+['','一','二','三','四','五'][state.night]+'夜 · 巡夜';
  if(which==='A') seq=PATROL_ROUTE_A;
  else if(which==='B') seq=PATROL_ROUTE_B;
  else if(which==='C') seq=PATROL_ROUTE_C;
  if(!seq) return;
  playSequenceVN(seq, chapter, IMG.bg.hall);
}

/* ============ 路线 A ============ */
const PATROL_ROUTE_A = [
  {who:'action', text:'你按照原定路线，先去了大厅。'},
  {bg:IMG.bg.hall},
  {who:'action', text:'壁炉的火快灭了，大厅里空荡荡的，白天坐满的地方现在只剩几把椅子对着火。'},
  {who:'action', text:'你绕了一圈，没什么异常，于是走向钟楼。'},
  {bg:IMG.bg.tower, hideCg:true},
  {who:'action', text:'钟楼里更冷。风从塔身的缝里灌进来，吹得铁梯嗡嗡响。'},
  {who:'action', text:'你抬头看了看那口钟，指针走得稳稳的。'},
  {who:'action', text:'确认无误，你准备沿后门廊绕去管风琴阁楼。'},
  {bg:IMG.bg.towerBackdoor},
  {who:'action', text:'推开后门，雪扑面而来。'},
  {who:'action', text:'门外台阶的雪里，似乎埋着什么东西。'},
  {who:'action', text:'你凑近一看——是个人。'},
  {who:'action', text:'一个年轻男人趴在雪里，外套上全是雪，脸色发青，嘴唇冻得发紫。'},
  {who:'me', text:'喂！喂！你还好吗？'},
  {who:'action', text:'你连忙把他翻过来，拍掉他脸上的雪，用力摇晃。'},
  {who:'action', text:'他咳了一声，眼睛勉强睁开一条缝。'},
  {who:'philip', text:'……救、救命……门……门是从外面锁的……我……咳、咳……'},
  {who:'action', text:'你说不清楚话，只来得及抓住你的手腕，力气大得吓人。'},
  {who:'me', text:'别说话，先进去！'},
  {who:'action', text:'你半扶半架着把他拖进了钟楼，让他靠着墙坐下，给他搓了搓手。'},
  {who:'action', text:'好一会儿，他才缓过来一些，喘着气看向你。'},
  {who:'philip', text:'……谢谢。我叫菲利普，是山下新来的医生。'},
  {who:'philip', text:'暴风雪前我上山来送药，结果被挡在这儿……刚才我想去后门看看路通没通，不知道被谁从外面扣住了门。'},
  {who:'me', text:'扣住？这是教堂里头，谁会干这种事。'},
  {who:'philip', text:'我也想知道。'},
  {who:'action', text:'菲利普扶着墙站起来，腿还有点抖，但眼神已经清醒了不少。'},
  {who:'philip', text:'你不是住这儿的人吧？看你也不像。'},
  {who:'me', text:'我是守夜人。刚好要去阁楼巡查。'},
  {who:'philip', text:'那正好，我跟你一起。我这人命硬，冻这一会儿还死不了。'},
  {who:'action', text:'他执意要跟来，你拗不过，只好扶着他一起上了阁楼。'},
  {bg:IMG.bg.loft},
  {who:'action', text:'管风琴阁楼的门虚掩着。'},
  {who:'action', text:'你推开门的一瞬间，愣在了原地。', enterVN:true}
];

/* ============ 路线 B ============ */
const PATROL_ROUTE_B = [
  {who:'action', text:'你决定先去厨房找玛丽聊聊。'},
  {bg:IMG.bg.kitchen},
  {who:'action', text:'厨房的炉子还温着，玛丽正在收拾最后一锅汤。'},
  {who:'mary', text:'哎哟，这个点儿还不睡？来，喝碗热的。'},
  {who:'action', text:'她把一碗热汤塞到你手里，热气糊了你一脸。'},
  {who:'me', text:'谢谢玛丽。今晚教堂里……有没有什么不对劲的？'},
  {who:'mary', text:'不对劲？这教堂哪天对劲过。'},
  {who:'action', text:'玛丽笑了笑，压低声音。'},
  {who:'mary', text:'要说的话……老本今晚好像没下来吃饭。他那人，耳朵灵，从不误饭点。'},
  {who:'me', text:'老本？'},
  {who:'mary', text:'就是那个盲眼的老先生，管风琴师。你要巡夜的话，去阁楼看看吧，他常在上面待着。'},
  {who:'action', text:'你心里咯噔一下，把汤碗放下，匆匆往大厅方向走。'},
  {bg:IMG.bg.hall, hideCg:true},
  {who:'action', text:'大厅已经空了。你穿过大厅，走向钟楼。'},
  {bg:IMG.bg.tower},
  {who:'action', text:'钟楼里冷得刺骨，铁梯在风口嗡嗡地响。'},
  {who:'action', text:'你确认了钟没有问题，转身上了通往阁楼的楼梯。'},
  {bg:IMG.bg.loft},
  {who:'action', text:'靠近阁楼，你就觉出不对——门是开着的。'},
  {who:'action', text:'而且门口站着一个人，正打着手电往里照。'},
  {who:'action', text:'那人听见脚步声，猛地回头。'},
  {who:'philip', text:'别过来！你——你是住在这儿的人？'},
  {who:'me', text:'我是守夜人。你是谁？'},
  {who:'philip', text:'我叫菲利普，山下来的医生。我刚才在后门被人从外面扣住了门，好不容易撬开……上来就看见这扇门开着。'},
  {who:'action', text:'他脸色发青，外套上还挂着没化的雪，说话的时候哈出一口白气。'},
  {who:'philip', text:'我没敢一个人进去。你来得正好。'},
  {who:'action', text:'你们对视一眼，一起走了进去。'},
  {who:'action', text:'—— 推开里面那扇门的一瞬间，你愣在了原地。', enterVN:true}
];

/* ============ 路线 C ============ */
const PATROL_ROUTE_C = [
  {who:'action', text:'你决定先去药房找特蕾莎。'},
  {bg:IMG.bg.apothecary},
  {who:'action', text:'药房的灯还亮着。特蕾莎修女在柜子前清点着什么，听见动静回过头，露出惯常的微笑。'},
  {who:'theresa', text:'守夜人，这么晚还没睡？'},
  {who:'me', text:'马上要去巡夜。您这么晚还在忙？'},
  {who:'theresa', text:'药房的账总要对清楚。对了，你巡夜的话，把账本带上吧，说不定用得上。'},
  {who:'action', text:'她从抽屉里取出一本账本，递给你。'},
  {who:'action', text:'你随手翻了翻——字迹工整，数目清楚，看上去没什么问题。'},
  {who:'theresa', text:'有什么不明白的，随时来问我。'},
  {who:'action', text:'她的笑容一以贯之，看不出任何破绽。'},
  {who:'me', text:'谢谢。'},
  {who:'action', text:'你把账本收进外套内袋，转身往大厅走。'},
  {bg:IMG.bg.hall, hideCg:true},
  {who:'action', text:'大厅空无一人，你快步穿过，走向钟楼。'},
  {bg:IMG.bg.tower},
  {who:'action', text:'钟楼的风声比别处更响，你确认过钟后，往阁楼去。'},
  {bg:IMG.bg.loft},
  {who:'action', text:'还没到阁楼，你就看见门敞着，门口站着一个陌生男人。'},
  {who:'philip', text:'别过来……你是什么人？'},
  {who:'me', text:'守夜人。你又是谁？'},
  {who:'philip', text:'菲利普，山下来的医生。我本来想去后门看看路，结果被人从外面扣住了门，撬了半天才出来。'},
  {who:'philip', text:'上来就看见这扇门开着。我一个病人都不敢进去，正好你来了。'},
  {who:'action', text:'他冻得嘴唇发白，但眼神清明，不像在说谎。'},
  {who:'action', text:'你和他一起推门进去。'},
  {who:'action', text:'—— 门后的景象，让你愣在了原地。', enterVN:true}
];

// 剧情对话 VN 播放器
let dvnState=null;
function playDialogVN(n){
  const arr=VN_DIALOG[n]; if(!arr||!arr.length) return;
  dvnState={ night:n, queue:arr.slice(), pending:null };
  var bgUrl = (n===1) ? IMG.bg.hall : ((typeof VN_SCENES!=='undefined' && VN_SCENES[n]) ? VN_SCENES[n].bg : '');
  if(bgUrl){ $('vnBg').style.backgroundImage='url(' + String.fromCharCode(39) + bgUrl + String.fromCharCode(39) + ')'; }
  $('vnCg').style.backgroundImage=''; $('vnCg').classList.remove('show');
  $('vnChapter').textContent='第'+['','一','二','三','四','五'][n]+'夜 · 大厅初见';
  $('vnEmote').classList.remove('show');
  var _pd=document.getElementById('vnDialog'); if(_pd) _pd.classList.remove('narrator','has-portrait'); var _pp=document.getElementById('vnPortrait'); if(_pp) _pp.classList.remove('show');
  showScreen('screen-vn');
  dvnRender();
}

// 显示当前队列第一条（不弹出）
function dvnCurrent(){
  if(!dvnState) return null;
  return dvnState.queue.length ? dvnState.queue[0] : null;
}

function dvnRender(){
  if(!dvnState) return null;
  const m=dvnCurrent();
  if(!m){ dvnEnd(); return; }
  const dlg=document.getElementById('vnDialog');
  // 段落自带背景/CG 切换（巡夜剧情用）
  if(m.bg){ $('vnBg').style.backgroundImage='url(' + String.fromCharCode(39) + m.bg + String.fromCharCode(39) + ')'; }
  if(m.cg){ $('vnCg').style.backgroundImage='url(' + String.fromCharCode(39) + m.cg + String.fromCharCode(39) + ')'; $('vnCg').classList.add('show'); }
  if(m.hideCg){ $('vnCg').classList.remove('show'); }
  const nameEl=document.getElementById('vnCharName');
  const textEl=document.getElementById('vnText');
  const port=document.getElementById('vnPortrait');
  // 选项
  if(m.choice){
    if(dlg) dlg.classList.remove('narrator','has-portrait');
    if(port) port.classList.remove('show');
    if(nameEl){ nameEl.textContent=''; nameEl.style.display='none'; }
    if(textEl) textEl.textContent='';
    let html='<div class="vn-choices">';
    m.choice.forEach((c,i)=>{
      html+='<button class="intro-choice" onclick="dvnChoose('+i+')">'+esc(c.text)+'</button>';
    });
    html+='</div>';
    $('vnExtra').innerHTML=html;
    return;
  }
  // 普通/旁白
  let name='';
  if(m.who==='action'){ name=''; }
  else if(m.who==='me'){ name='许赎'; }
  else if(m.name){ name=m.name; }
  else if(m.who && CHARS[m.who]){ name=CHARS[m.who].name; }
  if(nameEl){ nameEl.textContent=name; nameEl.style.display=name?'':'none'; }
  if(textEl) textEl.textContent=m.text;
  // 立绘：只有许赎说话才显示（与开场一致）
  const hasPortrait = !!INTRO_PORTRAIT_SPEAKERS[name];
  if(hasPortrait){
    document.getElementById('vnPortraitImg').src=INTRO_PORTRAIT_SRC;
    if(port) port.classList.add('show');
    if(dlg) dlg.classList.add('has-portrait');
  } else {
    if(port) port.classList.remove('show');
    if(dlg) dlg.classList.remove('has-portrait');
  }
  if(dlg){ if(m.who==='action') dlg.classList.add('narrator'); else dlg.classList.remove('narrator'); }
  $('vnExtra').innerHTML='';
}

function dvnAdvance(){
  if(!dvnState) return;
  const m=dvnCurrent(); if(!m) { dvnEnd(); return; }
  if(m.choice){ return; }      // 选项需点击 dvnChoose
  dvnState.queue.shift();
  // 该条推进后触发特殊动作（按优先级）
  if(m.enterVN){ dvnEnterVN(); return; }                       // 进入搜证场景
  if(m.endToPhone){ dvnState=null; enterBedPhone(); return; }  // 大厅初见结束 → 躺床玩手机
  if(m.after404){ dvnState=null; showPatrolChoice(); return; } // 404 播完 → 弹巡夜三选一
  if(m.route){ dvnState=null; startPatrolRoute(m.route); return; } 
// 选择巡夜路线
  dvnRender();
}

// 点击对话框/屏幕推进对话（选项/离开/搜证场景不处理）
function vnScreenClick(e){
  var t=e.target;
  if(t && t.closest && t.closest("button, a, .intro-choice, .vn-search, .vn-topbar")) return;
  if(typeof dvnState==='undefined' || !dvnState) return;
  var m=dvnCurrent(); if(!m) return;
  if(m.choice) return;
  dvnAdvance();
}

function dvnChoose(i){
  if(!dvnState) return;
  const m=dvnCurrent(); if(!m||!m.choice) return;
  const c=m.choice[i]; if(!c) return;
  dvnState.queue.shift();
  if(c.effect) applyEffect(c.effect);
  if(c.after && c.after.length){ dvnState.queue = c.after.concat(dvnState.queue); }
  dvnRender();
}



/* ============================================================ 行动页 */
function renderActions(){
  renderActionTop();
  renderSceneGrid();
  renderEvidence();
}

function findAction(id){
  var list = ACTIONS[state.night] || [];
  return list.filter(function(a){ return a.id===id; })[0];
}

// 行动页顶部：本夜进度 / 行动点 / 强制巡查入口
function renderActionTop(){
  var box=$('actionTop'); if(!box) return;
  var n=state.night;
  var used=state.actionsDone.filter(function(id){ var a=findAction(id); return a && !a.free; }).length;
  var left = state.maxAp - used;
  var html = '<div class="relation-panel">' +
    '<div class="rp-title">本 夜</div>' +
    '<div class="rp-sub">强制巡查 ' + (state.patrolled?'已完成':'未完成') + ' · 行动点 ' + state.ap + '/' + state.maxAp +
    ' · 放逐 ' + (n>=5?'今夜不放逐':'可选') + '</div>';
  if(!state.patrolled){
    html += '<button class="intro-choice" onclick="startPatrol()">开始巡查（不占行动点）</button>';
  } else {
    html += '<div style="font-size:11px;color:#6a6672;line-height:1.7;">巡查已完成。' +
      (left>0?'还有 '+left+' 个行动可以选择。':'今夜行动已用完，去「放逐」页做决定。') + '</div>';
  }
  html += '</div>';
  box.innerHTML=html;
}

// 主行动卡片
function renderSceneGrid(){
  var grid=$('sceneGrid'); if(!grid) return;
  var list = ACTIONS[state.night] || [];
  var html='';
  list.forEach(function(a){
    var done = state.actionsDone.indexOf(a.id)>=0;
    var noAP = !a.free && state.ap<=0;
    var dis = done || noAP;
    var cls = done ? 'done' : (a.free ? 'visit' : 'current');
    var cost = a.free ? '免费' : '1';
    html += '<div class="scene-card '+cls+'" style="'+sceneBg(IMG.bg[a.bg]||IMG.bg.hall)+'" ' +
      (dis?'':'onclick="runAction(\''+a.id+'\')"')+'>' +
      '<span class="sc-cost'+(a.free?' free':'')+'">'+(done?'已完成':cost)+'</span>' +
      '<div class="sc-name">'+esc(a.name)+'</div>' +
      '<div class="sc-sub">'+esc(a.sub||'')+'</div>' + sceneIcon() + '</div>';
  });
  if(!list.length) html = '<div style="color:#8a8794;font-size:12px;padding:12px;">今夜没有可选行动。</div>';
  grid.innerHTML=html;
}

function sceneBg(url){
  if(!url) url = IMG.bg.hall;
  return "background-image:linear-gradient(160deg,rgba(10,10,14,.58),rgba(10,10,14,.82)),url('"+url+"');background-size:cover;background-position:center;";
}
function sceneIcon(){
  return '<svg class="sc-icon" viewBox="0 0 24 24"><path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/></svg>';
}
function openConfessFromAction(){ openConfess(); }

// —— 执行一个主行动 ——
function runAction(id){
  var a = findAction(id);
  if(!a) return;
  if(state.actionsDone.indexOf(id)>=0){ showToast('这个行动本夜已经做过了'); return; }
  if(!a.free){
    if(state.ap<=0){ showToast('行动点不足'); return; }
    state.ap--; toastStat();
  }
  state.actionsDone.push(id);
  applyActionEffects(a);
  var chapter = '第'+['','一','二','三','四','五'][state.night]+'夜 · '+a.name;
  playSequenceVN(a.seq, chapter, IMG.bg[a.bg]||IMG.bg.hall);
}

function applyActionEffects(a){
  (a.clues||[]).forEach(function(cid){ giveClue(cid); });
  (a.secondary||[]).forEach(function(k){ giveSecondary(k); });
  if(a.onConfirm) a.onConfirm.forEach(function(cid){ confirmClue(cid); });
  if(a.onSuspect) addSuspicion(a.onSuspect);
  if(a.calm){ addSuspicion(-1); state.flags['calmed_'+state.night]=true; }
  if(a.cellar){
    state.flags['cellarVisited_'+state.night]=true;
    if(state.exiled.length){
      if(!state.clues.opportunity.confirmed) confirmClue('C_LOCK');
      showToast('地窖里的人作证：机会线被确认');
    } else {
      showToast('地窖是空的。今夜你没有放逐任何人。');
    }
  }
  if(a.notes){ state.flags['notesDone']=true; showToast('案件笔记整理完毕'); }
  if(a.clueBoost){
    Object.keys(state.clues).forEach(function(k){
      var s=state.clues[k];
      if(s.found && !s.confirmed){ s.confirmed=true; }
    });
    toastStat();
  }
  renderActions();
}

// —— 强制巡查（剧情事件，不花行动点）——
function startPatrol(){
  if(state.patrolled){ showToast('今夜已经巡查过了'); return; }
  state.patrolled=true;
  var n=state.night;
  var seq = [
    {who:'action', text:'你提着灯，按规程走了一圈：大厅、钟楼、走廊。'},
    {who:'action', text:'风雪把窗户敲得咚咚响。该在的人都在，不该在的人……你也说不好。'},
    {who:'action', text:'巡查结束。你把灯放在桌上，摊开今晚的笔记。', endAction:true}
  ];
  playSequenceVN(seq, '第'+['','一','二','三','四','五'][n]+'夜 · 巡查', IMG.bg.corridor);
}

// —— 证据板 ——
function renderEvidence(){
  renderSlots();
  renderRelationNet();
  renderClueList();
  renderSecondaryList();
}

function renderSlots(){
  var box=$('evSlots'); if(!box) return;
  var html = '<div class="slot-panel"><div class="slot-title">三 槽 状 态</div>';
  Object.keys(SLOTS).forEach(function(key){
    var st=slotState(key), on=(st==='confirmed'), half=(st==='found');
    var def=CLUES[KEY_OF_SLOT[key]];
    var tip='？？？';
    if(half) tip='○ 已找到：'+def.hint;
    if(on) tip='● 已确认';
    html += '<div class="slot-row"><span class="sr-name">'+SLOTS[key].label+'</span>' +
      '<span class="sr-dots"><span class="'+((half||on)?'d-on':'d-off')+'">○</span><span class="'+(on?'d-on':'d-off')+'">●</span></span>' +
      '<span class="sr-tip">'+esc(tip)+'</span></div>';
  });
  html += '</div>';
  box.innerHTML=html;
}

// 关系网：解锁了相关线索才点亮，否则 ？？？
function renderRelationNet(){
  var box=$('evRelation'); if(!box) return;
  var html = '<div class="relation-panel"><div class="rp-title">关 系 网</div>' +
    '<div class="rp-sub">谁护着谁。点亮之后，你才知道放逐谁会拆掉谁的网。</div>';
  RELATION_ROWS.forEach(function(row){
    var unlocked = row.unlocks.some(function(k){
      if(CLUES[k]) return isClueFound(k) || isClueConfirmed(k);
      return hasSecondary(k);
    }) || isGone(row.from) || isInjured(row.from);
    if(unlocked){
      html += '<div class="relation-row">' +
        '<span class="rr-who">'+esc(row.who)+badges(row.from)+'</span>' +
        '<span class="rr-arrow">护住 →</span>' +
        '<span class="rr-target">'+esc(row.target)+badges(row.to)+'</span></div>';
    } else {
      html += '<div class="relation-row unknown"><span class="rr-who">？？？</span>' +
        '<span class="rr-arrow">护住 →</span><span class="rr-target">？？？</span></div>';
    }
  });
  html += '</div>';
  box.innerHTML=html;
}
function badges(k){
  var s='';
  if(isExiled(k)) s+='<span class="chk-badge exi">地窖</span>';
  if(!isAlive(k)) s+='<span class="chk-badge dead">已故</span>';
  else if(isInjured(k)) s+='<span class="chk-badge inj">受伤</span>';
  return s;
}

function renderClueList(){
  var b=$('evBoard'); if(!b) return;
  var html='';
  Object.keys(CLUES).forEach(function(id){
    var c=CLUES[id];
    var found=isClueFound(id), conf=isClueConfirmed(id);
    var cls = conf ? 'confirmed' : (found ? 'found' : '');
    var tag = conf ? '● 确认' : (found ? '○ 找到' : '未发现');
    html += '<div class="clue-card '+cls+'">' +
      '<div class="cc-head"><span class="cc-name">'+(found?esc(c.name):'？？？')+'</span>' +
      '<span class="cc-tag">'+tag+(c.slot?' · '+SLOTS[c.slot].label:'')+'</span></div>' +
      '<div class="cc-src">'+esc(found?c.src:(c.slot?'来源未知':'还在别处'))+
        (found&&!conf&&c.confirm&&c.confirm!=='—'?' · 确认方式：'+esc(c.confirm):'')+'</div></div>';
  });
  b.innerHTML=html;
}

function renderSecondaryList(){
  var box=$('evSecondary'); if(!box) return;
  var html='';
  Object.keys(SECONDARY).forEach(function(k){
    var def=SECONDARY[k];
    var deadWho=secondaryDead(k), on=hasSecondary(k);
    var cls = deadWho ? 'dead' : (on ? 'on' : '');
    var txt;
    if(on) txt = def.name;
    else if(deadWho) txt = DESTROY[deadWho].alt;
    else txt = '？？？';
    html += '<div class="sec-clue '+cls+'">'+esc(txt)+'</div>';
  });
  box.innerHTML=html;
}

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

/* ============================================================ 主页 */
// 应用图标定义（3×2）
const HOME_APPS = [
  { id:'memo',     name:'备忘录', cls:'memo',     icon:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>' },
  { id:'settings', name:'设置',   cls:'settings', icon:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>' },
  { id:'album',    name:'相册',   cls:'album',    icon:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5-6 6-3-3-4 4"/></svg>' },
  { id:'phone',    name:'电话',   cls:'phone',    icon:'<svg viewBox="0 0 24 24"><path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>' },
  { id:'wechat',   name:'微信',   cls:'wechat',   icon:'<svg viewBox="0 0 24 24"><path d="M9 4C5.5 4 3 6.3 3 9.2c0 1.7.9 3.2 2.4 4.2L5 16l2.6-1.3c.9.3 1.9.5 2.9.5"/><path d="M21 14.5c0-2.5-2.2-4.5-5-4.5s-5 2-5 4.5 2.2 4.5 5 4.5c.7 0 1.4-.1 2-.3L20 20l-.4-2.2C20.4 16.9 21 15.8 21 14.5z"/></svg>' },
  { id:'wallet',   name:'钱包',   cls:'wallet',   icon:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.3"/></svg>' }
];

function renderHome(){
  if($('phPatrolBtn')) $('phPatrolBtn').style.display='none';
  var hh = String(state.clock % 24).padStart(2,'0');
  if($('phClock')) $('phClock').textContent = hh+':00';
  if($('phDate')) $('phDate').textContent = '第'+['','一','二','三','四','五'][state.night]+'夜 · 暴风雪';
  if($('setNight')) $('setNight').textContent = '第'+['','一','二','三','四','五'][state.night]+'夜';
  if($('phoneNum')) $('phoneNum').textContent = '';

  // 通知条
  var nw = $('phNoticeWrap');
  if(nw){
    var res = state.nightResult;
    var blocks=[];
    if(res){
      var btnTxt = (state.night>=4) ? '进入第五夜 · 指认' : '进入下一夜';
      var btnFn  = (state.night>=4) ? 'startAccusation()' : 'goNextNight()';
      blocks.push('<div class="ph-notice" style="flex-direction:column;gap:8px;border-color:rgba(200,50,58,.45);">'+
        '<div style="display:flex;gap:8px;align-items:flex-start;"><span>❄</span><span>'+esc(res.cause||'')+'</span></div>'+
        '<button class="result-btn" style="padding:9px;font-size:12.5px;letter-spacing:2px;" onclick="'+btnFn+'">'+btnTxt+'</button>'+
        '</div>');
    } else if(!state.patrolled && state.night<5){
      blocks.push('<div class="ph-notice" style="flex-direction:column;gap:8px;">'+
        '<div style="display:flex;gap:8px;align-items:flex-start;"><span>❄</span><span>天黑了。今晚你要巡查，还要做两个选择。</span></div>'+
        '<button class="result-btn" style="padding:9px;font-size:12.5px;letter-spacing:2px;" onclick="goToActions()">开始今夜</button>'+
        '</div>');
    }
    nw.innerHTML = blocks.join('');
  }

  // 应用网格
  var grid = $('phGrid');
  if(grid){
    grid.innerHTML = HOME_APPS.map(function(app){
      var badge='';
      if(app.id==='wechat' && !state.groupShown[state.night]){
        var len = GROUP_SCRIPT[state.night] ? GROUP_SCRIPT[state.night].length : 1;
        badge = '<span class="app-badge">'+len+'</span>';
      }
      return '<button class="ph-app" onclick="openApp(\''+app.id+'\')">'+
        '<span class="app-ic '+app.cls+'">'+app.icon+badge+'</span>'+
        '<span class="app-nm">'+app.name+'</span></button>';
    }).join('');
  }
}

function goToActions(){
  switchPage('page-actions');
  showHint('先「开始巡查」，再用 2 个行动点做选择。', null, true);
}

function openApp(id){
  if(id==='wechat'){ switchPage('page-msgs'); return; }
  if(id==='memo'){ renderMemoApp(); showApp('app-memo'); return; }
  if(id==='settings'){ showApp('app-settings'); return; }
  if(id==='album'){ showApp('app-album'); return; }
  if(id==='phone'){ showApp('app-phone'); return; }
  if(id==='wallet'){ openWallet(); return; }
}

// 每夜第一次进讯息页：自动弹出本夜群聊（免费）
function maybeAutoGroup(){
  if(state.groupShown[state.night]) return false;
  if(!GROUP_SCRIPT[state.night] || !GROUP_SCRIPT[state.night].length) return false;
  state.groupShown[state.night]=true;
  openGroupChat();
  return true;
}

function showApp(id){
  document.querySelectorAll('#page-home .app-screen').forEach(a=>a.classList.toggle('active', a.id===id));
}
function closeApp(){
  closeModal();
  document.querySelectorAll('#page-home .app-screen').forEach(a=>a.classList.remove('active'));
}

// 钱包：首次进入弹出对话
function openWallet(){
  showApp('app-wallet');
  if(!state.walletOpened){
    state.walletOpened = true;
    setTimeout(()=>{
      openModal(
        '<div class="mbody" style="padding:22px;">'+
          '<p style="font-size:14px;line-height:1.8;color:#ece9e4;">真的很需要这份工作..</p>'+
        '</div>'+
        '<div class="mfoot"><button class="pri" onclick="closeModal()">知道了</button></div>'
      );
    }, 300);
  }
}

// 备忘录内容（iOS 风格日记）
const MEMOS = [
  { t:'买菜', d:'11月3日 17:42', b:'土豆、洋葱、胡萝卜。\n玛丽说要炖汤。\n顺便带了猫粮——阁楼下面那只三花又来了。' },
  { t:'遇见猫', d:'11月5日 21:08', b:'钟楼底下，一只橘猫蹲在雪里。\n喂了半根香肠。\n它跟着我走了两步，又停住了。\n像在等人。' },
  { t:'修管风琴', d:'11月6日 14:30', b:'约瑟夫说第13根音管有问题。\n老本以前总专门绕开它。\n问他为什么，他只说"不吉利"。' },
  { t:'给妈妈的信', d:'11月7日 23:15', b:'这里信号很差，电话打不出去。\n钱也不多，钱包里只剩0.5。\n但我需要这份工作。\n再撑一阵子吧。' },
  { t:'雪', d:'11月8日 06:50', b:'雪下了一整夜。\n早祷的钟声比平时晚了两分钟。\n可能是错觉。' }
];
function renderMemoApp(){
  const body=$('appMemoBody'); if(!body) return;
  body.innerHTML = '<div class="ios-notes">'+ MEMOS.map((m,i)=>
    '<div class="ios-note" onclick="openMemoDetail('+i+')">'+
      '<div class="n-title">'+esc(m.t)+'</div>'+
      '<div class="n-excerpt">'+esc(m.b.replace(/\n/g,' '))+'</div>'+
      '<div class="n-meta">'+esc(m.d)+'</div>'+
    '</div>').join('') + '</div>';
}
function openMemoDetail(i){
  const m=MEMOS[i]; if(!m) return;
  const body=$('appMemoBody');
  body.innerHTML = '<div class="note-detail">'+
    '<button class="app-back" style="margin-bottom:14px;" onclick="renderMemoApp()">‹ 备忘录</button>'+
    '<div class="nd-title">'+esc(m.t)+'</div>'+
    '<div class="nd-meta">'+esc(m.d)+'</div>'+
    '<div class="nd-body">'+esc(m.b)+'</div>'+
    '</div>';
}

function nextNight(){
  var n=state.night;
  if(n>=4){ enterNight(5); startAccusation(); return; }
  enterNight(n+1);
}
function goNextNight(){
  state.night = Math.min(4, state.night + 1);
  enterNight(state.night);
}

/* ============================================================ 最终指认 */
function startAccusation(){
  state.night=5;
  if($('nightLabel')) $('nightLabel').textContent='第五夜';
  showScreen('screen-accuse');
  renderAccuseBody();
}

function renderAccuseBody(){
  var body=$('accuseBody'); if(!body) return;
  var html='';
  // 总览
  html += '<div class="acc-sum">'+
    '<div><b>'+scoreText()+'</b>线索槽</div>'+
    '<div><b>'+state.suspicion+'</b>怀疑</div>'+
    '<div><b>'+state.fear+'</b>恐惧</div>'+
    '</div>';
  // 三槽
  Object.keys(SLOTS).forEach(function(key){
    var st=slotState(key), on=(st==='confirmed'), half=(st==='found');
    var def=CLUES[KEY_OF_SLOT[key]];
    html += '<div class="chain-card'+(on?' complete':'')+'">'+
      '<div class="chain-head"><span class="ctitle">'+SLOTS[key].label+'</span>'+
      '<span class="cstat '+(on?'ok':'no')+'">'+(on?'● 已确认':(half?'○ 仅找到':'未取得'))+'</span></div>'+
      '<div class="chain-items"><div class="ci'+(on?' held':'')+'"><span class="box">'+(on?'✓':'')+'</span>'+
      esc((on||half)?def.name:'？？？')+'</div></div></div>';
  });
  // 出示证据（每夜一次，指认前还能用一次）
  if(state.evidenceUsedNight!==5 && state.ap>0){
    html += '<button class="intro-choice" style="margin:6px 0 2px;" onclick="presentEvidence();renderAccuseBody();">出示证据（怀疑 -1 · 行动点 1）</button>';
  }
  // 指认对象
  html += '<div class="act-section-title" style="margin-top:20px;">指 认 谁 <span class="ast-hint">一次机会</span></div>';
  html += '<div class="choices">';
  ['theresa','priest'].forEach(function(k){
    var c=CHARS[k];
    var lockedIn = (k==='theresa' && isExiled('theresa'));
    html += '<button class="intro-choice" onclick="finalizeAccusation(\''+k+'\')">'+
      '<img src="'+c.ava+'" style="width:26px;height:26px;border-radius:8px;object-fit:cover;vertical-align:middle;margin-right:8px;" onerror="this.style.display=\'none\'">'+
      esc(c.name)+(lockedIn?'（已在地窖）':'')+'</button>';
  });
  html += '</div>';
  body.innerHTML=html;
}

function finalizeAccusation(target){
  showEnding(judgeEnding(target));
}

// 判定结局（互斥优先级）
function judgeEnding(target){
  var inCellar = isExiled('theresa');
  var score = clueScore();
  var any = clueAny();
  var T = state.flags['escape_helen'] ? 'helen' : (state.flags['escape_philip'] ? 'philip' : null);

  // —— 跑路结局 ——
  if(T==='helen'){
    return (state.favor.helen>=2) ? ENDING_DEFS.hilllight : ENDING_DEFS.wanderer;
  }
  if(T==='philip'){
    return (state.favor.philip>=2) ? ENDING_DEFS.drain : ENDING_DEFS.wanderer;
  }

  // —— 怀疑满 3 ——
  if(state.suspicion>=3) return inCellar ? ENDING_DEFS.bellnot : ENDING_DEFS.guest13;

  // —— 指认神父 ——
  if(target==='priest') return ENDING_DEFS.scapegoat;

  // —— 指认特蕾莎 ——
  if(target==='theresa'){
    if(!any) return ENDING_DEFS.guest13;                // 一点证据都没有
    if(state.fear>=4) return ENDING_DEFS.nofree;        // 审判恐惧满
    if(inCellar){
      return (score>=3) ? ENDING_DEFS.bells : ENDING_DEFS.bellnot;
    }
    if(score===3){
      if(!state.everExiled && state.suspicion<=1) return ENDING_DEFS.nobody;  // 隐藏
      return ENDING_DEFS.bells;
    }
    if(score===2) return ENDING_DEFS.before;
    return ENDING_DEFS.bellnot;
  }
  return ENDING_DEFS.bellnot;
}

/* ============================================================ 结局展示 */
function showEnding(def){
  if(state.ending) return;
  state.ending=def;
  try { unlockEnding(endingKeyOf(def)); } catch(e){}
  showScreen('screen-accuse');
  var body=$('accuseBody'); if(!body) return;
  var cgHtml='';
  if(def.cg){
    cgHtml = '<div style="margin:16px 0;border-radius:16px;overflow:hidden;border:1px solid rgba(200,50,58,.3);">'+
      '<img src="'+def.cg+'" style="width:100%;display:block;" onerror="this.parentNode.style.display=\'none\'">'+
      '</div>';
  }
  body.innerHTML =
    '<div style="text-align:center;padding:10px 0 4px;">'+
      '<div style="font-size:10px;letter-spacing:6px;color:#e06a72;margin-bottom:12px;">'+esc(def.tag)+'</div>'+
      '<h2 style="font-size:24px;letter-spacing:8px;margin:0;">'+esc(def.title)+'</h2>'+
    '</div>'+
    cgHtml+
    '<div style="font-size:13px;line-height:2;color:#c9c6cc;padding:8px 2px;">'+esc(def.desc)+'</div>'+
    '<div class="result-strip" style="padding:0;margin:18px 0;">'+
      '<div><b>'+scoreText()+'</b>线索槽</div>'+
      '<div><b>'+state.suspicion+'</b>怀疑</div>'+
      '<div><b>'+state.fear+'</b>恐惧</div>'+
    '</div>'+
    '<button class="result-btn" style="margin-top:10px;" onclick="restartGame()">再 玩 一 次</button>'+
    '<div style="height:30px;"></div>';
  body.scrollTop=0;
}

function restartGame(){
  initGame();
  state.ending=null;
  showScreen('screen-chat');
  enterNight(1);
}

/* ============================================================ 弹窗 */
function openModal(html){
  const m=$('modalBox'); if(m) m.innerHTML=html;
  const mask=$('modalMask'); if(mask) mask.classList.add('show');
}
function closeModal(){
  const mask=$('modalMask'); if(mask) mask.classList.remove('show');
}

/* ============================================================ 启动 */
document.addEventListener('DOMContentLoaded', function(){
  initGame();
  toastStat();
    // 开场屏点击推进
  const intro=$('screen-intro');
  if(intro){
    intro.addEventListener('click', function(){
      if(!intro.classList.contains('active')) return;
      advanceIntroClick();
    });
  }
});
</script>
</body>
</html>
