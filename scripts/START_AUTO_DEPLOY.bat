@echo off
REM START AUTO DEPLOY - Ensures ALL changes go online automatically

echo ====================================
echo STARTING AUTO DEPLOY DAEMON
echo Local changes are IMPOSSIBLE!
echo Everything deploys to online topos!
echo ====================================

cd /d "C:\Recursive Garden OS"

REM Start the PowerShell daemon in a new window
start "AUTO DEPLOY DAEMON" powershell.exe -ExecutionPolicy Bypass -File "AUTO_DEPLOY_DAEMON.ps1"

echo.
echo Auto-deploy daemon started in new window.
echo ANY file change will be automatically pushed online!
echo.
pause