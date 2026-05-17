@echo off
cd /d "C:\Users\HI\Desktop\MY CODESPACE\Ai Finder\aifinder"
echo === Committing accuracy fix ===
git add src/App.jsx
git commit -m "Fix AI detection: strict watermark rules + keyword override logic"
echo.
echo === Updating remote URL (removing expired token) ===
git remote set-url origin https://github.com/HSF237/aifinder.git
echo.
echo === Pushing to GitHub ===
git push origin main
echo.
echo === Done ===
pause
