<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

BoardDao board = new BoardDao();

//기본 변수
String code = m.rs("code", "notice");  //게시판 코드
int pageNum = m.ri("page", 1);
int categoryId = m.ri("cid");
String keyword = m.rs("keyword"); //검색어

//목록
ListManager lm = new ListManager();
lm.setRequest(request);
lm.setTable(board.table + " a");
lm.setFields("a.*");
lm.addWhere("a.status != -1");
if(categoryId > 0) lm.addWhere("a.category_id = " + categoryId);
if(!"".equals(keyword)) { //검색 조건 추가
    lm.addSearch("a.subject,a.content", keyword, "LIKE");
}
lm.setOrderBy("a.sort ASC, a.id DESC");

//포맷팅
DataSet list = lm.getDataSet();
while(list.next()) {
    list.put("reg_date_conv", m.time("yyyy.MM.dd", list.s("reg_date")));
    list.put("content_conv", m.stripTags(list.s("content")));
    list.put("subject_conv", m.cutString(list.s("subject"), 50));
}

//출력
p.setLayout(ch);
p.setBody("main.board");
p.setVar("list", list);
p.setVar("total_cnt", lm.getTotalNum());
p.setVar("pagebar", lm.getPaging());
p.setVar("category_id", categoryId);
p.display();
%>