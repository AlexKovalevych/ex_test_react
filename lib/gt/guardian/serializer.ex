defmodule Gt.Guardian.Serializer do
    @behaviour Guardian.Serializer

    alias Gt.{Repo, User}

    def for_token(user = %User{}) do
        {:ok, "User:#{user.id}"}
    end

    def for_token(_) do
        {:error, "Unknown resource type"}
    end

    def from_token("User:" <> id) do
        {:ok, Repo.get(User, String.to_integer(id))}
    end

    def from_token(thing) do
        {:error, "Unknown resource type"}
    end
end
