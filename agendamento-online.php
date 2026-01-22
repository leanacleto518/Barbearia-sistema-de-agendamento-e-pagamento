<?php
/**
 * ========================================
 * BARBEARIA BRUM - SISTEMA DE AGENDAMENTO ONLINE
 * Versão para hospedagem gratuita com MySQL
 * ========================================
 */

// Configurações
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responde a requisições OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configurações do banco de dados
$config = [
    'host' => 'localhost',
    'dbname' => 'barbearia_db', // Altere conforme sua hospedagem
    'username' => 'seu_usuario', // Altere conforme sua hospedagem
    'password' => 'sua_senha',   // Altere conforme sua hospedagem
    'timezone' => 'America/Sao_Paulo',
    'formato_data' => 'd/m/Y H:i:s'
];

// Define timezone
date_default_timezone_set($config['timezone']);

/**
 * Conecta ao banco de dados
 */
function conectarBanco($config) {
    try {
        $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4";
        $pdo = new PDO($dsn, $config['username'], $config['password']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log('Erro de conexão: ' . $e->getMessage());
        return null;
    }
}

/**
 * Cria tabela se não existir
 */
function criarTabela($pdo) {
    $sql = "CREATE TABLE IF NOT EXISTS agendamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        data_preferida DATE NOT NULL,
        horario TIME NOT NULL,
        servico VARCHAR(255) NOT NULL,
        observacoes TEXT,
        status VARCHAR(50) DEFAULT 'Pendente',
        fonte VARCHAR(100) DEFAULT 'Site',
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    try {
        $pdo->exec($sql);
        return true;
    } catch (PDOException $e) {
        error_log('Erro ao criar tabela: ' . $e->getMessage());
        return false;
    }
}

/**
 * Função para validar dados do agendamento
 */
function validarDados($dados) {
    $erros = [];
    
    // Validar nome
    if (empty($dados['nome']) || strlen(trim($dados['nome'])) < 2) {
        $erros[] = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    // Validar telefone
    $telefone = preg_replace('/\D/', '', $dados['telefone']);
    if (strlen($telefone) < 10 || strlen($telefone) > 11) {
        $erros[] = 'Telefone deve ter 10 ou 11 dígitos';
    }
    
    // Validar data
    if (empty($dados['data']) || !strtotime($dados['data'])) {
        $erros[] = 'Data inválida';
    } else {
        $dataAgendamento = strtotime($dados['data']);
        $hoje = strtotime('today');
        if ($dataAgendamento < $hoje) {
            $erros[] = 'Data deve ser hoje ou futura';
        }
    }
    
    // Validar horário
    if (empty($dados['horario'])) {
        $erros[] = 'Horário é obrigatório';
    }
    
    // Validar serviço
    if (empty($dados['servico'])) {
        $erros[] = 'Tipo de serviço é obrigatório';
    }
    
    return $erros;
}

/**
 * Função para salvar agendamento no banco
 */
function salvarAgendamento($dados, $pdo) {
    $sql = "INSERT INTO agendamentos (nome, telefone, data_preferida, horario, servico, observacoes, status, fonte) 
            VALUES (:nome, :telefone, :data_preferida, :horario, :servico, :observacoes, :status, :fonte)";
    
    try {
        $stmt = $pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':nome' => trim($dados['nome']),
            ':telefone' => trim($dados['telefone']),
            ':data_preferida' => $dados['data'],
            ':horario' => $dados['horario'],
            ':servico' => $dados['servico'],
            ':observacoes' => trim($dados['observacoes'] ?? ''),
            ':status' => 'Pendente',
            ':fonte' => 'Site Barbearia Brum'
        ]);
        
        return $resultado;
    } catch (PDOException $e) {
        error_log('Erro ao salvar agendamento: ' . $e->getMessage());
        return false;
    }
}

/**
 * Função para enviar resposta JSON
 */
function enviarResposta($sucesso, $mensagem, $dados = null) {
    $resposta = [
        'sucesso' => $sucesso,
        'mensagem' => $mensagem,
        'timestamp' => date('c')
    ];
    
    if ($dados) {
        $resposta['dados'] = $dados;
    }
    
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit();
}

// Processar apenas requisições POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    enviarResposta(false, 'Método não permitido. Use POST.');
}

try {
    // Conectar ao banco
    $pdo = conectarBanco($config);
    if (!$pdo) {
        http_response_code(500);
        enviarResposta(false, 'Erro de conexão com banco de dados.');
    }
    
    // Criar tabela se necessário
    criarTabela($pdo);
    
    // Obter dados JSON
    $input = file_get_contents('php://input');
    $dados = json_decode($input, true);
    
    // Verificar se dados foram recebidos
    if (!$dados) {
        http_response_code(400);
        enviarResposta(false, 'Dados inválidos ou não recebidos.');
    }
    
    // Log para debug
    error_log('Agendamento recebido: ' . print_r($dados, true));
    
    // Validar dados
    $erros = validarDados($dados);
    if (!empty($erros)) {
        http_response_code(400);
        enviarResposta(false, 'Dados inválidos: ' . implode(', ', $erros));
    }
    
    // Salvar agendamento
    if (salvarAgendamento($dados, $pdo)) {
        // Sucesso
        enviarResposta(true, 'Agendamento salvo com sucesso!', [
            'nome' => $dados['nome'],
            'data' => date('d/m/Y', strtotime($dados['data'])),
            'horario' => $dados['horario']
        ]);
    } else {
        // Erro ao salvar
        http_response_code(500);
        enviarResposta(false, 'Erro interno: não foi possível salvar o agendamento.');
    }
    
} catch (Exception $e) {
    // Erro geral
    error_log('Erro no agendamento: ' . $e->getMessage());
    http_response_code(500);
    enviarResposta(false, 'Erro interno do servidor.');
}
?>