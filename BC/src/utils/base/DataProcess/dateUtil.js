export function StringToDate(DateStr) {
    var converted = Date.parse(DateStr);
    var myDate = new Date(converted);
    if (isNaN(myDate)) {
        var arys = DateStr.split('-');
        myDate = new Date(arys[0], --arys[1], arys[2]);
    }
    return myDate;
}

window.Date.prototype.DateDiff = function (strInterval, dtEnd) {
    var dtStart = this;
    dtStart = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate());
    if (typeof dtEnd == 'string') {
        dtEnd = StringToDate(dtEnd);
    }
    switch (strInterval) {
        case 's' :
            return parseInt((dtEnd - dtStart) / 1000, 10);
        case 'n' :
            return parseInt((dtEnd - dtStart) / 60000, 10);
        case 'h' :
            return parseInt((dtEnd - dtStart) / 3600000, 10);
        case 'd' :
            return parseInt((dtEnd - dtStart) / 86400000, 10);
        case 'w' :
            return parseInt((dtEnd - dtStart) / 86400000 * 7, 10);
        case 'm' :
            return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
        case 'y' :
            return dtEnd.getFullYear() - dtStart.getFullYear();
    }
};

/**
 * @return {number}
 */
window.Date.prototype.DateDiff1 = function (strInterval, dtEnd) {
    let dtStart = this;
    if (!(dtEnd instanceof Date)) {
        // todo throw exception
    }
    switch (strInterval) {
        case 's' :
            return parseInt((dtEnd - dtStart) / 1000, 10);
        case 'n' :
            return parseInt((dtEnd - dtStart) / 60000, 10);
        case 'h' :
            return parseInt((dtEnd - dtStart) / 3600000, 10);
        case 'd' :
            dtStart = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate());
            dtEnd = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate());
            return parseInt((dtEnd - dtStart) / 86400000, 10);
        case 'w' :
            return parseInt((dtEnd - dtStart) / 86400000 * 7, 10);
        case 'm' :
            return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
        case 'y' :
            return dtEnd.getFullYear() - dtStart.getFullYear();
    }
};