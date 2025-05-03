<%@ page contentType="text/html; charset=utf-8" %><%@ include file="./init.jsp" %><%

String today = m.time("yyyyMMdd");
String todayMonth = today.substring(4);
String todayYear = today.substring(0, 4);
String now = m.time("yyyyMMddHHmmss");
String year = m.rs("year"); if(4 != year.length() || 2000 > m.parseInt(year) || 3000 < m.parseInt(year)) year = m.time("yyyy");
String month = m.strrpad(m.rs("month"), 2, "0"); if(2 != month.length() || 1 > m.parseInt(month) || 12 < m.parseInt(month)) month = m.time("MM");
String thisMonth = year + month;
String prevMonth = m.addDate("M", -1, thisMonth + "01", "yyyyMM");
String nextMonth = m.addDate("M", 1, thisMonth + "01", "yyyyMM");
String day = m.time("dd");

CalendarEventDao eventDao = new CalendarEventDao();
CodeDao code = new CodeDao();

DataSet eventList = eventDao.query("SELECT * FROM " + eventDao.table + " WHERE status = 1");
// 여러 날에 걸친 이벤트 찾기
DataSet allDayEvents = new DataSet();
while(eventList.next()) {
    String sday = eventList.s("request_sday");
    String eday = eventList.s("request_eday");
    int isAllDay = eventList.i("is_all_day");
    
    // 종일 이벤트인 경우
    if(isAllDay == 1) {
        // 이벤트를 종일 이벤트 데이터셋에 저장
        allDayEvents.addRow();
        allDayEvents.put("request_sday", sday);
        allDayEvents.put("request_eday", eday);
        allDayEvents.put("title", eventList.s("title"));
        allDayEvents.put("color", eventList.s("color"));
        allDayEvents.put("sort", eventList.i("sort"));
    }
}
// sort 기준으로 정렬
allDayEvents.sort("sort", "asc");
eventList.first();

//m.p(eventList);
DataSet dlist = code.getMonthDays(year + month + day, "yyyyMMdd");
DataSet list = new DataSet();

while(dlist.next()) {
	list.addRow();
	list.put("date", dlist.s("date"));
	list.put("type", dlist.s("type"));
	list.put("weekday", dlist.s("weekday"));
	list.put("day", m.time("d", dlist.s("date")));
	list.put("newline", dlist.i("weekday") == 7 ? "</tr><tr>" : "");
	list.put("font", dlist.i("type") == 2 ? "bold" : "normal");
	list.put("year", year);
	list.put("month", month);

	DataSet requestStart = new DataSet();
	
	eventList.first(); // 포인터를 처음으로 되돌림
	while(eventList.next()) {
		String sday = eventList.s("request_sday");
		String eday = eventList.s("request_eday");
		int isAllDay = eventList.i("is_all_day");
    
		// 시간 이벤트인 경우
		if(isAllDay == 0 && m.time("yyyyMMdd", list.s("date")).equals(sday)) {
			requestStart.addRow();
			requestStart.put("request_sday", sday);
			requestStart.put("request_eday", eday);
			requestStart.put("title", eventList.s("title"));
			requestStart.put("event_idx", eventList.i("__idx"));
			requestStart.put("start_time", eventList.s("start_time"));
			requestStart.put("end_time", eventList.s("end_time"));
		}
	}
	eventList.first(); // 다음 사용을 위해 포인터를 다시 처음으로

	list.put(".request_start", requestStart);
	requestStart.first();
	while(requestStart.next()) {
		requestStart.put("start_time", requestStart.s("start_time").substring(0, 2) + ":" + requestStart.s("start_time").substring(2, 4));
		requestStart.put("end_time", requestStart.s("end_time").substring(0, 2) + ":" + requestStart.s("end_time").substring(2, 4));
	}
	
	// 해당 날짜에 포함된 종일 이벤트 찾기
	DataSet allDayEventsForDate = new DataSet();
	allDayEvents.first();
	
	while(allDayEvents.next()) {
	    String sday = allDayEvents.s("request_sday");
	    String eday = allDayEvents.s("request_eday");
	    String currentDate = m.time("yyyyMMdd", list.s("date"));
	    
	    // 현재 날짜가 시작일과 종료일 사이에 있는지 확인 (시작일과 종료일 포함)
	    if(m.parseInt(currentDate) >= m.parseInt(sday) && m.parseInt(currentDate) <= m.parseInt(eday)) {
	        allDayEventsForDate.addRow();
	        allDayEventsForDate.put("color", allDayEvents.s("color"));
	        // 스타일링을 위한 위치 표시
	        boolean isFirst = currentDate.equals(sday);
	        boolean isLast = currentDate.equals(eday);
	        
	        // 주의 첫 날이거나 이벤트의 시작일인 경우에만 제목 표시
	        boolean isWeekStart = m.parseInt(m.time("u", currentDate)) == 7; // 일요일인 경우
	        boolean showTitle = isFirst || isWeekStart;
	        
	        if(isFirst && isLast) {
	            allDayEventsForDate.put("position_type", "single");  // 하루짜리 이벤트
	            allDayEventsForDate.put("title", allDayEvents.s("title"));
	        } else if(isFirst) {
	            allDayEventsForDate.put("position_type", "first");   // 여러 날 이벤트의 첫째날
	            allDayEventsForDate.put("title", allDayEvents.s("title"));
	        } else if(isLast) {
	            allDayEventsForDate.put("position_type", "last");    // 여러 날 이벤트의 마지막날
	            allDayEventsForDate.put("title", showTitle ? allDayEvents.s("title") : "");
	        } else {
	            allDayEventsForDate.put("position_type", "middle");  // 여러 날 이벤트의 중간날
	            allDayEventsForDate.put("title", showTitle ? allDayEvents.s("title") : "");
	        }
	    }
	}
	list.put(".all_day_events", allDayEventsForDate);

    String tdClass = "";
    if(!"2".equals(dlist.s("type"))) tdClass += "other-month ";
    if(dlist.s("date").equals(today)) tdClass += "today ";
    list.put("td_class", tdClass.trim());
}

//출력
p.setLayout(ch);
p.setBody("main.calendar");
p.setVar("form_script", f.getScript());

p.setLoop("dlist", dlist);
p.setLoop("list", list);
p.setVar("prev_year", prevMonth.substring(0, 4));
p.setVar("next_year", nextMonth.substring(0, 4));
p.setVar("prev_month", prevMonth.substring(4));
p.setVar("next_month", nextMonth.substring(4));

p.setVar("year", year);
p.setVar("month", month);

p.setVar("today_year", todayYear);
p.setVar("today_month", todayMonth);
p.display();

%>