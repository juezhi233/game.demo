# Apply small HTML/CSS patches to index(1).html (marker-based replacement)
param(
  [Parameter(Mandatory=$true)][string]$Start,
  [Parameter(Mandatory=$true)][string]$End,
  [Parameter(Mandatory=$true)][string]$File,
  [switch]$KeepEnd
)
$path = Join-Path (Get-Location) 'index(1).html'
$c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$i = $c.IndexOf($Start)
if($i -lt 0){ Write-Output "START NOT FOUND"; exit 1 }
$j = $c.IndexOf($End, $i)
if($j -lt 0){ Write-Output "END NOT FOUND"; exit 1 }
$repl = [System.IO.File]::ReadAllText((Join-Path (Get-Location) $File), [System.Text.Encoding]::UTF8)
if($KeepEnd){ $j = $c.IndexOf($End, $i) } else { $j = $c.IndexOf($End, $i) + $End.Length }
$out = $c.Substring(0,$i) + $repl + $c.Substring($j)
[System.IO.File]::WriteAllText($path, $out, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ("OK start={0} end={1} newlen={2}" -f $i, $j, $out.Length)
