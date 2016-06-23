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

config :joken, config_module: Guardian.JWT

config :guardian, Guardian,
    allowed_algos: ["HS512"], # optional
    verify_module: Guardian.JWT,  # optional
    issuer: "Gt",
    ttl: { 10, :days },
    verify_issuer: true, # optional
    secret_key: %{
        "crv" => "P-521",
        "d" => "axDuTtGavPjnhlfnYAwkHa4qyast352j25dseppXEzmKpQyY0xd3bGpYLEF4ognDpRJm5IRaM31Id2NfEtDFw4iTbDSE",
        "kty" => "EC",
        "x" => "AL0H8OvP5NuboUoj8Pb3zpBcDyEJN907wM32j52hc5h235xrCy7H2062i3IRPF5NQ546jIJU3uQX5KN2QB_Cq6R_SUqyVZSNpIfC",
        "y" => "ALdxLuo6oKLoQ-xLSkShv_TA0di97I9V92sg1MKFava5hK235j2cc23GST1EKiVQnZMrN3HO8LtLT78SNVUaA-lV"
    },
    serializer: Gt.GuardianSerializer

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
