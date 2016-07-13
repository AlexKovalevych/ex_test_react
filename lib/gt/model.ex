defmodule Gt.Model do
    def object_id(id) do
        {:ok, mongo_id} = Mongo.Ecto.ObjectID.dump(id)
        mongo_id
    end

    def id_to_string(id) do
        Base.encode16(id.value, case: :lower)
    end

    defmacro __using__(_) do
        quote do
            use Ecto.Model
            @primary_key {:id, :binary_id, autogenerate: true}
            # @foreign_key_type :string # For associations
        end
    end
end
