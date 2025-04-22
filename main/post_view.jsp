<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

PostDao postDao = new PostDao();
UserDao user = new UserDao();

//게시물 정보 조회
int id = m.ri("id");

//게시물 조회
DataSet post = postDao.find("id = " + id + " AND status = 1");
if(!post.next()) { m.jsError("error"); return; }

//조회수 증가 - IP당 하루 한 번만 증가하도록 수정
String ip = request.getRemoteAddr();
String today = m.time("yyyyMMdd");
String viewKey = "board_view_" + id + "_" + ip + "_" + today;

//세션에 오늘 이 게시물을 봤는지 확인
if(session.getAttribute(viewKey) == null) {
    //조회 기록이 없으면 조회수 증가
    postDao.execute("UPDATE " + postDao.table + " SET view_count = view_count + 1 WHERE id = " + id);
    //세션에 조회 기록 저장
    session.setAttribute(viewKey, "viewed");
}

DataSet post2 = postDao.query("SELECT a.id, a.title, a.content, b.name, a.created_at, a.view_count FROM " + postDao.table + " a JOIN " + user.table + " b ON a.user_id = b.id WHERE a.id = " + id + " AND a.status != -1");

//날짜 포맷팅 - 간소화
if(post2.next()) {
    
    try {
        Date date = inputFormat.parse(post2.s("created_at"));
        post2.put("created_at_conv", outputFormat.format(date));
    } catch(Exception e) {
        // 변환 실패 시 기본 날짜 표시
        post2.put("created_at_conv", post2.s("created_at").substring(0, 10).replace("-", "."));
    }
    
    post2.first();
}

//출력
p.setLayout(ch);
p.setBody("main.post_view");
p.setVar("post", post2);
p.display();

%> 