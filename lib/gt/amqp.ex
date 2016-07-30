defmodule Gt.Amqp do
    use GenServer
    use AMQP

    @sms_exchange "reactions"
    @sms_queue "send_sms_iqsms"
    @sms_routing "sms.iqsms"

    def start_link(state, opts \\ []) do
        GenServer.start_link(__MODULE__, state, opts)
    end

    def init(_opts) do
        rabbitmq_connect
    end

    defp rabbitmq_connect do
        case Connection.open("amqp://guest:guest@localhost") do
          {:ok, conn} ->
            # Get notifications when the connection goes down
            Process.monitor(conn.pid)
            # Everything else remains the same
            {:ok, channel} = Channel.open(conn)
            Basic.qos(channel, prefetch_count: 10)
            Queue.declare(channel, @sms_queue, durable: true)
            Exchange.fanout(channel, @sms_exchange, durable: true)
            Queue.bind(channel, @sms_queue, @sms_exchange)
            {:ok, channel}
          {:error, _} ->
            # Reconnection loop
            :timer.sleep(5000)
            rabbitmq_connect
        end
    end

    def handle_cast({:publish,  message}, channel) do
        Basic.publish(channel, @sms_exchange, @sms_routing, message)
        {:noreply, channel}
    end

    def handle_info({:DOWN, _, :process, _pid, _reason}, _) do
        {:ok, chan} = rabbitmq_connect
        {:noreply, chan}
    end
end
