<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

PostDao postDao = new PostDao();

int id = m.ri("id");
DataSet post = postDao.find("id = " + id);
if(!post.next()) { m.jsError("error"); return; } 

postDao.item("status", 0);
postDao.item("updated_at", m.time("yyyyMMddHHmmss"));
if(!postDao.update("id = " + id)) { m.jsError("error"); return; } 

m.redirect("/sysop/post_list.jsp?id=" + post.getInt("category_id"));

%>