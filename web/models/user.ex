defmodule Gt.Model.User do
    use Gt.Web, :model

    @derive {Poison.Encoder, only: [:id, :email, :permissions, :settings, :is_admin]}

    @collection "users"

    schema @collection do
        field :email, :string
        field :password, :string
        field :password_plain, :string, virtual: true
        field :permissions, :map
        field :settings, :map, default: %{
            "dashboardSort" => "paymentsAmount",
            "dashboardChartType" => "paymentsAmount",
            "dashboardPeriod" => "month",
            "dashboardComparePeriod" => -1
        }
        field :is_admin, :boolean, default: false

        timestamps
    end

    @required_fields ~w(email password_plain permissions settings is_admin)
    @optional_fields ~w(password)

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
        |> validate_format(:email, ~r/@/, message: "Email format is not valid")
        |> validate_length(:password_plain, min: 4, message: "Password should be 5 or more characters long")
        |> validate_confirmation(:password_plain, message: "Password confirmation doesn’t match")
        |> unique_constraint(:email, message: "This email is already taken")
        |> cs_encrypt_password()
    end

    # def signup(params) do
    #     %__MODULE__{}
    #     |> changeset(params)
    #     |> Repo.insert()
    # end

    def signin(params) do
        email = Map.get(params, "email", "")
        email = if is_nil(email), do: "", else: email
        password = Map.get(params, "password", "")
        password = if is_nil(password), do: "", else: password
        __MODULE__
        |> Repo.get_by(email: String.downcase(email))
        |> check_password(password)
    end

    defp cs_encrypt_password(%Ecto.Changeset{valid?: true, changes: %{password_plain: pwd}} = cs) do
        put_change(cs, :password, Comeonin.Bcrypt.hashpwsalt(pwd))
    end
    defp cs_encrypt_password(cs), do: cs

    defp check_password(%__MODULE__{password: hash} = user, password) do
        case Comeonin.Bcrypt.checkpw(password, hash) do
            true -> {:ok, user}
            false -> {:error, "Invalid email or password"}
        end
    end
    defp check_password(nil, _password) do
        if Mix.env == :prod do
            Comeonin.Bcrypt.dummy_checkpw()
        end
        {:error, "Invalid email or password"}
    end

    def by_id(query, user_id) do
        from u in query,
        where: u.id == ^user_id,
        limit: 1
    end
end
