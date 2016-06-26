defmodule Gt.Fixtures.Project do
    alias Gt.Repo
    alias Gt.Model.Project

    @projects [
        {
            "Loto 1",
            "lt1",
            "123",
            "http://loto1.com",
            true,
            "123"
        },
        {
            "Test1",
            "test1",
            "124",
            "http://socslots.com",
            true,
            "124"
        },
        {
            "Loto 2",
            "lt2",
            "130",
            "http://loto2.com/",
            true,
            "130"
        }
    ]

    def run do
        Enum.map(@projects, &insert_project/1)
    end

    def insert_project(project) do
        {title, prefix, item_id, url, enabled, external_id} = project
        Repo.insert!(Project.changeset(%Project{}, %{
            title: title,
            prefix: prefix,
            item_id: item_id,
            url: url,
            enabled: enabled,
            external_id: external_id
        }))
    end
end
