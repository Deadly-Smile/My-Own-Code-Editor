/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const UsersAPI = createApi({
  reducerPath: "users",

  baseQuery: fetchBaseQuery({
    baseUrl: `https://judge0-ce.p.rapidapi.com`,
    prepareHeaders: (headers) => {
      headers.set(
        "x-rapidapi-key",
        "9a6b59aeb2msh873db0a1336877dp1fd116jsnf278552906cc"
      );
      headers.set("x-rapidapi-host", "judge0-ce.p.rapidapi.com");
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      getSubmissionResult: builder.query({
        providesTags: (result, error, arg) => {
          const tags = [{ type: "result" }];
          return tags;
        },
        query: () => {
          if (localStorage.getItem("last_code_token")?.length > 0) {
            return {
              url: `/submissions/${localStorage.getItem("last_code_token")}`,
              params: {
                base64_encoded: "true",
                fields: "*",
              },
              method: "GET",
            };
          }
        },
      }),
      getLanguages: builder.query({
        query: () => `/languages`,
      }),
      submitCode: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          if (result.token) {
            localStorage.setItem("last_code_token", result.token);
          }
          const tags = [{ type: "result" }];
          return tags;
        },
        query: ({ languageId, sourceCode, input, expectedOutput }) => {
          localStorage.setItem("source_code", sourceCode);
          localStorage.setItem("input", input);
          localStorage.setItem("expected_output", expectedOutput);
          return {
            url: "/submissions",
            params: {
              base64_encoded: "true",
              wait: "false",
              fields: "*",
            },
            body: {
              language_id: languageId,
              source_code: btoa(sourceCode),
              stdin: btoa(input),
              expected_output: btoa(expectedOutput),
            },
            method: "POST",
          };
        },
      }),
    };
  },
});

export const {
  useGetLanguagesQuery,
  useSubmitCodeMutation,
  useGetSubmissionResultQuery,
} = UsersAPI;
export { UsersAPI };
