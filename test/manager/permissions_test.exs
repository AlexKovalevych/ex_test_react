defmodule Gt.ManagerCase.Permissions do
    use ExUnit.Case, async: true
    alias Gt.Manager.Permissions

    @tag :unit
    test "has" do
        permissions = %{
            "dashboard" => %{
                "dashboard_index" => ["1", "3"]
            },
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
            "dashboard" => %{
                "dashboard_index" => [],
            },
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
    #
    # @tag :unit
    # test "remove" do
    #     permissions = %{
    #         :dashboard => %{
    #             :projects => ["1"]
    #             :children => %{
    #                 :dashboard_index => %{:projects => ["2"]}
    #             }
    #         }
    #     }
    #
    #     assert Permissions.has("dashboard", "1", permissions)
    #     updated_permissions = Permissions.remove("dashboard", "1", permissions)
    #     assert Permissions.has("dashboard", "1", updated_permissions) == false
    #
    #     assert Permissions.has("dashboard_index", "2", permissions)
    #     updated_permissions = Permissions.remove("dashboard_index", "2", permissions)
    #     assert Permissions.has("dashboard_index", "2", updated_permissions) == false
    # end
end
