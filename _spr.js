function startPatrolRoute(which){
  state.flags['patrolRoute']=which;
  var seq=null, chapter='第'+['','一','二','三','四','五'][state.night]+'夜 · 巡夜';
  if(which==='A') seq=PATROL_ROUTE_A;
  else if(which==='B') seq=PATROL_ROUTE_B;
  else if(which==='C') seq=PATROL_ROUTE_C;
  if(!seq) return;
  playSequenceVN(seq, chapter, IMG.bg.hall);
}
