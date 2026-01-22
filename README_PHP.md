# 🚀 Sistema de Agendamento PHP - Barbearia Brum

## 📋 Configuração do Servidor PHP

### ✅ **Pré-requisitos**
- PHP instalado no computador
- Navegador web

### 🔧 **Como Executar**

#### **1. Abrir Terminal/Prompt**
- **Windows**: Abra o Prompt de Comando ou PowerShell
- **Mac/Linux**: Abra o Terminal

#### **2. Navegar até a pasta do projeto**
```bash
cd C:\Users\User\Desktop\siteparabarbearia
```

#### **3. Iniciar servidor PHP**
```bash
php -S localhost:8000
```

#### **4. Acessar o site**
Abra o navegador e acesse: **http://localhost:8000**

### 📊 **Como Funciona**

1. **Formulário de Agendamento**: Cliente preenche os dados
2. **Validação**: PHP valida todos os campos
3. **Salvamento**: Dados são salvos em `agendamentos.csv`
4. **Confirmação**: Cliente recebe confirmação de sucesso

### 📁 **Arquivos Criados**

- **`agendamento.php`**: Processa os agendamentos
- **`agendamentos.csv`**: Planilha com todos os agendamentos
- **`README_PHP.md`**: Este arquivo de instruções

### 📈 **Visualizar Agendamentos**

O arquivo `agendamentos.csv` pode ser aberto em:
- **Excel**: Duplo clique no arquivo
- **Google Sheets**: Upload do arquivo
- **LibreOffice Calc**: Abrir com o programa

### 🔍 **Estrutura da Planilha**

| Coluna | Descrição |
|--------|-----------|
| Data/Hora Agendamento | Quando foi feito o agendamento |
| Nome | Nome do cliente |
| Telefone | Telefone do cliente |
| Data Preferida | Data desejada para o corte |
| Horário | Horário desejado |
| Serviço | Tipo de serviço escolhido |
| Observações | Comentários do cliente |
| Status | Status do agendamento (Pendente) |
| Fonte | De onde veio o agendamento |

### 🛠️ **Solução de Problemas**

#### **Erro: "php não é reconhecido"**
- Adicione o PHP ao PATH do Windows
- Ou use o caminho completo: `C:\php\php.exe -S localhost:8000`

#### **Erro: "Permission denied"**
- Execute o terminal como Administrador
- Verifique se a pasta tem permissão de escrita

#### **Erro: "Port already in use"**
- Use outra porta: `php -S localhost:8001`
- Ou feche outros servidores rodando

### 🎯 **Vantagens do Sistema PHP**

✅ **Controle Total**: Dados ficam no seu computador
✅ **Sem Dependências**: Não depende de serviços externos
✅ **Rápido**: Processamento local instantâneo
✅ **Seguro**: Dados não saem do seu ambiente
✅ **Flexível**: Fácil de modificar e personalizar

### 📞 **Próximos Passos**

1. **Testar o sistema** com alguns agendamentos
2. **Verificar a planilha** `agendamentos.csv`
3. **Personalizar** conforme necessário
4. **Fazer backup** regular da planilha

---

## 🎉 **Sistema Pronto para Uso!**

Agora você tem um sistema de agendamento completo e independente rodando no seu próprio computador!