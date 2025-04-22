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
            console.warn(`팝업/모달 오버레이를 찾을 수 없습니다: ${popupSelector}`);
            return;
        }

        const contentElement = this.popup.querySelector('.modal-content');
        if (contentElement) {
            this.closeBtn = contentElement.querySelector('.modal-close');
        } else {
            this.closeBtn = this.popup.querySelector('.modal-close');
        }
        
        if (!this.closeBtn) {
            console.warn('모달 닫기 버튼 (.modal-close)을 찾을 수 없습니다.');
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

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
        if (!this.popup) return;
        this.popup.style.display = 'flex';
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.popup) return;
        this.popup.style.display = 'none';
        this.popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    isOpen() {
        if (!this.popup) return false;
        return this.popup.style.display === 'flex';
    }
}

// Ministry 페이지 탭 기능
const initMinistryTabs = () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const projectSection = document.getElementById('projectSection');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabButtons.length || !projectSection || !tabContents.length) {
        // Ministry 탭 관련 요소가 없으면 함수 종료
        return;
    }

    // URL 해시가 있으면 해당 탭 활성화, 없으면 첫 번째 탭(교회학교 세움) 활성화
    function activateTabFromHash() {
        const hash = window.location.hash.substring(1); // '#' 제거
        if (hash) {
            const targetTab = document.querySelector(`[data-tab="${hash}"]`);
            if (targetTab) {
                activateTab(targetTab);
                // 해당 섹션으로 스크롤
                // projectSection.scrollIntoView({ behavior: 'smooth' }); // 부드러운 스크롤 (선택 사항)
            }
        } else {
            // 해시가 없으면 첫 번째 탭(교회학교 세움) 활성화
            const firstTab = document.querySelector('.tab-button');
            if (firstTab) {
                activateTab(firstTab);
            }
        }
    }

    // 탭 활성화 함수
    function activateTab(tab) {
        // 모든 탭에서 active 클래스 제거
        tabButtons.forEach(button => button.classList.remove('active'));
        // 클릭된 탭에 active 클래스 추가
        tab.classList.add('active');

        // 모든 탭 컨텐츠 숨기기
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // 선택된 탭의 컨텐츠만 보이기
        const tabId = tab.getAttribute('data-tab');
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            selectedContent.classList.add('active');
        }
    }

    // 탭 클릭 이벤트 처리
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            // URL 해시 업데이트 (페이지 이동 방지)
            history.pushState(null, null, `#${tabId}`);
            activateTab(this);
            // 클릭 시 부드럽게 스크롤 (선택 사항)
            // projectSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 페이지 로드 시 URL 해시 확인
    activateTabFromHash();

    // 뒤로/앞으로 가기 시 해시 변경 감지
    window.addEventListener('popstate', activateTabFromHash);
};

// 네비게이션 활성화 기능
const initActiveNav = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav a');
    let activeLinkFound = false; // 활성 링크를 찾았는지 여부 플래그

    console.log("Current Path:", currentPath);

    // 먼저 현재 경로와 일치하는 링크를 찾아 활성화
    navLinks.forEach(link => {
        const linkUrl = new URL(link.href);
        const linkPath = linkUrl.pathname;

        // 확장자를 제외하고 비교 (예: /main/about 과 /main/about.jsp 비교)
        const currentPathBase = currentPath.substring(0, currentPath.lastIndexOf('.') > 0 ? currentPath.lastIndexOf('.') : currentPath.length);
        const linkPathBase = linkPath.substring(0, linkPath.lastIndexOf('.') > 0 ? linkPath.lastIndexOf('.') : linkPath.length);

        // 콘솔 로그 추가 (확장자 제거된 경로 확인)
        console.log("Checking Link:", link.href, "Base Path:", linkPathBase, "Current Base:", currentPathBase);

        // 확장자를 제외한 경로가 일치하거나, 루트 경로 처리
        if (linkPathBase === currentPathBase || (currentPath === '/' && linkPath.endsWith('/index'))) { // index 는 확장자 없이 비교
            console.log("Match found! Activating:", link.href);
            link.classList.add('active');
            activeLinkFound = true;
        } else {
            link.classList.remove('active'); // 일치하지 않으면 확실히 제거
        }
    });

    // 만약 확장자 제외 비교로도 못 찾았고, 현재 경로가 / 라면 index.jsp 강제 활성화
    if (!activeLinkFound && currentPath === '/') {
         navLinks.forEach(link => {
             if (new URL(link.href).pathname.endsWith('/index.jsp')) {
                 console.log("Fallback: Activating index.jsp for root path");
                 link.classList.add('active');
             }
         });
    }
};

// 페이지 초기화 (공통)
document.addEventListener('DOMContentLoaded', function() {
    // 공통 기능 초기화
    initMobileMenu();
    initMainSlider(); // 홈페이지 슬라이더
    initActiveNav(); // 네비게이션 활성화 기능 호출

    // Ministry 페이지 탭 기능 초기화
    initMinistryTabs();

    // Board 페이지 팝업 기능 초기화
    initBoardPopup();

    // 후원 팝업 초기화 (공통)
    const donationPopup = new Popup('#donationModalOverlay'); // ID 선택자 사용
    document.querySelectorAll('.donation-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (donationPopup.popup) { // donationPopup 객체가 유효한지 확인
                donationPopup.open();
            } else {
                console.error("Donation popup (#donationModalOverlay) not found or Popup class failed.");
            }
        });
    });
});
