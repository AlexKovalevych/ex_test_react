defmodule Gt.PageController do
    use Gt.Web, :controller
    require Gt.AuthController

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def index(conn, _params) do
        user = current_user(conn)
        initial_state = %{"auth" => %{"user" => user}}
        Gt.AuthController.render_react(conn, initial_state)
    end
end

