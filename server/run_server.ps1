param([switch]$Background)
if ($Background) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "node"
    $psi.Arguments = "C:\Users\SKIZO-NEBRAS-MEXICY\Desktop\EduFanor\server\server.js"
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $process = [System.Diagnostics.Process]::Start($psi)
    $process.WaitForExit()
    Write-Host "Server exited with code $($process.ExitCode)"
} else {
    & node .\server.js
}