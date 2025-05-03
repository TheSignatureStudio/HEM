<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

PostCategoryDao postCategory = new PostCategoryDao();
BoardDao boardDao = new BoardDao();
PostDao post = new PostDao();
UserDao user2 = new UserDao();

//기본 변수
int id = m.ri("id");
DataSet board = boardDao.find("id = " + id);
if(!board.next()) {
    m.jsError("error");
    return;
} else {
    board.first();
    if(board.next()) {
        try {
            Date date = inputFormat.parse(board.s("created_at"));
            board.put("created_at_conv", outputFormat.format(date));
        } catch(Exception e) {
            // 변환 실패 시 기본 날짜 표시
            board.put("created_at_conv", board.s("created_at").substring(0, 10).replace("-", "."));
        }
        if (board.getInt("status") == 1) {
            board.put("status_conv", "<span class=\"status-badge status-active\">활성화</span>");
        } else {
            board.put("status_conv", "<span class=\"status-badge status-inactive\">비활성화</span>");
        }
    }
}

//목록
ListManager lm = new ListManager();
lm.setRequest(request);
//lm.setDebug(out);

lm.setTable(post.table + "  a JOIN " + user2.table + " b JOIN " + postCategory.table + " c ON a.user_id = b.id AND a.category_id = c.id");
lm.setFields("a.id, a.category_id, a.title, b.name, a.created_at, a.view_count, a.status, c.name as category_name");
lm.addWhere("a.status != -1 AND a.category_id = " + id);
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
    if (list.getInt("status") == 1) {
        list.put("status_conv", "<span class=\"status-badge status-active\">활성화</span>");
    } else {
        list.put("status_conv", "<span class=\"status-badge status-inactive\">비활성화</span>");
    }
}

board.put("count", lm.getTotalNum());

p.setLayout("sysop");
p.setBody("sysop.post_list");
p.setLoop("list", list);
p.setVar("board", board);
p.setVar("pagebar", lm.getPaging());
p.display();

%>