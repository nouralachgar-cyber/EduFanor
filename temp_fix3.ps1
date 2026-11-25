$content = Get-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Raw
$content = $content -replace 'border-plumLight', 'border-[var(--color-plumLight)]'
$content = $content -replace 'text-plumLightMuted', 'text-[var(--color-purpleAccent)]'
$content | Set-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Encoding UTF8
Write-Host 'Done'