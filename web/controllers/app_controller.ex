defmodule Gt.AppController do
    use Gt.Web, :controller

    plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__

    def index(conn, %{"path" => path}) do
        initial_state = %{}
        props = %{
            "location" => "/app" <> Enum.join(path, "/"),
            "initial_state" => initial_state
        }

        result = Gt.ReactIO.json_call!(%{
            component: "./priv/static/server/js/app.js",
            props: props,
        })

        conn
        |> put_layout("app.html")
        |> render("index.html", html: result["html"], props: initial_state)
    end

    def logout(conn, _params) do
        conn
        |> Guardian.Plug.sign_out()
        |> redirect(to: "/")
    end

    def unauthenticated(conn, _params) do
        redirect(conn, to: "/")
    end
end
