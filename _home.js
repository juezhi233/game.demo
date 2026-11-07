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
