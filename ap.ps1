param([string]$CfgFile)
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$cfgRaw = [System.IO.File]::ReadAllText((Join-Path $root $CfgFile), [System.Text.Encoding]::UTF8)
$cfg = $cfgRaw | ConvertFrom-Json
Write-Output ("DBG src=[{0}] start=[{1}] cfg={2}" -f $cfg.Src, $cfg.Start, $Cfg)
$path = Join-Path $root 'index(1).html'
if($cfg.Mode -eq 'json'){
  $obj = Get-Content -LiteralPath (Join-Path $root $cfg.Src) -Raw -Encoding UTF8 | ConvertFrom-Json
  $txt = $obj.Text
} else {
  $txt = [System.IO.File]::ReadAllText((Join-Path $root $cfg.Src), [System.Text.Encoding]::UTF8)
}
$c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$i = $c.IndexOf($cfg.Start)
if($i -lt 0){ Write-Output 'START-NOT-FOUND'; exit 1 }
$j = $c.IndexOf($cfg.End, $i)
if($j -lt 0){ Write-Output 'END-NOT-FOUND'; exit 1 }
if($cfg.KeepEnd){ $tail = $c.Substring($j) } else { $tail = $c.Substring($j + $cfg.End.Length) }
$out = $c.Substring(0, $i) + $txt + $tail
[System.IO.File]::WriteAllText($path, $out, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ("OK start={0} end={1} newlen={2}" -f $i, $j, $out.Length)
