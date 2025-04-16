// 현재 페이지에 따라 메뉴 활성화
document.addEventListener('DOMContentLoaded', function() {

    // 현재 경로를 기반으로 메뉴를 활성화하는 함수
    const activateMenus = () => {
        const currentPath = window.location.pathname; // 예: /sysop/post_list.jsp
        const menuItems = document.querySelectorAll('.menu-item');
        const submenuItems = document.querySelectorAll('.submenu-item');
        let parentMenuToOpen = null; // 열어야 할 부모 메뉴를 저장할 변수
        let exactMatchFound = false; // 정확히 일치하는 경로를 찾았는지 여부

        // 기존 활성 상태 초기화
        menuItems.forEach(item => item.classList.remove('active', 'submenu-open'));
        submenuItems.forEach(item => item.classList.remove('active'));

        // 1. 서브메뉴에서 정확히 일치하는 경로 확인
        submenuItems.forEach(item => {
            const href = item.getAttribute('href'); // 예: post_list.jsp 또는 boards/qt.jsp
            // 더 정확한 확인: 경로 끝부분 일치 또는 완전 일치
            if (currentPath.endsWith(href)) {
                item.classList.add('active');
                exactMatchFound = true;
                const submenuDiv = item.closest('.submenu');
                const parentMenu = submenuDiv ? submenuDiv.previousElementSibling : null;
                if (parentMenu && parentMenu.classList.contains('has-submenu')) {
                    parentMenu.classList.add('active');
                    parentMenuToOpen = parentMenu; // 이 부모 메뉴를 열도록 표시
                }
            }
        });

        // 2. 정확한 서브메뉴 경로가 없으면 메인 메뉴 확인
        if (!exactMatchFound) {
            menuItems.forEach(item => {
                const href = item.getAttribute('href'); // 예: dashboard.jsp 또는 boards.jsp
                 // 메인 메뉴 항목에 대해서도 정확히 일치하는지 확인
                if (currentPath.endsWith(href)) {
                    item.classList.add('active');
                    exactMatchFound = true;
                    // 이 메인 메뉴 항목이 서브메뉴를 가지고 있다면, 열도록 표시
                    if (item.classList.contains('has-submenu')) {
                         parentMenuToOpen = item;
                    }
                }
            });
        }

        // 3. 대체 경로: 여전히 정확한 경로가 없을 경우 (예: 최상위 경로), 대시보드를 활성화 시도
        if (!exactMatchFound) {
            menuItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === 'dashboard.jsp' && currentPath.includes('/sysop/')) { // 대시보드를 위한 기본 확인
                    item.classList.add('active');
                }
            });
        }

        // 4. 표시된 부모 메뉴의 서브메뉴를 열도록 클래스 추가
        //    실제 표시는 사이드바 상태에 따라 CSS가 처리함
        if (parentMenuToOpen) {
            parentMenuToOpen.classList.add('submenu-open');
        }
    };

    // DOM이 완전히 준비되도록 메뉴 활성화 함수 실행을 약간 지연
    setTimeout(activateMenus, 0);

    // --- 서브메뉴가 있는 메뉴 항목에 대한 클릭 리스너 추가 --- 
    const submenuParents = document.querySelectorAll('.menu-item.has-submenu');
    submenuParents.forEach(parent => {
        parent.addEventListener('click', function(event) {
            // 링크 이동을 허용하기 위해 preventDefault 제거
            // event.preventDefault(); 

            // 클릭된 항목의 .submenu-open 클래스 토글
            const wasOpen = this.classList.contains('submenu-open');

            // (선택 사항) 아코디언 효과: 다른 서브메뉴 닫기
            submenuParents.forEach(p => {
                if (p !== this) { // 현재 토글 중인 것은 닫지 않음
                    p.classList.remove('submenu-open');
                }
            });

            // 현재 항목 토글
            if (!wasOpen) {
                this.classList.add('submenu-open');
            } else {
                this.classList.remove('submenu-open');
            }
            // 이 리스너가 완료된 후 링크 이동이 진행됨
        });
    });

    // --- 사이드바 토글 로직 --- 
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const toggleBtnIcon = toggleBtn.querySelector('i');

    // 필수 요소 확인
    if (!sidebar || !mainContent || !toggleBtn || !toggleBtnIcon) {
        console.error("사이드바, 메인 컨텐츠, 토글 버튼 또는 버튼 아이콘을 찾을 수 없습니다.");
        return; // 필수 요소가 없으면 중단
    }

    // 토글 버튼 클릭 이벤트 리스너 추가
    toggleBtn.addEventListener('click', function() {
        // BODY 요소의 클래스 토글
        const isCollapsed = document.body.classList.toggle('sidebar-is-collapsed');

        // 새로운 상태에 따라 아이콘 클래스 토글
        if (isCollapsed) {
            toggleBtnIcon.classList.remove('fa-chevron-left');
            toggleBtnIcon.classList.add('fa-chevron-right');
        } else {
            toggleBtnIcon.classList.remove('fa-chevron-right');
            toggleBtnIcon.classList.add('fa-chevron-left');
        }

        // 로컬 스토리지에 상태 저장
        try {
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        } catch (e) {
            console.error('로컬 스토리지에 접근할 수 없습니다: ', e);
        }
    });

    // 페이지 로드 시 body 클래스에 따라 아이콘 상태 수동 설정
    // 인라인 스크립트에 의해 설정된 상태와 아이콘 일치 보장
    if (document.body.classList.contains('sidebar-is-collapsed')) {
        toggleBtnIcon.classList.remove('fa-chevron-left');
        toggleBtnIcon.classList.add('fa-chevron-right');
    } else {
        toggleBtnIcon.classList.remove('fa-chevron-right');
        toggleBtnIcon.classList.add('fa-chevron-left');
    }

    // --- Setting Page Tab Logic --- 
    const tabContainer = document.querySelector('.tab-container');
    if (tabContainer) { // 탭 컨테이너가 있는 페이지에서만 실행
        const urlParams = new URLSearchParams(window.location.search);
        let currentTab = urlParams.get('tab') || 'education'; // 기본 탭: 'education'

        const tabButtons = tabContainer.querySelectorAll('.tab-button'); // 컨테이너 내부에서 검색
        const formSections = document.querySelectorAll('.form-section'); // 폼 섹션은 전역 검색 가능

        function activateTab(tabName) {
            // 모든 탭과 섹션 비활성화
            tabButtons.forEach(button => button.classList.remove('active'));
            formSections.forEach(section => section.classList.remove('active'));

            // 목표 탭과 섹션 활성화
            const activeTabButton = tabContainer.querySelector(`.tab-button[data-tab="${tabName}"]`);
            const activeSection = document.getElementById(`${tabName}-section`);

            if (activeTabButton) {
                activeTabButton.classList.add('active');
            }
            if (activeSection) {
                activeSection.classList.add('active');
            } else {
                // 섹션을 찾지 못하면 기본 탭 활성화
                console.warn(`"${tabName}" 탭 섹션을 찾을 수 없습니다.`);
                const defaultTabButton = tabContainer.querySelector('.tab-button[data-tab="education"]');
                const defaultSection = document.getElementById('education-section');
                if (defaultTabButton) defaultTabButton.classList.add('active');
                if (defaultSection) defaultSection.classList.add('active');
                currentTab = 'education'; // currentTab 초기화
            }
        }

        // URL 파라미터에 따라 초기 탭 활성화
        activateTab(currentTab);
        // 탭 클릭은 링크 이동으로 페이지 리로드를 통해 처리됨
    }
});