defmodule Gt.PermissionsController do
    use Gt.Web, :controller
    require Gt.AuthController
    alias Gt.Manager.Permissions

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def index(conn, _) do
        initial_state = %{
            permissions: Permissions.load()
        }
        Gt.AuthController.render_react(conn, initial_state, true)
    end
end
