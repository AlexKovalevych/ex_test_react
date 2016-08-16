defmodule Gt.Manager.Projects do
    alias Gt.Model.Project
    alias Gt.Manager.Date, as: GtDate

    @page_size 10

    def load_projects(page, search \\ nil) do
        projects = Project
        projects = case is_nil(search) do
            true -> projects
            false -> projects |> Project.filter_by_title(search)
        end
        %{
            projects: projects |> Project.page(page) |> Gt.Repo.all,
            currentPage: page,
            totalPages: Float.ceil((Project.count(projects) |> Gt.Repo.one) / @page_size),
            lastUpdated: GtDate.timestamp(GtDate.now),
            search: search
        }
    end

    def load_project(id) do
        %{project: Gt.Repo.get!(Project, id)}
    end
end
