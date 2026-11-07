$p = 'd:\OneDrive\Desktop\game.demo\index(1).html'
$b = [System.IO.File]::ReadAllBytes($p)
$t = [System.Text.Encoding]::UTF8.GetString($b)
$i = $t.IndexOf('groupRead')
"first groupRead at $i"
$idx = 0; $n=0
while (($idx = $t.IndexOf('groupRead', $idx)) -ge 0 -and $n -lt 12) {
  "--- $idx : " + ($t.Substring([Math]::Max(0,$idx-120), 200) -replace "`r`n"," ")
  $idx += 9; $n++
}
