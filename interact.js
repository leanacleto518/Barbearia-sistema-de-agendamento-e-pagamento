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
    
    // Abre WhatsApp ou rola para seção de contato
    this.openWhatsApp();
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

  /**
   * Abre WhatsApp com mensagem pré-definida
   */
  openWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de agendar um horário na Barbearia Brum.');
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    
    // Abre em nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Fallback: rolar para seção de contato se existir
    const contatoSection = document.querySelector('#contato, .contato, [data-section="contato"]');
    if (contatoSection) {
      setTimeout(() => {
        this.smoothScrollTo(contatoSection);
      }, 500);
    }
  }

  /**
   * Scroll suave para elemento
   */
  smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
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