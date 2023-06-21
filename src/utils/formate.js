/**
 * 日期格式化
 * @param row
 * @param column
 * @returns {string}
 */
export const formatDate = (row, column) => {
    // 获取单元格数据
    let datac = row[column.property];
    let dtc = new Date(datac);
    //获取月,默认月份从0开始
    let dtuMonth = dtc.getMonth() + 1;
    //获取日
    let dtuDay = dtc.getDate();
    //处理1-9月前面加0
    if (dtuMonth < 10) {
        dtuMonth = '0' + (dtc.getMonth() + 1);
    }
    //处理1-9天前面加0
    if (dtuDay < 10) {
        dtuDay = '0' + dtc.getDate();
    }
    //获取小时
    let dtuHours = dtc.getHours();
    //处理1-9时前面加0
    if (dtuHours < 10) {
        dtuHours = '0' + dtc.getHours();
    }
    //获取分钟
    let dtuMinutes = dtc.getMinutes();
    //处理1-9分前面加0
    if (dtuMinutes < 10) {
        dtuMinutes = '0' + dtc.getMinutes();
    }
    //获取秒
    let dtuSeconds = dtc.getSeconds();
    //处理1-9秒前面加0
    if (dtuSeconds < 10) {
        dtuSeconds = '0' + dtc.getSeconds();
    }
    //组装年月日时分秒,按自己的要求来
    let dd = dtc.getFullYear() + '/' + dtuMonth + '/' + dtuDay;
    return row.TableIsbibei = dd;
    //+ " " + dtuHours + ":" + dtuMinutes + ":" + dtuSeconds
};
