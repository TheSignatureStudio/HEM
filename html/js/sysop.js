// 현재 페이지에 따라 메뉴 활성화
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    // 메인 메뉴 활성화
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.includes(href)) {
            item.classList.add('active');
            // 서브메뉴가 있는 경우 서브메뉴도 표시
            if (item.classList.contains('has-submenu')) {
                const submenu = item.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.style.display = 'block';
                }
            }
        }
    });
    
    // 서브메뉴 활성화
    submenuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.includes(href)) {
            item.classList.add('active');
            // 부모 메뉴도 활성화
            const parentMenu = item.closest('.menu-item');
            if (parentMenu) {
                parentMenu.classList.add('active');
                const submenu = parentMenu.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.style.display = 'block';
                }
            }
        }
    });
});