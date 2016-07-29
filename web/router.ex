defmodule Gt.Router do
    use Gt.Web, :router

    pipeline :browser do
        plug :accepts, ["html"]
        plug :fetch_session
        plug :fetch_flash
        plug :protect_from_forgery
        plug :put_secure_browser_headers
    end

    pipeline :browser_session do
        plug Guardian.Plug.VerifySession
        plug Guardian.Plug.LoadResource
    end

    pipeline :api do
        plug :accepts, ["json"]
        plug Guardian.Plug.VerifyHeader
        plug Guardian.Plug.LoadResource
    end

    pipeline :api_session do
        plug :fetch_session
        plug :put_secure_browser_headers
    end

    scope "/api", Gt do
        pipe_through [:api, :api_session]

        scope "/v1" do
            post "/auth", Api.V1.AuthController, :auth
            post "/two_factor", Api.V1.AuthController, :two_factor
            post "/send_sms", Api.V1.AuthController, :send_sms
            delete "/auth", Api.V1.AuthController, :delete
            get "/current_user", Api.V1.CurrentUserController, :show
        end
    end

    scope "/", Gt do
        pipe_through [:browser, :browser_session] # Use the default browser stack

        get "/login", AuthController, :login
        get "/logout", AuthController, :logout
        get "/", DashboardController, :index
        get "/*path", PageController, :index
    end
end
