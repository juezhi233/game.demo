$ErrorActionPreference='Stop'
$root = (Get-Location).Path
function GetTxt($name){ return [System.IO.File]::ReadAllText((Join-Path $root $name), [System.Text.Encoding]::UTF8) }
$H = GetTxt '_headC.html'
Write-Output ('start=' + $H.Length)

# 1) 状态层
$sm = 'function freshState(){'; $em = 'let toastTimer=null;'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'state start' }
$j = $H.IndexOf($em, $i + $sm.Length)
Write-Output ('state i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_state.js') + $H.Substring($j)
Write-Output ('after state=' + $H.Length)

# 2) 行动页逻辑
$sm = '/* ============================================================ 行动页 */'
$sm2 = '/* ============================================================ 放逐页 */'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'actions start' }
$j = $H.IndexOf($sm2, $i + $sm.Length)
Write-Output ('actions i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_actions.js') + $H.Substring($j)
Write-Output ('after actions=' + $H.Length)

# 3) 放逐页逻辑
$sm3 = '/* ============================================================ 主页 */'
$i = $H.IndexOf($sm2)
if($i -lt 0){ throw 'exile start' }
$j = $H.IndexOf($sm3, $i + $sm2.Length)
Write-Output ('exile i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_exile.js') + $H.Substring($j)
Write-Output ('after exile=' + $H.Length)

# 4) 主页
$sm = 'function renderHome(){'; $em = 'function showApp(id){'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'home start' }
$j = $H.IndexOf($em, $i + $sm.Length)
Write-Output ('home i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_home.js') + $H.Substring($j)
Write-Output ('after home=' + $H.Length)

# 5) 夜间流转
$sm = 'function nextNight(){'
$sm2 = '/* ============================================================ 最终指认 */'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'next start' }
$j = $H.IndexOf($sm2, $i + $sm.Length)
Write-Output ('next i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_next.js') + $H.Substring($j)
Write-Output ('after next=' + $H.Length)

# 6) 指认
$sm3 = '/* ============================================================ 结局展示 */'
$i = $H.IndexOf($sm2)
if($i -lt 0){ throw 'accuse start' }
$j = $H.IndexOf($sm3, $i + $sm2.Length)
Write-Output ('accuse i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_accuse.js') + $H.Substring($j)
Write-Output ('after accuse=' + $H.Length)

# 7) 结局展示
$sm = 'function showEnding(def){'; $em = '/* ============================================================ 弹窗 */'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'ending start' }
$j = $H.IndexOf($em, $i + $sm.Length)
Write-Output ('ending i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_ending.js') + $H.Substring($j)
Write-Output ('after ending=' + $H.Length)

# 8) 群聊输入
$sm = '  if(chatMode=' + [char]39 + 'confess' + [char]39 + '){'
$em = '  if(chatMode=' + [char]39 + 'pm' + [char]39 + '){'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'chat start' }
$j = $H.IndexOf($em, $i + $sm.Length)
Write-Output ('chat ri0=' + $ri0 + ' i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_chatinput.js') + $H.Substring($j)
Write-Output ('after chat=' + $H.Length)

# 9) 免费群聊
$sm = 'function spendAP(n){'; $em = '// 通用：聊天页居中选项浮层'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'speak start' }
$j = $H.IndexOf($em, $i + $sm.Length)
Write-Output ('speak i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_groupspeak.js') + $H.Substring($j)
Write-Output ('after speak=' + $H.Length)

# 10) 巡夜路线 + VN 播放器
$sm = '// A. 公开回复：选回复谁'
$sm2 = '/* ============================================================ 行动页 */'
$i = $H.IndexOf($sm)
if($i -lt 0){ throw 'patrol start' }
$j = $H.IndexOf($sm2, $i + $sm.Length)
Write-Output ('patrol i=' + $i + ' j=' + $j)
$H = $H.Substring(0,$i) + (GetTxt '_spr.js') + $H.Substring($j)
Write-Output ('after patrol=' + $H.Length)

[System.IO.File]::WriteAllText((Join-Path $root '_headB.html'), $H, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('WROTE ' + $H.Length)
