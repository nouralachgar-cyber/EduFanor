$content = Get-Content 'C:\Users\pc\Desktop\EduFanor\client\src\pages\PublicLandingPage.jsx' -Raw

# Replace #C5B0CD with CSS variable (primary border/text color in dark mode)
$content = $content -replace '#C5B0CD', 'var(--color-purpleAccent)'

# Replace #415E72 with CSS variable (lavender muted)  
$content = $content -replace '#415E72', 'var(--color-plumLight)'

# Replace #17313E with CSS variable (main background dark)
$content = $content -replace '#17313E', 'var(--color-mainbackground)'

# Replace #F6F5F2 with CSS variable (light text/background)
$content = $content -replace '#F6F5F2', 'var(--color-pinkHighlight)'

# Replace #F0EFF5 with CSS variable
$content = $content -replace '#F0EFF5', 'var(--color-plumLightest)'

# Replace #FFD0EC with CSS variable (pink highlight) - shouldn't need replacement as it's already in the palette

$content | Set-Content 'C:\Users\pc\Desktop\EduFanor\client\src\pages\PublicLandingPage.jsx' -Encoding UTF8
Write-Host 'Done'