@echo off
REM One-command local database setup for the SecureEdge CRM (Windows).
REM
REM   scripts\setup-local-db.bat
REM
REM Requires PostgreSQL installed with psql on PATH
REM (https://www.postgresql.org/download/windows/).
REM Override defaults by setting DB_USER / DB_PASSWORD etc. before running.

setlocal
if "%DB_NAME%"=="" set DB_NAME=secureedge_crm
if "%DB_USER%"=="" set DB_USER=postgres
if "%DB_PASSWORD%"=="" set DB_PASSWORD=postgres
if "%DB_HOST%"=="" set DB_HOST=localhost
if "%DB_PORT%"=="" set DB_PORT=5432

cd /d "%~dp0.."

where psql >nul 2>nul
if errorlevel 1 (
  echo ERROR: psql not found. Install PostgreSQL and add its bin folder to PATH.
  exit /b 1
)

set PGPASSWORD=%DB_PASSWORD%

echo ==^> Creating database %DB_NAME% if it does not exist...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '%DB_NAME%'" | findstr 1 >nul
if errorlevel 1 (
  psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE \"%DB_NAME%\"" || exit /b 1
  echo     Created.
) else (
  echo     Database already exists - keeping it.
)

set DATABASE_URL=postgres://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%

if not exist .env (
  echo ==^> Writing .env...
  for /f %%s in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set AUTH_SECRET=%%s
  (
    echo DATABASE_URL=%DATABASE_URL%
    echo AUTH_SECRET=%AUTH_SECRET%
    echo APP_URL=http://localhost:3000
  ) > .env
) else (
  echo ==^> .env already exists - not touching it.
)

if not exist node_modules (
  echo ==^> Installing npm dependencies...
  call npm install || exit /b 1
)

echo ==^> Applying schema and migrations...
call npm run db:init || exit /b 1

echo ==^> Seeding mock logins...
call npm run db:seed-demo || exit /b 1

echo.
echo ============================================================
echo  Local database is ready. Start the app with:  npm run dev
echo  Then open http://localhost:3000
echo.
echo  CRM logins (/login):
echo    admin@secureedge.in  / Admin@123   (admin)
echo    priya@secureedge.in  / Sales@123   (sales)
echo    arjun@secureedge.in  / Sales@123   (sales)
echo.
echo  Client portal logins (/portal):
echo    client1@example.com  / Client@123  (Desai Industries - Maharashtra)
echo    client2@example.com  / Client@123  (Iyer Fintech - Karnataka)
echo.
echo  NOTE: mock credentials only - change them before production.
echo ============================================================
endlocal
