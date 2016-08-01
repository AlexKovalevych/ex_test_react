defmodule Gt.UserController do
    use Gt.Web, :controller
    require Gt.AuthController
    # alias Gt.Manager.Dashboard

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def list(conn, _) do
        user = current_user(conn)
        if !user.isAdmin do
            redirect conn, to: "/login"
        else
            # data = Dashboard.load_data(user)
            initial_state = %{
                # "pendingTasks" => 1,
                "auth" => %{"user" => user},
                # "dashboard" => data
            }

            Gt.AuthController.render_react(conn, initial_state)
        end
    end
end
