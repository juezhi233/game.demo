$ErrorActionPreference='Stop'
$root = (Get-Location).Path
$nl = [string][char]13 + [char]10
function GetTxt($name, $enc){
  if(-not $enc){ $enc = [System.Text.Encoding]::UTF8 }
  return [System.IO.File]::ReadAllText((Join-Path $root $name), $enc)
}
$m = [string][char]0xE5  # not used
$H = GetTxt '_head.txt' ([System.Text.Encoding]::GetEncoding(936))
Write-Output ('head=' + $H.Length)

$p1 = $H.IndexOf('id="statBar"') - 4
$pEnd = $H.IndexOf('<div id="pageWrap">')
Write-Output ('p1=' + $p1 + ' pEnd=' + $pEnd)
$H = $H.Substring(0,$p1) + (GetTxt '_p1.html') + $H.Substring($pEnd)
Write-Output ('a1=' + $H.Length)

$s = $H.IndexOf('<div class="page-scroll">', $H.IndexOf('id="page-actions"'))
$e = $H.IndexOf('<!-- 放逐页 -->')
Write-Output ('p2=' + $s + ' p3=' + $e)
$H = $H.Substring(0,$s) + (GetTxt '_p2.html') + $H.Substring($e)
Write-Output ('a2=' + $H.Length)

$s = $H.IndexOf('<div class="page-scroll">', $H.IndexOf('id="page-exile"'))
$e = $H.IndexOf('    </div>', $H.IndexOf('id="exileGo"'))
Write-Output ('p4=' + $s + ' p5=' + $e)
$H = $H.Substring(0,$s) + (GetTxt '_p3.html') + $H.Substring($e)
Write-Output ('a3=' + $H.Length)

[System.IO.File]::WriteAllText((Join-Path $root '_headA.html'), $H, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('WROTE ' + $H.Length)
