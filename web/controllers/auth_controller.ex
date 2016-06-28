defmodule Gt.AuthController do
    use Gt.Web, :controller

    plug :scrub_params, "auth" when action in [:auth]

    def auth(conn, %{"auth" => auth_params}) do
        case Gt.Model.User.signin(auth_params) do
            {:ok, user} -> {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)

            conn
            |> put_status(:created)
            |> render("show.json", jwt: jwt, user: user)

            {:error, message} ->
            conn
            |> put_status(:unprocessable_entity)
            |> render("error.json")
        end
    end

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

        render(conn, "index.html", html: result["html"], props: initial_state)
    end

    def index(conn, _params) do
        current_token = Guardian.Plug.current_token(conn)
        user = case current_token do
            nil -> nil
            _ ->
                case Guardian.decode_and_verify(current_token) do
                    {:ok, claims} ->
                        case GuardianSerializer.from_token(claims["sub"]) do
                            {:ok, user} -> user
                            _ -> nil
                        end
                    _ -> nil
                end
        end

        if is_nil(user) do
            redirect conn, to: "/login"
        else
            initial_state = %{"user" => user}
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
        |> render(Gt.AuthView, "forbidden.json", error: "Not Authenticated")
    end
end
