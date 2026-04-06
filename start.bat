@echo off
echo.
echo  VERIDEX - Verify Before You Click
echo  ====================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
echo  Node.js found!

echo.
echo  Installing backend dependencies...
cd backend
call npm install --silent
cd ..

echo  Installing frontend dependencies...
cd frontend
call npm install --silent
cd ..

echo.
echo  Starting Veridex...
echo  Backend  --^> http://localhost:5000
echo  Frontend --^> http://localhost:3000
echo.
echo  Press Ctrl+C to stop.
echo.

start "Veridex Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "Veridex Frontend" cmd /k "cd frontend && npm run dev"

echo  Both servers starting in separate windows...
echo  Open http://localhost:3000 in your browser.
pause
