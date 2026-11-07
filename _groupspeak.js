// 群聊发言：完全免费，不占行动点
function groupFreeSpeak(){
  var body=$('chatBody'); if(!body) return;
  var seq=[
    {who:'player', text:'大家好，我叫许赎，有什么需要可以找我，请多关照了。'},
    {who:'henry',  text:'谈不上关照的，大家彼此帮助。'},
    {who:'peter',  text:'以后可能要麻烦您，先说一声谢谢。'},
    {who:'action', text:'你随意翻了翻群里，聊天记录就这些了。'}
  ];
  hideChatChoices();
  var i=0;
  var playOne=function(){
    if(i>=seq.length){ renderChatInput(); return; }
    var m=seq[i];
    if(m.who==='action'){
      body.insertAdjacentHTML('beforeend','<div class="msg sys action"><div class="bubble">'+esc(m.text)+'</div></div>');
    } else if(m.who==='player'){
      body.insertAdjacentHTML('beforeend','<div class="msg right"><div class="bubble">'+esc(m.text)+'</div></div>');
    } else {
      body.insertAdjacentHTML('beforeend', groupBubble({speaker:m.who,text:m.text}));
    }
    body.scrollTop=body.scrollHeight;
    i++;
    setTimeout(playOne, 650);
  };
  playOne();
}

