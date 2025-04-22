<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

//로그인 여부
if(userId != 0) {
	m.redirect("/sysop/index.jsp"); 
	return;
}

//객체
UserDao user = new UserDao();
// user.setDebug(out);

String returl = m.rs("returl", "/sysop/index.jsp");

//로그인 
String username = m.rs("username");
String password = m.rs("password");

f.addElement("username", null, "required: true");
f.addElement("password", null, "required: true");


//폼입력
if(m.isPost() && f.validate()){

	password = m.sha256(password);
	DataSet info = user.find("username = '" + username + "' AND password = '" + password + "' AND status = 1 AND role = 1");
	
    if(info.next()) {
		auth.put("id", info.i("id"));
		auth.put("name", info.s("name"));
		auth.put("username", info.s("username"));
		auth.put("role", info.i("role"));
		auth.put("status", info.i("status"));
		auth.save();

		out.print("success");
        return;

	}

	out.print("아이디 또는 비밀번호를 확인하세요.");
	return;
}

//출력
p.setBody("sysop.login");
p.setVar("form_script", f.getScript());
p.display();

%>