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
        current_user = socket.assigns.current_user
        settings = current_user.settings
        project_ids = Gt.Manager.Permissions.get(current_user.permissions, "dashboard_index")
        |> Enum.map(fn id ->
            {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
            object_id
        end)
        stats = Gt.Manager.Dashboard.get_stats(
            String.to_atom(settings["dashboardPeriod"]),
            settings["dashboardComparePeriod"],
            project_ids
        )
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
