<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

UserDao user2 = new UserDao();

if("CHECK".equals(m.rs("mode"))) {
	String value = m.rs("v");
	if("".equals(value)) { return; }

	//중복여부
	if(0 < user2.findCount("username = '" + value + "'")) {
		out.print("<span class='bad'>사용 중인 로그인아이디입니다. 다시 입력해 주세요.</span>");
	} else {
		out.print("<span class='good'>사용할 수 있는 로그인아이디입니다.</span>");
	}
	return;
}

f.addElement("name", null, "required:'Y'");
f.addElement("username", null, "required:'Y'");
f.addElement("password", null, "required:'Y'");
f.addElement("role", null, "required:'Y'");
f.addElement("status", null, "required:'Y'");
f.addElement("email", null, "");
f.addElement("phone", null, "");

if(m.isPost() && f.validate()) {
    //제한
	if(0 < user2.findCount("username = '" + f.get("username") + "'")) { m.jsAlert("사용 중인 로그인아이디입니다. 다시 입력하세요."); return; }
	if(0 < user2.findCount("email = '" + f.get("email") + "'")) {
		m.jsAlert("해당 이메일( " + f.get("email") + " )을 사용중입니다. 다시 입력하세요.");
		m.jsReplace("check_bc.jsp?" + m.qs(), "parent");
		return;
	}

    userDao.item("name", f.get("name"));
    userDao.item("username", f.get("username"));
	userDao.item("password", m.encrypt(f.get("password"), "SHA-256"));
    userDao.item("role", f.get("role"));
    userDao.item("email", f.get("email"));
    userDao.item("phone", f.get("phone"));
    userDao.item("status", f.get("status"));
    userDao.item("created_at", m.time("yyyyMMddHHmmss"));

    if (!userDao.insert()){
        m.jsError("error");
        return;
    }
    m.redirect("/sysop/user_list.jsp");
    return;
}

p.setLayout("sysop");
p.setBody("sysop.user_add");
p.setVar("form_script", f.getScript());
p.display();

%>