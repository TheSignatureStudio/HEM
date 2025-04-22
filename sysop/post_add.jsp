<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

// DAO 객체 생성
PostDao postDao = new PostDao();
BoardDao boardDao = new BoardDao();

// 파라미터 받기
int id = m.ri("id");
if (id == 0) {
    // user_add.jsp 스타일 에러 처리 (jsError 후 return)
    m.jsError("잘못된 접근입니다. 게시판 ID가 필요합니다.");
    return;
}

DataSet board = boardDao.find("id = " + id);
if(!board.next()) { m.jsError("잘못된 접근입니다. 게시판 ID가 필요합니다."); return; }

// 폼 객체 초기화 (user_add.jsp 와 동일하게 f 객체 사용)
f.addElement("title", null, "required:'Y'");
f.addElement("content", null, "required:'Y'");

// POST 요청 처리 (게시물 등록)
if (m.isPost() && f.validate()) {
    
    // 데이터 설정 (user_add.jsp 처럼 item 메서드 사용)
    postDao.item("category_id", id);
    postDao.item("user_id", userId); // init.jsp에서 가져온 관리자 ID (user_add.jsp의 userDao.item 과 유사)
    postDao.item("title", f.get("title"));
    postDao.item("content", f.get("content"));
    postDao.item("status", 1); // 기본값: 활성(공개)
    postDao.item("view_count", 0); // 기본값: 0
    // created_at, updated_at는 DB 기본값 사용

    // 데이터베이스 삽입
    if (!postDao.insert()) {
        // user_add.jsp 스타일 에러 처리 (jsAlert 사용)
        m.jsAlert("게시물을 등록하는 중 오류가 발생했습니다.");
        return;
    }

    // 성공 시 목록 페이지로 이동 (user_add.jsp 는 m.redirect 사용, 여기서는 jsReplace 유지)
    m.jsAlert("게시물이 성공적으로 등록되었습니다.");
    m.jsReplace("post_list.jsp?id=" + id);
    return;
}

// GET 요청 처리 (폼 출력)
p.setLayout("sysop");
p.setBody("sysop.post_add");
p.setVar("board", board); // 템플릿에서 사용하기 위해 전달
p.setVar("form_script", f.getScript()); // user_add.jsp 와 동일
p.display();

%> 