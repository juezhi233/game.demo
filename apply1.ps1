$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$p = Join-Path $root 'index(1).html'
$enc = New-Object System.Text.UTF8Encoding($false)
function Txt($n){ return [System.IO.File]::ReadAllText((Join-Path $root $n), [System.Text.Encoding]::UTF8) }
function Norm($s){ return $s.Replace("`r`n", "`n").Replace("`r", "`n").Replace("`n", [string][char]13 + [char]10) }

$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
$len0 = $c.Length

# --- 1) 数据层：证据列表 ~ 剧情对话 VN ---
$sm = '// 证据列表'
$em = '// 剧情对话 VN'
$i = $c.IndexOf($sm)
$j = $c.IndexOf($em, $i + $sm.Length)
if($i -lt 0 -or $j -lt 0){ throw 'data anchor fail' }
Write-Output ("data " + $i + ".." + $j)
$c = $c.Substring(0, $i) + (Norm (Txt '_data.js')) + [string][char]13 + [char]10 + $c.Substring($j)

# --- 2) 旧结局定义 ~ 已解锁结局（持久化到 localStorage） ---
$sm = '// 结局定义'
$em = '// 已解锁结局（持久化到 localStorage）'
$i = $c.IndexOf($sm)
$j = $c.IndexOf($em, $i + $sm.Length)
if($i -lt 0 -or $j -lt 0){ throw 'defs anchor fail' }
Write-Output ("defs " + $i + ".." + $j)
$c = $c.Substring(0, $i) + (Norm (Txt '_endings_def.js')) + [string][char]13 + [char]10 + $c.Substring($j)

[System.IO.File]::WriteAllText($p, $c, $enc)
Write-Output ("written " + $len0 + " -> " + $c.Length)

# --- 自检 ---
$c2 = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
$fns = [regex]::Matches($c2,'function\s+([A-Za-z_$][\w$]*)\s*\(') | ForEach-Object { $_.Groups[1].Value }
$dup = $fns | Group-Object | Where-Object { $_.Count -gt 1 }
Write-Output ("funcs=" + $fns.Count + " dup=" + $(if($dup){ ($dup | ForEach-Object { $_.Name }) -join ',' } else { 'none' }))
Write-Output ("CLUES=" + ([regex]::Matches($c2,'const CLUES')).Count + " ENDING_DEFS=" + ([regex]::Matches($c2,'ENDING_DEFS = \{')).Count)
Write-Output ("tail=" + $c2.Substring($c2.Length-30).Replace("`r"," ").Replace("`n","|"))
