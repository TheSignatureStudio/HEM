<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

//userDao.setDebug(out);

int id = m.ri("id");

DataSet user2 = userDao.find("id = " + id);
if(!user2.next()){
    m.jsError("해당 정보가 없습니다."); 
    return;
}

userDao.item("status", 0);
userDao.item("updated_at", m.time("yyyyMMddHHmmss"));
if(!userDao.update("id = " + id)) {
    m.jsError("비활성화 하던 중 오류가 발생했습니다."); 
    return; 
}

m.redirect("/sysop/user_list.jsp");
%>