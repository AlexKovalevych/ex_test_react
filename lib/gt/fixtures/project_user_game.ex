defmodule Gt.Fixtures.ProjectUserGame do
    use Timex
    alias Gt.Repo
    alias Gt.Model.{ProjectUserGame, Project, ProjectGame, ProjectUser}
    alias Gt.Manager.Date, as: GtDate
    import Gt.Model, only: [object_id: 1]
    require Logger

    def run do
        Logger.info("Loading #{__MODULE__} fixtures")
        data = File.read! Path.join(__DIR__, "project_user_games.json")
        project_user_games = Poison.decode!(data)
        projects = Project
        |> Repo.all
        |> Enum.reduce(%{}, fn (project, acc) ->
            Map.put(acc, project.prefix, project.id)
        end)

        now = DateTime.today
        games = ParallelStream.map(project_user_games, fn data ->
            [
                hours,
                minutes,
                seconds,
                days,
                bets,
                converted_bets,
                bets_count,
                currency,
                game_ref,
                project_prefix,
                user_id,
                wins,
                converted_wins,
                wins_count
            ] = data
            date = now
            |> Timex.subtract(Time.to_timestamp(days, :days))
            |> DateTime.set([{:time, {hours, minutes, seconds}}])
            user = ProjectUser
            |> ProjectUser.projects(projects[project_prefix])
            |> ProjectUser.by_item_id(user_id)
            |> Repo.one
            game = ProjectGame
            |> ProjectGame.projects(projects[project_prefix])
            |> ProjectGame.by_name(game_ref)
            |> ProjectGame.limit(1)
            |> Repo.one
            project_user_game = %{
                bets: bets,
                convertedBets: converted_bets,
                betsCount: bets_count,
                currency: currency,
                date: date,
                gameRef: game_ref,
                userId: user_id,
                wins: wins,
                convertedWins: converted_wins,
                winsCount: wins_count,
                project: object_id(projects[project_prefix]),
                game: object_id(game.id),
                user: object_id(user.id)
            }
            Map.put(project_user_game, :itemId, ProjectUserGame.item_id(project_user_game))
            |> Map.put(:date, BSON.DateTime.from_datetime({GtDate.format(date, :date, :tuple), GtDate.format(date, :microtime, :tuple)}))
        end) |> Enum.into([])
        Mongo.insert_many(Gt.Repo.__mongo_pool__, ProjectUserGame.collection, games)
        Logger.info("Loaded #{__MODULE__} fixtures")
    end
end
