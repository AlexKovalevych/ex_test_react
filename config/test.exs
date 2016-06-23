use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :gt, Gt.Endpoint,
    http: [port: 4001],
    server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :gt, Gt.Repo,
    adapter: Mongo.Ecto,
    database: "gt_test",
    hostname: "localhost",
    pool_size: 10
