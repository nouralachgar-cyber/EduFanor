$content = Get-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Raw
$content = $content -replace 'text-plumLightMuted', 'text-[var(--color-purpleAccent)]'
$content = $content -replace 'text-plumdeep[^d]', 'text-[var(--color-purpleAccent)]'
$content = $content -replace 'bg-plumLight/30', 'bg-[var(--color-bgSecondary)/30]'
$content = $content -replace 'bg-mainBackground/90', 'bg-[var(--color-mainbackground)/90]'
$content = $content -replace 'border-plumLight/30', 'border-[var(--color-purpleAccent)/30]'
$content | Set-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Encoding UTF8
Write-Host 'Done'