# 🚀 Guia Completo de Deploy - Barbearia Brum

## ✅ Status Atual

- **Frontend**: ✅ Pronto no GitHub Pages
- **Backend**: ✅ Arquivos preparados para Render
- **Conexão**: ✅ Frontend configurado para Render URL

## 📁 Estrutura do Projeto

```
barbearia-brum/
├── Frontend (GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── interact.js (configurado para Render)
│   └── ...outros arquivos
│
└── barbearia-backend/ (Para Render)
    ├── index.php
    ├── agendamento-online.php
    ├── composer.json
    ├── README.md
    ├── .gitignore
    ├── deploy.sh (Linux/Mac)
    └── deploy.bat (Windows)
```

## 🎯 Próximos Passos

### **Passo 1: Criar Repositório Backend no GitHub**

1. **Acesse**: https://github.com/new
2. **Nome**: `barbearia-backend`
3. **Descrição**: `Backend PHP para Barbearia Brum`
4. **Público**: ✅ (necessário para Render gratuito)
5. **Clique**: "Create repository"

### **Passo 2: Fazer Upload dos Arquivos**

**Opção A - Via Terminal (Recomendado):**
```bash
cd barbearia-backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/barbearia-backend.git
git push -u origin main
```

**Opção B - Via Interface GitHub:**
1. Arraste os arquivos da pasta `barbearia-backend/` para o repositório
2. Commit com mensagem: "Initial backend setup"

### **Passo 3: Deploy no Render**

1. **Acesse**: https://render.com
2. **Crie conta gratuita**
3. **New** → **Web Service**
4. **Connect GitHub** → Selecione `barbearia-backend`

### **Passo 4: Configurações do Render**

```
Name: barbearia-brum-backend
Environment: PHP
Region: Oregon (US West)
Branch: main
Root Directory: (deixe vazio)
Build Command: composer install
Start Command: php -S 0.0.0.0:$PORT
```

### **Passo 5: Variáveis de Ambiente (Opcional)**
```
DEBUG=false
TIMEZONE=America/Sao_Paulo
```

### **Passo 6: Deploy**
- Clique **"Create Web Service"**
- Aguarde 5-10 minutos
- URL será: `https://barbearia-brum-backend.onrender.com`

## 🧪 Testando o Sistema

### **1. Testar Backend**
Acesse: `https://barbearia-brum-backend.onrender.com`

Deve retornar:
```json
{
  "nome": "Barbearia Brum - Backend API",
  "status": "online",
  "servidor": "Render.com"
}
```

### **2. Testar Health Check**
Acesse: `https://barbearia-brum-backend.onrender.com/health`

Deve retornar:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-24T..."
}
```

### **3. Testar Frontend**
1. Acesse seu site no GitHub Pages
2. Preencha o formulário de agendamento
3. Clique "Enviar Agendamento"
4. Deve aparecer mensagem de sucesso

## 🔧 Solução de Problemas

### **Backend não responde**
- Verifique se o deploy terminou no Render
- Aguarde alguns minutos (cold start)
- Verifique logs no dashboard do Render

### **Erro de CORS**
- Verifique se a URL do GitHub Pages está correta no backend
- Confirme que está usando HTTPS

### **Formulário não envia**
- Abra F12 → Console para ver erros
- Verifique se a URL do Render está correta no `interact.js`

## 💰 Custos

- **GitHub Pages**: Gratuito
- **Render**: Gratuito (750h/mês)
- **Total**: R$ 0,00/mês

## 📊 Monitoramento

- **Render Dashboard**: Logs e métricas
- **GitHub Pages**: Status na aba Actions
- **Uptime**: Render monitora automaticamente

## 🎉 Sistema Completo

Após o deploy:
- ✅ Site funcionando no GitHub Pages
- ✅ Backend rodando no Render
- ✅ Agendamentos salvos em CSV
- ✅ Sistema totalmente gratuito

---

## 🆘 Precisa de Ajuda?

1. **Verifique os logs** no dashboard do Render
2. **Teste os endpoints** individualmente
3. **Confirme as URLs** estão corretas
4. **Aguarde o cold start** (primeiros 30 segundos)

**Tudo pronto para funcionar! 🚀**