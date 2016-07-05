defmodule Mix.Tasks.Gt.SetUsersStat do
    use Mix.Task
    use Gt.Task
    use Timex
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Model.{Project, ProjectUser, Payment}
    alias Gt.Repo
    import Gt.Model, only: [object_id: 1]
    import Ecto.Query, only: [from: 1, offset: 3, order_by: 3]

    @shortdoc "Sends a greeting to us from Hello Phoenix"

    @moduledoc """
        This is where we would put any long form documentation or doctests.
    """

    def parse_args(args) do
        Map.merge(%{:skip => 0, :onlyWithStats => false, :projectIds => []}, Map.new(elem(args, 0)))
    end

    def do_process(%{:skip => skip, :onlyWithStats => onlyWithStats, :projectIds => projectIds}) do
        Gt.start_repo_supervisor
        project_ids = case length(projectIds) do
            0 -> Project
                |> Project.get_ids
                |> Gt.Repo.all
            _ -> projectIds
        end

        project_users = ProjectUser |> ProjectUser.projects(project_ids)
        project_users = case onlyWithStats do
            "true" -> project_users |> ProjectUser.stat_exists
            _ -> project_users
        end

        project_users = project_users
        |> order_by([pu], asc: pu.id)
        |> offset([pu], ^skip)
        |> Repo.all

        total = Enum.count(project_users)
        Enum.each 1..total, fn i ->
            project_user = Enum.at(project_users, i - 1)
            user_payments = Payment.by_user_id(object_id(project_user.id))

            stat_data = Enum.reduce(user_payments, %{}, fn (payment, acc) ->
                acc
                |> last_deposit_date(payment)
                |> type_name(payment)
                |> day_date(payment)
                |> stat(payment)
                |> first_dates(payment)
            end)

            if Enum.empty?(stat_data) do
                Mongo.update_one(
                    Gt.Repo.__mongo_pool__,
                    ProjectUser.collection,
                    %{"_id" => object_id(project_user.id)},
                    %{
                        "$unset" => %{
                            "stat" => true,
                            "last_dep_d" => true,
                            "first_dep_amount" => true,
                            "first_dep_d" => true,
                            "first_wdr_amount" => true,
                            "first_wdr_d" => true
                        }
                    }
                )
            else
                Mongo.update_one(
                    Gt.Repo.__mongo_pool__,
                    ProjectUser.collection,
                    %{"_id" => object_id(project_user.id)},
                    %{
                        "$set" => %{
                            "stat" => stat_data.stat,
                            "last_dep_d" => Map.get(stat_data, :last_deposit_date, nil),
                            "first_dep_amount" => Map.get(stat_data, :first_deposit_amount, nil),
                            "first_dep_d" => Map.get(stat_data, :first_deposit_date, nil),
                            "first_wdr_amount" => Map.get(stat_data, :first_withdrawal_amount, nil),
                            "first_wdr_d" => Map.get(stat_data, :first_withdrawal_date, nil)
                        }
                    }
                )
            end
            ProgressBar.render(i, total)
        end
    end
    def do_process(_) do
        IO.puts """
            Usage:
            mix gt.set_users_stat --skip=.. --onlyWithStats=.. --projectIds=[..]

            Options:
            --help  Show this help message.

            Description:
            Generates app cache
        """

        System.halt(0)
    end

    defp last_deposit_date(data, payment) do
        Map.put_new(data, :last_deposit_date, payment["add_d"])
    end

    defp type_name(data, payment) do
        type = cond do
            payment["type"] == Payment.type(:deposit) -> "dep"
            payment["type"] == Payment.type(:cashout) -> "wdr"
        end
        Map.put(data, :type_name, type)
    end

    defp day_date(data, payment) do
        date = DateTime.from_milliseconds(payment["add_t"])
        Map.put(data, :day_date, GtDate.format(date, :stat_date))
        |> Map.put(:month_date, GtDate.format(date, :stat_month))
    end

    defp stat(data, payment) do
        type = data[:type_name]
        day = data[:day_date]
        month = data[:month_date]
        initial_map = %{
            "count" => 0,
            "cash_real" => 0
        }

        stat = case Map.has_key?(data, :stat) do
            true -> data[:stat]
            false -> %{}
        end

        day_stat =  Map.get(stat, day, %{}) |> Map.put_new(type, initial_map)
        month_stat = Map.get(stat, month, %{}) |> Map.put_new(type, initial_map)
        total_stat = Map.get(stat, "total", %{}) |> Map.put_new(type, initial_map)

        stat = stat
        |> Map.put(day, day_stat)
        |> Map.put(month, month_stat)
        |> Map.put("total", total_stat)

        stat = stat
        |> put_in([day, type, "count"], stat[day][type]["count"] + 1)
        |> put_in([month, type, "count"], stat[month][type]["count"] + 1)
        |> put_in(["total", type, "count"], stat["total"][type]["count"] + 1)
        |> put_in([day, type, "cash_real"], stat[day][type]["cash_real"] + payment["goods"]["cash_real"])
        |> put_in([month, type, "cash_real"], stat[month][type]["cash_real"] + payment["goods"]["cash_real"])
        |> put_in(["total", type, "cash_real"], stat["total"][type]["cash_real"] + payment["goods"]["cash_real"])

        Map.put(data, :stat, stat)
    end

    defp first_dates(data, payment) do
        cond do
            payment["type"] == Payment.type(:deposit) ->
                Map.put(data, :first_deposit_date, payment["add_d"])
                |> Map.put(:first_deposit_amount, payment["goods"]["cash_real"])
            payment["type"] == Payment.type(:cashout) ->
                Map.put(data, :first_withdrawal_date, payment["add_d"])
                |> Map.put(:first_withdrawal_amount, payment["goods"]["cash_real"])
        end
    end
end
