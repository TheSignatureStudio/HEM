<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

PostDao post = new PostDao();

ListManager lm = new ListManager();
lm.setRequest(request);
//lm.setDebug(out);

lm.setTable(post.table);
lm.setFields("id, category_id, title, content, created_at, status");
lm.setListNum(3);
lm.addWhere("category_id = 1 AND status = 1");
lm.setOrderBy("id DESC");

// 데이터 조회
DataSet list = lm.getDataSet();
if (!list.next()){
    //m.jsError("error");
    //return;
} else {
    list.first();
    while (list.next()){
        try {
            Date date = inputFormat.parse(list.s("created_at"));
            list.put("created_at_conv", outputFormat.format(date));
        } catch(Exception e) {
            list.put("created_at_conv", list.s("created_at").substring(0, 10).replace("-", "."));
        }
    }
}

p.setLayout(ch);
p.setBody("main.index");
p.setLoop("list", list);
p.display();
%>