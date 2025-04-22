<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

//로그인 체크
if(!auth.isLogin()) {
    out.print("unauthorized");
    return;
}

//게시물 정보 조회
BoardDao board = new BoardDao();
int id = m.ri("id");
if(id == 0) {
    out.print("invalid_id");
    return;
}

//게시물 조회
DataSet post = board.find("id = " + id);
if(!post.next()) {
    out.print("not_found");
    return;
}

//본인 게시물 여부 확인
if(userId != post.getInt("user_id") && !auth.isAdmin()) {
    out.print("unauthorized");
    return;
}

//게시물 삭제 (status = -1로 업데이트)
board.item("status", -1);
if(!board.update("id = " + id)) {
    out.print("error");
    return;
}

out.print("success");

%> 