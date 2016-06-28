defmodule Gt.PageController do
    use Gt.Web, :controller

    plug :scrub_params, "auth" when action in [:auth]

    def auth(conn, %{"auth" => auth_params}) do
        case Gt.User.signin(auth_params) do
            {:ok, user} -> {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
            conn
            |> put_status(:created)
            |> render("show.json", jwt: jwt, user: user)

            :error ->
            conn
            |> put_status(:unprocessable_entity)
            |> render("error.json")
        end
    end
    def index(conn, _params) do
        initial_state = %{}
        props = %{
            "location" => conn.request_path,
            "initial_state" => initial_state
        }

        result = Gt.ReactIO.json_call!(%{
            component: "./priv/static/server/js/app.js",
            props: props,
        })

        render(conn, "index.html", html: result["html"], props: initial_state)
    end

    def delete(conn, _) do
        {:ok, claims} = Guardian.Plug.claims(conn)

        conn
        |> Guardian.Plug.current_token
        |> Guardian.revoke!(claims)

        conn
        |> render("delete.json")
    end

    def unauthenticated(conn, _params) do
        conn
        |> put_status(:forbidden)
        |> render(PhoenixTrello.SessionView, "forbidden.json", error: "Not Authenticated")
    end
end
