/**
 * ========================================
 * BARBEARIA BRUM - JAVASCRIPT PARA GITHUB PAGES
 * Versão simplificada sem sistema de agendamento
 * ========================================
 */

'use strict';

/**
 * Configurações globais da aplicação
 */
const CONFIG = {
  carousel: {
    autoplayInterval: 5000, // 5 segundos
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
    
    this.currentSlide = 0;
    this.isPlaying = true;
    this.autoplayTimer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    
    this.setupEventListeners();
    this.startAutoplay();
    this.updateAriaLabels();
    this.setupLazyLoading();
    
    console.log('🎠 Carrossel inicializado com sucesso');
  }

  setupEventListeners() {
    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Pausar/retomar autoplay no hover
    if (CONFIG.carousel.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
    }
    
    // Suporte a teclado
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

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }

  goToSlide(index) {
    if (index === this.currentSlide || index < 0 || index >= this.slides.length) return;
    
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide]?.classList.remove('active');
    this.indicators[this.currentSlide]?.setAttribute('aria-selected', 'false');
    
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide]?.classList.add('active');
    this.indicators[this.currentSlide]?.setAttribute('aria-selected', 'true');
    
    this.updateAriaLabels();
    
    if (this.isPlaying) {
      this.startAutoplay();
    }
  }

  startAutoplay() {
    this.clearAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, CONFIG.carousel.autoplayInterval);
  }

  pauseAutoplay() {
    this.isPlaying = false;
    this.clearAutoplay();
  }

  resumeAutoplay() {
    this.isPlaying = true;
    this.startAutoplay();
  }

  clearAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

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

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  updateAriaLabels() {
    this.container.setAttribute('aria-label', `Slide ${this.currentSlide + 1} de ${this.slides.length}`);
  }

  setupLazyLoading() {
    const images = this.container.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src;
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  destroy() {
    this.clearAutoplay();
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

  init() {
    if (!this.statusElement) return;
    
    this.updateStatus();
    this.startPeriodicUpdate();
    
    console.log('⏰ Gerenciador de horários inicializado');
  }

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
      statusText = 'FECHADO - DOMINGO';
      statusClass = 'fechado';
    } else {
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
    
    this.statusElement.textContent = statusText;
    this.statusElement.className = `status-atual ${statusClass}`;
    this.statusElement.setAttribute('aria-label', `Status atual: ${statusText}`);
  }

  getDayName(dayNumber) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayNumber];
  }

  formatTime(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  startPeriodicUpdate() {
    this.updateTimer = setInterval(() => {
      this.updateStatus();
    }, CONFIG.updateInterval);
  }

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
    this.contatoBtn = document.getElementById('btn-contato');
    this.init();
  }

  init() {
    this.setupAgendarButton();
    this.setupContatoButton();
    console.log('🔘 Gerenciador de botões inicializado');
  }

  setupAgendarButton() {
    if (!this.agendarBtn) return;
    
    this.agendarBtn.addEventListener('click', (e) => {
      this.handleAgendarClick(e);
    });
  }

  setupContatoButton() {
    if (!this.contatoBtn) return;
    
    this.contatoBtn.addEventListener('click', (e) => {
      this.handleContatoClick(e);
    });
  }

  handleAgendarClick(e) {
    e.preventDefault();
    
    // Rola para a seção de contato
    const agendamentoSection = document.getElementById('agendamento-section');
    if (agendamentoSection) {
      agendamentoSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  handleContatoClick(e) {
    e.preventDefault();
    
    // Abre WhatsApp
    const message = encodeURIComponent('Olá! Gostaria de agendar um horário na Barbearia Brum.');
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    console.log('🚀 Iniciando Barbearia Brum App (GitHub Version)...');
    
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
      
      console.log('✅ Aplicação GitHub inicializada com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
    }
  }

  setupGlobalEvents() {
    // Otimiza resize events
    const debouncedResize = this.debounce(() => {
      this.handleResize();
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // Melhora performance em scroll
    const throttledScroll = this.throttle(() => {
      this.handleScroll();
    }, 16);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile');
    } else {
      document.body.classList.remove('mobile');
    }
  }

  handleScroll() {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  debounce(func, wait) {
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

  throttle(func, limit) {
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

// Inicializa a aplicação
const barbeariaApp = new App();

// Limpa recursos quando a página é descarregada
window.addEventListener('beforeunload', () => {
  barbeariaApp.destroy();
});

// Debug (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.BarbeariaApp = barbeariaApp;
  console.log('🔧 Modo debug ativo. Use window.BarbeariaApp para acessar a aplicação.');
}