// 게시글 데이터
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

document.addEventListener('DOMContentLoaded', function() {
    const boardPopup = new Popup('.popup-overlay');
    
    // 게시글 클릭 이벤트
    document.querySelectorAll('.title-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = e.target.getAttribute('data-post-id');
            const post = posts[postId];
            
            if (post) {
                const popupContent = boardPopup.popup;
                popupContent.querySelector('.popup-title').textContent = post.title;
                popupContent.querySelector('.popup-author').textContent = `작성자: ${post.author}`;
                popupContent.querySelector('.popup-date').textContent = `작성일: ${post.date}`;
                popupContent.querySelector('.popup-views').textContent = `조회수: ${post.views}`;
                popupContent.querySelector('.popup-body').innerHTML = post.content;
                
                boardPopup.open();
            }
        });
    });
}); 