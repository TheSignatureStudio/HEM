<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

//로그인 체크
if(!auth.isLogin()) {
    m.jsAlert("로그인 후 이용가능합니다.");
    m.jsReplace("/main/login.jsp");
    return;
}

//게시판 정보
BoardDao board = new BoardDao();
String code = m.rs("code", "");

//폼 객체
f.addElement("title", null, "required:'Y'");
f.addElement("content", null, "required:'Y'");

//등록 처리
if(m.isPost() && f.validate()) {
    int board_id = 1; // 기본 게시판 ID (게시판 목록이 있는 경우 변경 필요)
    
    board.item("board_id", board_id);
    board.item("user_id", userId); // 현재 로그인한 사용자 ID
    board.item("title", f.get("title"));
    board.item("content", f.get("content"));
    board.item("status", 1); // 기본 공개 상태
    board.item("view_count", 0);
    board.item("created_at", m.time("yyyy-MM-dd HH:mm:ss"));
    
    //DB 등록
    if(!board.insert()) {
        m.jsAlert("등록하는 중 오류가 발생했습니다.");
        return;
    }
    
    m.jsAlert("게시물이 등록되었습니다.");
    m.jsReplace("board.jsp?code=" + code);
    return;
}

//출력
p.setLayout(ch);
p.setBody("main.post_add");
p.setVar("code", code);
p.setVar("form_script", f.getScript());
p.display();

%> 