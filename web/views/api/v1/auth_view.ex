defmodule Gt.Api.V1.AuthView do
    use Gt.Web, :view

    def render("show.json", %{jwt: jwt, user: user}) do
        %{
            jwt: jwt,
            user: user
        }
    end
    def render("show.json", %{url: url, user: user}) do
        %{
            url: url,
            user: user
        }
    end
    def render("show.json", %{user: user}) do
        %{user: user}
    end

    def render("error.json", %{error: error}) do
        %{error: error}
    end

    def render("delete.json", _) do
        %{ok: true}
    end

    def render("forbidden.json", %{error: error}) do
        %{error: error}
    end
end
