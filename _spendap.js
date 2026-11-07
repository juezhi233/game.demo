function spendAP(n){
  if(state.ap < n){ showToast('行动点不足'); return false; }
  state.ap -= n; toastStat();
  if(typeof renderActions==='function' && $('page-actions') && $('page-actions').classList.contains('active')) renderActions();
  return true;
}
