# defmodule Gt.DashboardChannel do
#     use Gt.Web, :channel

#     def join("dashboard", _params, socket) do
#         Mix.shell.info socket.assigns
#         # case Guardian.decode_and_verify(params.jwt) do
#         #     { :ok, claims } -> Mix.shell.info(claims)
#         #     { :error, reason } -> Mix.shell.info(reason)
#         # end
#         # send(self, :after_join)
#         {:ok, socket}
#     end

#     # def handle_info(:after_join, socket) do
#     #     push(socket, "init", Reph.Visitors.state())
#     #     {:ok, _} = Reph.Visitors.add()
#     #     {:noreply, socket}
#     # end
#     # def handle_info(%{event: event}, socket) when event in ["add", "remove"] do
#     #     push(socket, event, %{})
#     #     {:noreply, socket}
#     # end

#     # def terminate(_, _) do
#     #     {:ok, _} = Reph.Visitors.remove()
#     #     :ok
#     # end
# end
