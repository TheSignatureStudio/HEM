<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

//권한 체크
if(!auth.isLogin()) {
    out.print("{\"can_edit\":false,\"can_delete\":false}");
    return;
}

//게시물 정보 조회
BoardDao board = new BoardDao();
int id = m.ri("id");
if(id == 0) {
    out.print("{\"can_edit\":false,\"can_delete\":false,\"error\":\"Invalid post ID\"}");
    return;
}

//게시물 조회
DataSet post = board.find("id = " + id);
if(!post.next()) {
    out.print("{\"can_edit\":false,\"can_delete\":false,\"error\":\"Post not found\"}");
    return;
}

//관리자이거나 자신의 게시물인 경우 true
boolean canEdit = auth.isAdmin() || post.getInt("user_id") == userId;
boolean canDelete = auth.isAdmin() || post.getInt("user_id") == userId;

out.print("{\"can_edit\":" + canEdit + ",\"can_delete\":" + canDelete + "}");

%> 