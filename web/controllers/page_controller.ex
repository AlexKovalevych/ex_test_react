defmodule Gt.PageController do
    use Gt.Web, :controller

    def login(conn, _params) do
        initial_state = %{}
        props = %{
            "location" => conn.request_path,
            "initial_state" => initial_state
        }

        result = Gt.ReactIO.json_call!(%{
            component: "./priv/static/server/js/app.js",
            props: props,
        })

        render(conn, "index.html", html: result["html"], props: Poison.encode!(props))
    end

    def index(conn, _params) do
        conn = conn |> fetch_session
        user = get_session(conn, :current_user)

        if is_nil(user) do
            redirect conn, to: "/login"
        else
            initial_state = %{"auth" => %{"user" => user}}
            props = %{
                "location" => conn.request_path,
                "initial_state" => initial_state
            }

            result = Gt.ReactIO.json_call!(%{
                component: "./priv/static/server/js/app.js",
                props: props,
            })

            render(conn, "index.html", html: result["html"], props: Poison.encode!(props))
        end
    end
end

