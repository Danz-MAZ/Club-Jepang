@echo off
echo Installing Japanese Club Manager...
echo.

echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Setting up database...
call npx prisma db push

echo.
echo Setup complete! 
echo.
echo To start the development server, run:
echo npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
