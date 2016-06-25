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

config :gt,
    permissions: [
        {:block, "dashboard", [
            {:node, "dashboard"}
        ]},
        {:block, "finance", [
            {:node, "payments_check"},
            {:node, "payment_systems"},
            {:node, "incoming_reports"},
            {:node, "funds_flow"},
            {:node, "monthly_balance"}
        ]},
        {:block, "statistics", [
            {:node, "consolidated_report"},
            {:node, "ltv_report"},
            {:node, "segments_report"},
            {:node, "retention"},
            {:node, "activity_waves"},
            {:node, "timeline_report"},
            {:node, "cohorts_report"}
        ]},
        {:block, "calendar_events", [
            {:node, "events_list"},
            {:node, "events_types_list"},
            {:node, "events_groups_list"}
        ]},
        {:block, "players", [
            {:node, "multiaccounts"},
            {:node, "signup_channels"}
        ]},
        {:block, "settings", [
            {:node, "users"},
            {:node, "projects"},
            {:node, "notifications"},
            {:node, "permissions"},
            {:node, "data_sources"},
            {:node, "smtp_servers"}
        ]}
    ]

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