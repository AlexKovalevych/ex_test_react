import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
    ru: 'Russian',
    en: 'English',
    yes: 'Yes',
    no: 'No',
    months: {
        Jan: 'Jan',
        Feb: 'Feb',
        Mar: 'Mar',
        Apr: 'Apr',
        May: 'May',
        Jun: 'Jun',
        Jul: 'Jul',
        Aug: 'Aug',
        Sep: 'Sep',
        Oct: 'Oct',
        Nov: 'Nov',
        Dec: 'Dec'
    },
    login: {
        sms_sent: 'SMS with confirmation code was sent to your phone number (%(phone)s). Please contact site administration if you didn\'t receive it.',
        invalid_sms_code: 'Invalid sms code',
        invalid_google_code: 'Invalid code',
        disabled: 'Your account is disabled. Contact system administrator',
        sms_was_sent: 'SMS was sent',
        server_time: 'Warning! Generated code is sensitive to the time set at your phone. Maximum difference with server time may be ± 1 minute. Server time:'
    },
    difference: 'Difference',
    charts: 'Charts',
    menu: {
        dashboard: 'Project indicators',
        finance: 'Finance',
        statistics: 'Statistics',
        calendar_events: 'Events calendar',
        players: 'Players',
        settings: 'Settings',
        payments_check: 'Payments check',
        payment_systems: 'PS Config',
        monthly_balance: 'Monthly balance',
        incoming_reports: 'Incoming reports',
        funds_flow: 'Funds flow',
        timeline_report: 'Timeline report',
        segments_report: 'Segments report',
        retention: 'Retention',
        ltv_report: 'LTV report',
        consolidated_report: 'Consolidated report',
        cohorts_report: 'Cohorts report',
        activity_waves: 'Activity waves',
        events_types_list: 'Events types list',
        events_list: 'Events list',
        events_groups_list: 'Events groups list',
        signup_channels: 'Signup channels',
        multiaccounts: 'Multiaccounts',
        user: 'Users',
        project: 'Projects',
        notification: 'Notifications',
        permissions: 'Permissions',
        data_source: 'Data sources',
        smtp_server: 'SMTP servers'
    },
    form: {
        email: 'Login',
        password: 'Password',
        login: 'Login',
        sms_code: 'SMS code',
        sms_resend: 'Snd SMS again',
        google_code: 'Authentication code'
    },
    validation: {
        invalid_email_password: 'Invalid email or password'
    },
    dashboard: {
        no_data: 'No data',
        current: 'Current',
        previous: 'Previous',
        title: 'Projects indicators',
        average_deposit: 'Average receipt',
        arpu: 'ARPU',
        average_first_deposit: 'Average first deposit',
        deposits_number: 'Deposits number',
        depositors_number: 'Depositors number',
        first_depositors_number: 'First depositors number',
        signups_number: 'Signups number',
        first_deposits_amount: 'First deposits amount',
        authorizations_number: 'Authorizations number',
        inout: 'Inout',
        netgaming: 'Netgaming',
        paymentsAmount: 'Inout',
        depositsAmount: 'Deposits',
        cashoutsAmount: 'Withdrawal',
        netgamingAmount: 'Netgaming',
        rakeAmount: 'Rake',
        betsAmount: 'Bets',
        winsAmount: 'Wins',
        current_period: 'Current period',
        comparison_period: 'Comparison period',
        sort_by_metrics: 'Sort by metrics',
        sort_by: {
            paymentsAmount: 'Inout',
            depositsAmount: 'Deposits',
            cashoutsAmount: 'Withdrawals',
            netgamingAmount: 'Netgaming',
            betsAmount: 'Bets',
            winsAmount: 'Wins',
            firstDepositsAmount: 'First deposits amount'
        },
        project_types: 'Projects:',
        projects: {
            default: 'Our',
            partner: 'Partner'
        },
        period: {
            month: 'Month to date',
            year: 'Year to date',
            last_30_days: 'Last 30 days',
            last_12_months: 'Last 12 months'
        },
        paymentsAmount_daily: 'InOut by the period from %(from)s to %(to)s by days',
        paymentsAmount_monthly: 'InOut by the period from %(from)s to %(to)s monthly',
        depositsAmount_daily: 'Deposits by the period from %(from)s to %(to)s by days',
        depositsAmount_monthly: 'Deposits by the period from %(from)s to %(to)s monthly',
        cashoutsAmount_daily: 'Cashout by the period from %(from)s to %(to)s by days',
        cashoutsAmount_monthly: 'Cashout by the period from %(from)s to %(to)s monthly',
        netgamingAmount_daily: 'NetGaming by the period from %(from)s to %(to)s by days',
        netgamingAmount_monthly: 'NetGaming by the period from %(from)s to %(to)s monthly',
        betsAmount_daily: 'Bets by the period from %(from)s to %(to)s by days',
        betsAmount_monthly: 'Bets by the period from %(from)s to %(to)s monthly',
        winsAmount_daily: 'Wins by the period from %(from)s to %(to)s by days',
        winsAmount_monthly: 'Wins by the period from %(from)s to %(to)s monthly',
        averageDeposit_daily: 'Average check by the period from %(from)s to %(to)s by days',
        averageDeposit_monthly: 'Average check by the period from %(from)s to %(to)s monthly',
        averageArpu_daily: 'ARPU by the period from %(from)s to %(to)s by days',
        averageArpu_monthly: 'ARPU by the period from %(from)s to %(to)s monthly',
        averageFirstDeposit_daily: 'Average first deposit by the period from %(from)s to %(to)s by days',
        averageFirstDeposit_monthly: 'Average first deposit by the period from %(from)s to %(to)s monthly',
        depositsNumber_daily: 'Deposits number by the period from %(from)s to %(to)s by days',
        depositsNumber_monthly: 'Deposits number by the period from %(from)s to %(to)s monthly',
        depositorsNumber_daily: 'Depositors number by the period from %(from)s to %(to)s by days',
        depositorsNumber_monthly: 'Depositors number by the period from %(from)s to %(to)s monthly',
        firstDepositorsNumber_daily: 'First depositors number by the period from %(from)s to %(to)s by days',
        firstDepositorsNumber_monthly: 'First depositors number by the period from %(from)s to %(to)s monthly',
        signupsNumber_daily: 'Signups number by the period from %(from)s to %(to)s by days',
        signupsNumber_monthly: 'Signups number by the period from %(from)s to %(to)s monthly',
        firstDepositsAmount_daily: 'First depositors amount by the period from %(from)s to %(to)s by days',
        firstDepositsAmount_monthly: 'First depositors amount by the period from %(from)s to %(to)s monthly',
        authorizationsNumber_by_days: 'Authorizations number by the period from %(from)s to %(to)s by days',
        authorizationsNumber_monthly: 'Authorizations number by the period from %(from)s to %(to)s monthly'
    },
    highstock: {
        from: 'From',
        to: 'To',
        zoom: 'Zoom',
        '1m': '1 month',
        '3m': '3 months',
        '6m': '6 months',
        '1y': '1 year',
        'ytd': 'YTD',
        'all': 'All',
        january: 'january',
        february: 'february',
        march: 'march',
        april: 'april',
        may: 'may',
        june: 'june',
        july: 'july',
        august: 'august',
        september: 'september',
        october: 'october',
        november: 'november',
        december: 'december',
        sunday: 'sunday',
        monday: 'monday',
        tuesday: 'tuesday',
        wednesday: 'wednesday',
        thursday: 'thursday',
        friday: 'friday',
        saturday: 'saturday'
    },
    user: {
        email: 'Email',
        comment: 'Comment',
        phone_number: 'Phone number',
        is_active: 'Is active',
        last_online: 'Last online'
    }
});
