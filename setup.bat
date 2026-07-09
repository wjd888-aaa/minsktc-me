@echo off
chcp 65001 >nul
title MinskTC Platform Setup
echo ============================================
echo    MinskTC Platform - D1 + Pages Setup
echo ============================================
echo.

REM Step 1: Install dependencies
echo [1/6] Installing npm dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 ( echo FAILED & exit /b 1 )
echo OK
echo.

REM Step 2: Build frontend
echo [2/6] Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 ( echo FAILED & exit /b 1 )
echo OK
echo.

REM Step 3: Create D1 database
echo [3/6] Creating D1 database...
npx wrangler d1 create minsktc-db --json > d1-output.json 2>&1
if %ERRORLEVEL% NEQ 0 ( echo FAILED & exit /b 1 )
echo OK
echo.

REM Step 4: Extract database ID
echo [4/6] Extracting database ID...
for /f "tokens=*" %%i in ('type d1-output.json ^| npm.cmd -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log(j.uuid||j.result.uuid)}catch(e){console.error('Parse error',e.message)}})" 2^>nul') do set DB_ID=%%i
if "%DB_ID%"=="" (
  echo Warning: Could not extract DB ID. Check d1-output.json
) else (
  echo Database ID: %DB_ID%
)
echo.

REM Step 5: Apply schema
echo [5/6] Applying database schema...
npx wrangler d1 execute minsktc-db --file=schema.sql
if %ERRORLEVEL% NEQ 0 ( echo FAILED & exit /b 1 )
echo OK
echo.

REM Step 6: Deploy to Cloudflare Pages
echo [6/6] Deploying to Cloudflare Pages...
npx wrangler pages deploy dist --project-name=minsktc-me
if %ERRORLEVEL% NEQ 0 ( echo FAILED & exit /b 1 )
echo OK
echo.

echo ============================================
echo   Setup Complete!
echo   Your site should be live at:
echo   https://minsktc-me.pages.dev
echo   https://minsktc.me (after DNS propagation)
echo ============================================
echo.
pause
