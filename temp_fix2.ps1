$content = Get-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Raw
$content = $content -replace 'bg-softLavender', 'bg-[var(--color-bgSecondary)]'
$content = $content -replace 'hover:bg-plumLight/10', 'hover:bg-[var(--color-mainbackground)/10]'
$content = $content -replace 'border-plumLight/30', 'border-[var(--color-purpleAccent)/30]'
$content = $content -replace 'text-plumdeep[^d]', 'text-[var(--color-purpleAccent)]'
$content = $content -replace 'text-plumLightMuted', 'text-[var(--color-purpleAccent)]'
$content | Set-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Encoding UTF8
Write-Host 'Done'