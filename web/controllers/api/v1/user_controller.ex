defmodule Gt.Api.V1.UserController do
    use Gt.Web, :controller

    alias Gt.User
    alias Gt.SessionController

    plug Guardian.Plug.EnsureAuthenticated, on_failure: { SessionController, :unauthenticated_api }

    def index(conn, _params) do
        users = Repo.all(User)
        json(conn, %{ data: users, current_user: Guardian.Plug.current_resource(conn) })
    end
end
