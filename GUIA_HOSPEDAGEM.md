# 🌐 Guia de Hospedagem PHP - Barbearia Brum

## 🎯 **Objetivo**
Hospedar o sistema de agendamento PHP gratuitamente para funcionar via GitHub Pages.

## 📋 **Arquivos Necessários**
- `agendamento-online.php` - Sistema de agendamento
- `index.html` - Site com formulário
- `interact.js` - JavaScript configurado
- `style.css` - Estilos

## 🚀 **Passo a Passo - InfinityFree (Recomendado)**

### **1. Criar Conta**
1. Acesse: https://infinityfree.net
2. Clique em "Create Account"
3. Preencha os dados e confirme email

### **2. Criar Site**
1. No painel, clique "Create Account"
2. Escolha um subdomínio (ex: `barbeariabrum.infinityfreeapp.com`)
3. Aguarde ativação (até 72h, geralmente 1h)

### **3. Configurar Banco de Dados**
1. No painel, vá em "MySQL Databases"
2. Clique "Create Database"
3. Anote os dados:
   - **Host**: `sql200.infinityfree.com` (exemplo)
   - **Database**: `if0_12345678_barbearia`
   - **Username**: `if0_12345678`
   - **Password**: (gerada automaticamente)

### **4. Editar Arquivo PHP**
Abra `agendamento-online.php` e altere:

```php
$config = [
    'host' => 'sql200.infinityfree.com', // Seu host MySQL
    'dbname' => 'if0_12345678_barbearia', // Seu database
    'username' => 'if0_12345678', // Seu username
    'password' => 'SUA_SENHA_AQUI', // Sua senha
    'timezone' => 'America/Sao_Paulo',
    'formato_data' => 'd/m/Y H:i:s'
];
```

### **5. Upload dos Arquivos**
1. No painel, vá em "File Manager"
2. Entre na pasta `htdocs`
3. Faça upload do arquivo `agendamento-online.php`

### **6. Configurar JavaScript**
Edite `interact.js` e altere:

```javascript
this.scriptURL = 'https://barbeariabrum.infinityfreeapp.com/agendamento-online.php';
```

### **7. Commit no GitHub**
```bash
git add .
git commit -m "Configura sistema para hospedagem online"
git push origin gh-pages
```

## 🔧 **Configuração Alternativa - 000webhost**

### **1. Criar Conta**
1. Acesse: https://000webhost.com
2. Clique "Sign Up Free"
3. Confirme email

### **2. Criar Site**
1. Clique "Create Website"
2. Escolha "Build Website"
3. Selecione subdomínio

### **3. Banco de Dados**
1. Vá em "Manage Website"
2. Clique "Database"
3. Crie banco MySQL
4. Anote credenciais

### **4. Upload**
1. Use File Manager
2. Upload para pasta `public_html`

## 📊 **Vantagens de Cada Hospedagem**

| Hospedagem | Espaço | Tráfego | PHP | MySQL | Ads |
|------------|--------|---------|-----|-------|-----|
| InfinityFree | 5GB | Ilimitado | ✅ | ✅ | Não |
| 000webhost | 1GB | 10GB/mês | ✅ | ✅ | Sim |
| AwardSpace | 1GB | 5GB/mês | ✅ | ✅ | Sim |

## 🎯 **Resultado Final**

Após configurar:
1. **GitHub Pages**: Site visual funcionando
2. **Hospedagem PHP**: Formulário salvando no banco
3. **Sistema completo**: Online e gratuito

## 🛠️ **Solução de Problemas**

### **Erro de Conexão**
- Verifique credenciais do banco
- Confirme se banco foi criado
- Teste conexão no painel da hospedagem

### **CORS Error**
- Adicione headers CORS no PHP
- Verifique se URL está correta no JS

### **Formulário não envia**
- Abra console do navegador (F12)
- Verifique erros JavaScript
- Confirme se URL do PHP está acessível

## 📞 **Próximos Passos**

1. **Escolher hospedagem** (recomendo InfinityFree)
2. **Configurar banco de dados**
3. **Fazer upload do PHP**
4. **Atualizar JavaScript**
5. **Testar sistema completo**

---

## 🎉 **Sistema Online Funcionando!**

Com isso você terá:
- ✅ Site no GitHub Pages
- ✅ Formulário funcionando
- ✅ Dados salvos em banco MySQL
- ✅ Sistema 100% online e gratuito