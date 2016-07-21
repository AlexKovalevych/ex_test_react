defmodule Gt.Fixtures.Payment do
    use Timex
    alias Gt.Repo
    alias Gt.Model.Project
    alias Gt.Model.ProjectUser
    alias Gt.Model.Payment
    alias Gt.Manager.Date, as: GtDate
    import Gt.Model, only: [object_id: 1]
    require Logger

    @traffic_sources %{"n" => "noref", "i" => "internal", "b" => "buying", "w" => "webmasters"}

    @systems %{
        "c" => "Creditcard",
        "q" => "QIWI",
        "w" => "Webmoney",
        "e" => "Eport",
        "y" => "Yandex",
        "s" => "SmsPay",
        "qd" => "QiwiDirect",
        "a" => "Alphaclick",
        "l" => "LiqPay",
        "yd" => "Яндекс.Деньги",
        "i" => "interkassa",
        "p" => "Privat24",
        "m" => "Moneta",
        "mr" => "Mail.ru",
        "mb" => "Moneybookers",
        "p7" => "Pay777Pins",
        "sw" => "SMSWiz",
        "sp" => "SpryPay"
    }

    @now GtDate.now

    def run do
        Logger.info("Loading #{__MODULE__} fixtures")
        {:ok, data} = File.read Path.join(__DIR__, "payments.json")
        users = Poison.decode!(data)
        projects = Project
        |> Project.titles(["Loto 1", "Loto 2", "Loto 3", "Loto 4", "Loto 5", "Loto 6", "Loto 7", "Loto 8", "Loto 9"])
        |> Gt.Repo.all

        Enum.map(projects, fn project ->
            ParallelStream.each(users, &insert_payments(project, &1)) |> Enum.to_list
        end)
        Logger.info("Loaded #{__MODULE__} fixtures")
    end

    def insert_payments(project, [user_item_id, data]) do
        user_item_id = case project.title do
            "Loto 1" -> user_item_id
            "Loto 2" -> user_item_id <> "2"
            "Loto 3" -> user_item_id <> "3"
            "Loto 4" -> user_item_id <> "4"
            "Loto 5" -> user_item_id <> "5"
            "Loto 6" -> user_item_id <> "32"
            "Loto 7" -> user_item_id <> "7"
            "Loto 8" -> user_item_id <> "8"
            "Loto 9" -> user_item_id <> "9"
        end

        user = ProjectUser
        |> ProjectUser.projects(project.id)
        |> ProjectUser.by_item_id(user_item_id)
        |> Repo.one
        payments = Enum.map(data, fn payment ->
            [
                date_past_days,
                hours,
                minutes,
                seconds,
                traffic_source,
                cash_real,
                item_id,
                state,
                system,
                type
            ] = payment
            date = @now |> Timex.shift(days: -date_past_days)
            time = DateTime.set(date, [{:time, {hours, minutes, seconds}}])
            cash_real = case project.title do
                "Loto 1" -> cash_real
                "Loto 2" -> round(cash_real * 1.05)
                "Loto 3" -> round(cash_real * 0.85)
                "Loto 4" -> round(cash_real * 1.2)
                "Loto 5" -> round(cash_real * 0.8)
                "Loto 6" -> round(cash_real * 1.1)
                "Loto 7" -> round(cash_real * 0.95)
                "Loto 8" -> round(cash_real * 1.07)
                "Loto 9" -> round(cash_real * 1.11)
            end
            %{
                item_id: item_id,
                project: object_id(project.id),
                user_id: user_item_id,
                add_d: GtDate.format(date, :date),
                add_t: GtDate.timestamp(time),
                type: type,
                state: state,
                goods: %{"cash_real" => cash_real},
                system: @systems[system],
                user: object_id(user.id),
                trafficSource: @traffic_sources[traffic_source]
            }
        end)
        Mongo.insert_many(Gt.Repo.__mongo_pool__, Payment.collection, payments)
    end
end
