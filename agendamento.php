<?php
/**
 * ========================================
 * BARBEARIA BRUM - SISTEMA DE AGENDAMENTO PHP
 * Processa agendamentos e salva em planilha CSV
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

// Configurações do sistema
$config = [
    'arquivo_csv' => 'agendamentos.csv',
    'timezone' => 'America/Sao_Paulo',
    'formato_data' => 'd/m/Y H:i:s'
];

// Define timezone
date_default_timezone_set($config['timezone']);

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
 * Função para salvar agendamento no CSV
 */
function salvarAgendamento($dados, $arquivo) {
    // Preparar dados para CSV
    $linha = [
        date('d/m/Y H:i:s'), // Data/hora do agendamento
        trim($dados['nome']),
        trim($dados['telefone']),
        date('d/m/Y', strtotime($dados['data'])),
        $dados['horario'],
        $dados['servico'],
        trim($dados['observacoes'] ?? ''),
        'Pendente', // Status
        'Site Barbearia Brum' // Fonte
    ];
    
    // Verificar se arquivo existe, se não, criar com cabeçalho
    if (!file_exists($arquivo)) {
        $cabecalho = [
            'Data/Hora Agendamento',
            'Nome',
            'Telefone',
            'Data Preferida',
            'Horário',
            'Serviço',
            'Observações',
            'Status',
            'Fonte'
        ];
        
        $fp = fopen($arquivo, 'w');
        if ($fp) {
            // Adicionar BOM para UTF-8 (para Excel abrir corretamente)
            fwrite($fp, "\xEF\xBB\xBF");
            fputcsv($fp, $cabecalho, ';');
            fclose($fp);
        }
    }
    
    // Adicionar nova linha
    $fp = fopen($arquivo, 'a');
    if ($fp) {
        fputcsv($fp, $linha, ';');
        fclose($fp);
        return true;
    }
    
    return false;
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
    if (salvarAgendamento($dados, $config['arquivo_csv'])) {
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