defmodule Gt.UserController do
    use Gt.Web, :controller
    require Gt.AuthController
    alias Gt.Manager.Users

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def list(conn, _) do
        user = current_user(conn)
        if !user.is_admin do
            redirect conn, to: "/login"
        else
            initial_state = %{
                pendingTasks: 1,
                auth: %{user: user},
                users: Users.load_users(1)
            }

            Gt.AuthController.render_react(conn, initial_state)
        end
    end

    def create(conn, _) do
        user = current_user(conn)
        if !user.is_admin do
            redirect conn, to: "/login"
        else
            initial_state = %{
                auth: %{user: user}
            }

            Gt.AuthController.render_react(conn, initial_state)
        end
    end

    def edit(conn, %{"id" => id}) do
        current_user = current_user(conn)
        if !current_user.is_admin do
            redirect conn, to: "/login"
        else
            initial_state = %{
                auth: %{user: current_user},
                users: Users.load_users(1) |> Map.put(:user, Gt.Repo.get!(Gt.Model.User, id))
            }

            Gt.AuthController.render_react(conn, initial_state)
        end
    end
end
