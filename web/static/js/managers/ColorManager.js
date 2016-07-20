class ColorManager {
    static progressColors = {
        current: {
            paymentsAmount: 'progress-bar-primary',
            depositsAmount: 'progress-bar-light-green',
            cashoutsAmount: 'progress-bar-light-red',
            netgamingAmount: 'progress-bar-violet',
            betsAmount: 'progress-bar-salat-green',
            winsAmount: 'progress-bar-orange',
            firstDepositsAmount: 'progress-bar-grey',
            negative: 'progress-bar-danger'
        },
        previous: {
            paymentsAmount: 'progress-bar-sky',
            depositsAmount: 'progress-bar-light-light-green',
            cashoutsAmount: 'progress-bar-light-pink',
            netgamingAmount: 'progress-bar-light-violet',
            betsAmount: 'progress-bar-light-salat-green',
            winsAmount: 'progress-bar-light-orange',
            firstDepositsAmount: 'progress-bar-light-grey',
            negative: 'progress-bar-pink'
        }
    };

    static chartColors = {
        paymentsAmount: '#54A9F4',
        depositsAmount: '#80CA4B',
        cashoutsAmount: '#E9581B',
        netgamingAmount: '#F63673',
        rakeAmount: '#834AA9',
        betsAmount: '#32AA9E',
        winsAmount: '#F8931B',
        averageDeposit: '#5fa2dd',
        averageArpu: '#5fa2dd',
        averageFirstDeposit: '#5fa2dd',
        depositsNumber: '#5fa2dd',
        depositorsNumber: '#5fa2dd',
        firstDepositorsNumber: '#5fa2dd',
        signupsNumber: '#5fa2dd'
    };

    // static jiraColorToBootstrapColor = {
    //     "blue-gray": "label-primary",
    //     "warm-red": "label-danger",
    //     "yellow": "label-warning",
    //     "brown": "label-warning",
    //     "green": "label-success",
    //     "medium-gray": "label-default"
    // };

    static timelineSegmentsColors = {
        NFD:'#FFE699',
        RFD:'#FFD966',
        LD:'#C5E0B4',
        RD_14:'#DAE3F3',
        RD_30:'#B4C7E7',
        RD_90:'#8FAADC',
        RD_90p:'#2F5597'
    };

    static warmMapColor = [109, 213, 113];

    static gridColor = '#E8E8E8';

    static multiaccountsColors = {
        cookie: {
            background: '#6CCE9E',
            border: '#5FB58B',
            highlight: {
                border: '#96cfb3',
                background: '#6CCE9E'
            }
        },
        uid: {
            background: '#68BDF6',
            border: '#5CA8DB',
            highlight: {
                border: '#82bde3',
                background: '#68BDF6'
            }
        }
    };

    static paymentCheckStatusColors = {
        waiting_for_processing: 'warning',
        'processing_uploaded_files': 'info',
        comparing_data: 'info',
        completed: 'success',
        error: 'danger'
    };

    getWarmMapColor(minValue, maxValue, value) {
        let percent = Math.round((value - minValue) / ((maxValue - minValue) / 100)) / 100;
        return `rgba(${ColorManager.warmMapColor.join(', ')}, ${percent})`;
    }

    getProgressColor(metrics, value, period) {
        if (value > 0) {
            return ColorManager.progressColors[period][metrics];
        } else {
            return ColorManager.progressColors[period].negative;
        }
    }

    getPaymentCheckStatusColor(status) {
        return ColorManager.paymentCheckStatusColors[status];
    }

    getTimelineSegmentsColor(type) {
        return ColorManager.timelineSegmentsColors[type];
    }

    getChartColor(metrics) {
        return ColorManager.chartColors[metrics];
    }

    get gridColor() {
        return ColorManager.gridColor;
    }

    get gantChartColor() {
        return ColorManager.chartColors.paymentsAmount;
    }

    get highlightChartColor() {
        return ColorManager.chartColors.cashoutsAmount;
    }

    get getJiraColorToBootstrapColor() {
        return ColorManager.jiraColorToBootstrapColor;
    }

    getMultiaccountsColors(group) {
        return ColorManager.multiaccountsColors[group.toLowerCase()];
    }
}

export default new ColorManager();
