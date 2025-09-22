@echo off
echo.
echo =====================================
echo    DanceAI Presentation Launcher
echo =====================================
echo.
echo Starting local server for presentation...
echo.
echo The presentation will open in your default browser.
echo Press Ctrl+C to stop the server when done.
echo.

cd /d "%~dp0"

REM Try Python 3 first
python -m http.server 8080 >nul 2>&1 && (
    echo Server started on http://localhost:8080
    start http://localhost:8080
    python -m http.server 8080
) || (
    REM If Python 3 fails, try Python 2
    python -m SimpleHTTPServer 8080 >nul 2>&1 && (
        echo Server started on http://localhost:8080
        start http://localhost:8080
        python -m SimpleHTTPServer 8080
    ) || (
        REM If no Python, just open the file directly
        echo Python not found. Opening presentation directly in browser...
        echo Note: Some features may not work without a local server.
        echo.
        start index.html
    )
)

pause