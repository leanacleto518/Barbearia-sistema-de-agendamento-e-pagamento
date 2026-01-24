# 🚀 Deploy no Render - Barbearia Brum Backend

## 📋 Passo a Passo para Deploy

### **1. Preparar Repositório**
```bash
# Criar repositório separado para o backend
git init barbearia-backend
cd barbearia-backend

# Copiar arquivos necessários
cp agendamento-online.php .
cp composer.json .
cp index.php .
cp README_RENDER.md .
```

### **2. Fazer Push para GitHub**
```bash
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/barbearia-backend.git
git push -u origin main
```

### **3. Configurar no Render**

1. **Acesse**: https://render.com
2. **Crie conta** (grátis)
3. **New Web Service**
4. **Connect GitHub** → Selecione o repositório `barbearia-backend`

### **4. Configurações do Render**

- **Name**: `barbearia-brum-backend`
- **Environment**: `PHP`
- **Build Command**: `composer install`
- **Start Command**: `php -S 0.0.0.0:$PORT`
- **Plan**: `Free` (750h/mês grátis)

### **5. Variáveis de Ambiente (opcional)**
```
DEBUG=false
TIMEZONE=America/Sao_Paulo
```

### **6. Deploy**
- Clique em **Create Web Service**
- Aguarde o deploy (5-10 minutos)
- URL será: `https://barbearia-brum-backend.onrender.com`

## 🔧 **Estrutura dos Arquivos**

```
barbearia-backend/
├── index.php                 # Arquivo principal
├── agendamento-online.php     # Processa agendamentos
├── composer.json             # Dependências PHP
├── README_RENDER.md          # Este arquivo
└── data/                     # Criado automaticamente
    ├── agendamentos.csv      # Planilha de agendamentos
    ├── rate_limit.json       # Controle de spam
    └── .htaccess            # Proteção do diretório
```

## 🌐 **Endpoints da API**

### **GET /**
Informações da API
```json
{
  "nome": "Barbearia Brum - Backend API",
  "status": "online",
  "endpoints": {...}
}
```

### **POST /agendamento-online.php**
Criar agendamento
```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "data": "2024-02-15",
  "horario": "14:00",
  "servico": "Corte + Barba",
  "observacoes": "Preferência por tesoura"
}
```

### **GET /health**
Health check
```json
{
  "status": "healthy",
  "timestamp": "2024-01-24T10:30:00Z"
}
```

## 🔒 **Recursos de Segurança**

- **CORS**: Configurado para GitHub Pages
- **Rate Limiting**: 1 agendamento por minuto por IP
- **Validação**: Todos os campos validados
- **Proteção**: Diretório de dados protegido
- **Limite**: Máximo 1000 agendamentos

## 📊 **Monitoramento**

- **Logs**: Disponíveis no dashboard do Render
- **Uptime**: Monitorado automaticamente
- **Health Check**: `/health` endpoint

## 🆓 **Plano Gratuito**

- **750 horas/mês**: Suficiente para site pequeno
- **Sleep após inatividade**: 15 minutos sem uso
- **Cold start**: ~30 segundos para "acordar"

## 🔄 **Atualizações**

Qualquer push para o repositório GitHub fará deploy automático no Render.

## 🎯 **Próximos Passos**

1. **Deploy no Render**
2. **Testar endpoints**
3. **Atualizar URL no frontend**
4. **Testar agendamentos**

---

## ✅ **Sistema Completo**

- **Frontend**: GitHub Pages (grátis)
- **Backend**: Render (grátis)
- **Dados**: CSV no servidor
- **Total**: R$ 0,00/mês