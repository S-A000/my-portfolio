Write-Host "=================================="
Write-Host " Starting Portfolio Project "
Write-Host "=================================="

# Start Backend in a new terminal window
Write-Host "Starting FastAPI Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; if (Test-Path venv\Scripts\activate.ps1) { .\venv\Scripts\activate.ps1 }; pip install -r requirements.txt; python main.py" -WorkingDirectory $PSScriptRoot

# Start Frontend in a new terminal window
Write-Host "Starting Vite Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm run dev" -WorkingDirectory $PSScriptRoot

Write-Host "Servers are starting up in separate windows!"
Write-Host "You can now use VS Code's 'Launch Vite Frontend' configuration."
