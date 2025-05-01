import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Project interface representing a project entity
// Each project has basic information like name, description, and timeframes
export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// Task priority levels as an enum for type safety and consistency
// These values represent different urgency levels for tasks
export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

// Task status options as an enum for type safety and consistency
// These values represent the different stages in a task's lifecycle
export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

// Define the User interface that represents a user in the system
// Users can be authors of tasks, assignees, or team members
export interface User {
  // TODO: Change the userId to a uuid instead of just a number
  userId?: number; // Primary identifier for the user
  username: string; // Display name for the user
  email: string; // User's email address
  profilePictureUrl?: string; // Path to user's profile image
  cognitoId?: string; // External auth ID (AWS Cognito)
  teamId?: number; // ID of the team the user belongs to
}

// Define the Attachment interface for files attached to tasks
// Attachments can be documents, images, or other relevant files
export interface Attachment {
  id: number; // Primary identifier for the attachment
  fileURL: string; // Path to the stored file
  fileName: string; // Original name of the file
  taskId: number; // ID of the task this attachment belongs to
  uploadedById: number; // ID of the user who uploaded this attachment
}

// Define the Task interface which is the core entity for project management
// Tasks represent units of work that need to be completed within projects
export interface Task {
  id: number; // Primary identifier for the task
  title: string; // Short name/title of the task
  description?: string; // Detailed explanation of what the task involves
  status?: Status; // Current status of the task in the workflow
  priority?: Priority; // Importance/urgency level of the task
  tags?: string; // Comma-separated tags for categorization
  startDate?: string; // When work on the task should begin
  dueDate?: string; // Deadline for task completion
  points?: number; // Story points or effort estimation
  projectId: number; // ID of the project this task belongs to
  authorUserId?: number; // ID of the user who created the task
  assignedUserId?: number; // ID of the user responsible for completing the task

  // Relational fields populated by Prisma when using include
  author?: User; // Complete user object of the task creator
  assignee?: User; // Complete user object of the assigned person
  comments?: Comment[]; // List of comments associated with this task
  attachments?: Attachment[]; // List of files attached to this task
}

// Define the SearchResult interface which contains arrays of search results by type
// This interface is used to structure responses from the search endpoint
export interface SearchResult {
  tasks?: Task[]; // Array of tasks matching the search query
  projects?: Project[]; // Array of projects matching the search query
  users?: User[]; // Array of users matching the search query
}

// Create and configure the Redux Toolkit Query API
// This sets up an API client with endpoints for data fetching and mutation
export const api = createApi({
  // Configure the base query with the API URL from environment variables
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),

  // Define a unique key for storing this API's cache in the Redux store
  reducerPath: "api",

  // Define tag types for cache invalidation
  // When mutations happen, we can invalidate specific tags to refetch data
  tagTypes: ["Projects", "Tasks", "Users"],

  // Define all the endpoints for interacting with the backend API
  endpoints: (build) => ({
    // Get all projects
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"], // Cache results with "Projects" tag
    }),

    // Get a specific project by ID
    getProjectById: build.query<Project, number>({
      query: (id) => `projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),

    // Create a new project
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"], // Invalidate "Projects" cache after mutation
    }),

    // Get tasks for a specific project
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      transformResponse: (response: Task[]) => {
        console.log("Raw task data:", response); // Debug log to see raw data
        return response.map((task) => {
          // Log a warning if a task has authorUserId but no author object
          // This helps identify potential issues with backend includes
          if (task.authorUserId && !task.author) {
            console.warn(
              `Task ${task.id} has authorUserId but no author object`,
            );
          }
          return task;
        });
      },
      // Tag results with both the general "Tasks" tag and specific task IDs
      // This enables targeted cache invalidation when specific tasks change
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),

    // Get tasks assigned to a specific user
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),

    // Create a new task
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"], // Invalidate all tasks cache after creation
    }),

    // Update the status of a task
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      // Only invalidate cache for the specific task that was updated
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),

    // Get all users
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"], // Cache results with "Users" tag
    }),

    // Search across tasks, projects, and users
    search: build.query<SearchResult, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

// Export auto-generated React hooks for each endpoint
// These hooks handle loading states, cache, and refetching automatically
export const {
  useGetProjectsQuery, // Hook to fetch all projects
  useCreateProjectMutation, // Hook to create a new project
  useGetTasksQuery, // Hook to fetch tasks for a project
  useCreateTaskMutation, // Hook to create a new task
  useUpdateTaskStatusMutation, // Hook to update a task's status
  useSearchQuery, // Hook to search across entities
  useGetTasksByUserQuery, // Hook to fetch tasks for a user
  useGetUsersQuery, // Hook to fetch all users
} = api;
