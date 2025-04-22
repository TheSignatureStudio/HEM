<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

//로그인 체크
if(!auth.isLogin()) {
    m.jsAlert("로그인 후 이용가능합니다.");
    m.jsReplace("/main/login.jsp");
    return;
}

//게시물 정보 조회
BoardDao board = new BoardDao();
int id = m.ri("id");
if(id == 0) { m.jsError("잘못된 접근입니다."); return; }

String code = m.rs("code", "");

//게시물 조회
DataSet post = board.find("id = " + id);
if(!post.next()) { m.jsError("존재하지 않는 게시물입니다."); return; }

//본인 게시물 여부 확인
if(userId != post.getInt("user_id") && !auth.isAdmin()) {
    m.jsAlert("본인이 작성한 게시물만 수정할 수 있습니다.");
    m.jsReplace("board.jsp?code=" + code);
    return;
}

//폼 객체
f.addElement("title", post.s("title"), "required:'Y'");
f.addElement("content", post.s("content"), "required:'Y'");

//수정 처리
if(m.isPost() && f.validate()) {
    board.item("title", f.get("title"));
    board.item("content", f.get("content"));
    board.item("updated_at", m.time("yyyy-MM-dd HH:mm:ss"));
    
    //DB 수정
    if(!board.update("id = " + id)) {
        m.jsAlert("수정하는 중 오류가 발생했습니다.");
        return;
    }
    
    m.jsAlert("게시물이 수정되었습니다.");
    m.jsReplace("board.jsp?code=" + code);
    return;
}

//출력
p.setLayout(ch);
p.setBody("main.post_edit");
p.setVar("post", post);
p.setVar("code", code);
p.setVar("form_script", f.getScript());
p.display();

%> 