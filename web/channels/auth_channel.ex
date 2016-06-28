defmodule Gt.AuthChannel do
    use Gt.Web, :channel

    alias Gt.Model.User

    # intercept ["shout"]

    # def join("auth", _params, socket) do
    #     {:ok, socket}
    # end

    # # Deny joining the channel if the user isn't authenticated
    # def join("authorized:lobby", _, socket) do
    #     {:error, %{error: "not authorized, are you logged in?"}}
    # end

    # Channels can be used in a request/response fashion
    # by sending replies to requests from the client
    # def handle_in("login", params, socket) do
    #     response = case User.signin(params) do
    #         {:ok, user} ->
    #             assign(socket, :user, user.id)
    #             # Mix.shell.info socket.assigns[:user]

    #             {:ok, %{:token => get_sl_token(user), :user => user}}
    #         {:error, error} -> {:error, %{"error" => error}}
    #     end
    #     {:reply, response, socket}
    # end

    # def handle_in("dashboard", params, socket) do
    #     Mix.shell.info socket.assigns
    #     # case Guardian.decode_and_verify(params.jwt) do
    #     #     { :ok, claims } -> Mix.shell.info(claims)
    #     #     { :error, reason } -> Mix.shell.info(reason)
    #     # end
    #     # send(self, :after_join)
    #     {:ok, socket}
    # end

    # defp get_sl_token(user) do
    #     ttl = {10, :seconds}
    #     {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :disposable, %{"ttl" => ttl})
    #     jwt
    # end
end
