<%@ page import="java.util.*,java.io.*,dao.*,malgnsoft.db.*,malgnsoft.util.*" %><%@ page import="java.text.SimpleDateFormat, java.util.Date" %><%

Malgn m = new Malgn(request, response, out);

Form f = new Form();
f.setRequest(request);

Page p = new Page();
p.setRequest(request, response);
p.setWriter(out);

int userId = 0;
String userName = "";
String userType = "";
String userLogin = "";
String userBirthday = "";
boolean isAdult = false;
int sellerStatus = 0;

Auth auth = new Auth(request, response); 
auth.keyName = "AUTHID1867";

// ISO 8601 형식 날짜 변환
SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy.MM.dd");

if(auth.isValid()) {
    userId = auth.getInt("id");
	userName = auth.getString("name");
	userLogin = auth.getString("uid");
	userBirthday = auth.getString("birthday");
	p.setVar("login_block", true);
} else {
	p.setVar("login_block", false);
}
%>