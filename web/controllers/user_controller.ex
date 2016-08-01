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
end
