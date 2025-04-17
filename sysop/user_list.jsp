<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

ListManager lm = new ListManager();
lm.setRequest(request);
lm.setDebug(out);

lm.setTable("TB_USER");
lm.setListNum(10);
lm.setFields("id, username, name, email, phone, role, created_at, updated_at, status");
lm.addWhere("status = 1");

DataSet users = lm.getDataSet();
m.p(users);
//if (!users.next()){
//    m.jsError("error");
//    return;
//} else {
    users.first();
    while (users.next()){
        users.put("created_at", m.time("yyyy" + "/" + "MM" + "/" + "dd " + "HH" + ":" + "mm", users.getString("created_at")));
    }
//}

//m.p(dao);

p.setLayout("sysop");
p.setBody("sysop.user_list");
p.setLoop("users", users);
p.setVar("pagebar", lm.getPaging());
p.display();

%>