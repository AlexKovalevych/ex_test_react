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
            post "/auth", AuthController, :auth
            delete "/auth", AuthController, :delete
            get "/current_user", CurrentUserController, :show
        end
    end

    scope "/", Gt do
        pipe_through [:browser, :browser_session] # Use the default browser stack

        get "/login", PageController, :login
        get "/logout", PageController, :logout
        get "/*path", PageController, :index
    end
end
