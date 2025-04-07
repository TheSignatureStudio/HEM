// 메인 슬라이더 초기화 (홈페이지 전용)
const initMainSlider = () => {
    if (document.querySelector('.main-slider')) {
        const mainSlider = new Swiper('.main-slider', {
            direction: 'horizontal',
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 40
                }
            }
        });
    }
};

// 스크롤 시 헤더 스타일 변경 (공통)
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = '#fff';
    }
});

// 모바일 메뉴 기능 (공통)
const initMobileMenu = () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
};

// 팝업 클래스 (공통)
class Popup {
    constructor(popupSelector) {
        this.popup = document.querySelector(popupSelector);
        if (!this.popup) {
            console.warn(`팝업을 찾을 수 없습니다: ${popupSelector}`);
            return;
        }

        this.closeBtn = this.popup.querySelector('.popup-close');
        if (!this.closeBtn) {
            console.warn('팝업 닫기 버튼을 찾을 수 없습니다.');
            return;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());

        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open() {
        this.popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.popup.style.display = 'none';
        document.body.style.overflow = '';
    }

    isOpen() {
        return this.popup.style.display === 'flex';
    }
}

// 페이지 초기화 (공통)
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 메뉴 초기화
    initMobileMenu();
    
    // 메인 슬라이더 초기화 (홈페이지에만 있는 경우)
    initMainSlider();
    
    // 후원 팝업 초기화
    const donationPopup = new Popup('.donation-popup');
    document.querySelectorAll('.donation-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            donationPopup.open();
        });
    });
});
