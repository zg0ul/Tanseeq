"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/projects/ProjectCard";
import TaskCard from "@/components/projects/TaskCard";
import UserCard from "@/components/projects/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="p-8">
      <Header name="Search" />
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for tasks, projects or users..."
          className="w-full max-w-2xl rounded-lg border border-gray-200 p-3 shadow focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          onChange={handleSearch}
        />
      </div>
      <div className="space-y-8">
        {isLoading && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        )}
        {isError && (
          <p className="text-center text-red-500">
            Error occurred while fetching search results.
          </p>
        )}
        {!isLoading && !isError && searchResults && (
          <>
            {/* Tasks Section */}
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Tasks
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {searchResults.tasks?.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {searchResults.projects && searchResults.projects?.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Projects
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {searchResults.projects?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Users Section */}
            {searchResults.users && searchResults.users?.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Users
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {searchResults.users?.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
