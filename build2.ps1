$ErrorActionPreference='Stop'
$root = (Get-Location).Path
$Q = [string][char]34
$SQ = [string][char]39
$nl = [string][char]13 + [char]10
function GetTxt($name){ return [System.IO.File]::ReadAllText((Join-Path $root $name), [System.Text.Encoding]::UTF8) }
function ReplaceBlock($text, $startMark, $endMark, $newText){
  $i = $text.IndexOf($startMark)
  if($i -lt 0){ throw ('start not found: ' + $startMark) }
  $j = $text.IndexOf($endMark, $i)
  if($j -lt 0){ throw ('end not found: ' + $endMark) }
  $j = $j + $endMark.Length
  return $text.Substring(0,$i) + $newText + $text.Substring($j)
}
function ReplaceMid($text, $startMark, $endMark, $newText){
  $i = $text.IndexOf($startMark)
  if($i -lt 0){ throw ('mid start not found: ' + $startMark) }
  $j = $text.IndexOf($endMark, $i)
  if($j -lt 0){ throw ('mid end not found: ' + $endMark) }
  return $text.Substring(0,$i) + $newText + $text.Substring($j)
}

$L = GetTxt '.history\index(1)_20261102225557.html'
Write-Output ('base=' + $L.Length)

# edit1 statBar
$s = $L.IndexOf('id=' + $Q + 'statBar' + $Q) - 4
$e = $L.IndexOf('<div id=' + $Q + 'pageWrap' + $Q + '>')
$L = $L.Substring(0,$s) + (GetTxt '_p1.html') + $L.Substring($e)
Write-Output ('edit1 ok ' + $L.Length)

# edit2 actions page
$s = $L.IndexOf('<div class=' + $Q + 'page-scroll' + $Q + '>' + $nl + '          <div class=' + $Q + 'act-section-title' + $Q + '>场 景')
$endStr = '</div>' + $nl + '      </div>' + $nl + $nl
$e = $L.IndexOf($endStr, $s) + $endStr.Length
$L = $L.Substring(0,$s) + (GetTxt '_p2.html') + $L.Substring($e)
Write-Output ('edit2 ok ' + $L.Length)

# edit3 exile page
$s = $L.IndexOf('<div class=' + $Q + 'page-scroll' + $Q + '>' + $nl + '          <div class=' + $Q + 'exile-mode' + $Q + '>')
$endMarker2 = '</div>' + $nl + $nl + '    </div>'
$e = $L.IndexOf($endMarker2, $s) + $endMarker2.Length
$L = $L.Substring(0,$s) + (GetTxt '_p3.html') + $L.Substring($e)
Write-Output ('edit3 ok ' + $L.Length)

$L = ReplaceBlock $L '// 证据列表' '// 剧情对话 VN' ((GetTxt '_data.js') + $nl)
Write-Output ('edit4 ok ' + $L.Length)
$L = ReplaceMid $L 'function freshState(){' 'let toastTimer=null;' ((GetTxt '_state.js') + $nl)
Write-Output ('edit5 ok ' + $L.Length)
$L = ReplaceMid $L '/* ============================================================ 行动页 */' '/* ============================================================ 放逐页 */' ((GetTxt '_actions.js') + $nl)
Write-Output ('edit6 ok ' + $L.Length)
$L = ReplaceMid $L '/* ============================================================ 放逐页 */' '/* ============================================================ 主页 */' ((GetTxt '_exile.js') + $nl)
Write-Output ('edit7 ok ' + $L.Length)
$L = ReplaceMid $L 'function renderHome(){' 'function showApp(id){' ((GetTxt '_home.js') + $nl)
Write-Output ('edit8 ok ' + $L.Length)
$L = ReplaceMid $L 'function nextNight(){' '/* ============================================================ 最终指认 */' ((GetTxt '_next.js') + $nl)
Write-Output ('edit9 ok ' + $L.Length)
$L = ReplaceMid $L '/* ============================================================ 最终指认 */' '/* ============================================================ 结局展示 */' ((GetTxt '_accuse.js') + $nl)
Write-Output ('edit10 ok ' + $L.Length)
$L = ReplaceMid $L 'function showEnding(def){' '/* ============================================================ 弹窗 */' ((GetTxt '_ending.js') + $nl)
Write-Output ('edit11 ok ' + $L.Length)
$L = ReplaceBlock $L 'const ENDING_DEFS = {' '// 已解锁结局（持久化到 localStorage）' ((GetTxt '_endings_def.js') + $nl)
Write-Output ('edit12 ok ' + $L.Length)
$L = ReplaceMid $L ('  if(chatMode===' + $SQ + 'confess' + $SQ + '){') ('  if(chatMode===' + $SQ + 'pm' + $SQ + '){') (GetTxt '_chatinput.js')
Write-Output ('edit13 ok ' + $L.Length)
$L = ReplaceMid $L 'function spendAP(n){' '// 通用：聊天页居中选项浮层' (GetTxt '_groupspeak.js')
Write-Output ('edit14 ok ' + $L.Length)
$L = ReplaceMid $L '// A. 公开回复：选回复谁' '/* ============================================================ 行动页 */' ((GetTxt '_spr.js') + $nl)
Write-Output ('edit15 ok ' + $L.Length)

[System.IO.File]::WriteAllText((Join-Path $root 'index(1).html'), $L, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('WROTE size=' + (Get-Item (Join-Path $root 'index(1).html')).Length)
