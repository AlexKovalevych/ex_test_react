import accounting from 'accounting';
// import moment from 'moment';
import translate from 'counterpart';

class Formatter {
    static monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    static cashableMetrics = [
        'paymentsAmount',
        'depositsAmount',
        'cashoutsAmount',
        'firstDepositsAmount',
        'netgamingAmount',
        'betsAmount',
        'winsAmount',
        'rakeAmount',
        'averageDeposit',
        'averageIn',
        'averageOut',
        'averageCashout',
        'averageArpu',
        'averageArppu',
        'averageArpu',
        'ltv',
        'averageFirstDeposit'
    ];

    static numberMetrics = [
        'paymentsNumber',
        'depositsNumber',
        'cashoutsNumber',
        'depositorsNumber',
        'firstDepositorsNumber',
        'signupsNumber',
        'transactorsNumber',
        'authorizationsNumber'
    ];

    get cashableMetrics() {
        return Formatter.cashableMetrics;
    }

    formatChartValue(value, metrics) {
        let formattedValue = value;
        if (Formatter.cashableMetrics.indexOf(metrics) > -1) {
            formattedValue = Math.round(value / 100);
        }

        if (metrics == 'cashoutsAmount') {
            formattedValue = Math.abs(formattedValue);
        }
        return formattedValue;
    }

    formatValue(value, metrics) {
        if (Formatter.cashableMetrics.indexOf(metrics) > -1) {
            return accounting.formatMoney(Math.round(value / 100), '$', 0);
        }

        if (Formatter.numberMetrics.indexOf(metrics) > -1) {
            return this.formatNumber(value);
        }

        return value;
    }

    formatMoney(value, symbol = '$', format='%s%v', precision=0) {
        return accounting.formatMoney(value, {symbol: symbol, format: format, precision: precision});
    }

    formatNumber(value, precision=0)    {
        return accounting.formatNumber(value, precision);
    }

    formatDashboardPeriod(type, value) {
        switch (type) {
        case 'month':
            return this.formatMonth(value);
        }
    }

    formatDate(date) {
        let dateObj = new Date(date);
        let month = translate(`months.${Formatter.monthNames[dateObj.getMonth()]}`);
        return `${month} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    // formatDateForDatepicker(date) {
    //     return moment.utc(date).format('YYYY-MM-DD');
    // }

    // formatMonthForDatepicker(date) {
    //     let dateObj = new Date(date);

    //     return `${dateObj.getFullYear()}-${this._getZero(dateObj.getMonth() + 1)}`;
    // }

    // formatDateByFormat(date) {
    //     let dateObj = new Date(date);

    //     return `${this._getZero(dateObj.getDate())}.${this._getZero(dateObj.getMonth() + 1)}.${dateObj.getFullYear()}`;
    // }

    formatMonth(date) {
        let dateObj = new Date(date);
        let month = translate(`months.${Formatter.monthNames[dateObj.getMonth()]}`);
        return `${month} ${dateObj.getFullYear()}`;
    }

    // formatMinutes(date) {
    //     let dateObj = new Date(date);
    //     let month = dateObj.getMonth() + 1;
    //     let day = dateObj.getDate();
    //     let hours = dateObj.getHours();
    //     let minutes = dateObj.getMinutes();

    //     return `${dateObj.getFullYear()}-${this._getZero(month)}-${this._getZero(day)} ${this._getZero(hours)}:${this._getZero(minutes)}`;
    // }

    // formatSeconds(date) {
    //     let dateObj = new Date(date);
    //     let month = dateObj.getMonth() + 1;
    //     let day = dateObj.getDate();
    //     let hours = dateObj.getHours();
    //     let minutes = dateObj.getMinutes();
    //     let seconds = dateObj.getSeconds();

    //     return `${dateObj.getFullYear()}-${this._getZero(month)}-${this._getZero(day)} ${this._getZero(hours)}:${this._getZero(minutes)}:${this._getZero(seconds)}`;
    // }

    // formatTime(date) {
    //     let dateObj = new Date(date);
    //     let dateStr = this.formatDate(date);
    //     let hours = dateObj.getHours();
    //     let minutes = dateObj.getMinutes();
    //     let seconds = dateObj.getSeconds();

    //     return `${dateStr} ${this._getZero(hours)}:${this._getZero(minutes)}:${this._getZero(seconds)}`;
    // }

    // getMonthNamesByRange(start, end) {
    //     return this.getMonthsByRange(start, end).map((v) => {
    //         return this.formatMonth(v.toString());
    //     });
    // }

    // getMonthsByRange(start, end) {
    //     let startDate = new Date(start);
    //     startDate.setDate(1);
    //     startDate.setHours(0);
    //     startDate.setMinutes(0);
    //     startDate.setSeconds(0);
    //     let endDate = new Date(end);
    //     endDate.setDate(1);
    //     endDate.setHours(0);
    //     endDate.setMinutes(0);
    //     endDate.setSeconds(0);
    //     let months = [];
    //     while(startDate <= endDate) {
    //         months.push(new Date(startDate.getTime()));
    //         startDate.setMonth(startDate.getMonth() + 1);
    //     }
    //     return months;
    // }

    toTimestamp(date) {
        let dateObj = new Date(date);
        return dateObj.getTime();
    }

    ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // _getZero(value) {
    //     if (value < 10) {
    //         return `0${value}`;
    //     }
    //     return value;
    // }
}

export default new Formatter();
