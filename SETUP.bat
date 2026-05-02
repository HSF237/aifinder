@echo off
title AI Finder - Setup & Deploy
color 0A
echo.
echo  ==========================================
echo   AI Finder - Project Setup Script
echo  ==========================================
echo.
echo  [1/4] Installing npm packages...
echo.
cd /d "%~dp0"
call npm install
if %errorlevel% neq 0 (
    echo  ERROR: npm install failed. Is Node.js installed?
    pause
    exit /b 1
)
echo.
echo  [2/4] Initializing Git repository...
git init
git add .
git commit -m "Initial deployment: AI Finder v1.0"
echo.
echo  [3/4] Starting dev server...
echo.
echo  ==========================================
echo   DONE! Opening http://localhost:5173
echo   Press Ctrl+C to stop the server
echo  ==========================================
echo.
call npm run dev
pause
