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

// Board 페이지 게시글 팝업 기능
const initBoardPopup = () => {
    const boardTable = document.querySelector('.board-table'); // 게시판 테이블 존재 여부 확인
    if (!boardTable) return; // 게시판 페이지가 아니면 종료

    // 게시글 데이터 (원래 board.js 에 있던 데이터)
    const posts = {
        notice1: {
            title: '2024년 교회학교 교사 모집 안내',
            author: '관리자',
            date: '2024.03.25',
            views: 128,
            content: `
                <h2>교사 모집 안내</h2>
                <p>HEM은 건강한 교육 사역을 위한 교회학교 교사를 모집합니다.</p>
                <h3>모집 요강</h3>
                <ul>
                    <li>모집 분야: 영아부, 유치부, 초등부</li>
                    <li>자격 요건: 세례교인, 교사교육 이수자</li>
                    <li>근무 조건: 주 1회 교회학교 교육</li>
                    <li>지원 기간: 2024년 4월 1일 ~ 4월 30일</li>
                </ul>
                <p>자세한 내용은 첨부된 모집 공고를 참고해 주시기 바랍니다.</p>
            `
        },
        post5: {
            title: '3월 교사 교육 프로그램 후기',
            author: '김교사',
            date: '2024.03.24',
            views: 45,
            content: `
                <p>지난 3월 15일부터 17일까지 진행된 교사 교육 프로그램에 참여했습니다.</p>
                <p>이번 교육을 통해 다음과 같은 내용을 배웠습니다:</p>
                <ul>
                    <li>효과적인 성경 교육 방법</li>
                    <li>아이들과의 소통 기법</li>
                    <li>창의적인 교육 자료 제작</li>
                </ul>
                <p>특히 실습 시간에 다른 교사들과 함께 교육 자료를 만들어보는 시간이 매우 유익했습니다.</p>
            `
        },
        post4: {
            title: '우리 교회 비전트리 프로그램 이야기',
            author: '이목사',
            date: '2024.03.23',
            views: 67,
            content: `
                <p>우리 교회에서 진행 중인 비전트리 프로그램에 대해 소개드립니다.</p>
                <p>이 프로그램은 아이들의 꿈과 비전을 키우는 특별한 교육 과정입니다.</p>
                <h4>주요 활동</h4>
                <ul>
                    <li>개인별 비전 발견 워크샵</li>
                    <li>진로 탐색 캠프</li>
                    <li>멘토링 프로그램</li>
                </ul>
                <p>아이들의 변화와 성장이 눈에 띄게 나타나고 있습니다.</p>
            `
        },
        post3: {
            title: '2024 상반기 교육 세미나 개최 안내',
            author: '관리자',
            date: '2024.03.22',
            views: 89,
            content: `
                <p>2024년 상반기 교육 세미나가 개최됩니다.</p>
                <h4>세미나 정보</h4>
                <ul>
                    <li>일시: 2024년 4월 15일 (월) 14:00 ~ 17:00</li>
                    <li>장소: HEM 교육센터 3층 대강당</li>
                    <li>주제: "다음 세대를 위한 건강한 교육"</li>
                </ul>
                <p>많은 참여 부탁드립니다.</p>
            `
        },
        post2: {
            title: '작은교회 교회학교 이야기',
            author: '박전도사',
            date: '2024.03.21',
            views: 92,
            content: `
                <p>작은교회에서의 교회학교 운영 경험을 공유합니다.</p>
                <p>인원이 적은 교회에서도 효과적인 교육이 가능하다는 것을 보여드리고 싶습니다.</p>
                <h4>우리 교회의 특별한 점</h4>
                <ul>
                    <li>개인별 맞춤 교육</li>
                    <li>가족 중심의 교육</li>
                    <li>지역 연계 프로그램</li>
                </ul>
            `
        },
        post1: {
            title: 'HEM 교육 네트워크 1분기 모임 후기',
            author: '김간사',
            date: '2024.03.20',
            views: 103,
            content: `
                <p>HEM 교육 네트워크 1분기 모임이 성공적으로 마무리되었습니다.</p>
                <p>이번 모임에서는 다음과 같은 주제로 토론이 이루어졌습니다:</p>
                <ul>
                    <li>교회학교 교육의 새로운 방향</li>
                    <li>디지털 시대의 교육 방법</li>
                    <li>교사 양성 프로그램 개선</li>
                </ul>
                <p>다음 모임은 2분기에 진행될 예정입니다.</p>
            `
        }
    };

    const boardPopup = new Popup('#boardModalOverlay'); // ID 선택자 사용

    document.querySelectorAll('.title-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = e.target.getAttribute('data-post-id');
            const post = posts[postId]; // 여기서 posts 객체 참조

            if (post && boardPopup.popup) {
                const modalContent = boardPopup.popup.querySelector('.modal-content.modal-md');
                if (modalContent) {
                    modalContent.querySelector('.modal-title').textContent = post.title;
                    const meta = modalContent.querySelector('.modal-meta');
                    if (meta) {
                        meta.querySelector('.popup-author').textContent = `작성자: ${post.author}`;
                        meta.querySelector('.popup-date').textContent = `작성일: ${post.date}`;
                        meta.querySelector('.popup-views').textContent = `조회수: ${post.views}`;
                    }
                    modalContent.querySelector('.modal-body').innerHTML = post.content;
                    boardPopup.open();
                } else {
                    console.error("Board popup content (.modal-content.modal-md) not found.");
                }
            } else if (!boardPopup.popup) {
                console.error("Board popup overlay (#boardModalOverlay) not found or Popup class failed.");
            }
        });
    });
};

// 페이지 초기화 (공통)
document.addEventListener('DOMContentLoaded', function() {
    // 공통 기능 초기화
    initMobileMenu();
    initMainSlider(); // 홈페이지 슬라이더

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
