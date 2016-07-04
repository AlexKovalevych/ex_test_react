defmodule Gt.Manager.ConsolidatedStats do
    require Logger
    alias Gt.Model.{Payment, ProjectUser, ProjectUserGame, PokerGame, ProcessedEvent}

    defmacrop process_data(name, term) do
        quote do
            message = unquote name
            Logger.info "Aggregating #{message}"
            data = unquote(term) |> Enum.to_list
            Logger.info "Updating dashboard #{message}"
            total = length(data)
            Enum.each 1..total, fn i ->
                project_day = Enum.at(data, i - 1)
                Gt.Model.ConsolidatedStats.upsert_project_date(project_day["_id"], Map.drop(project_day, ["_id"]))
                ProgressBar.render(i, total)
            end
        end
    end

    def update_stats(from, to, project_ids) do
        Logger.configure([level: :info])
        process_data("payments", Payment.dashboard_stats(from, to, project_ids))
        process_data("first deposits", ProjectUser.first_deposit_stats(from, to, project_ids))
        process_data("signups", ProjectUser.signup_stats(from, to, project_ids))
        process_data("netgaming", ProjectUserGame.netgaming(from, to, project_ids))
        process_data("rake", PokerGame.rake(from, to, project_ids))
        process_data("authorizations", ProcessedEvent.authorizations_by_period(from, to, project_ids))
    end
end
