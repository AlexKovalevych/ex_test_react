defmodule Gt.Router do
    use Gt.Web, :router

    pipeline :browser_session do
        plug Guardian.Plug.VerifySession
        plug Guardian.Plug.LoadResource
    end

    pipeline :api do
        plug :accepts, ["json"]
        plug Guardian.Plug.VerifyHeader
        plug Guardian.Plug.LoadResource
    end

    scope "/", Gt do
        pipe_through [:browser, :browser_session] # Use the default browser stack

        get "/login", SessionController, :new, as: :login
        post "/login", SessionController, :create, as: :login
        delete "/logout", SessionController, :delete, as: :logout
        get "/logout", SessionController, :delete, as: :logout
    end

    scope "/", Gt do
        pipe_through :browser # Use the default browser stack

        get "/", PageController, :index
    end

    scope "/api/v1", Gt.Api.V1 do
        pipe_through [:api]

        resources "/users", UserController
    end
end
