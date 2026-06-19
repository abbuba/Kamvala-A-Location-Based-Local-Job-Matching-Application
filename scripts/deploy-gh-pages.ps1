# Build and push the dist folder to the gh-pages branch (safe — does not touch main).
param(
  [string]$RepoUrl = "https://github.com/abbuba/Kamvala-A-Location-Based-Local-Job-Matching-Application.git"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Push-Location $root

$env:GITHUB_PAGES = "true"
# Do not load .env here — Mapbox token in built JS is blocked by GitHub push protection.
# Add VITE_MAPBOX_TOKEN as a GitHub Actions secret for CI builds instead.
npx vite build
Copy-Item dist\index.html dist\404.html -Force

$deployDir = Join-Path $env:TEMP "kamvala-gh-pages-deploy"
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }
New-Item -ItemType Directory -Path $deployDir | Out-Null
Copy-Item -Path "$root\dist\*" -Destination $deployDir -Recurse -Force

Pop-Location

Push-Location $deployDir
git init
git add .
git commit -m "Deploy Kamvala to GitHub Pages"
git branch -M gh-pages
git remote add origin $RepoUrl
git push -f origin gh-pages
Pop-Location

Write-Host ""
Write-Host "Done. Set GitHub Pages source to: Deploy from branch -> gh-pages -> / (root)"
Write-Host "Live URL: https://abbuba.github.io/Kamvala-A-Location-Based-Local-Job-Matching-Application/"
