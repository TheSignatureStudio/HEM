<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

// DAO 객체 생성
PostDao postDao = new PostDao();

// 파라미터 받기 (수정할 게시물 ID)
int id = m.ri("id");
if (id == 0) {
    m.jsError("잘못된 접근입니다. 게시물 ID가 필요합니다.");
    return;
}

// 게시물 정보 조회 (수정할 내용 로드)
DataSet post = postDao.find("id = " + id + " AND status != -1"); // 삭제되지 않은 게시물만
if (!post.next()) {
    m.jsError("게시물을 찾을 수 없거나 삭제되었습니다.");
    return;
}

// 폼 객체 초기화 (수정)
f.addElement("title", post.s("title"), "required:'Y'"); // 기존 값으로 초기화
f.addElement("content", post.s("content"), "required:'Y'"); // 기존 값으로 초기화

// POST 요청 처리 (게시물 수정)
if (m.isPost() && f.validate()) {
    
    // 데이터 준비
    String title = f.get("title");
    String content = f.get("content");
    // updated_at은 DB에서 자동으로 업데이트되도록 설정되어 있어야 함

    postDao.item("title", title);
    postDao.item("content", content);
    postDao.item("updated_at", m.time("yyyyMMddHHmmss"));
    // 데이터베이스 업데이트
    if (!postDao.update("id = " + id)) {
        m.jsAlert("게시물을 수정하는 중 오류가 발생했습니다.");
        // 실패 시 현재 페이지에 머무르거나 다른 처리 가능
    } else {
        // 성공 시 게시물 보기 페이지로 이동
        m.jsAlert("게시물이 성공적으로 수정되었습니다.");
        m.jsReplace("post_view.jsp?id=" + id);
        return; // 리다이렉션 후 코드 실행 중지
    }
}

// GET 요청 또는 POST 실패 시 (폼 출력)
p.setLayout("sysop");
p.setBody("sysop.post_edit");
p.setVar("post", post); // 조회된 게시물 정보를 템플릿에 전달
p.setVar("form_script", f.getScript());
p.display();

%> 