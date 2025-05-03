<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

BoardDao board = new BoardDao();

ListManager lm = new ListManager();
lm.setRequest(request);
//lm.setDebug(out);

lm.setTable(board.table);
lm.setFields("id, board_id, board_name, description, created_at, status");
lm.addWhere("status != -1");

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
p.setLayout("sysop");
p.setBody("sysop.boards");
p.setLoop("list", list);
p.setVar("pagebar", lm.getPaging());
p.display();

%>