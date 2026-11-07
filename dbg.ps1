$ErrorActionPreference='Stop'
$c = [System.IO.File]::ReadAllText((Join-Path (Get-Location).Path '_cfg1.json'), [System.Text.Encoding]::UTF8)
Write-Output ("RAW LEN=" + $c.Length)
Write-Output ("FIRST=" + $c.Substring(0, [Math]::Min(60,$c.Length)))
$j = $c | ConvertFrom-Json
Write-Output ("SRC=[" + $j.Src + "] START=[" + $j.Start + "]")
Write-Output ("FILES: " + ((Get-ChildItem _p1.html).Length))
