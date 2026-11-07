// ============ 第一夜·躺床玩手机 → 去巡夜 → 404 → 三选一 → A/B/C 完整剧情 ============

// 进入「躺床玩手机」阶段：回到手机主页，时间 23:00，左上角出现「去巡夜」，场景锁定
function enterBedPhone(){
  state.playPhase = 'bedphone';
  state.clock = 23;
  showScreen('screen-chat');
  switchPage('page-home');
  if($('phPatrolBtn')) $('phPatrolBtn').style.display = 'block';
  renderHome();
}

// 手机主页「不玩了，去巡夜」按钮
function goPatrol(){
  if($('phPatrolBtn')) $('phPatrolBtn').style.display = 'none';
  playPatrol404();
}

// 404 剧情（小序列，播完弹三选一）
const PATROL_404 = [
  {who:'action', text:'你打开手机，想刷点什么打发时间。'},
  {who:'action', text:'但是信号实在太差，你看着圈圈转了半天，最后弹出 404 的界面。'},
  {who:'me', text:'好无聊啊。还是去找点事干吧。'},
  {who:'action', text:'—— 索性去巡夜吧。'},
  {who:'action', text:'巡夜路线：大厅 → 钟楼 → 管风琴阁楼。'},
  {who:'action', text:'你披上外套，拿好钥匙和手电，走出房间。', go404:true}
];

function playPatrol404(){
  playSequenceVN(PATROL_404, '第'+['','一','二','三','四','五'][state.night]+'夜 · 巡夜', IMG.bg.corridor);
}

// 404 播完 → 弹巡夜路线三选一（居中浮层，在手机界面上）
function showPatrolChoice(){
  showScreen('screen-chat');
  switchPage('page-actions');
  const box=$('chatChoices');
  if(!box) return;
  const opts = [
    { text:'A. 大厅 → 钟楼 → 管风琴阁楼（正常路线）', onclick:'startPatrolRoute("A")' },
    { text:'B. 先去厨房找玛丽', onclick:'startPatrolRoute("B")' },
    { text:'C. 先去药房找特蕾莎', onclick:'startPatrolRoute("C")' }
  ];
  renderChatChoices(opts);
}

// 通用：播放自定义 VN 序列（复用 dvn 渲染）
function playSequenceVN(seq, chapter, bgUrl){
  if(!seq||!seq.length) return;
  dvnState={ night:state.night, queue:seq.slice(), pending:null, seq:true };
  if(bgUrl){ $('vnBg').style.backgroundImage='url(' + String.fromCharCode(39) + bgUrl + String.fromCharCode(39) + ')'; }
  $('vnCg').style.backgroundImage=''; $('vnCg').classList.remove('show');
  $('vnChapter').textContent=chapter||'巡夜';
  $('vnEmote').classList.remove('show');
  showScreen('screen-vn');
  dvnRender();
}

// 序列里各条可带 bg/cg 切换
function dvnRender(){ 
  if(!dvnState) return null;
  const m=dvnCurrent(); if(!m){ dvnEnd(); return; }
  // 段落自带背景/CG
  if(m.bg){ $('vnBg').style.backgroundImage='url(' + String.fromCharCode(39) + m.bg + String.fromCharCode(39) + ')'; }
  if(m.cg){ $('vnCg').style.backgroundImage='url(' + String.fromCharCode(39) + m.cg + String.fromCharCode(39) + ')'; $('vnCg').classList.add('show'); }
  if(m.hideCg){ $('vnCg').classList.remove('show'); }
  var _dvnBody = arguments.length;
  return dvnRenderCore(m);
}

// 搬运原 dvnRender 的主体到 core（避免与全局重名冲突）
function dvnRenderCore(m){
  const dlg=document.getElementById('vnDialog');
  const nameEl=document.getElementById('vnCharName');
  const textEl=document.getElementById('vnText');
  const port=document.getElementById('vnPortrait');
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
  let name='';
  if(m.who==='action'){ name=''; }
  else if(m.who==='me'){ name='许赎'; }
  else if(m.name){ name=m.name; }
  else if(m.who && CHARS[m.who]){ name=CHARS[m.who].name; }
  if(nameEl){ nameEl.textContent=name; nameEl.style.display=name?'':'none'; }
  if(textEl) textEl.textContent=m.text;
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

// 根据路线播放对应剧情
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
