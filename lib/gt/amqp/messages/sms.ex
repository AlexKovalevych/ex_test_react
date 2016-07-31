defmodule Gt.Amqp.Messages.Sms do
    @sender Application.get_env(:gt, :amqp)
    |> Keyword.fetch!(:producers)
    |> Keyword.fetch!(:iqsms)
    |> Map.get(:sender)

    defstruct phone: nil, text: nil, clientId: nil, sender: @sender
end
