// ============================================================
// 结局判定
// ============================================================
function judgeEnding(target){
  const E = ENDING_DEFS;

  // 1) 跑路结局优先（第四夜选了跑路）
  if(state.ranAway === 'helen')  return E.hilllight;
  if(state.ranAway === 'philip') return E.drain;

  // 2) 审判恐惧拉满 → 无人自由
  if(state.fear >= 4) return E.nofree;

  // 3) 指认神父 → 替罪的白袍
  if(target === 'priest') return E.scapegoat;

  // 4) 指认特蕾莎（真凶）
  if(target === 'theresa'){
    const c = confirmedCount();

    // 隐藏结局：三槽全确认 + 怀疑没越线 + 从没放逐过任何人 + 审判恐惧为 0
    if(c === 3 && state.suspicion <= 2 && !state.ever_exiled && state.fear === 0) return E.nobody;

    // 三槽全确认 + 怀疑没越线 → 钟声归位（TRUE END）
    if(c === 3 && state.suspicion <= 2) return E.bells;

    // 三槽全确认但怀疑越线 → 雪停之前
    if(c === 3) return E.before;

    // 只确认两槽 → 雪停之前
    if(c === 2) return E.before;

    // 一槽或零槽 → 未落下的钟
    return E.bellnot;
  }

  // 5) 指认其他人
  // 手里什么都没有 → 第十三个客人
  if(confirmedCount() === 0) return E.guest13;

  // 有证据但指错 → 替罪（白袍替人背罪）
  return E.scapegoat;
}
