$content = Get-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Footer.jsx' -Raw
$content = $content -replace 'border-plumLight/30', 'border-[var(--color-purpleAccent)/30]'
$content = $content -replace 'bg-mainBackground', 'bg-[var(--color-mainbackground)]'
$content = $content -replace 'text-plumdeep', 'text-[var(--color-purpleAccent)]'
$content = $content -replace 'text-plumLightMuted', 'text-[var(--color-purpleAccent)]'
$content = $content -replace 'text-lavender', 'text-[var(--color-pinkHighlight)]'
$content = $content -replace 'bg-plumLight', 'bg-[var(--color-plumLight)]'
$content = $content -replace 'className="w-36 text-plumdeep', 'className="w-36 text-[var(--color-purpleAccent)]'
$content | Set-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Footer.jsx' -Encoding UTF8
Write-Host 'Done'