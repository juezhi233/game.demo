function renderEvidence(){
  const b=$('evBoard'); if(!b) return;

  var html='';

  /* ================= 一、三槽进度 ================= */
  var cc = confirmedCount();
  html += '<div class="ev-box">' +
            '<div class="ev-box-head">' +
              '<span class="ev-box-title">三槽进度</span>' +
              '<span class="ev-box-meta"><b>' + cc + '</b> / 3 已确认</span>' +
            '</div>' +
            '<div class="ev-box-body">';

  ['opportunity','motive','identity'].forEach(function(slot){
    var st = clueState(slot);
    var mark = st==='confirmed' ? '●' : (st==='found' ? '○' : '·');
    var hint = st==='confirmed' ? '已确认' : (st==='found' ? '已找到 · 待确认' : '未找到');
    html += '<div class="ev-slot ' + st + '">' +
              '<span class="ev-slot-mark">' + mark + '</span>' +
              '<span class="ev-slot-name">' + SLOTS[slot].label + '</span>' +
              '<span class="ev-slot-hint">' + hint + '</span>' +
            '</div>';
  });
  html += '</div></div>';

  /* ================= 二、关键线索 ================= */
  var keyIds = Object.keys(CLUES);
  var keyHeld = keyIds.filter(function(id){ return hasItem(id); }).length;
  html += '<div class="ev-box">' +
            '<div class="ev-box-head">' +
              '<span class="ev-box-title">关键线索</span>' +
              '<span class="ev-box-meta"><b>' + keyHeld + '</b> / ' + keyIds.length + '</span>' +
            '</div>' +
            '<div class="ev-box-body flush">';

  keyIds.forEach(function(id){
    var e = CLUES[id];
    var held = hasItem(id);
    var slot = e.slot;
    var conf = slot && state.clues[slot] && state.clues[slot].confirmed && held;
    html += '<div class="ev-row' + (held ? ' held' : '') + (conf ? ' confirmed' : '') + '">' +
              '<span class="ev-id">' + (held ? (conf ? '●' : '○') : '?') + '</span>' +
              '<div class="ev-body">' +
                '<div class="ev-name">' + (held ? esc(e.name) : '？？？') + '</div>' +
                '<div class="ev-src">' + (held ? esc(e.src) : '尚未发现') + '</div>' +
              '</div>' +
              '<span class="ev-chain">' + (slot ? SLOTS[slot].label : '旁证') + '</span>' +
            '</div>';
  });
  html += '</div></div>';

  /* ================= 三、次要线索 ================= */
  var secIds = Object.keys(SECONDARY);
  var secHeld = secIds.filter(function(id){ return hasSecondary(id); }).length;
  html += '<div class="ev-box">' +
            '<div class="ev-box-head">' +
              '<span class="ev-box-title">次要线索</span>' +
              '<span class="ev-box-meta"><b>' + secHeld + '</b> / ' + secIds.length + '</span>' +
            '</div>' +
            '<div class="ev-box-body flush">';

  secIds.forEach(function(id){
    var e = SECONDARY[id];
    var held = hasSecondary(id);
    var gone = e.owner ? isGone(e.owner) : false;
    var note = gone ? '这条线索已经断了' : (held ? '已记录' : '尚未获得');
    html += '<div class="ev-row' + (held ? ' held' : '') + (gone ? ' gone' : '') + '">' +
              '<span class="ev-id">' + (held ? '○' : '?') + '</span>' +
              '<div class="ev-body">' +
                '<div class="ev-name">' + (held ? esc(e.name) : '？？？') + '</div>' +
                '<div class="ev-src">' + note + '</div>' +
              '</div>' +
            '</div>';
  });
  html += '</div></div>';

  /* ================= 四、关系网 ================= */
  var litCount = 0;
  var rows = RELATION_ROWS.map(function(row){
    var lit = false;
    if(row.unlockClue){
      if(hasItem(row.unlockClue)) lit = true;
      var d = CLUES[row.unlockClue];
      if(d && d.slot && state.clues[d.slot] && state.clues[d.slot].confirmed) lit = true;
    }
    if(lit) litCount++;
    return { row:row, lit:lit };
  });

  html += '<div class="ev-box">' +
            '<div class="ev-box-head">' +
              '<span class="ev-box-title">关系网</span>' +
              '<span class="ev-box-meta"><b>' + litCount + '</b> / ' + RELATION_ROWS.length + ' 已点亮</span>' +
            '</div>' +
            '<div class="ev-box-body flush">';

  rows.forEach(function(o){
    var row = o.row, lit = o.lit;
    var from = CHARS[row.from] || { name:'？？？', ava:'' };
    var to   = CHARS[row.to]   || { name:'？？？', ava:'' };
    html += '<div class="rel-row' + (lit ? ' lit' : '') + '">' +
              '<div class="rel-node">' +
                '<div class="rel-ava">' + (lit ? '<img src="' + from.ava + '" alt="">' : '？') + '</div>' +
                '<div class="rel-name">' + (lit ? esc(from.name) : '？？？') + '</div>' +
              '</div>' +
              '<div class="rel-arrow">→<span class="rel-lose">失去保护</span></div>' +
              '<div class="rel-node">' +
                '<div class="rel-ava">' + (lit ? '<img src="' + to.ava + '" alt="">' : '？') + '</div>' +
                '<div class="rel-name">' + (lit ? esc(to.name) : '？？？') + '</div>' +
              '</div>' +
            '</div>';
  });
  html += '</div></div>';

  b.innerHTML = html;
}
