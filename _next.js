function nextNight(){
  var n=state.night;
  if(n>=4){ enterNight(5); startAccusation(); return; }
  enterNight(n+1);
}
function goNextNight(){
  state.night = Math.min(4, state.night + 1);
  enterNight(state.night);
}
