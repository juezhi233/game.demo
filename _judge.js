function judgeEnding(target){
  const E = ENDING_DEFS;

  // 0) 开场转身走 → 风雪不归人
  if(state.walkedAway) return E.wanderer;

  // 1) 跑路结局优先（第四夜选了跑路）
  if(state.ranAway === 'helen')  return E.hilllight;
  if(state.ranAway === 'philip') return E.drain;

  // 2) 怀疑满 3 → 第十三个客人
  if(state.suspicion >= 3) return E.guest13;

  // 三槽确认数
  const cc = confirmedCount();
  // 0个●但有任何○ → 记 1/3
  const anyFound = ['opportunity','motive','identity'].some(function(s){ return clueState(s) !== 'none'; });
  const score = (cc === 0 && anyFound) ? 1 : cc;

  // 3) 指认神父：有 1/3 以上 → 替罪的白袍
  if(target === 'priest'){
    if(score >= 1) return E.scapegoat;
    return E.bellnot;
  }

  // 4) 指认特蕾莎（真凶）
  if(target === 'theresa'){
    // 隐藏结局：全程未放逐 + 3/3 + 怀疑<3 + 恐惧=0
    if(cc === 3 && state.suspicion <= 2 && !state.ever_exiled && state.fear === 0) return E.nobody;

    // 0/3（连○都没有）→ 第十三个客人
    if(score === 0) return E.guest13;

    // 2/3 以上 + 恐惧≥4 → 无人自由
    if(score >= 2 && state.fear >= 4) return E.nofree;

    // 3/3 + 恐惧≤2 + 怀疑<3 → 钟声归位
    if(cc === 3 && state.fear <= 2 && state.suspicion < 3) return E.bells;

    // (3/3 且 恐惧=3) 或 (2/3 且 恐惧≤3) → 雪停之前
    if(cc === 3 && state.fear === 3) return E.before;
    if(cc === 2 && state.fear <= 3) return E.before;

    // 3/3 但恐惧/怀疑越线 → 雪停之前（兜底）
    if(cc === 3) return E.before;

    // 其余（1/3 等）→ 未落下的钟
    return E.bellnot;
  }

  // 5) 不指认（target 为空）/ 指认其他人
  if(!target) return E.bellnot;
  if(target === 'theresa_in_cellar') return E.bellnot;

  // 指认了无关人 + 有料 → 替罪；无料 → 第十三个客人
  if(score >= 1) return E.scapegoat;
  return E.guest13;
}
