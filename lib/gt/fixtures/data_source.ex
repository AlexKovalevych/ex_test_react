defmodule Gt.Fixtures.DataSource do
    alias Gt.Repo
    alias Gt.Model.{Project, PomadoroDataSource}
    alias Gt.Manager.Date, as: GtDate
    require Logger
    import ExPrintf
    use Timex

    @data_sources [
        [:casino_users, "pomadoro poker users", 60, 10],
        [:casino_invoices, "pomadoro poker invoices", 60, 7],
        [:casino_games, "pomadoro poker games", 60, 5],
        [:casino_bonuses, "pomadoro poker bonuses", 60, 3],
        [:poker_games, "pomadoro poker games", 60, 4],
        [:poker_bonuses, "pomadoro poker bonuses", 60, 8]
    ]

    def run do
        Logger.info("Loading #{__MODULE__} fixtures")
        project = Project
        |> Project.titles("Loto 1")
        |> Repo.one
        now = GtDate.now
        Enum.map(@data_sources, fn data ->
            [type, name, runFrequency, days] = data
            type = PomadoroDataSource.type(type)
            date = now |> Timex.subtract(Time.to_timestamp(days, :days))
            {:ok, createdAt} = Ecto.DateTime.cast({{date.year, date.month, date.day}, {0, 0, 0}})
            startDate = createdAt
            Repo.insert!(PomadoroDataSource.changeset(%PomadoroDataSource{}, %{
                project: project.id,
                host: sprintf("%s/data_source/%s.json", ["localhost", type]),
                types: [type],
                name: name,
                runFrequency: runFrequency,
                createdAt: createdAt,
                startDate: startDate
            }))
        end)
        Logger.info("Loaded #{__MODULE__} fixtures")
    end
end
