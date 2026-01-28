@echo off
echo 🚀 Iniciando deploy do backend da Barbearia Brum...

REM Verificar se estamos na pasta correta
if not exist "composer.json" (
    echo ❌ Erro: Execute este script na pasta barbearia-backend/
    pause
    exit /b 1
)

REM Verificar se Git está inicializado
if not exist ".git" (
    echo 📦 Inicializando repositório Git...
    git init
    git branch -M main
)

REM Adicionar arquivos
echo 📁 Adicionando arquivos...
git add .

REM Commit
echo 💾 Fazendo commit...
git commit -m "Backend setup for Render deployment - %date% %time%"

REM Verificar se remote existe
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Configure o remote do GitHub:
    echo git remote add origin https://github.com/SEU_USUARIO/barbearia-backend.git
    echo.
    echo Depois execute:
    echo git push -u origin main
) else (
    echo 📤 Fazendo push...
    git push -u origin main
)

echo.
echo ✅ Arquivos preparados para deploy!
echo.
echo 📋 Próximos passos:
echo 1. Acesse: https://render.com
echo 2. Conecte seu repositório GitHub
echo 3. Configure como Web Service PHP
echo 4. Use as configurações do README.md
echo.
echo 🌐 URL final será: https://barbearia-brum-backend.onrender.com

pause