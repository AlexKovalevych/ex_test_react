use Mix.Config

webpack = fn(name) ->
    {"node", [
        "node_modules/webpack/bin/webpack.js",
        "--watch-stdin",
        "--colors",
        "--config",
        "webpack.#{name}.js"
    ]}
end

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :gt, Gt.Endpoint,
    http: [port: 4000],
    debug_errors: true,
    code_reloader: true,
    check_origin: false,
    watchers: ["config", "server.config"] |> Enum.map(&(webpack.(&1)))

# Watch static and templates for browser reloading.
config :gt, Gt.Endpoint,
    live_reload: [
        patterns: [
            ~r{priv/static/js/.*js$},
            ~r{priv/static/css/.*css$},
            ~r{priv/static/.*(png|jpeg|jpg|gif|svg)$},
            ~r{priv/gettext/.*(po)$},
            ~r{web/views/.*(ex)$},
            ~r{web/templates/.*(eex)$},
            ~r{web/webpack.config.js},
            ~r{web/webpack.server.config.js}
        ]
    ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "$time [$level] $message\n"

# Set a higher stacktrace during development.
# Do not configure such in production as keeping
# and calculating stacktraces is usually expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :gt, Gt.Repo,
    adapter: Mongo.Ecto,
    database: "gt",
    hostname: "localhost",
    pool_size: 10
