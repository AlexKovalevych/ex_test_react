defmodule Gt.Manager.Permissions do
    def remove(value, permissions) when is_bitstring(value) do
        Enum.map(permissions, fn
            {:block, name, children} when name != value -> remove(value, children)
            {_, name} -> List.keydelete(permissions, value, 1)
            {_, name, _} -> List.keydelete(permissions, value, 1)
        end)
    end
    def remove(value, permissions) when is_list(value) do
        Enum.map(permissions, &remove(value, &1))
    end
end
