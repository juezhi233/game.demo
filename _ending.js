function showEnding(def){
  if(state.ending) return;
  state.ending=def;
  try { unlockEnding(endingKeyOf(def)); } catch(e){}
  showScreen('screen-accuse');
  var body=$('accuseBody'); if(!body) return;
  var cgHtml='';
  if(def.cg){
    cgHtml = '<div style="margin:16px 0;border-radius:16px;overflow:hidden;border:1px solid rgba(200,50,58,.3);">'+
      '<img src="'+def.cg+'" style="width:100%;display:block;" onerror="this.parentNode.style.display=\'none\'">'+
      '</div>';
  }
  body.innerHTML =
    '<div style="text-align:center;padding:10px 0 4px;">'+
      '<div style="font-size:10px;letter-spacing:6px;color:#e06a72;margin-bottom:12px;">'+esc(def.tag)+'</div>'+
      '<h2 style="font-size:24px;letter-spacing:8px;margin:0;">'+esc(def.title)+'</h2>'+
    '</div>'+
    cgHtml+
    '<div style="font-size:13px;line-height:2;color:#c9c6cc;padding:8px 2px;">'+esc(def.desc)+'</div>'+
    '<div class="result-strip" style="padding:0;margin:18px 0;">'+
      '<div><b>'+scoreText()+'</b>线索槽</div>'+
      '<div><b>'+state.suspicion+'</b>怀疑</div>'+
      '<div><b>'+state.fear+'</b>恐惧</div>'+
    '</div>'+
    '<button class="result-btn" style="margin-top:10px;" onclick="restartGame()">再 玩 一 次</button>'+
    '<div style="height:30px;"></div>';
  body.scrollTop=0;
}

function restartGame(){
  initGame();
  state.ending=null;
  showScreen('screen-chat');
  enterNight(1);
}
