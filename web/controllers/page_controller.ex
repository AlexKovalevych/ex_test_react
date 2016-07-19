defmodule Gt.PageController do
    use Gt.Web, :controller

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def index(conn, _params) do
        user = current_user(conn)
        initial_state = %{"auth" => %{"user" => user}}
        props = %{
            "location" => conn.request_path,
            "initial_state" => initial_state,
            "user_agent" => conn |> get_req_header("user-agent") |> Enum.at(0)
        }

        {:ok, result} = Gt.ReactIO.json_call(%{
            component: "./priv/static/server/js/app.js",
            props: props,
        })

        render(conn, "index.html", html: result["html"], props: Poison.encode!(props))
    end
end

