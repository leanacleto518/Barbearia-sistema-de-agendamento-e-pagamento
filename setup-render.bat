@echo off
echo ========================================
echo BARBEARIA BRUM - SETUP RENDER BACKEND
echo ========================================
echo.

echo 1. Criando diretorio backend...
mkdir barbearia-backend 2>nul
cd barbearia-backend

echo 2. Copiando arquivos necessarios...
copy ..\agendamento-online.php . >nul
copy ..\composer.json . >nul
copy ..\index.php . >nul
copy ..\README_RENDER.md . >nul

echo 3. Inicializando repositorio Git...
git init >nul 2>&1
git add . >nul 2>&1
git commit -m "Initial backend setup for Render" >nul 2>&1

echo.
echo ========================================
echo SETUP CONCLUIDO!
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Crie um repositorio no GitHub chamado 'barbearia-backend'
echo 2. Execute os comandos:
echo    git remote add origin https://github.com/SEU_USUARIO/barbearia-backend.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Va para https://render.com e crie um Web Service
echo 4. Conecte com o repositorio GitHub
echo 5. Use as configuracoes do README_RENDER.md
echo.
echo Arquivos criados em: barbearia-backend/
echo.
pause