defmodule Gt.UserChannel do
    use Gt.Web, :channel

    def join("users:" <> user_id, _params, socket) do
        current_user = socket.assigns.current_user
        if user_id == current_user.id do
            {:ok, socket}
        else
            {:error, %{reason: "Invalid user"}}
        end
    end
end
