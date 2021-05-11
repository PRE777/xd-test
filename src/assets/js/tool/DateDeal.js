// 时间段处理 按照天、周、月、季度、年 划分

export class DeteDeal {
    _startDate = undefined;
    _endDate = undefined;
    _interval = undefined;
    constructor() {}
    get startDate() {
        return this._startDate;
    }
    set startDate(value) {
        if (value != undefined) {
            // 此处对日期进行深拷贝 
            this._startDate = new Date(value.valueOf());
        }
    }
    get endDate() {
        return this._endDate;
    }
    set endDate(value) {
        if (value != undefined) {
            // 此处对日期进行深拷贝 
            this._endDate = new Date(value.valueOf());
        }
    }
    dateClone() {
        return new Date(this.valueOf());
    }

    // 就算时间段相隔天数
    interval(val) {
            let days = Math.abs(this.endDate - this.startDate) / (1000 * 60 * 60 * 24); // 天数
            let int = parseInt(days / val);
            let yu = days % val;
            return [int, yu];
        }
        // 划分时间
    divisionWithInterval(type) {
        let tempDate = this.startDate;
        let dateArr = [];
        let interval = 1;
        switch (type) {
            case "1天":
                interval = 1;
                break;
            case "1周":
                interval = 7;
                break;
            case "1月":
                interval = 30;
                break;
            case "1季度":
                interval = 90;
                break;
            case "1年":
                interval = 365;
                break;
            default:
                interval = 1;
                break;
        }
        let length = this.interval(interval);
        if (length[0] == 0 && length[1] != 0) {
            // 该时间段 在 所给定的时间间隔内
            interval = length[1];
            let range = getRange();
            dateArr.push(range);
            return dateArr;
        }
        if (length[0] != 0) {
            for (let i = 0; i < length[0]; i++) {
                let range = getRange();
                dateArr.push(range);
            }
            if (length[1] != 0) {
                interval = length[1];
                let range = getRange();
                dateArr.push(range);
            }
            return dateArr
        }
        if (length[0] == 0 && length[1] == 0) {
            interval = length[0];
            let start = dateFormat("YYYY-mm-dd", tempDate);
            dateArr.push(start + "~" + start);
            return dateArr
        }

        function getRange() {
            let start = dateFormat("YYYY-mm-dd", tempDate);
            tempDate.setDate(tempDate.getDate() + interval);
            let end = dateFormat("YYYY-mm-dd", tempDate);
            let range = start + "~" + end;
            return range;
        }
    }
}
export function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}