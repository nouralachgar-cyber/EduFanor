$content = Get-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Raw
$content = $content -replace 'bg-plumdeep', 'bg-[var(--color-purpleAccent)]'
$content = $content -replace 'text-on-plumdeep', 'text-[var(--color-mainbackground)]'
$content = $content -replace 'hover:bg-softLavender', 'hover:bg-[var(--color-bgSecondary)]'
$content | Set-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Navbar.jsx' -Encoding UTF8
Write-Host 'Done'