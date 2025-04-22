<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

int id = m.ri("id");
DataSet info = userDao.find("id=" + id);

if (!info.next()){
    m.jsError("존재하지 않는 사용자입니다.");
    return;
} 

info.put("created_at_conv", m.time("yyyy" + "/" + "MM" + "/" + "dd " + "HH" + ":" + "mm", info.getString("created_at")));
info.put("role_conv", info.getInt("role") == 1 ? "관리자" : "일반사용자");
if (info.getInt("status") == 1) {
    info.put("status_conv", "<span class=\"status-badge status-active\">활성화</span>");
} else {
    info.put("status_conv", "<span class=\"status-badge status-inactive\">비활성화</span>");
}

p.setLayout("sysop");
p.setBody("sysop.user_view");
p.setVar("user", info);
p.display();

%>