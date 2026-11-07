function renderEvidence(){
  const b=$('evBoard'); if(!b) return;

  var html='';

  /* ---------- 一、三槽进度 ---------- */
  html += '<div class="ev-section">三槽 · 达成 ' + confirmedCount() + '/3</div>';
  ['opportunity','motive','identity'].forEach(function(slot){
    var st = clueState(slot);
    var mark = st==='confirmed' ? '●' : (st==='found' ? '○' : '·');
    var key = KEY_OF_SLOT[slot];
    var d = CLUES[key];
    html += '<div class="ev-slot ' + st + '">' +
              '<span class="ev-slot-mark">' + mark + '</span>' +
              '<span class="ev-slot-name">' + SLOTS[slot].label + '槽</span>' +
              '<span class="ev-slot-hint">' + (st==='confirmed' ? '已确认' : (st==='found' ? '已找到，未确认' : '未找到')) + '</span>' +
            '</div>';
  });

  /* ---------- 二、关键线索 ---------- */
  html += '<div class="ev-section">关键线索</div>';
  Object.keys(CLUES).forEach(function(id){
    var e = CLUES[id];
    var held = hasItem(id);
    var slot = e.slot;
    var confirmed = slot ? (state.clues[slot] && state.clues[slot].confirmed) : false;
    html += '<div class="ev-row' + (held ? ' held' : '') + '">' +
              '<span class="ev-id">' + (held ? (confirmed ? '●' : '○') : '?') + '</span>' +
              '<div class="ev-body">' +
                '<div class="ev-name">' + (held ? esc(e.name) : '？？？') + '</div>' +
                '<div class="ev-src">' + (held ? esc(e.src) : '尚未发现') + '</div>' +
              '</div>' +
              '<span class="ev-chain">' + (slot ? SLOTS[slot].label : '旁证') + '</span>' +
            '</div>';
  });

  /* ---------- 三、次要线索 ---------- */
  html += '<div class="ev-section">次要线索</div>';
  Object.keys(SECONDARY).forEach(function(id){
    var e = SECONDARY[id];
    var held = hasSecondary(id);
    var gone = e.owner ? isGone(e.owner) : false;
    html += '<div class="ev-row' + (held ? ' held' : '') + (gone ? ' gone' : '') + '">' +
              '<span class="ev-id">' + (held ? '○' : '?') + '</span>' +
              '<div class="ev-body"><div class="ev-name">' + (held ? esc(e.name) : '？？？') + '</div>' +
              '<div class="ev-src">' + (gone ? '这条线索已经断了' : (held ? '已记录' : '尚未获得')) + '</div></div>' +
            '</div>';
  });

  /* ---------- 四、关系网 ---------- */
  html += '<div class="ev-section">关系网 <span class="ev-section-tip">确认线索后点亮</span></div>';
  html += '<div class="rel-net">';
  RELATION_ROWS.forEach(function(row){
    var lit = row.unlockClue && state.clues[CLUES[row.unlockClue] ? CLUES[row.unlockClue].slot : ''] ?
              (state.clues[CLUES[row.unlockClue].slot] && state.clues[CLUES[row.unlockClue].slot].confirmed) : false;
    // 该通道线索不在三槽（slot=null）时，只要拿到该线索也算已知，但仍需确认条件；此处按“已持有”点亮
    if(!lit && row.unlockClue && hasItem(row.unlockClue)) lit = true;

    var a = CHAR_INFO[row.from] || { name:'？？？', ava:'' };
    var b2 = CHAR_INFO[row.to] || { name:'？？？', ava:'' };
    html += '<div class="rel-row' + (lit ? ' lit' : '') + '">' +
              '<div class="rel-node">' +
                '<div class="rel-ava">' + (lit ? '<img src="' + a.ava + '" alt="">' : '？') + '</div>' +
                '<div class="rel-name">' + (lit ? esc(a.name) : '？？？') + '</div>' +
              '</div>' +
              '<div class="rel-arrow">→<span class="rel-lose">失去保护</span></div>' +
              '<div class="rel-node">' +
                '<div class="rel-ava">' + (lit ? '<img src="' + b2.ava + '" alt="">' : '？') + '</div>' +
                '<div class="rel-name">' + (lit ? esc(b2.name) : '？？？') + '</div>' +
              '</div>' +
            '</div>';
  });
  html += '</div>';

  b.innerHTML = html;
}
