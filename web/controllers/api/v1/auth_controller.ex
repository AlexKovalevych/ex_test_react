defmodule Gt.AuthController do
    use Gt.Web, :controller

    plug :scrub_params, "auth" when action in [:auth]

    def auth(conn, %{"auth" => auth_params}) do
        case Gt.Model.User.signin(auth_params) do
            {:ok, user} ->
                {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
                conn = conn
                |> fetch_session
                |> put_session(:current_user, user)
                conn
                |> put_status(:created)
                |> render("show.json", jwt: jwt, user: user)

            {:error, _} ->
                conn
                |> put_status(:unprocessable_entity)
                |> render("error.json")
        end
    end


    def delete(conn, _) do
        {:ok, claims} = Guardian.Plug.claims(conn)

        conn
        |> clear_session
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
