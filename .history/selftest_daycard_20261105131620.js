var _log=[];
window.onerror=function(m,s,l,c,e){_log.push('ERR:'+m+'@'+l);return false;};
function ok(n,c){_log.push((c?'PASS ':'FAIL ')+n);}
function chShown(){var b=document.getElementById('chatChoices');return !!(b&&b.classList.contains('show')&&b.innerHTML.length>0);}
function chText(){return document.getElementById('chatChoices').innerText;}

// 强制同步推进海伦私聊：清掉定时器，手动 step
function forceHelenStep(max){
  for(var i=0;i<max;i++){
    clearTimeout(); // 无参数无效，但每次 proHelenStep 会再设新 timer
    var before = PRO.pmIdx;
    // 若已弹选项就停
    if(chShown()) return 'choice';
    if(PRO.pmIdx >= PRO.pmScript.length) return 'end';
    // 直接调用内部逻辑：复用 proHelenStep 但不指望它的 setTimeout
    proHelenStep();
    if(PRO.pmIdx===before) return 'stuck';
  }
  return 'max';
}

window.addEventListener('load',function(){
  setTimeout(function(){
    try{
      /* ① 换天卡元素 */
      ok('①dayCard元素', !!document.getElementById('dayCard'));

      /* ② startGame 显示序章 */
      initGame();
      var shownLabel=null;
      var real=window.showDayCard;
      window.showDayCard=function(l,cb){ shownLabel=l; if(cb)cb(); };
      startGame();
      window.showDayCard=real;
      ok('②黑屏显示序章', shownLabel && shownLabel.indexOf('序')>=0);
      ok('②b进序章VN', !!dvnState);

      /* ③ 回房VN + 海伦 */
      initGame(); state.night=1;
      endPrologue();
      ok('③回房VN开', !!dvnState);
      var sawRoom=(dvnState.queue||[]).some(function(m){return m.text&&m.text.indexOf('顶住门')>=0;});
      ok('④回房顶门文本在队列', sawRoom);

      // 直接触发 proToHelenPM（跳过VN时序）
      proToHelenPM();
      ok('⑤进海伦私聊', chatWho==='helen' && chatMode==='pm');

      // 清空 body，手动一步步播
      document.getElementById('chatBody').innerHTML='';
      PRO.pmIdx=0;
      // 播第一条(海伦"你好？")
      proHelenStep();
      ok('⑥海伦第一句已播', document.getElementById('chatBody').innerHTML.indexOf('活着吗')>=0);

      // 再 step 一次 → 遇 prompt → 弹选项
      PRO.pmIdx=1; // 已播到第一条，下一条是 prompt
      // 清掉挂起timer，直接调
      proHelenStep();
      ok('⑦弹选项', chShown() && chText().indexOf('活着')>=0);

      // 点选项
      if(chShown()) proHelenReply();
      ok('⑧许赎句靠右', document.getElementById('chatBody').innerHTML.indexOf('msg right')>=0);
      ok('⑧b海伦数据完整', N1_PM_HELEN.length>=10);

      /* ⑨ nextNight 换天卡 */
      initGame(); state.night=2;
      var lbl2=null; var real2=window.showDayCard;
      window.showDayCard=function(l,cb){ lbl2=l; ok('⑨nextNight显示第二天', l.indexOf('第二天')>=0); };
      nextNight();
      window.showDayCard=real2;

    }catch(e){_log.push('RUNTIME:'+e.message+' | '+(e.stack||'').split('\n')[1]);}
    var o=document.createElement('pre');o.id='SELFTEST';o.textContent=_log.join('\n');document.body.appendChild(o);
  },800);
});
