/* ============================================================
   群聊过滤 + 台词替换
   ============================================================ */

// 台词替换表：原说话人不在场时，改用谁来说
const SPEAKER_FALLBACK = {
  mary:     ['peter','samuel','joseph'],
  agnes:    ['henry','priest','johndoe'],
  samuel:   ['joseph','priest','peter'],
  margaret: ['mary','priest','agnes'],
  peter:    ['mary','joseph'],
  joseph:   ['priest','samuel'],
  theresa:  ['priest','agnes'],
  henry:    ['agnes','priest'],
  johndoe:  ['peter','mary']
};

// 挑一个当前能发言的替代者；都不行就返回 null（消息丢弃）
function fallbackSpeaker(origId){
  var cands = SPEAKER_FALLBACK[origId] || [];
  for(var i=0;i<cands.length;i++){
    var id = cands[i];
    if(canSpeakInGroup(id)) return id;
  }
  // 兜底：任何能发言的住客
  for(var j=0;j<RESIDENTS.length;j++){
    if(canSpeakInGroup(RESIDENTS[j])) return RESIDENTS[j];
  }
  return null;
}

// 是否有资格出现在群聊消息里
function filterGroupMessage(m){
  var key = m.speaker;
  if(!key) return m;
  if(key==='system' || key==='action' || key==='player' || key==='confession') return m;
  if(!CHARS[key]) return m;

  // 在场 → 原样
  if(canSpeakInGroup(key)) return m;

  // 不在场：尝试换人
  var sub = fallbackSpeaker(key);
  if(!sub) return null;           // 没人能说，丢弃这条
  var out = {};
  for(var k in m) out[k] = m[k];
  out.speaker = sub;
  out.reassignedFrom = m.speaker;
  return out;
}

// 批量过滤一段对话
function filterGroupSeq(seq){
  var out = [];
  for(var i=0;i<seq.length;i++){
    var r = filterGroupMessage(seq[i]);
    if(r) out.push(r);
  }
  return out;
}

// 群聊成员面板（显示谁在群里）
function renderGroupMembers(){
  var box = $('chatMembers');
  if(!box) return;
  var ids = RESIDENTS.filter(function(id){ return canSpeakInGroup(id); });
  box.innerHTML = ids.map(function(id){
    var c = CHARS[id] || {};
    return '<div class="gm-item" title="' + esc(c.name||'') + '">' +
             '<img src="' + (c.ava||'') + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
           '</div>';
  }).join('');
}
