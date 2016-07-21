# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Gt.Repo.insert!(%Gt.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Gt.Fixtures.{
    Project,
    User,
    ProjectUser,
    Payment,
    ProjectGame,
    ProjectUserGame,
    PokerGame,
    ProcessedEvent,
    DataSource
}

use Timex
require Logger

start_time = Time.now
Logger.configure([level: :info])
Project.run()
User.run()
ProjectUser.run()
ProjectGame.run()
ProjectUserGame.run()
PokerGame.run()
DataSource.run()
ProcessedEvent.run()
Payment.run()
Gt.Task.log_time_diff(start_time, Time.now)
