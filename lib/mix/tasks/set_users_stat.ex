defmodule Mix.Tasks.Gt.SetUsersStat do
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
        |> Enum.to_list

        total = Enum.count(project_users)
        Enum.each 1..total, fn i ->
            project_user = Enum.at(project_users, i - 1)
            project_user_id = object_id(project_user.id)
            user_payments = Payment.by_user_id(
                project_user_id,
                %{"_id" => false, "add_d" => true, "goods" => true, "type" => true, "add_t" => true})
            |> Enum.to_list
            if Enum.empty?(user_payments) do
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
                last_deposit = Payment.last_deposit(project_user.id) |> Repo.one
                last_deposit_date = case is_map(last_deposit) do
                    true -> last_deposit.add_d
                    false -> nil
                end
                first_deposit = Payment.first_deposit(project_user.id) |> Repo.one
                [first_deposit_amount, first_deposit_date] = case is_map(first_deposit) do
                    true -> [first_deposit.goods["cash_real"], first_deposit.add_d]
                    false -> [nil, nil]
                end
                first_withdrawal = Payment.first_withdrawal(project_user.id) |> Repo.one
                [first_withdrawal_amount, first_withdrawal_date] = case is_map(first_withdrawal) do
                    true -> [first_withdrawal.goods["cash_real"], first_withdrawal.add_d]
                    false -> [nil, nil]
                end
                stat = Enum.reduce(user_payments, %{}, fn (payment, acc) ->
                    type = type_name(payment)
                    {day, month} = day_date(payment)
                    sum = payment["goods"]["cash_real"]
                    day_stat = stat(get_in(acc, [day]), type, sum)
                    month_stat = stat(get_in(acc, [month]), type, sum)
                    total_stat = stat(get_in(acc, ["total"]), type, sum)
                    acc
                    |> Map.put(day, day_stat)
                    |> Map.put(month, month_stat)
                    |> Map.put("total", total_stat)
                end)
                Mongo.update_one(
                    Gt.Repo.__mongo_pool__,
                    ProjectUser.collection,
                    %{"_id" => object_id(project_user.id)},
                    %{
                        "$set" => %{
                            "stat" => stat,
                            "last_dep_d" => last_deposit_date,
                            "first_dep_amount" => first_deposit_amount,
                            "first_dep_d" => first_deposit_date,
                            "first_wdr_amount" => first_withdrawal_amount,
                            "first_wdr_d" => first_withdrawal_date
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

    defp type_name(payment) do
        cond do
            payment["type"] == Payment.type(:deposit) -> "dep"
            payment["type"] == Payment.type(:cashout) -> "wdr"
        end
    end

    defp day_date(payment) do
        date = payment["add_d"]
        {GtDate.convert(date, :date, :stat_day), GtDate.convert(date, :date, :stat_month)}
    end

    defp initial_map(type, sum) do
        %{
            type => %{
                "cash_real" => sum,
                "count" => 1
            }
        }
    end

    defp stat(nil, type, sum), do: initial_map(type, sum)
    defp stat(stat, type, sum) do
        case Map.has_key?(stat, type) do
            true ->
                put_in(stat, [type, "count"], stat[type]["count"] + 1)
                |> put_in([type, "cash_real"], stat[type]["cash_real"] + sum)
            false -> Map.merge(stat, initial_map(type, sum))
        end
    end
end
