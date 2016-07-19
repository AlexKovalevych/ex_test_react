defmodule Gt.DashboardController do
    use Gt.Web, :controller

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def index(conn, _) do
        user = current_user(conn)
        IO.inspect(user)
        # settings = user.settings
        # project_ids = Gt.Manager.Permissions.get(user.permissions, "dashboard_index")
        # projects = Project |> Project.ids(project_ids) |> Repo.all
        # project_ids = Enum.map(project_ids, fn id ->
        #     {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
        #     object_id
        # end)
        # data = Gt.Manager.Dashboard.get_stats(
        #     String.to_atom(settings["dashboardPeriod"]),
        #     settings["dashboardComparePeriod"],
        #     project_ids
        # )

        # initial_state = %{
        #     "auth" => %{"user" => user},
        #     "dashboard" => %{stats: data.stats, periods: data.periods, totals: data.totals, projects: projects}
        # }
        # props = %{
        #     "location" => conn.request_path,
        #     "initial_state" => initial_state,
        #     "user_agent" => conn |> get_req_header("user-agent") |> Enum.at(0)
        # }

        # {:ok, result} = Gt.ReactIO.json_call(%{
        #     component: "./priv/static/server/js/app.js",
        #     props: props,
        # })

        # render(conn, "index.html", html: result["html"], props: Poison.encode!(props))
    end
end
