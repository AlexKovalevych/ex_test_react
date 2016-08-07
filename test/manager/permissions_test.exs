defmodule Gt.ManagerCase.Permissions do
    use ExUnit.Case, async: true
    alias Gt.Manager.Permissions

    @tag :unit
    test "get_all" do
        permissions = %{
            "dashboard" => %{
                "dashboard_index" => [],
            },
            "finance" => %{
                "payment_systems" => [],
                "payments_check" => []
            }
        }

        assert Permissions.get_all(permissions, ["dashboard_index", "payment_systems", "payments_check"])
    end

    @tag :unit
    test "has" do
        permissions = %{
            "dashboard_index" => ["1", "3"],
            "finance" => %{
                "payment_systems" => ["1", "2"],
                "payments_check" => ["1", "2"]
            }
        }

        assert Permissions.has(permissions, "dashboard", "1")
        assert Permissions.has(permissions, "dashboard_index", "1")
        assert Permissions.has(permissions, "dashboard", "10") == false
        assert Permissions.has(permissions, "dashboard_index", "10") == false
        assert Permissions.has(permissions, "finance", "1")
        assert Permissions.has(permissions, "payment_systems", "1")
        assert Permissions.has(permissions, "payments_check", "2")
        assert Permissions.has(permissions, "invalid", "10") == false
        assert Permissions.has([], "invalid", "10") == false
    end

    @tag :unit
    test "add" do
        permissions = %{
            "dashboard_index" => [],
            "finance" => %{
                "payments_check" => [],
                "payment_systems" => []
            }
        }

        assert Permissions.has(Permissions.add(permissions, "dashboard", "1"), "dashboard", "1")
        assert Permissions.has(Permissions.add(permissions, "dashboard_index", "1"), "dashboard_index", "1")
        assert Permissions.has(
            Permissions.add(permissions, ["payments_check", "payment_systems"], "1"),
            "payment_systems",
            "1"
        )
        assert Permissions.has(
            Permissions.add(permissions, "payment_systems", ["1", "2"]),
            "payment_systems",
            "2"
        )
        multiple_permissions = Permissions.add(permissions, ["payments_check", "payment_systems"], ["1", "2"])
        assert Permissions.has(multiple_permissions, "payments_check", "1")
        assert Permissions.has(multiple_permissions, "payments_check", "2")
        assert Permissions.has(multiple_permissions, "payment_systems", "1")
        assert Permissions.has(multiple_permissions, "payment_systems", "2")
    end

    @tag :unit
    test "remove" do
        permissions = %{
            "dashboard" => %{
                "dashboard_index" => ["2"],
            },
            "finance" => %{
                "payments_check" => ["1", "3"],
                "payment_systems" => ["5", "10"]
            }
        }

        assert Permissions.has(permissions, "dashboard_index", "2")
        updated_permissions = Permissions.remove(permissions, "dashboard_index", "2")
        assert Permissions.has(updated_permissions, "dashboard_index", "2") == false

        assert Permissions.has(permissions, "payments_check", "1")
        updated_permissions = Permissions.remove(permissions, "payments_check", "1")
        assert Permissions.has(updated_permissions, "payments_check", "1") == false

        assert Permissions.has(permissions, "payment_systems", "5")
        updated_permissions = Permissions.remove(permissions, "payment_systems", "6")
        assert Permissions.has(updated_permissions, "payment_systems", "5")
    end
end
