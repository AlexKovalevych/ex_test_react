defmodule Gt.CurrentUserView do
     use Gt.Web, :view

    def render("show.json", %{user: user}) do
        user
    end

    def render("error.json", _) do
    end
end
