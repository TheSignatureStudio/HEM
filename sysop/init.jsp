<%@ include file="../init.jsp" %><%

UserDao userDao = new UserDao();
auth.loginURL = "/sysop/login/login.jsp";

if(userId == 0) auth.loginForm();

DataSet user = userDao.find("id = " + userId + " AND role = 1");

p.setVar("user", user);
%>