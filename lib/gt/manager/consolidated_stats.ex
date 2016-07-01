defmodule Gt.Manager.ConsolidatedStats do
    require Logger
    alias Gt.Model.Payment

    def update_stats(from, to, project_ids) do
        Logger.info "Aggregating payments"
        Payment.dashboard_stats(from, to, project_ids)
        |> Enum.to_list
        |> IO.inspect
    end
end
