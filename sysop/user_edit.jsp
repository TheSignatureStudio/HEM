<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

UserDao user2 = new UserDao();
int id = m.ri("id");

DataSet info = userDao.find("id = " + id);

if (!info.next()){
    m.jsError("존재하지 않는 사용자입니다.");
    return;
} 

f.addElement("id", null, "required:'Y'");
f.addElement("name", null, "required:'Y'");
f.addElement("email", null, "");
f.addElement("phone", null, "");
f.addElement("role", null, "required:'Y'");
f.addElement("status", null, "required:'Y'");

if(m.isPost() && f.validate()) {
    if(id == 0) { m.jsError("사용자 정보가 없습니다."); return; }
    
    // 이메일 중복 체크 (자기 자신은 제외)
    if(!"".equals(f.get("email")) && 0 < user2.findCount("email = '" + f.get("email") + "' AND id != " + id)) {
        m.jsAlert("해당 이메일( " + f.get("email") + " )을 다른 사용자가 사용중입니다. 다시 입력하세요.");
        return;
    }

    userDao.item("name", f.get("name"));
    userDao.item("email", f.get("email"));
    userDao.item("phone", f.get("phone"));
    userDao.item("role", f.get("role"));
    userDao.item("status", f.get("status"));
    userDao.item("updated_at", m.time("yyyyMMddHHmmss"));
    
    // 비밀번호가 입력된 경우에만 변경
    if(!"".equals(f.get("password"))) {
        userDao.item("password", m.encrypt(f.get("password"), "SHA-256"));
    }

    if (!userDao.update("id = " + id)) {
        m.jsError("사용자 정보를 수정하는 중 오류가 발생했습니다.");
        return;
    }
    
    m.redirect("/sysop/user_list.jsp");
    return;
}

p.setLayout("sysop");
p.setBody("sysop.user_edit");
p.setVar("info", info);
p.setVar("form_script", f.getScript());
p.display();

%> 