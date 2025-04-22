<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

PostDao postDao = new PostDao();
UserDao user2 = new UserDao();

int id = m.ri("id");
DataSet post = postDao.query("SELECT a.id post_id, a.user_id user_id, a.title, a.content, a.view_count, a.status, a.category_id, a.created_at, b.id userId, b.name user_name FROM " + postDao.table + " a LEFT JOIN " + user2.table + " b ON a.user_id = b.id WHERE a.id = " + id);

if(!post.next()) {
    m.jsError("error");
    return;
} else {
    post.first();
    if(post.next()) {
        try {
            Date date = inputFormat.parse(post.s("created_at"));
            post.put("created_at_conv", outputFormat.format(date));
        } catch(Exception e) {
            // 변환 실패 시 기본 날짜 표시
            post.put("created_at_conv", post.s("created_at").substring(0, 10).replace("-", "."));
        }
    }
}

p.setLayout("sysop");
p.setBody("sysop.post_view");
p.setVar("post", post);
p.display();

%>