$ErrorActionPreference='Stop'
$root = (Get-Location).Path
$LF = [string][char]10
$CRLF = [string][char]13 + [char]10
function GetTxt($name){ return [System.IO.File]::ReadAllText((Join-Path $root $name), [System.Text.Encoding]::UTF8) }
function Norm($s){ return ($s -replace [string][char]13 + "`n", "`n").Replace("`n", [string][char]13 + [char]10) }
function Fix($text, $startMark, $endMark, $newText, $tag){
  Write-Output ('  [Fix] tag=' + $tag + ' smLen=' + $startMark.Length + ' emLen=' + $endMark.Length)
  $i = $text.IndexOf($startMark)
  if($i -lt 0){ throw ('missing start ' + $tag) }
  $j = $text.IndexOf($endMark, $i + $startMark.Length)
  Write-Output ('  [Fix] i=' + $i) 
  if($j -lt 0){ throw ('missing end ' + $tag) }
  Write-Output ('  [' + $tag + '] ' + $i + '..' + $j)
  return $text.Substring(0,$i) + (Norm $newText) + $text.Substring($j)
}

# ---- 阶段 C：数据 + 结局表 ----
if(-not (Test-Path (Join-Path $root '_headC.html'))){
  $H = GetTxt '_headA.html'
  $H = Fix $H '// 证据列表' '// 剧情对话 VN' (GetTxt '_data.js') 'data'
  $H = Fix $H 'const ENDING_DEFS = {' '// 已解锁结局（持久化到 localStorage）' (GetTxt '_endings_def.js') 'defs'
  [System.IO.File]::WriteAllText((Join-Path $root '_headC.html'), $H, (New-Object System.Text.UTF8Encoding($false)))
  Write-Output ('stage C wrote ' + $H.Length)
  return
}

# ---- 阶段 B：逻辑层 ----
$H = GetTxt '_headC.html'
Write-Output ('stage B start=' + $H.Length)
$H = Fix $H 'function freshState(){' 'let toastTimer=null;' (GetTxt '_state.js') 'state'
$H = Fix $H '/* ============================================================ 行动页 */' '/* ============================================================ 放逐页 */' (GetTxt '_actions.js') 'actions'
$H = Fix $H '/* ============================================================ 放逐页 */' '/* ============================================================ 主页 */' (GetTxt '_exile.js') 'exile'
$H = Fix $H 'function renderHome(){' 'function showApp(id){' (GetTxt '_home.js') 'home'
$H = Fix $H 'function nextNight(){' '/* ============================================================ 最终指认 */' (GetTxt '_next.js') 'next'
$H = Fix $H '/* ============================================================ 最终指认 */' '/* ============================================================ 结局展示 */' (GetTxt '_accuse.js') 'accuse'
$H = Fix $H 'function showEnding(def){' '/* ============================================================ 弹窗 */' (GetTxt '_ending.js') 'ending'

# 群聊输入（限定在 renderChatInput 之后）
$ri = $H.IndexOf('function renderChatInput(')
if($ri -lt 0){ throw 'renderChatInput missing' }
$sm = '  if(chatMode=' + [char]39 + 'confess' + [char]39 + '){'
$em = '  if(chatMode=' + [char]39 + 'pm' + [char]39 + '){'
$i = $H.IndexOf($sm, $ri)
if($i -lt 0){ throw 'chat start' }
$j = $H.IndexOf($em, $i + $sm.Length)
if($j -lt 0){ throw 'chat end' }
Write-Output ('  [chat] ' + $i + '..' + $j)
$H = $H.Substring(0,$i) + (Norm (GetTxt '_chatinput.js')) + $H.Substring($j)

$H = Fix $H 'function spendAP(n){' '// 通用：聊天页居中选项浮层' (GetTxt '_groupspeak.js') 'speak'
$H = Fix $H '// A. 公开回复：选回复谁' '/* ============================================================ 行动页 */' (GetTxt '_spr.js') 'patrol'

[System.IO.File]::WriteAllText((Join-Path $root '_headB.html'), $H, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('stage B wrote ' + $H.Length)
