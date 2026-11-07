$ErrorActionPreference='Stop'
$root = (Get-Location).Path
function GetTxt($name){ return [System.IO.File]::ReadAllText((Join-Path $root $name), [System.Text.Encoding]::UTF8) }
function ReplaceMid($text, $startMark, $endMark, $newText, $tag){
  Write-Output ('  [ReplaceMid] ' + $tag + ' startMarkLen=' + $startMark.Length + ' endMarkLen=' + $endMark.Length)
  $i = $text.IndexOf($startMark)
  if($i -lt 0){ throw ('missing start ' + $tag) }
  $j = $text.IndexOf($endMark, $i + $startMark.Length)
  Write-Output ('  [ReplaceMid] ' + $tag + ' i=' + $i + ' j=' + $j + ' lens=' + $startMark.Length + '/' + $endMark.Length)
  if($j -lt 0){ throw ('missing end ' + $tag) }
  return $text.Substring(0,$i) + $newText + $text.Substring($j)
}
$H = GetTxt '_headA.html'
Write-Output ('start=' + $H.Length)

# 1) 数据层：证据列表 ～ 剧情对话 VN
$d = GetTxt '_data.js'
$H = ReplaceMid $H '// 证据列表' '// 剧情对话 VN' $d 'data'
Write-Output ('after data=' + $H.Length)

# 2) ENDING_DEFS：必须排在数据层之后（在数据层中定位，避免重复标记歧义）
$sDefs = $H.IndexOf('const ENDING_DEFS = {', $H.IndexOf($d) + $d.Length)
if($sDefs -lt 0){ throw 'defs anchor missing' }
$eDefs = $H.IndexOf('// 已解锁结局（持久化到 localStorage）', $sDefs)
if($eDefs -lt 0){ throw 'defs end missing' }
$H = $H.Substring(0,$sDefs) + (GetTxt '_endings_def.js') + $H.Substring($eDefs)
Write-Output ('after defs=' + $H.Length)

# 3) 状态层
$H = ReplaceMid $H 'function freshState(){' 'let toastTimer=null;' (GetTxt '_state.js') 'state'
Write-Output ('after state=' + $H.Length)

# 4) 行动页逻辑
$sAct = $H.IndexOf('/* ============================================================ 行动页 */', $H.IndexOf('function freshState(){'))
if($sAct -lt 0){ throw 'actions anchor missing' }
$eAct = $H.IndexOf('/* ============================================================ 放逐页 */', $sAct)
if($eAct -lt 0){ throw 'actions end missing' }
$H = $H.Substring(0,$sAct) + (GetTxt '_actions.js') + $H.Substring($eAct)
Write-Output ('after actions=' + $H.Length)

# 5) 放逐页逻辑
$sEx = $H.IndexOf('/* ============================================================ 放逐页 */', $sAct + 100)
if($sEx -lt 0){ throw 'exile anchor missing' }
$eEx = $H.IndexOf('/* ============================================================ 主页 */', $sEx)
if($eEx -lt 0){ throw 'exile end missing' }
$H = $H.Substring(0,$sEx) + (GetTxt '_exile.js') + $H.Substring($eEx)
Write-Output ('after exile=' + $H.Length)

# 6) 主页
$H = ReplaceMid $H 'function renderHome(){' 'function showApp(id){' (GetTxt '_home.js') 'home'
Write-Output ('after home=' + $H.Length)

# 7) 夜间流转
$sNx = $H.IndexOf('function nextNight(){', $eEx)
if($sNx -lt 0){ throw 'next anchor missing' }
$eNx = $H.IndexOf('/* ============================================================ 最终指认 */', $sNx)
if($eNx -lt 0){ throw 'next end missing' }
$H = $H.Substring(0,$sNx) + (GetTxt '_next.js') + $H.Substring($eNx)
Write-Output ('after next=' + $H.Length)

# 8) 指认
$sAc = $H.IndexOf('/* ============================================================ 最终指认 */', $sNx)
if($sAc -lt 0){ throw 'accuse anchor missing' }
$eAc = $H.IndexOf('/* ============================================================ 结局展示 */', $sAc)
if($eAc -lt 0){ throw 'accuse end missing' }
$H = $H.Substring(0,$sAc) + (GetTxt '_accuse.js') + $H.Substring($eAc)
Write-Output ('after accuse=' + $H.Length)

# 9) 结局展示
$sEn = $H.IndexOf('function showEnding(def){', $eAc)
if($sEn -lt 0){ throw 'ending anchor missing' }
$eEn = $H.IndexOf('/* ============================================================ 弹窗 */', $sEn)
if($eEn -lt 0){ throw 'ending end missing' }
$H = $H.Substring(0,$sEn) + (GetTxt '_ending.js') + $H.Substring($eEn)
Write-Output ('after ending=' + $H.Length)

# 10) 群聊输入
$sCh = $H.IndexOf('  if(chatMode=' + [char]39 + 'confess' + [char]39 + '){')
if($sCh -lt 0){ throw 'chat anchor missing' }
$eCh = $H.IndexOf('  if(chatMode=' + [char]39 + 'pm' + [char]39 + '){', $sCh)
if($eCh -lt 0){ throw 'chat end missing' }
$H = $H.Substring(0,$sCh) + (GetTxt '_chatinput.js') + $H.Substring($eCh)
Write-Output ('after chat=' + $H.Length)

# 11) 免费群聊
$H = ReplaceMid $H 'function spendAP(n){' '// 通用：聊天页居中选项浮层' (GetTxt '_groupspeak.js') 'speak'
Write-Output ('after speak=' + $H.Length)

# 12) 巡夜路线 + VN 播放器
$sPt = $H.IndexOf('// A. 公开回复：选回复谁')
if($sPt -lt 0){ throw 'patrol anchor missing' }
$ePt = $H.IndexOf('/* ============================================================ 行动页 */', $sPt)
if($ePt -lt 0){ throw 'patrol end missing' }
$H = $H.Substring(0,$sPt) + (GetTxt '_spr.js') + $H.Substring($ePt)
Write-Output ('after patrol=' + $H.Length)

[System.IO.File]::WriteAllText((Join-Path $root '_headB.html'), $H, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('WROTE ' + $H.Length)
