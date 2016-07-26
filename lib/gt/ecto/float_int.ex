defmodule Ecto.Type.FloatInt do
    @behaviour Ecto.Type

    def type, do: :float

    def cast(value), do: {:ok, value}

    def load(value) when is_integer(value) do
        {:ok , value / 1}
    end
    def load(value), do: {:ok, value}

    def dump(value), do: {:ok, value}
end
