defmodule Gt.UserController do
    use Gt.Web, :controller
    require Gt.AuthController
    alias Gt.Manager.Users

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def list(conn, _) do
        initial_state = %{
            users: Users.load_users(1)
        }
        Gt.AuthController.render_react(conn, initial_state, true)
    end

    def create(conn, _) do
        initial_state = %{users: Map.merge(Users.load_users(1), Users.create_user)}
        Gt.AuthController.render_react(conn, initial_state, true)
    end

    def edit(conn, %{"id" => id}) do
        initial_state = %{users: Map.merge(Users.load_users(1), Users.load_user(id))}
        Gt.AuthController.render_react(conn, initial_state, true)
    end
end
