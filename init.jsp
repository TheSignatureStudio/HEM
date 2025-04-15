<%@ page import="java.util.*,java.io.*,malgnsoft.db.*,malgnsoft.util.*,dao.*" %><%

String docRoot = Config.getDocRoot();
String jndi = Config.getJndi();
String tplRoot = Config.getDocRoot() + "/html";
String dataDir = Config.getDataDir();
String webUrl = Config.getWebUrl();
int port = request.getServerPort();
if(port != 80) webUrl += ":" + port;

Malgn m = new Malgn(request, response, out);

Form f = new Form("form1");
try { f.setRequest(request); } catch (Exception ex) { out.print("제한 용량 초과 - " + ex.getMessage()); return; }

Page p = new Page(tplRoot);
p.setRequest(request);
p.setPageContext(pageContext);
p.setWriter(out);

int userId = 0;
String userName = "";
String userType = "";
String userLogin = "";
String userBirthday = "";
boolean isAdult = false;
int sellerStatus = 0;

Auth auth = new Auth(request, response);
auth.loginURL = "../member/login.jsp";
auth.keyName = "AUTHID1867";

if(auth.isValid()) {
	userId = auth.getInt("ID");
	userName = auth.getString("NAME");
	userType = auth.getString("TYPE");
	userLogin = auth.getString("LOGINID");
	userBirthday = auth.getString("BIRTHDAY");
	sellerStatus = auth.getInt("SELLERSTATUS");
	if(!"".equals(userBirthday)) {
		isAdult = 0 <= m.diffDate("D", userBirthday, m.addDate("Y", -19, m.time("yyyyMMdd"), "yyyyMMdd"));
		if("05".equals(userType)) isAdult = true;
	}
	p.setVar("login_block", true);
} else {
	p.setVar("login_block", false);

}

p.setVar("SYS_HTTPHOST", request.getServerName());
p.setVar("SYS_USERNAME", userName);
p.setVar("SYS_PAGE_URL", m.urlencode(request.getRequestURI() + (!"".equals(m.qs()) ? "?" + m.qs() : "")));
p.setVar("SYS_TITLE", Config.get("windowTitle"));
p.setVar("SYS_SELLER", ("03".equals(userType) || "04".equals(userType)) && sellerStatus == 1);
p.setVar("webUrl", m.getWebUrl());
//p.setDebug(out);

%>