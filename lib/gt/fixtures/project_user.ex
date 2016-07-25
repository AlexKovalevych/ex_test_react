defmodule Gt.Fixtures.ProjectUser do
    use Timex
    alias Gt.Model.ProjectUser
    alias Gt.Model.Project
    alias Gt.Manager.Date, as: GtDate
    require Logger

    @now Gt.Manager.Date.today

    def run do
        Logger.info("Loading #{__MODULE__} fixtures")
        data = File.read! Path.join(__DIR__, "project_users.json")
        project_users = Poison.decode!(data)
        projects = Project
        |> Project.titles(["Loto 1", "Loto 2", "Loto 3", "Loto 4", "Loto 5", "Loto 6", "Loto 7", "Loto 8", "Loto 9"])
        |> Gt.Repo.all

        Enum.each(projects, fn project ->
            users = ParallelStream.map(project_users, &insert_project_user(project, &1)) |> Enum.to_list
            Mongo.insert_many(Gt.Repo.__mongo_pool__, ProjectUser.collection, users)
        end)
        Logger.info("Loaded #{__MODULE__} fixtures")
    end

    def insert_project_user(project, project_user) do
        [
            reg_past_days,
            last_past_days,
            first_dep_past_days,
            currency,
            email_unsub_types,
            email_valid,
            first_dep_amount,
            has_bonus,
            is_active,
            _is_test,
            item_id,
            lang,
            phones,
            _,
            reg_ref1,
            segment,
            segment_upd_t,
            sms_unsub_types,
            _,
            query1,
            status,
            cash_real,
            cash_user_real
        ] = project_user
        reg_date = @now |> Timex.shift(days: -reg_past_days)
        last_date = @now |> Timex.shift(days: -last_past_days)
        first_dep_date = @now |> Timex.shift(days: -first_dep_past_days)
        item_id = case project.title do
            "Loto 1" -> item_id
            "Loto 2" -> item_id <> "2"
            "Loto 3" -> item_id <> "3"
            "Loto 4" -> item_id <> "4"
            "Loto 5" -> item_id <> "5"
            "Loto 6" -> item_id <> "32"
            "Loto 7" -> item_id <> "7"
            "Loto 8" -> item_id <> "8"
            "Loto 9" -> item_id <> "9"
        end
        %{
            item_id: item_id,
            project: Gt.Model.object_id(project.id),
            email_valid: email_valid,
            lang: lang,
            currency: currency,
            is_active: is_active,
            is_test: false,
            has_bonus: has_bonus,
            query1: query1,
            reg_ref1: reg_ref1,
            reg_d: GtDate.format(reg_date, :date),
            reg_t: GtDate.timestamp(reg_date),
            last_d: GtDate.format(last_date, :date),
            last_t: GtDate.timestamp(last_date),
            status: status,
            segment: segment,
            segment_upd_t: segment_upd_t,
            first_dep_d: GtDate.format(first_dep_date, :date),
            first_dep_amount: first_dep_amount,
            email_unsub_types: email_unsub_types,
            sms_unsub_types: sms_unsub_types,
            phones: phones,
            cash_real: cash_real,
            cash_user_real: cash_user_real
        }
    end
end
