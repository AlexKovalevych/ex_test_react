defmodule Gt.Router do
    use Gt.Web, :router

    pipeline :browser do
        plug :accepts, ["html"]
        plug :fetch_session
        plug :fetch_flash
        plug :protect_from_forgery
        plug :put_secure_browser_headers
    end

    pipeline :app do
        plug Guardian.Plug.VerifySession
        plug Guardian.Plug.LoadResource
    end

    scope "/app", Gt do
        pipe_through [:browser, :app]

        get "/logout", AppController, :logout
        get "/*path", AppController, :index
    end

    scope "/", Gt do
        pipe_through :browser # Use the default browser stack
        get "/*path", PageController, :index
    end

    # scope "/api/v1", Gt.Api.V1 do
    #     pipe_through [:api, :api_auth]
    #
    #     resources "/login", SessionController
    # end
end
