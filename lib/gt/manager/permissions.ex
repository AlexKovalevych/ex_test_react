defmodule Gt.Manager.Permissions do
    def get(name, []) do
        nil
    end
    def get(name, [head | tail]) do
        block_permission = get_block_permission(name, head)
        case block_permission do
            nil -> get(name, tail)
            _ -> block_permission
        end
    end

    defp get_node_permission(name, [head | tail]) do
        cond do
            head.name == name -> head
            Enum.count(tail) > 0 -> get_node_permission(name, tail)
            true -> nil
        end
    end

    defp get_block_permission(name, block) do
        cond do
            block.name == name -> block
            true -> get_node_permission(name, block.children)
        end
    end

    def has(name, project_id, permissions) do
        permission = get(name, permissions)
        if !is_nil(permission) do
            Enum.member?(permission.projects, project_id)
        else
            false
        end
    end

    def insert(name, project_id, permissions) when is_bitstring(project_id) and is_bitstring(name) do
        Enum.map(permissions, fn permission ->
            if permission.name == name do
                if Map.has_key?(permission, :projects) do
                    Map.update!(permission, :projects, fn v -> v ++ [project_id] end)
                else
                    permission
                end
            else
                Map.update!(permission, :children, fn children ->
                    Enum.map(children, fn child ->
                        if child.name == name do
                            Map.update!(child, :projects, fn v -> v ++ [project_id] end)
                        else
                            child
                        end
                    end)
                end)
            end
        end)
    end
    def insert(name, [head | tail], permissions) when is_bitstring(name) do
        updated_permissions = insert(name, head, permissions)
        insert(name, tail, updated_permissions)
    end
    def insert(_, [], permissions) do
        permissions
    end
    def insert([], _, permissions) do
        permissions
    end
    def insert([head | tail], project_id, permissions) when is_bitstring(project_id) do
        updated_permissions = insert(head, project_id, permissions)
        insert(tail, project_id, permissions)
    end
    def insert([name | name_tail], [project_id | project_id_tail], permissions) do
        updated_permissions = insert(name, [project_id] ++ project_id_tail, permissions)
        insert(name_tail, [project_id] ++ project_id_tail, updated_permissions)
    end

    def remove(name, project_id, permissions) do
        Enum.map(permissions, fn permission ->
            if permission.name == name do
                Map.update!(permission, :projects, fn v -> List.delete(v, project_id) end)
            else
                Map.update!(permission, :children, fn children ->
                    Enum.map(children, fn child ->
                        if child.name == name do
                            Map.update!(child, :projects, fn v -> List.delete(v, project_id) end)
                        else
                            child
                        end
                    end)
                end)
            end
        end)
    end
end
