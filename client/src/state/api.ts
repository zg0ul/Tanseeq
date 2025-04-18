import { createApi } from "@reduxjs/toolkit/query";
import { createApit, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    // Define your API endpoints here
  }),
});

export const { } = api;