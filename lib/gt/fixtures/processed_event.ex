defmodule Gt.Fixtures.ProcessedEvent do
    alias Gt.Repo
    alias Gt.Model.{Project}
    alias Gt.Manager.Date, as: GtDate
    import Gt.Model, only: [object_id: 1]
    require Logger
    use Timex

    @processed_events [
    ]

    def run do
        Logger.info("Loading #{__MODULE__} fixtures")
        # processed_events = Enum.map(@processed_events, fn data ->

        # end)
        Logger.info("Loaded #{__MODULE__} fixtures")
    end
end
