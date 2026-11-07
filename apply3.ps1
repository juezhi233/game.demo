$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$p = Join-Path $root 'index(1).html'
$enc = New-Object System.Text.UTF8Encoding($false)
function Txt($n){ return [System.IO.File]::ReadAllText((Join-Path $root $n), [System.Text.Encoding]::UTF8) }
function Norm($s){ return $s.Replace("`r`n", "`n").Replace("`r", "`n").Replace("`n", [string][char]13 + [char]10) }

$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
$len0 = $c.Length

# ---- 1) 替换 CSS：从 /* 证据板 */ 到 /* 放逐页 */ ----
$sm = '/* 证据板 */'
$em = '/* 放逐页 */'
$i = $c.IndexOf($sm)
if($i -lt 0){ throw 'css start fail' }
$j = $c.IndexOf($em, $i + $sm.Length)
if($j -lt 0){ throw 'css end fail' }
Write-Output ("css " + $i + ".." + $j)
$c = $c.Substring(0, $i) + (Norm (Txt '_css_evboard.css')) + $c.Substring($j)

# ---- 2) 替换 renderEvidence ----
$sm = 'function renderEvidence(){'
$i = $c.IndexOf($sm)
if($i -lt 0){ throw 'fn start fail' }
$j = $c.IndexOf('/* ============================================================ VN 场景 */', $i)
if($j -lt 0){ throw 'fn end fail' }
Write-Output ("fn " + $i + ".." + $j)
$c = $c.Substring(0, $i) + (Norm (Txt '_renderEvidence2.js')) + [string][char]13 + [char]10 + $c.Substring($j)

[System.IO.File]::WriteAllText($p, $c, $enc)
Write-Output ("written " + $len0 + " -> " + $c.Length)
