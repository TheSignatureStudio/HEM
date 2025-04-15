package dao;

import malgnsoft.db.DataObject;
import malgnsoft.db.QueryLog;
import malgnsoft.db.RecordSet;

public class BoardDao extends DataObject {
    public String[] statusList = new String[]{"1=>사용", "0=>중지"};
    public String[] postTypes = new String[]{"01=>일반", "02=>공지", "03=>FAQ"};
    
    public BoardDao() {
        this.table = "TB_POSTS";
    }

    public BoardDao(QueryLog queryLog) {
        this.table = "TB_POSTS";
        this.setQueryLog(queryLog);
    }

    public int sortPost(int postId, int currentSort, int targetSort) {
        if (postId > 0 && currentSort > 0 && targetSort > 0) {
            RecordSet rs = this.find("id = " + postId + " AND status != -1");
            if (!rs.next()) {
                return -1;
            } else {
                this.execute("UPDATE " + this.table + " SET sort = sort * 1000 WHERE category_id = " + rs.i("category_id") + " AND status != -1");
                this.execute("UPDATE " + this.table + " SET sort = " + targetSort + " * 1000" + (targetSort >= currentSort ? "+1" : "-1") + " WHERE id = " + postId);
                return this.autoSort(rs.i("category_id"));
            }
        }
        return -1;
    }

    public int autoSort(int categoryId) {
        RecordSet rs = this.find("category_id = " + categoryId + " AND status != -1", "id, sort", "sort ASC");

        for(int i = 1; rs.next(); i++) {
            this.execute("UPDATE " + this.table + " SET sort = " + i + " WHERE id = " + rs.s("id"));
        }

        return 1;
    }
} 