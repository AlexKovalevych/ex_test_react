defmodule Gt.Manager.TwoFactor do
    import Plug.Conn
    import Ecto.Changeset

    @failed_login_limit 6

    def fully_authenticated(conn) do
        user_id = get_session(conn, :current_user)
        is_two_factor = get_session(conn, :two_factor)
        !is_nil(user_id) && !is_nil(is_two_factor)
    end

    def verify_code(user, code) do
        if user.failedLoginCount > @failed_login_limit do
            {:error, "login.disabled"}
        else
            case user.code == code do
                true ->
                    user
                    |> change(%{failedLoginCount: 0})
                    |> apply_changes
                    Gt.Repo.update(user)
                    :ok
                false ->
                    changeset = %{failedLoginCount: user.failedLoginCount + 1}
                    changeset = case changeset.failedLoginCount > @failed_login_limit do
                        true -> Map.put(changeset, :enabled, false)
                        false -> changeset
                    end
                    user
                    |> change(changeset)
                    |> apply_changes
                    |> Gt.Repo.update
                    {:error, "login.invalid_sms_code"}
            end
        end
    end
end
