defmodule Gt.CurrentUserController do
    use Gt.Web, :controller

    plug Guardian.Plug.EnsureAuthenticated, handler: Gt.AuthController

    def show(conn, _) do
        user = Guardian.Plug.current_resource(conn)
        conn
        |> put_status(:ok)
        |> render("show.json", user: user)
    end
end
