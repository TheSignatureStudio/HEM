document.addEventListener('DOMContentLoaded', function() {
    // 탭 기능
    const tabs = {
        tab1: {
            images: {
                main: 'image/ministry1.jpg',
                grid: ['image/ministry1.jpg', 'image/ministry1.jpg', 'image/ministry1.jpg']
            },
            content: {
                overview: '작은교회 교회학교를 건강한 신앙교육공동체로 형성하며 하나님의 나라를 확장해가는 사역입니다. 우리는 교회학교 순회사역, 캠프 사역, 선교지 교회학교 세움 사역을 통해 다음 세대를 위한 교육 사역을 실천하고 있습니다.',
                approach: '체계적인 교육 커리큘럼과 전문 교사 양성을 통해 건강한 교회학교를 세워갑니다. 각 교회의 특성과 필요에 맞춘 맞춤형 교육 프로그램을 개발하고, 지속가능한 교육 환경을 조성합니다.'
            }
        },
        tab2: {
            images: {
                main: 'image/ministry2.jpg',
                grid: ['image/ministry2.jpg', 'image/ministry2.jpg', 'image/ministry2.jpg']
            },
            content: {
                overview: '아이들의 꿈과 비전을 발견하고 성장시키는 특별한 교육 프로그램입니다. 개인별 맞춤 비전 발견과 창의적 교육 활동을 통해 아이들의 잠재력을 끌어내고 있습니다.',
                approach: '개인별 맞춤 비전 발견, 창의적 교육 활동, 진로 탐색 프로그램, 멘토링 시스템을 통해 아이들이 자신의 비전을 발견하고 성장할 수 있도록 돕고 있습니다.'
            }
        },
        tab3: {
            images: {
                main: 'image/ministry3.jpg',
                grid: ['image/ministry3.jpg', 'image/ministry3.jpg', 'image/ministry3.jpg']
            },
            content: {
                overview: '전국의 교육 기관들과 협력하여 더 넓은 교육의 장을 만들어가는 네트워크 사역입니다. 교회 간 협력 시스템을 구축하고 교육 자원을 공유하며 함께 성장하고 있습니다.',
                approach: '교회 간 협력 시스템, 교육 자원 공유, 공동 교육 프로그램, 지역별 교육 허브를 통해 효과적인 교육 네트워크를 구축하고 있습니다.'
            }
        }
    };

    function updateContent(tabId) {
        const data = tabs[tabId];
        if (!data) return;

        // 이미지 업데이트
        document.querySelector('.main-image img').src = data.images.main;
        const gridImages = document.querySelectorAll('.grid-item:not(.main-image) img');
        gridImages.forEach((img, index) => {
            img.src = data.images.grid[index];
        });

        // 텍스트 업데이트
        document.querySelector('.overview-section p').textContent = data.content.overview;
        document.querySelector('.approach-section p').textContent = data.content.approach;
    }

    // 탭 클릭 이벤트
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            // 활성 탭 표시
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            // 컨텐츠 업데이트
            updateContent(button.getAttribute('data-tab'));
        });
    });

    // 초기 탭 설정
    updateContent('tab1');
}); 