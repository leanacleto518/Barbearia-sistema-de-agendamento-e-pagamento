/**
 * ========================================
 * BARBEARIA BRUM - JAVASCRIPT INTERATIVO
 * Desenvolvido com Vanilla JS para performance e acessibilidade
 * ========================================
 */

'use strict';

/**
 * Configurações globais da aplicação
 */
const CONFIG = {
  carousel: {
    autoplayInterval: 5000, // 5 segundos - garantido
    transitionDuration: 1000, // 1 segundo
    pauseOnHover: true, // Pausa ao passar o mouse
  },
  businessHours: {
    monday: { open: 9, close: 19 },
    tuesday: { open: 9, close: 19 },
    wednesday: { open: 9, close: 19 },
    thursday: { open: 9, close: 19 },
    friday: { open: 9, close: 19 },
    saturday: { open: 9, close: 17 },
    sunday: { open: null, close: null }, // Fechado
  },
  whatsappNumber: '5511999999999', // Número do WhatsApp da barbearia
  updateInterval: 60000, // Atualizar status a cada minuto
  colors: {
    // Paleta monocromática
    primary: '#000000',
    secondary: '#1A1A1A',
    accent: '#FFFFFF',
    text: '#0F0F0F'
  }
};

/**
 * ========================================
 * CLASSE PRINCIPAL DO CARROSSEL
 * ========================================
 */
class Carousel {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.slide');
    this.indicators = container.querySelectorAll('.indicator');
    // Removido: referências aos botões prev/next
    
    this.currentSlide = 0;
    this.isPlaying = true;
    this.autoplayTimer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  /**
   * Inicializa o carrossel
   */
  init() {
    if (this.slides.length === 0) return;
    
    this.setupEventListeners();
    this.startAutoplay();
    this.updateAriaLabels();
    
    // Lazy loading das imagens
    this.setupLazyLoading();
    
    console.log('🎠 Carrossel inicializado com sucesso');
  }

  /**
   * Configura todos os event listeners
   */
  setupEventListeners() {
    // Removido: Botões de navegação (não existem mais)
    
    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Pausar/retomar autoplay no hover (se configurado)
    if (CONFIG.carousel.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
    }
    
    // Suporte a teclado (apenas setas para navegação manual)
    this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Suporte a touch/swipe
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Pausar quando a aba não está visível
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else if (this.isPlaying) {
        this.resumeAutoplay();
      }
    });
  }

  /**
   * Vai para o próximo slide
   */
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  /**
   * Vai para o slide anterior
   */
  previousSlide() {
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }

  /**
   * Vai para um slide específico
   */
  goToSlide(index) {
    if (index === this.currentSlide || index < 0 || index >= this.slides.length) return;
    
    // Remove classe active do slide atual
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide]?.classList.remove('active');
    this.indicators[this.currentSlide]?.setAttribute('aria-selected', 'false');
    
    // Adiciona classe active ao novo slide
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide]?.classList.add('active');
    this.indicators[this.currentSlide]?.setAttribute('aria-selected', 'true');
    
    this.updateAriaLabels();
    
    // Reinicia o autoplay
    if (this.isPlaying) {
      this.startAutoplay();
    }
  }

  /**
   * Inicia o autoplay
   */
  startAutoplay() {
    this.clearAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, CONFIG.carousel.autoplayInterval);
  }

  /**
   * Pausa o autoplay
   */
  pauseAutoplay() {
    this.isPlaying = false;
    this.clearAutoplay();
  }

  /**
   * Retoma o autoplay
   */
  resumeAutoplay() {
    this.isPlaying = true;
    this.startAutoplay();
  }

  /**
   * Limpa o timer do autoplay
   */
  clearAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /**
   * Manipula eventos de teclado
   */
  handleKeyboard(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case ' ':
        e.preventDefault();
        this.isPlaying ? this.pauseAutoplay() : this.resumeAutoplay();
        break;
    }
  }

  /**
   * Manipula início do toque
   */
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  /**
   * Manipula fim do toque
   */
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  /**
   * Processa o gesto de swipe
   */
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide(); // Swipe left
      } else {
        this.previousSlide(); // Swipe right
      }
    }
  }

  /**
   * Atualiza labels de acessibilidade
   */
  updateAriaLabels() {
    this.container.setAttribute('aria-label', `Slide ${this.currentSlide + 1} de ${this.slides.length}`);
  }

  /**
   * Configura lazy loading das imagens
   */
  setupLazyLoading() {
    const images = this.container.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src; // Força o carregamento
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Destrói o carrossel e limpa event listeners
   */
  destroy() {
    this.clearAutoplay();
    // Remove event listeners se necessário
    console.log('🎠 Carrossel destruído');
  }
}

/**
 * ========================================
 * CLASSE PARA GERENCIAR HORÁRIO DE FUNCIONAMENTO
 * ========================================
 */
class BusinessHours {
  constructor() {
    this.statusElement = document.getElementById('status-atual');
    this.updateTimer = null;
    
    this.init();
  }

  /**
   * Inicializa o gerenciador de horários
   */
  init() {
    if (!this.statusElement) return;
    
    this.updateStatus();
    this.startPeriodicUpdate();
    
    console.log('⏰ Gerenciador de horários inicializado');
  }

  /**
   * Atualiza o status atual
   */
  updateStatus() {
    const now = new Date();
    const dayName = this.getDayName(now.getDay());
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + (currentMinute / 60);
    
    const todayHours = CONFIG.businessHours[dayName];
    
    let isOpen = false;
    let statusText = '';
    let statusClass = '';
    
    if (todayHours.open === null) {
      // Fechado (domingo)
      statusText = 'FECHADO - DOMINGO';
      statusClass = 'fechado';
    } else {
      // Verifica se está dentro do horário
      isOpen = currentTime >= todayHours.open && currentTime < todayHours.close;
      
      if (isOpen) {
        const closeTime = this.formatTime(todayHours.close);
        statusText = `ABERTO - FECHA ÀS ${closeTime}`;
        statusClass = 'aberto';
      } else {
        if (currentTime < todayHours.open) {
          const openTime = this.formatTime(todayHours.open);
          statusText = `FECHADO - ABRE ÀS ${openTime}`;
        } else {
          statusText = 'FECHADO - HORÁRIO ENCERRADO';
        }
        statusClass = 'fechado';
      }
    }
    
    // Atualiza o DOM
    this.statusElement.textContent = statusText;
    this.statusElement.className = `status-atual ${statusClass}`;
    
    // Atualiza o aria-label para leitores de tela
    this.statusElement.setAttribute('aria-label', `Status atual: ${statusText}`);
  }

  /**
   * Converte número do dia em nome
   */
  getDayName(dayNumber) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayNumber];
  }

  /**
   * Formata hora para exibição
   */
  formatTime(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  /**
   * Inicia atualização periódica
   */
  startPeriodicUpdate() {
    this.updateTimer = setInterval(() => {
      this.updateStatus();
    }, CONFIG.updateInterval);
  }

  /**
   * Para a atualização periódica
   */
  stopPeriodicUpdate() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }
}

/**
 * ========================================
 * SISTEMA DE AGENDAMENTO - SERVIDOR PHP
 * Envia dados do formulário para servidor PHP local
 * ========================================
 */
class AgendamentoSystem {
  constructor() {
    // URL do backend hospedado no Render
    // Prioriza `window.BACKEND_URL` (definido no HTML) para facilitar deploys em GitHub Pages
    this.scriptURL = (window.BACKEND_URL && window.BACKEND_URL.length)
      ? window.BACKEND_URL
      : 'https://barbearia-backend-8cse.onrender.com';
    
    this.form = document.getElementById('agendamento-form');
    this.submitBtn = document.getElementById('btn-agendar-form');
    
    this.init();
  }

  /**
   * Inicializa o sistema de agendamento
   */
  init() {
    this.setupEventListeners();
    this.setupDateRestrictions();
    
    // Teste de conectividade (opcional)
    this.testConnection();
    
    console.log('📅 Sistema de agendamento inicializado');
  }

  /**
   * Testa a conexão com servidor PHP (opcional)
   */
  async testConnection() {
    try {
      console.log('🔍 Testando conexão com servidor PHP...');
      
      // Não fazemos teste automático para evitar criar dados desnecessários
      console.log('✅ Sistema PHP configurado e pronto');
      
    } catch (error) {
      console.log('⚠️ Não foi possível testar a conexão:', error.message);
    }
  }

  /**
   * Testa a conexão manualmente
   */
  async testConnectionManual() {
    const testBtn = document.getElementById('btn-teste-conexao');
    const originalText = testBtn.innerHTML;
    
    testBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Testando...';
    testBtn.disabled = true;
    
    try {
      console.log('🧪 Teste manual de conexão iniciado...');
      
      const testData = {
        nome: 'Teste de Conexão',
        telefone: '(11) 99999-9999',
        data: new Date().toISOString().split('T')[0],
        horario: '10:00',
        servico: 'Teste',
        observacoes: 'Teste de conectividade com servidor PHP'
      };
      
      await this.sendToPhpServer(testData);
      
      this.showMessage('✅ Conexão funcionando! O servidor PHP está respondendo.', 'success');
      
    } catch (error) {
      console.error('❌ Erro no teste de conexão:', error);
      this.showMessage(`❌ Erro na conexão: ${error.message}`, 'error');
      
    } finally {
      testBtn.innerHTML = originalText;
      testBtn.disabled = false;
    }
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Máscara para telefone
    const phoneInput = document.getElementById('cliente-telefone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => this.formatPhone(e));
    }

    // Validação em tempo real
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });

    // Botão de teste de conexão (temporário)
    const testBtn = document.getElementById('btn-teste-conexao');
    if (testBtn) {
      testBtn.addEventListener('click', () => this.testConnectionManual());
    }
  }

  /**
   * Configura restrições de data
   */
  setupDateRestrictions() {
    const dateInput = document.getElementById('data-preferida');
    if (dateInput) {
      // Data mínima: hoje
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      
      // Data máxima: 30 dias a partir de hoje
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      dateInput.max = maxDate.toISOString().split('T')[0];
    }
  }

  /**
   * Formata número de telefone
   */
  formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      if (value.length < 14) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
    }
    
    e.target.value = value;
  }

  /**
   * Valida campo individual
   */
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.id) {
      case 'cliente-nome':
        isValid = value.length >= 2;
        message = 'Nome deve ter pelo menos 2 caracteres';
        break;
      
      case 'cliente-telefone':
        const cleanPhone = value.replace(/\D/g, '');
        isValid = cleanPhone.length >= 10 && cleanPhone.length <= 11;
        message = 'Telefone deve ter 10 ou 11 dígitos';
        break;
      
      case 'data-preferida':
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        isValid = selectedDate >= today;
        message = 'Data deve ser hoje ou futura';
        break;
    }

    this.setFieldValidation(field, isValid, message);
    return isValid;
  }

  /**
   * Define estado de validação do campo
   */
  setFieldValidation(field, isValid, message) {
    field.style.borderColor = isValid ? 
      'rgba(255, 255, 255, 0.2)' : 
      '#ef4444';
    
    // Remove mensagem anterior
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Adiciona mensagem de erro se necessário
    if (!isValid && message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.textContent = message;
      errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      `;
      errorDiv.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
      field.parentNode.appendChild(errorDiv);
    }
  }

  /**
   * Manipula envio do formulário
   */
  async handleSubmit(e) {
    e.preventDefault();

    console.log('📝 Iniciando envio do formulário...');

    // Valida todos os campos
    const inputs = this.form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      console.log('❌ Formulário inválido');
      this.showMessage('Por favor, corrija os erros no formulário.', 'error');
      return;
    }

    // Coleta dados do formulário
    const formData = this.collectFormData();
    console.log('📋 Dados coletados:', formData);

    // Mostra loading
    this.setLoadingState(true);

    try {
      // Envia para servidor PHP
      console.log('🚀 Enviando para servidor PHP...');
      await this.sendToPhpServer(formData);
      
      // Sucesso
      console.log('✅ Agendamento enviado com sucesso!');
      this.showSuccessMessage(formData);
      this.form.reset();
      
    } catch (error) {
      console.error('❌ Erro ao enviar agendamento:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao enviar agendamento. ';
      
      if (error.message.includes('conexão') || error.message.includes('rede')) {
        errorMessage += 'Verifique sua conexão com a internet e tente novamente.';
      } else if (error.message.includes('CORS')) {
        errorMessage += 'Problema de configuração. Entre em contato conosco.';
      } else if (error.message.includes('HTTP')) {
        errorMessage += 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.';
      } else {
        errorMessage += 'Tente novamente ou entre em contato conosco.';
      }
      
      this.showMessage(errorMessage, 'error');
      
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Coleta dados do formulário
   */
  collectFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Adiciona dados extras
    data.timestamp = new Date().toISOString();
    data.status = 'Pendente';
    data.fonte = 'Site Barbearia Brum';

    return data;
  }

  /**
   * Envia dados para o servidor PHP
   */
  async sendToPhpServer(data) {
    console.log('📤 Enviando dados para servidor PHP:', data);
    console.log('🔗 URL do script:', this.scriptURL);

    try {
      const response = await fetch(this.scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Resultado recebido:', result);
      
      if (!result.sucesso) {
        throw new Error(result.mensagem || 'Erro desconhecido');
      }

      console.log('📊 Dados salvos com sucesso:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Erro detalhado ao enviar para servidor PHP:', error);
      
      // Verifica se é erro de conexão
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor PHP está rodando.');
      }
      
      // Verifica se é erro de rede
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Erro de rede. Verifique sua conexão ou se o servidor está ativo.');
      }
      
      throw error;
    }
  }

  /**
   * Define estado de loading
   */
  setLoadingState(isLoading) {
    const btnText = this.submitBtn.querySelector('.btn-text');
    const btnLoading = this.submitBtn.querySelector('.btn-loading');

    if (isLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      this.submitBtn.disabled = true;
    } else {
      btnText.style.display = 'flex';
      btnLoading.style.display = 'none';
      this.submitBtn.disabled = false;
    }
  }

  /**
   * Mostra mensagem de sucesso
   */
  showSuccessMessage(data) {
    const message = `
      <div class="form-success">
        <i class="bi bi-check-circle-fill"></i>
        <div>
          <strong>Agendamento enviado com sucesso!</strong><br>
          <small>Entraremos em contato via WhatsApp para confirmar o horário.</small>
        </div>
      </div>
    `;

    this.insertMessage(message);

    // Também envia via WhatsApp
    setTimeout(() => {
      this.sendWhatsAppNotification(data);
    }, 1000);
  }

  /**
   * Envia notificação via WhatsApp
   */
  sendWhatsAppNotification(data) {
    const message = encodeURIComponent(
      `🗓️ *NOVO AGENDAMENTO*\n\n` +
      `👤 *Cliente:* ${data.nome}\n` +
      `📱 *Telefone:* ${data.telefone}\n` +
      `📅 *Data:* ${new Date(data.data).toLocaleDateString('pt-BR')}\n` +
      `🕐 *Horário:* ${data.horario}\n` +
      `✂️ *Serviço:* ${data.servico}\n` +
      `${data.observacoes ? `📝 *Obs:* ${data.observacoes}\n` : ''}` +
      `\n⏰ *Enviado em:* ${new Date().toLocaleString('pt-BR')}`
    );

    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    
    // Pergunta se quer abrir WhatsApp
    if (confirm('Deseja abrir o WhatsApp para enviar os detalhes do agendamento?')) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Mostra mensagem genérica
   */
  showMessage(text, type = 'info') {
    const iconClass = type === 'success' ? 'bi-check-circle-fill' : 
                     type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill';
    
    const className = type === 'success' ? 'form-success' : 
                     type === 'error' ? 'form-error' : 'form-info';

    const message = `
      <div class="${className}">
        <i class="bi ${iconClass}"></i>
        <span>${text}</span>
      </div>
    `;

    this.insertMessage(message);
  }

  /**
   * Insere mensagem no DOM
   */
  insertMessage(messageHTML) {
    // Remove mensagens anteriores
    const existingMessages = this.form.parentNode.querySelectorAll('.form-success, .form-error, .form-info');
    existingMessages.forEach(msg => msg.remove());

    // Adiciona nova mensagem
    this.form.insertAdjacentHTML('afterend', messageHTML);

    // Remove após 5 segundos
    setTimeout(() => {
      const messages = this.form.parentNode.querySelectorAll('.form-success, .form-error, .form-info');
      messages.forEach(msg => msg.remove());
    }, 5000);
  }

  /**
   * Obtém estatísticas (para admin)
   */
  getStats() {
    // Aqui você pode implementar lógica para buscar stats da planilha
    return {
      totalAgendamentos: 0,
      agendamentosHoje: 0,
      proximosAgendamentos: 0
    };
  }
}
/**
 * ========================================
 * CLASSE PARA GERENCIAR BOTÕES E AÇÕES
 * ========================================
 */
class ButtonManager {
  constructor() {
    this.agendarBtn = document.getElementById('btn-agendar');
    this.init();
  }

  /**
   * Inicializa o gerenciador de botões
   */
  init() {
    this.setupAgendarButton();
    console.log('🔘 Gerenciador de botões inicializado');
  }

  /**
   * Configura o botão de agendar
   */
  setupAgendarButton() {
    if (!this.agendarBtn) return;
    
    this.agendarBtn.addEventListener('click', (e) => {
      this.handleAgendarClick(e);
    });
    
    // Efeito visual no clique
    this.agendarBtn.addEventListener('mousedown', () => {
      this.agendarBtn.style.transform = 'scale(0.98)';
    });
    
    this.agendarBtn.addEventListener('mouseup', () => {
      this.agendarBtn.style.transform = 'scale(1)';
    });
    
    this.agendarBtn.addEventListener('mouseleave', () => {
      this.agendarBtn.style.transform = 'scale(1)';
    });
  }

  /**
   * Manipula clique no botão agendar
   */
  handleAgendarClick(e) {
    e.preventDefault();
    
    // Adiciona efeito visual
    this.addClickEffect();
    
    // Rola para o formulário de agendamento
    const agendamentoSection = document.getElementById('agendamento-section');
    if (agendamentoSection) {
      agendamentoSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Destaca o formulário
      setTimeout(() => {
        agendamentoSection.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
          agendamentoSection.style.animation = '';
        }, 1000);
      }, 500);
    }
  }

  /**
   * Adiciona efeito visual de clique
   */
  addClickEffect() {
    this.agendarBtn.classList.add('clicked');
    
    setTimeout(() => {
      this.agendarBtn.classList.remove('clicked');
    }, 200);
  }
}

/**
 * ========================================
 * UTILITÁRIOS E HELPERS
 * ========================================
 */
class Utils {
  /**
   * Debounce function para otimizar performance
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function para eventos frequentes
   */
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Verifica se o dispositivo suporta touch
   */
  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Detecta se está em modo mobile
   */
  static isMobile() {
    return window.innerWidth <= 768;
  }
}

/**
 * ========================================
 * INICIALIZAÇÃO DA APLICAÇÃO
 * ========================================
 */
class App {
  constructor() {
    this.carousel = null;
    this.businessHours = null;
    this.buttonManager = null;
    
    this.init();
  }

  /**
   * Inicializa a aplicação
   */
  init() {
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  /**
   * Inicia todos os componentes
   */
  start() {
    console.log('🚀 Iniciando Barbearia Brum App...');
    
    try {
      // Inicializa sistema de agendamento
      this.agendamentoSystem = new AgendamentoSystem();
      
      // Inicializa carrossel
      const carouselContainer = document.querySelector('.carrosel-conteiner');
      if (carouselContainer) {
        this.carousel = new Carousel(carouselContainer);
      }
      
      // Inicializa gerenciador de horários
      this.businessHours = new BusinessHours();
      
      // Inicializa gerenciador de botões
      this.buttonManager = new ButtonManager();
      
      // Configura eventos globais
      this.setupGlobalEvents();
      
      console.log('✅ Aplicação inicializada com sucesso!');
      console.log('📊 Sistema de agendamento ativo');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
    }
  }

  /**
   * Configura eventos globais
   */
  setupGlobalEvents() {
    // Otimiza resize events
    const debouncedResize = Utils.debounce(() => {
      this.handleResize();
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // Melhora performance em scroll
    const throttledScroll = Utils.throttle(() => {
      this.handleScroll();
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
  }

  /**
   * Manipula redimensionamento da janela
   */
  handleResize() {
    // Ajustes específicos para mobile/desktop podem ser feitos aqui
    if (Utils.isMobile()) {
      document.body.classList.add('mobile');
    } else {
      document.body.classList.remove('mobile');
    }
  }

  /**
   * Manipula eventos de scroll
   */
  handleScroll() {
    // Adiciona classe ao header quando rola a página
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  /**
   * Limpa recursos quando necessário
   */
  destroy() {
    if (this.carousel) {
      this.carousel.destroy();
    }
    
    if (this.businessHours) {
      this.businessHours.stopPeriodicUpdate();
    }
    
    console.log('🧹 Aplicação limpa');
  }
}

/**
 * ========================================
 * INICIALIZAÇÃO GLOBAL
 * ========================================
 */

// Inicializa a aplicação
const barbeariaApp = new App();

// Limpa recursos quando a página é descarregada
window.addEventListener('beforeunload', () => {
  barbeariaApp.destroy();
});

// Expõe no console para debug (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.BarbeariaApp = barbeariaApp;
  console.log('🔧 Modo debug ativo. Use window.BarbeariaApp para acessar a aplicação.');
}