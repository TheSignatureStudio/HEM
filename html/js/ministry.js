document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const projectSection = document.getElementById('projectSection');
    const tabContents = document.querySelectorAll('.tab-content');

    // URL 해시가 있으면 해당 탭 활성화, 없으면 첫 번째 탭(교회학교 세움) 활성화
    function activateTabFromHash() {
        const hash = window.location.hash.substring(1); // '#' 제거
        if (hash) {
            const targetTab = document.querySelector(`[data-tab="${hash}"]`);
            if (targetTab) {
                activateTab(targetTab);
                // 해당 섹션으로 스크롤
                projectSection.scrollIntoView({ behavior: 'smooth' });
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
            // URL 해시 업데이트
            window.location.hash = tabId;
            activateTab(this);
        });
    });

    // 페이지 로드 시 URL 해시 확인
    activateTabFromHash();

    // 해시 변경 이벤트 리스너
    window.addEventListener('hashchange', activateTabFromHash);
}); 