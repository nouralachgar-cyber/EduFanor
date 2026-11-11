param([switch]$Background)
$serverRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($Background) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "node"
    $psi.Arguments = (Join-Path $serverRoot 'server.js')
    $psi.WorkingDirectory = $serverRoot
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $process = [System.Diagnostics.Process]::Start($psi)
    $process.WaitForExit()
    Write-Host "Server exited with code $($process.ExitCode)"
} else {
    Set-Location -LiteralPath $serverRoot
    & node .\server.js
}