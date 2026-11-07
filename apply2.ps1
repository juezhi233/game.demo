$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$p = Join-Path $root 'index(1).html'
$enc = New-Object System.Text.UTF8Encoding($false)
function Txt($n){ return [System.IO.File]::ReadAllText((Join-Path $root $n), [System.Text.Encoding]::UTF8) }
function Norm($s){ return $s.Replace("`r`n", "`n").Replace("`r", "`n").Replace("`n", [string][char]13 + [char]10) }

$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
$len0 = $c.Length

$i = $c.IndexOf('let state;')
if($i -lt 0){ throw 'state start fail' }
$j = $c.IndexOf('/* ============================================================ 工具 */', $i)
if($j -lt 0){ throw 'state end fail' }
Write-Output ("state block " + $i + " .. " + $j + " removed " + ($j-$i))

$c = $c.Substring(0, $i) + (Norm (Txt '_state2.js')) + $c.Substring($j)

[System.IO.File]::WriteAllText($p, $c, $enc)
Write-Output ("written " + $len0 + " -> " + $c.Length)
