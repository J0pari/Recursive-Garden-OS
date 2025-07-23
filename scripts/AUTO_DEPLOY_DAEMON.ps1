# AUTO DEPLOY DAEMON - Makes ANY file change automatically go online
# 
# This PowerShell script watches for ANY changes and auto-commits/pushes
# Even if the agent doesn't know about git!

Write-Host "🤖 AUTO DEPLOY DAEMON STARTING..." -ForegroundColor Green
Write-Host "📡 ANY file change will be AUTOMATICALLY deployed online!" -ForegroundColor Yellow
Write-Host "🚫 LOCAL CHANGES ARE IMPOSSIBLE - Everything goes to the topos!" -ForegroundColor Red

# Configuration
$watchPath = "C:\Recursive Garden OS"
$excludePaths = @(".git", "node_modules", ".claude")

# Create file watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Track changes to batch them
$global:pendingChanges = @{}
$global:lastCommit = Get-Date

# Function to check if path should be ignored
function Should-Ignore($path) {
    foreach ($exclude in $excludePaths) {
        if ($path -like "*$exclude*") {
            return $true
        }
    }
    return $false
}

# Function to auto-deploy changes
function Deploy-Changes {
    $now = Get-Date
    $timeSinceLastCommit = ($now - $global:lastCommit).TotalSeconds
    
    # Wait at least 5 seconds between commits to batch changes
    if ($timeSinceLastCommit -lt 5) {
        return
    }
    
    if ($global:pendingChanges.Count -eq 0) {
        return
    }
    
    Write-Host "`n🔄 AUTO-DEPLOYING CHANGES..." -ForegroundColor Cyan
    
    # CHECK CHARTER COMPLIANCE
    $charterToken = "/tmp/charter_guard_cast_$(Get-Date -Format 'yyyyMMdd')"
    if (-not (Test-Path $charterToken)) {
        Write-Host "❌ CHARTER VIOLATION! No CHARTER_GUARD cast today!" -ForegroundColor Red
        Write-Host "📖 Run: node CHARTER_GUARD.js" -ForegroundColor Yellow
        Write-Host "🚫 Auto-deploy BLOCKED until Charter compliance!" -ForegroundColor Red
        return
    }
    
    # Get list of changed files
    $changedFiles = $global:pendingChanges.Keys -join ", "
    $changeCount = $global:pendingChanges.Count
    
    # Clear pending changes
    $global:pendingChanges = @{}
    $global:lastCommit = $now
    
    # Auto-commit and push
    Set-Location $watchPath
    
    # Add all changes
    & git add -A 2>&1 | Out-Null
    
    # Create automatic commit message WITH MORPHISM
    $timestamp = $now.ToString("yyyy-MM-dd HH:mm:ss")
    $commitMsg = "AUTO-DEPLOY: $changeCount files changed at $timestamp`n`nChanged: $changedFiles`n`nCHARTER_GUARD: Auto-deploy verified`nMORPHISM: INTENT → CHARTER → BOOK → CODE`n`nDeployed by AUTO_DEPLOY_DAEMON - Local is hallucination!"
    
    # Commit
    & git commit -m $commitMsg 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Committed $changeCount changes" -ForegroundColor Green
        
        # Push immediately
        & git push origin main 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🌐 DEPLOYED TO ONLINE TOPOS!" -ForegroundColor Green
            Write-Host "📍 Changes are now REAL at: https://j0pari.github.io/Recursive-Garden-OS/" -ForegroundColor Blue
        } else {
            Write-Host "❌ Push failed - will retry on next change" -ForegroundColor Red
        }
    }
}

# Define change handler
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    $fileName = Split-Path $path -Leaf
    
    # Ignore certain paths
    if (Should-Ignore $path) {
        return
    }
    
    # Track the change
    $global:pendingChanges[$fileName] = $changeType
    
    Write-Host "📝 Detected: $changeType - $fileName" -ForegroundColor Yellow
    
    # Schedule deployment
    Deploy-Changes
}

# Register event handlers
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action

# Periodic deployment check (every 10 seconds)
$timer = New-Object System.Timers.Timer
$timer.Interval = 10000
$timer.AutoReset = $true
Register-ObjectEvent -InputObject $timer -EventName "Elapsed" -Action { Deploy-Changes }
$timer.Start()

Write-Host "`n👁️ WATCHING FOR CHANGES..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the daemon`n" -ForegroundColor Gray

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Cleanup
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    $timer.Stop()
    $timer.Dispose()
    Write-Host "`n🛑 AUTO DEPLOY DAEMON STOPPED" -ForegroundColor Red
}