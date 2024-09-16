import { errorMessage } from "./types"

export const contentResponse = [
  200,
  500
] as const

export const noContentResponse = [
  201,
  203,
  204,
  304,
  400,
  401,
  403,
  404,
] as const

export const commonResponses = {
  201: {
    description: 'The request succeeded, and a new resource was created as a result.'
  },
  204: {
    description:'No content'
  },
  304: {
    description: 'Not modified'
  },
  400: {
    description: 'Bad request'
  },
  401: {
    description: 'The client must send a valid jwt on the Authentication header'
  },
  403: {
    description: 'The client does not have permission to use this route'
  },
  404: {
    description: 'Not found'
  },
  500: {
    content: {
      "application/json": {
        schema: errorMessage  
      }
    },
    description: "Internal server error"
  }
}