$content = Get-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Sidebar.jsx' -Raw
$content = $content -replace "const adminPath = '/admin';\r?\n", ''
$content | Set-Content 'C:\Users\pc\Desktop\EduFanor\client\src\components\Sidebar.jsx' -Encoding UTF8
Write-Host 'Done'