  if(chatMode==='confess'){
    hideChatChoices();
    box.innerHTML='<div class="chat-note">告解墙是匿名的。你只能看。</div>';
    return;
  }
  if(chatMode==='group'){
    if(typeof groupPlaying!=='undefined' && groupPlaying){ hideChatChoices(); box.innerHTML='<div class="chat-note">对方正在输入…</div>'; return; }
    hideChatChoices();
    box.innerHTML = '<div class="chat-note">群聊是免费的。你想说什么？</div>';
    renderChatChoices([
      { text:'大家好，我叫许赎，有什么需要可以找我，请多关照了。', onclick:'groupFreeSpeak()' },
      { text:'（不发言，先去忙）', onclick:'closeChatDetail()' }
    ]);
    return;
  }
