defmodule Gt.Manager.Permissions do
    def has(permissions, name, project_id) do
        Enum.any?(permissions, fn {block_k, block_v} ->
            Enum.any?(block_v, fn {node_k, node_v} ->
                (block_k == name or node_k == name) and Enum.member?(node_v, project_id)
            end)
        end)
    end

    def add(permissions, name, project_id) when is_bitstring(name) and is_bitstring(project_id) do
        Enum.reduce(permissions, %{}, fn({block_key, node}, acc) ->
            if block_key == name do
                child = Enum.reduce(node, %{}, fn({k, v}, a) ->
                    Map.put(a, k, insert_project_id(v, project_id))
                end)
                Map.put(acc, block_key, child)
            else
                if Map.has_key?(node, name) do
                    child = put_in(node, [name], insert_project_id(node[name], project_id))
                    Map.put(acc, block_key, child)
                else
                    Map.put(acc, block_key, node)
                end
            end
        end)
    end
    def add(permissions, name, [head | tail]) when is_bitstring(name) do
        add(permissions, name, head) |> add(name, tail)
    end
    def add(permissions, [head | tail], project_id) when is_bitstring(project_id) do
        add(permissions, head, project_id) |> add(tail, project_id)
    end
    def add(permissions, _, []) do
        permissions
    end
    def add(permissions, [], _) do
        permissions
    end
    def add(permissions, [name | name_tail], project_ids) when is_list(project_ids) do
        add(permissions, name, project_ids)
        |> add(name_tail, project_ids)
    end

    defp insert_project_id(projects, project_id) do
        case Enum.member?(projects, project_id) do
            true -> projects
            false -> projects ++ [project_id]
        end
    end

    def remove(permissions, name, project_id) do
        Enum.reduce(permissions, %{}, fn({block_key, node}, acc) ->
            if block_key == name do
                child = Enum.reduce(node, %{}, fn({k, v}, a) ->
                    Map.put(a, k, List.delete(v, project_id))
                end)
                Map.put(acc, block_key, child)
            else
                if Map.has_key?(node, name) do
                    child = put_in(node, [name], List.delete(node[name], project_id))
                    Map.put(acc, block_key, child)
                else
                    Map.put(acc, block_key, node)
                end
            end
        end)
    end

    def get(permissions, name) do
        Enum.reduce(permissions, [], fn ({_, node}, acc) ->
            if Enum.count(acc) > 0 do
                acc
            else
                Enum.reduce(node, [], fn ({k, v}, acc) ->
                    cond do
                        k == name -> v
                        true -> acc
                    end
                end)
            end
        end)
    end
end
