<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

PostCategoryDao postCategory = new PostCategoryDao();
PostDao post = new PostDao();
UserDao user = new UserDao();
//기본 변수
int categoryId = m.ri("cid");
String keyword = m.rs("keyword"); //검색어

//목록
ListManager lm = new ListManager();
//lm.setDebug(out);
lm.setRequest(request);
lm.setTable(post.table + "  a JOIN " + user.table + " b JOIN " + postCategory.table + " c ON a.user_id = b.id AND a.category_id = c.id");
lm.setFields("a.id, a.category_id, a.title, b.name, a.created_at, a.view_count, c.name as category_name");
lm.addWhere("a.status = 1");
lm.setOrderBy("a.id DESC");

//포맷팅
DataSet list = lm.getDataSet();
while(list.next()) {
    try {
        Date date = inputFormat.parse(list.s("created_at"));
        list.put("created_at_conv", outputFormat.format(date));
    } catch(Exception e) {
        // 변환 실패 시 기본 날짜 표시
        list.put("created_at_conv", list.s("created_at").substring(0, 10).replace("-", "."));
    }
}

//출력
p.setLayout(ch);
p.setBody("main.board");
p.setLoop("list", list);
p.setVar("list", list);
p.setVar("pagebar", lm.getPaging());
p.display();
%>