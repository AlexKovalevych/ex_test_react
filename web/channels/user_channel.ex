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

    def handle_in("dashboard", params, socket) do
        # response = case User.signin(params) do
        #     {:ok, user} ->
        #         assign(socket, :user, user.id)
        #         # Mix.shell.info socket.assigns[:user]

        #         {:ok, %{:token => get_sl_token(user), :user => user}}
        #     {:error, error} -> {:error, %{"error" => error}}
        # end
        {:reply, {:ok, %{"message" => "HELLO"}}, socket}
    end
end
