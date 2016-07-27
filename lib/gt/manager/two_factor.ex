defmodule Gt.Manager.TwoFactor do
    import Plug.Conn

    def fully_authenticated(conn) do
        user_id = get_session(conn, :current_user)
        is_two_factor = get_session(conn, :two_factor)
        !is_nil(user_id) && !is_nil(is_two_factor)
    end

    def verify_code(user, code) do
        true
    end
end
