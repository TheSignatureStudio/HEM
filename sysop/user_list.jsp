<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

ListManager lm = new ListManager();
lm.setRequest(request);
// lm.setDebug(out);

lm.setTable(userDao.table);
lm.setListNum(10);
lm.setFields("id, username, name, email, phone, role, created_at, updated_at, status");
lm.setOrderBy("id DESC");
lm.addWhere("status != -1");

DataSet users = lm.getDataSet();

if (!users.next()){
    m.jsError("error");
    return;
} else {
    users.first();
    while (users.next()){
        users.put("created_at_conv", m.time("yyyy" + "/" + "MM" + "/" + "dd " + "HH" + ":" + "mm", users.getString("created_at")));
        users.put("role_conv", users.getInt("role") == 1 ? "관리자" : "일반사용자");
        if (users.getInt("status") == 1) {
            users.put("status_conv", "<span class=\"status-badge status-active\">활성화</span>");
        } else {
            users.put("status_conv", "<span class=\"status-badge status-inactive\">비활성화</span>");
        }
    }
}
//m.p(users);

p.setLayout("sysop");
p.setBody("sysop.user_list");
p.setLoop("users", users);
p.setVar("pagebar", lm.getPaging());
p.display();

%>