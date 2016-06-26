defmodule Gt.ManagerCase.Permissions do
    use ExUnit.Case, async: true
    alias Gt.Manager.Permissions

    @tag :unit
    test "has" do
        permissions = [
            %{
                :name => "dashboard",
                :projects => ["1", "2", "3"],
                :children => [
                    %{:name => "dashboard_index", :projects => ["1", "3"]}
                ]
            }
        ]
        assert Permissions.has("dashboard", "1", permissions)
        assert Permissions.has("dashboard_index", "1", permissions)
        assert Permissions.has("dashboard", "10", permissions) == false
        assert Permissions.has("dashboard_index", "10", permissions) == false
        assert Permissions.has("invalid", "10", permissions) == false
        assert Permissions.has("invalid", "10", []) == false
    end

    @tag :unit
    test "insert" do
        permissions = [
            %{
                :name => "dashboard",
                :projects => [],
                :children => [
                    %{:name => "dashboard_index", :projects => []}
                ]
            }
        ]
        assert Permissions.has("dashboard", "1", Permissions.insert("dashboard", "1", permissions))
        assert Permissions.has("dashboard_index", "1", Permissions.insert("dashboard_index", "1", permissions))
    end

    @tag :unit
    test "remove" do
        permissions = [
            %{
                :name => "dashboard",
                :projects => ["1"],
                :children => [
                    %{:name => "dashboard_index", :projects => ["2"]}
                ]
            }
        ]
        assert Permissions.has("dashboard", "1", permissions)
        updated_permissions = Permissions.remove("dashboard", "1", permissions)
        assert Permissions.has("dashboard", "1", updated_permissions) == false

        assert Permissions.has("dashboard_index", "2", permissions)
        updated_permissions = Permissions.remove("dashboard_index", "2", permissions)
        assert Permissions.has("dashboard_index", "2", updated_permissions) == false
    end
end
