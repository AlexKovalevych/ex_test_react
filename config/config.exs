# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :gt, Gt.Endpoint,
    url: [host: "localhost"],
    root: Path.dirname(__DIR__),
    secret_key_base: "A4N0BdJAieRAntLI9bKdNX/7Lv1hvBr4Pdp4QMOBdHjlVkjLAPH9NwKc5jKGYbA+",
    render_errors: [accepts: ~w(html json)],
    pubsub: [name: Gt.PubSub,
            adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
    format: "$time $metadata[$level] $message\n",
    metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
    migration: true,
    binary_id: false

config :guardian, Guardian,
    issuer: "Gt.#{Mix.env}",
    ttl: { 10, :days },
    secret_key: to_string(Mix.env),
    serializer: Gt.GuardianSerializer,
    hooks: GuardianDb
    # permissions: %{
    #     default: [
    #         :read_profile,
    #         :write_profile,
    #         :read_token,
    #         :revoke_token,
    #     ],
    # }

config :guardian_db, GuardianDb,
    repo: Gt.Repo,
    schema_name: "tokens"
