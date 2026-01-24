<?php
/**
 * ========================================
 * BARBEARIA BRUM - BACKEND PRINCIPAL
 * Arquivo principal para hospedagem
 * ========================================
 */

// Redirecionar todas as requisições para o arquivo correto
$request = $_SERVER['REQUEST_URI'];

// Remover query string
$path = parse_url($request, PHP_URL_PATH);

// Roteamento simples
switch ($path) {
    case '/':
    case '/index.php':
        // Página inicial - informações da API
        header('Content-Type: application/json');
        echo json_encode([
            'nome' => 'Barbearia Brum - Backend API',
            'versao' => '1.0.0',
            'status' => 'online',
            'endpoints' => [
                'POST /agendamento-online.php' => 'Criar novo agendamento',
                'GET /' => 'Informações da API'
            ],
            'timestamp' => date('c')
        ], JSON_UNESCAPED_UNICODE);
        break;
        
    case '/agendamento-online.php':
        // Incluir o arquivo de agendamento
        require_once 'agendamento-online.php';
        break;
        
    case '/health':
        // Health check para o Render
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'healthy',
            'timestamp' => date('c'),
            'php_version' => PHP_VERSION
        ]);
        break;
        
    default:
        // 404 - Não encontrado
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'erro' => 'Endpoint não encontrado',
            'path' => $path,
            'timestamp' => date('c')
        ], JSON_UNESCAPED_UNICODE);
        break;
}
?>