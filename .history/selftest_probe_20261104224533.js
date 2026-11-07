var _log = [];
window.onerror = function(m,s,l,c,e){ _log.push('ERR:'+m+'@'+l); return false; };
function ok(name, cond){ _log.push((cond?'PASS ':'FAIL ') + name); }

function pumpVN(maxSteps){
  var steps = 0;
  while(dvnState && steps < maxSteps){
    var m = dvnCurrent();
    if(!m) { steps++; break; }
    if(m.choice) return 'choice';
    dvnAdvance();
    steps++;
  }
  return dvnState ? 'running' : 'end';
}

window.addEventListener('load', function(){
  setTimeout(function(){
    try {
      /* ===== 1. 命名 ===== */
      ok('[命名]night1=序章', nightName(1)==='序章');
      ok('[命名]night2=第一天', nightName(2)==='第一天');
      ok('[命名]night5=第四天', nightName(5)==='第四天');
      ok('[命名]night6=终局', nightName(6)==='终局');
      ok('[命名]isPrologue(1)', isPrologue(1)===true);
      ok('[命名]isLastNight(5)', isLastNight(5)===true);

      /* ===== 2. 数据移位 ===== */
      ok('[移位]GROUP_SCRIPT[2]', !!(GROUP_SCRIPT[2] && GROUP_SCRIPT[2].length));
      ok('[移位]GROUP_SCRIPT[1]空', !GROUP_SCRIPT[1]);
      ok('[移位]ACTIONS[2]', !!(ACTIONS[2] && ACTIONS[2].length));
      ok('[移位]PM_SCRIPT[2]', !!PM_SCRIPT[2]);

      /* ===== 3. 启动序章 ===== */
      initGame();
      startPrologue();
      ok('[序章]进入VN', !!dvnState);
      ok('[序章]标题含序章', document.getElementById('vnChapter').textContent.indexOf('序章')>=0);
      ok('[序章]开场首句', dvnCurrent() && dvnCurrent().text.indexOf('雪下得很密')>=0);

      /* ===== 4. 门口选择 ===== */
      var r = pumpVN(80);
      ok('[序章]到达门口选择', r==='choice');
      ok('[序章]选择2项', dvnCurrent().choice && dvnCurrent().choice.length===2);

      /* ===== 5. 转身走 → 结局 ===== */
      initGame(); startPrologue(); pumpVN(80);
      dvnChoose(1);
      ok('[分支]转身走→结局', state.ending && state.ending.title==='风雪不归人');

      /* ===== 6. 推门进去 → 神父 ===== */
      initGame(); startPrologue(); pumpVN(80);
      dvnChoose(0);
      ok('[分支]推门仍在VN', !!dvnState);
      ok('[分支]神父段本文', dvnState && dvnState.queue && dvnState.queue.some(function(x){ return x.text && x.text.indexOf('晚上好，孩子')>=0; }));
      r = pumpVN(200);
      ok('[分支]神父段→群聊', chatMode==='group');
      ok('[分支]群聊有消息', document.getElementById('chatBody').innerHTML.length>0);

      /* ===== 7. 序章放逐 ===== */
      initGame(); state.night=1;
      exileMode='exile'; exileSel='joseph';
      renderExile();
      ok('[序章放逐]显示不放逐', document.getElementById('exileList').innerHTML.indexOf('不放逐')>=0);
      ok('[序章放逐]确认按钮可用', document.getElementById('exileGo').disabled===false);

      /* ===== 8. 序章放逐不结算 ===== */
      initGame(); state.night=1;
      var sus = state.suspicion;
      confirmExile();
      ok('[序章放逐]不加怀疑', state.suspicion===sus);
      ok('[序章放逐]标记跳过', state.prologueExileSkipped===true);
      ok('[序章放逐]无结算', !state.nightResult);

      /* ===== 9. 正常放逐有结算 ===== */
      initGame(); state.night=3; state.ap=2;
      exileMode='spare'; exileSel=null;
      confirmExile();
      ok('[正常放逐]放过有结算', !!state.nightResult);

      /* ===== 10. 指认在night6 ===== */
      initGame(); state.night=5; state.nightResult=null;
      ok('[流程]night5可结束', canEndNight()===true);
      nextNight();
      ok('[流程]night5→night6', state.night===6);

      /* ===== 11. 文案 ===== */
      ok('[文案]N1_OPENING'+N1_OPENING.length, N1_OPENING.length>=5);
      ok('[文案]N1_PRIEST'+N1_PRIEST.length, N1_PRIEST.length>=20);
      ok('[文案]N1_BEN_CHOICES='+N1_BEN_CHOICES.length, N1_BEN_CHOICES.length===3);
      ok('[文案]N1_PHILIP_CHOICES='+N1_PHILIP_CHOICES.length, N1_PHILIP_CHOICES.length===3);
      ok('[文案]N1_LOFT='+N1_LOFT.length, N1_LOFT.length>=10);
      ok('[文案]N1_HALL_CHILD有内容', N1_HALL_CHILD.length>5);

    } catch(e){
      _log.push('RUNTIME:'+e.message+' | '+(e.stack||'').split('\n')[1]);
    }
    var out2 = document.createElement('pre');
    out2.id = 'SELFTEST';
    out2.textContent = _log.join('\n');
    document.body.appendChild(out2);
  }, 800);
});
