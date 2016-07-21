defmodule Gt.Fixtures.PokerGame do
    alias Gt.Repo
    alias Gt.Model.{Project, PokerGame, ProjectUser}
    alias Gt.Manager.Date, as: GtDate
    import Gt.Model, only: [object_id: 1]
    require Logger
    use Timex

    def run do
        Logger.info("Loading #{__MODULE__} fixtures")
        data = File.read! Path.join(__DIR__, "poker_games.json")
        poker_games_data = Poison.decode!(data)
        project = Project
        |> Project.titles("Loto 6")
        |> Repo.one

        now = GtDate.now
        poker_games = ParallelStream.map(poker_games_data, fn data ->
            [
                startDays,
                startHours,
                startMinutes,
                startSeconds,
                endDays,
                endHours,
                endMinutes,
                endSeconds,
                buyIn,
                userBuyIn,
                currency,
                cashout,
                rake,
                convertedRake,
                rebuyIn,
                sessionId,
                sessionType,
                totalBet,
                user_item_id
            ] = data
            startDate = now
            |> Timex.subtract(Time.to_timestamp(startDays, :days))
            |> DateTime.set([{:time, {startHours, startMinutes, startSeconds}}])
            endDate = now
            |> Timex.subtract(Time.to_timestamp(endDays, :days))
            |> DateTime.set([{:time, {endHours, endMinutes, endSeconds}}])
            user = ProjectUser
            |> ProjectUser.projects(project.id)
            |> ProjectUser.by_item_id(user_item_id)
            |> Repo.one
            poker_game = %{
                buyIn: buyIn,
                userBuyIn: userBuyIn,
                currency: currency,
                cashout: cashout,
                rake: rake,
                convertedRake: convertedRake,
                rebuyIn: rebuyIn,
                sessionId: sessionId,
                sessionType: sessionType,
                startDate: startDate,
                stopDate: endDate,
                userId: user_item_id,
                totalBet: totalBet,
                project: object_id(project.id),
                user: object_id(user.id)
            }
            Map.put(poker_game, :_id, PokerGame.id(poker_game))
            |> Map.put(:startDate, BSON.DateTime.from_datetime({GtDate.format(startDate, :date, :tuple), GtDate.format(startDate, :microtime, :tuple)}))
            |> Map.put(:stopDate, BSON.DateTime.from_datetime({GtDate.format(endDate, :date, :tuple), GtDate.format(endDate, :microtime, :tuple)}))
        end) |> Enum.to_list
        Mongo.insert_many(Gt.Repo.__mongo_pool__, PokerGame.collection, poker_games)
        Logger.info("Loaded #{__MODULE__} fixtures")
    end
end
