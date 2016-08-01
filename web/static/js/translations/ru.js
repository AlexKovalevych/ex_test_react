import counterpart from 'counterpart';

counterpart.registerTranslations('ru', {
    ru: 'Русский',
    en: 'Английский',
    months: {
        Jan: 'Янв',
        Feb: 'Фев',
        Mar: 'Мар',
        Apr: 'Апр',
        May: 'Май',
        Jun: 'Июн',
        Jul: 'Июл',
        Aug: 'Авг',
        Sep: 'Сен',
        Oct: 'Окт',
        Nov: 'Ноя',
        Dec: 'Дек'
    },
    login: {
        sms_sent: 'На ваш номер (%(phone)s) отправлено сообщение с кодом подтверждения. Если вы не получили код, обратитесь к администрации.',
        invalid_sms_code: 'Неправильный код из SMS',
        invalid_google_code: 'Неправильный код',
        disabled: 'Ваш аккаунт отключен. Свяжитесь с администратором',
        sms_was_sent: 'SMS было отправлено',
        server_time: 'Внимание! Код, генерируемый вашим телефоном, чувствителен ко времени, установленном в телефоне. Максимальная разница с серверным временем может быть ± 1 минуту. Серверное время:'
    },
    difference: 'Разница',
    charts: 'Графики',
    menu: {
        dashboard: 'Показатели проектов',
        finance: 'Финансы',
        statistics: 'Статистика',
        calendar_events: 'Календарь событий',
        players: 'Игроки',
        settings: 'Настройки',
        payments_check: 'Сверка платежей',
        payment_systems: 'Конфиг ПС',
        monthly_balance: 'Месячные балансы',
        incoming_reports: 'Входящие отчеты',
        funds_flow: 'Движение средств',
        timeline_report: 'Таймлайн отчет',
        segments_report: 'Отчет по сегментам',
        retention: 'Ретеншены',
        ltv_report: 'LTV отчет',
        consolidated_report: 'Сводный отчет',
        cohorts_report: 'Отчет по когортам',
        activity_waves: 'Всплески активности',
        events_types_list: 'Типы событий',
        events_list: 'Список событий',
        events_groups_list: 'Группы событий',
        signup_channels: 'Каналы регистрации',
        multiaccounts: 'Мультиаккаунты',
        user: 'Пользователи',
        project: 'Проекты',
        notification: 'Оповещения',
        permissions: 'Права доступа',
        data_source: 'Источники данных',
        smtp_server: 'SMTP сервера'
    },
    form: {
        email: 'Логин',
        password: 'Пароль',
        login: 'Войти',
        sms_code: 'SMS код',
        sms_resend: 'Отправить SMS еще раз',
        google_code: 'Код аутентификации'
    },
    validation: {
        invalid_email_password: 'Неправильный логин или пароль'
    },
    dashboard: {
        no_data: 'Нет данных',
        current: 'Текущий',
        previous: 'Предыдущий',
        title: 'Показатели проектов',
        average_deposit: 'Средний чек',
        arpu: 'ARPU',
        average_first_deposit: 'Средний первый депозит',
        deposits_number: 'Количество депозитов',
        depositors_number: 'Количество депозиторов',
        first_depositors_number: 'Количество перводепозиторов',
        signups_number: 'Количество регистраций',
        first_deposits_amount: 'Сумма первых депозитов',
        authorizations_number: 'Количество авторизаций',
        inout: 'Inout',
        netgaming: 'Netgaming',
        paymentsAmount: 'Inout',
        depositsAmount: 'Депозиты',
        cashoutsAmount: 'Выплаты',
        netgamingAmount: 'Netgaming',
        rakeAmount: 'Rake',
        betsAmount: 'Ставки',
        winsAmount: 'Выигрыши',
        current_period: 'Текущий период',
        comparison_period: 'Период сравнения',
        sort_by_metrics: 'Сортировать по метрике',
        sort_by: {
            paymentsAmount: 'Inout',
            depositsAmount: 'Депозитам',
            cashoutsAmount: 'Выплатам',
            netgamingAmount: 'Netgaming',
            betsAmount: 'Ставкам',
            winsAmount: 'Выигрышам',
            firstDepositsAmount: 'Сумме первых депозитов'
        },
        project_types: 'Проекты:',
        projects: {
            default: 'Наши',
            partner: 'Партнерские'
        },
        period: {
            month: 'С начала месяца',
            year: 'С начала года',
            last_30_days: 'Последние 30 дней',
            last_12_months: 'Последние 12 месяцев'
        },
        paymentsAmount_daily: 'InOut за период с %(from)s по %(to)s по дням',
        paymentsAmount_monthly: 'InOut за период с %(from)s по %(to)s по месяцам',
        depositsAmount_daily: 'Депозиты за период с %(from)s по %(to)s по дням',
        depositsAmount_monthly: 'Депозиты за период с %(from)s по %(to)s по месяцам',
        cashoutsAmount_daily: 'Выплаты за период с %(from)s по %(to)s по дням',
        cashoutsAmount_monthly: 'Выплаты за период с %(from)s по %(to)s по месяцам',
        netgamingAmount_daily: 'NetGaming за период с %(from)s по %(to)s по дням',
        netgamingAmount_monthly: 'NetGaming за период с %(from)s по %(to)s по месяцам',
        betsAmount_daily: 'Ставки за период с %(from)s по %(to)s по дням',
        betsAmount_monthly: 'Ставки за период с %(from)s по %(to)s по месяцам',
        winsAmount_daily: 'Выигрыши за период с %(from)s по %(to)s по дням',
        winsAmount_monthly: 'Выигрыши за период с %(from)s по %(to)s по месяцам',
        averageDeposit_daily: 'Средний чек за период с %(from)s по %(to)s по дням',
        averageDeposit_monthly: 'Средний чек за период с %(from)s по %(to)s по месяцам',
        averageArpu_daily: 'ARPU за период с %(from)s по %(to)s по дням',
        averageArpu_monthly: 'ARPU за период с %(from)s по %(to)s по месяцам',
        averageFirstDeposit_daily: 'Средний первый депозит за период с %(from)s по %(to)s по дням',
        averageFirstDeposit_monthly: 'Средний первый депозит за период с %(from)s по %(to)s по месяцам',
        depositsNumber_daily: 'Количество депозитов за период с %(from)s по %(to)s по дням',
        depositsNumber_monthly: 'Количество депозитов за период с %(from)s по %(to)s по месяцам',
        depositorsNumber_daily: 'Количество депозиторов за период с %(from)s по %(to)s по дням',
        depositorsNumber_monthly: 'Количество депозиторов за период с %(from)s по %(to)s по месяцам',
        firstDepositorsNumber_daily: 'Количество перводепозиторов за период с %(from)s по %(to)s по дням',
        firstDepositorsNumber_monthly: 'Количество перводепозиторов за период с %(from)s по %(to)s по месяцам',
        signupsNumber_daily: 'Количество регистраций за период с %(from)s по %(to)s по дням',
        signupsNumber_monthly: 'Количество регистраций за период с %(from)s по %(to)s по месяцам',
        firstDepositsAmount_daily: 'Сумма первых депозитов за период с %(from)s по %(to)s по дням',
        firstDepositsAmount_monthly: 'Сумма первых депозитов за период с %(from)s по %(to)s по месяцам',
        authorizationsNumber_daily: 'Количество авторизаций за период с %(from)s по %(to)s по дням',
        authorizationsNumber_monthly: 'Количество авторизаций за период с %(from)s по %(to)s по месяцам'
    },
    highstock: {
        from: 'С',
        to: 'По',
        zoom: 'Масштаб',
        '1m': '1 месяц',
        '3m': '3 месяца',
        '6m': '6 месяцев',
        '1y': '1 год',
        'ytd': 'Этот год',
        'all': 'Весь период',
        january: 'январь',
        february: 'февраль',
        march: 'март',
        april: 'апрель',
        may: 'май',
        june: 'июнь',
        july: 'июль',
        august: 'август',
        september: 'сентябрь',
        october: 'октябрь',
        november: 'ноябрь',
        december: 'декабрь',
        sunday: 'воскресенье',
        monday: 'понедельник',
        tuesday: 'вторник',
        wednesday: 'среда',
        thursday: 'четверг',
        friday: 'пятница',
        saturday: 'суббота'
    },
    user: {
        email: 'Почта',
        comment: 'Коментарий',
        phone_number: 'Номер телефона',
        is_active: 'Активный',
        last_online: 'Последний вход'
    }
});
