defmodule Gt.Manager.ConsolidatedStats do
    require Logger
    alias Gt.Model.Payment
    alias Gt.Model.ProjectUser

    def update_stats(from, to, project_ids) do
        Logger.configure([level: :info])
        Logger.info "Aggregating payments"
        payments = Payment.dashboard_stats(from, to, project_ids) |> Enum.to_list
        Logger.info "Updating dashboard payments"
        process_data(payments)

        Logger.info "Aggregating first deposits"
        first_deposits = ProjectUser.first_deposit_stats(from, to, project_ids) |> Enum.to_list
        Logger.info "Updating dashboard first deposits"
        process_data(first_deposits)

        Logger.info "Aggregating signups"
        signups = ProjectUser.signup_stats(from, to, project_ids) |> Enum.to_list
        Logger.info "Updating dashboard signups"
        process_data(signups)
    end

    defp process_data(data) do
        total = length(data)
        Enum.each 1..total, fn i ->
            project_day = Enum.at(data, i - 1)
            Gt.Model.ConsolidatedStats.upsert_project_date(project_day["_id"], Map.drop(project_day, ["_id"]))
            ProgressBar.render(i, total)
        end
    end
end
