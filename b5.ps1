$ErrorActionPreference='Stop'
$root = (Get-Location).Path
function GetTxt($name){ return [System.IO.File]::ReadAllText((Join-Path $root $name), [System.Text.Encoding]::UTF8) }
function ReplaceMid($text, $startMark, $endMark, $newText, $tag){
  $i = $text.IndexOf($startMark)
  if($i -lt 0){ throw ('missing start ' + $tag) }
  $j = $text.IndexOf($endMark, $i + $startMark.Length)
  if($j -lt 0){ throw ('missing end ' + $tag) }
  return $text.Substring(0,$i) + $newText + $text.Substring($j)
}
$H = GetTxt '_headA.html'
Write-Output ('start=' + $H.Length)
$H = ReplaceMid $H '// 证据列表' '// 剧情对话 VN' (GetTxt '_data.js') 'data'
Write-Output ('after data=' + $H.Length)
$H = ReplaceMid $H 'function freshState(){' 'let toastTimer=null;' (GetTxt '_state.js') 'state'
Write-Output ('after state=' + $H.Length)
$H = ReplaceMid $H '/* ============================================================ 行动页 */' '/* ============================================================ 放逐页 */' (GetTxt '_actions.js') 'actions'
Write-Output ('after actions=' + $H.Length)
$H = ReplaceMid $H '/* ============================================================ 放逐页 */' '/* ============================================================ 主页 */' (GetTxt '_exile.js') 'exile'
Write-Output ('after exile=' + $H.Length)
$H = ReplaceMid $H 'function renderHome(){' 'function showApp(id){' (GetTxt '_home.js') 'home'
Write-Output ('after home=' + $H.Length)
$H = ReplaceMid $H 'function nextNight(){' '/* ============================================================ 最终指认 */' (GetTxt '_next.js') 'next'
Write-Output ('after next=' + $H.Length)
$H = ReplaceMid $H '/* ============================================================ 最终指认 */' '/* ============================================================ 结局展示 */' (GetTxt '_accuse.js') 'accuse'
Write-Output ('after accuse=' + $H.Length)
$H = ReplaceMid $H 'function showEnding(def){' '/* ============================================================ 弹窗 */' (GetTxt '_ending.js') 'ending'
Write-Output ('after ending=' + $H.Length)
$H = ReplaceMid $H 'const ENDING_DEFS = {' '// 已解锁结局（持久化到 localStorage）' (GetTxt '_endings_def.js') 'defs'
Write-Output ('after defs=' + $H.Length)
$H = ReplaceMid $H ('  if(chatMode=' + [char]39 + 'confess' + [char]39 + '){') ('  if(chatMode=' + [char]39 + 'pm' + [char]39 + '){') (GetTxt '_chatinput.js') 'chat'
Write-Output ('after chat=' + $H.Length)
$H = ReplaceMid $H 'function spendAP(n){' '// 通用：聊天页居中选项浮层' (GetTxt '_groupspeak.js') 'speak'
Write-Output ('after speak=' + $H.Length)
$H = ReplaceMid $H '// A. 公开回复：选回复谁' '/* ============================================================ 行动页 */' (GetTxt '_spr.js') 'patrol'
Write-Output ('after patrol=' + $H.Length)
[System.IO.File]::WriteAllText((Join-Path $root '_headB.html'), $H, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('WROTE ' + $H.Length)
