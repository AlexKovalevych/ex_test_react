defmodule Gt.Router do
    use Gt.Web, :router

    pipeline :browser do
        plug :accepts, ["html"]
        plug :fetch_session
        plug :fetch_flash
        plug :protect_from_forgery
        plug :put_secure_browser_headers
    end

    pipeline :api do
        plug :accepts, ["json"]
        plug Guardian.Plug.VerifyHeader
        plug Guardian.Plug.LoadResource
    end

    scope "/api", Gt do
        pipe_through :api

        scope "/v1" do
            post "/auth", AuthController, :auth
            delete "/auth", AuthController, :delete
            get "/current_user", CurrentUserController, :show
        end
    end

    scope "/", Gt do
        pipe_through :browser # Use the default browser stack

        get "/login", AuthController, :login
        get "/*path", AuthController, :index
    end
end
