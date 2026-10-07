/**
 * 성도현 자기소개 웹페이지 인터랙션 스크립트
 * Dohyun Seong - Portfolio & Personal Website
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initStatsCounter();
  initTacticsBoard();
  initPenaltyGame();
  initScrollTop();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlEl = document.documentElement;

  // Retrieve saved theme or use system preference
  const savedTheme = localStorage.getItem('dohyun_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  htmlEl.setAttribute('data-theme', initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('dohyun_theme', newTheme);
  });
}

/* ==========================================================================
   2. Navbar Scroll, Active State & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active link
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. Animated Number Counter for Stats
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const duration = 1500; // ms
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    observer.observe(heroStats);
  }
}

/* ==========================================================================
   4. Interactive Football Tactics Board
   ========================================================================== */
function initTacticsBoard() {
  const markers = document.querySelectorAll('.pos-marker');
  const posTag = document.getElementById('pos-tag');
  const posTitle = document.getElementById('pos-title');
  const posDesc = document.getElementById('pos-desc');

  const positionData = {
    cm: {
      tag: "MF - 중앙 미드필더 (선호 1위)",
      title: "경기를 조율하는 미드필더 (Playmaker)",
      desc: "넓은 시야와 왕성한 활동량으로 공수를 잇는 핵심 가교 역할을 가장 즐깁니다. 상대의 압박을 이겨내고 빈 공간을 찌르는 킬패스로 동료의 득점을 돕는 순간이 가장 짜릿합니다."
    },
    lw: {
      tag: "FW - 레프트 윙어 (스피드 & 돌파)",
      title: "측면을 허무는 스피드 윙어 (Winger)",
      desc: "측면 공간에서 빠른 스피드와 드리블로 수비진의 균형을 무너뜨립니다. 날카로운 크로스와 중앙으로 접고 들어가는 과감한 슈팅 시도를 즐깁니다."
    },
    cf: {
      tag: "FW - 스트라이커 (피니셔)",
      title: "골 찬스를 놓치지 않는 공격수 (Finisher)",
      desc: "수비 뒷공간 침투와 침착한 퍼스트 터치로 언제든 골문을 위협합니다. 문전 앞에서의 집중력과 과감한 슈팅으로 결과를 만듭니다."
    },
    cb: {
      tag: "DF - 센터백 (빌드업 & 수비 커버)",
      title: "팀의 최후방을 든든히 지키는 수비수 (Center Back)",
      desc: "강인한 대인 수비와 끈기 있는 몸싸움으로 실점을 막아냅니다. 최후방에서 침착하게 볼을 전개하는 후방 빌드업에 높은 가치를 둡니다."
    }
  };

  markers.forEach(marker => {
    marker.addEventListener('click', () => {
      markers.forEach(m => m.classList.remove('active'));
      marker.classList.add('active');

      const posKey = marker.getAttribute('data-position');
      const data = positionData[posKey];

      if (data) {
        // Fade transition effect
        const card = document.getElementById('position-detail-card');
        card.style.opacity = '0';
        setTimeout(() => {
          posTag.textContent = data.tag;
          posTitle.textContent = data.title;
          posDesc.textContent = data.desc;
          card.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Penalty Kick Mini Game
   ========================================================================== */
function initPenaltyGame() {
  const ball = document.getElementById('interactive-ball');
  const keeper = document.getElementById('goalkeeper');
  const feedback = document.getElementById('game-feedback');
  const goalCountEl = document.getElementById('goal-count');
  const targetZones = document.querySelectorAll('.target-zone');

  let goalCount = 0;
  let isKicking = false;

  const keeperPositions = ['left', 'center', 'right'];

  targetZones.forEach(zone => {
    zone.addEventListener('click', (e) => {
      if (isKicking) return;
      isKicking = true;

      const target = zone.getAttribute('data-target');
      
      // Random keeper action
      const randomAction = keeperPositions[Math.floor(Math.random() * keeperPositions.length)];
      
      // Move Keeper
      if (randomAction === 'left') {
        keeper.style.transform = 'translateX(-120%) rotate(-25deg)';
      } else if (randomAction === 'right') {
        keeper.style.transform = 'translateX(20%) rotate(25deg)';
      } else {
        keeper.style.transform = 'translateX(-50%) scale(1.1)';
      }

      // Ball kick trajectory coordinates
      let ballX = 0;
      let ballY = -120; // up towards goal

      if (target === 'top-left') { ballX = -130; ballY = -160; }
      else if (target === 'top-right') { ballX = 130; ballY = -160; }
      else if (target === 'bottom-left') { ballX = -110; ballY = -100; }
      else if (target === 'bottom-right') { ballX = 110; ballY = -100; }

      // Animate Ball
      ball.style.transform = `translate(calc(-50% + ${ballX}px), ${ballY}px) scale(0.65) rotate(720deg)`;

      // Check Outcome
      setTimeout(() => {
        let isSaved = false;
        if ((randomAction === 'left' && target.includes('left')) ||
            (randomAction === 'right' && target.includes('right'))) {
          // 40% chance of keeper saving if in correct direction
          isSaved = Math.random() < 0.55;
        }

        if (!isSaved) {
          goalCount++;
          goalCountEl.textContent = goalCount;
          feedback.textContent = '🎉 골인 (GOAL)! 환상적인 코스입니다!';
          feedback.style.background = 'rgba(16, 185, 129, 0.9)';
        } else {
          feedback.textContent = '🧤 선방! 키퍼의 슈퍼세이브에 막혔습니다.';
          feedback.style.background = 'rgba(239, 68, 68, 0.9)';
        }

        // Reset after moment
        setTimeout(() => {
          ball.style.transform = 'translateX(-50%)';
          keeper.style.transform = 'translateX(-50%)';
          feedback.textContent = '다음 슛을 날려보세요!';
          feedback.style.background = 'rgba(0, 0, 0, 0.6)';
          isKicking = false;
        }, 1200);

      }, 450);
    });
  });
}

/* ==========================================================================
   6. Scroll to Top Floating Button
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
