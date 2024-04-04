// api-routes/get.js
export default {
  // operation's method
  get: {
    // operation's summary
    summary: 'Get all categories',
    // operation's description
    description: 'Fetch all categories from the database',
    // operation's parameters
    parameters: [],
    // operation's response
    responses: {
      // response code
      200: {
        description: 'List of all categories', // response description
        content: {
          // content-type
          'application/json': {
            schema: {
              type: 'array', // data type
              items: {
                type: 'object', // data type
                properties: {
                  id: {
                    type: 'integer', // data type
                    description: 'The category id', // param desc
                  },
                  name: {
                    type: 'string', // data type
                    description: 'The category name', // param desc
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
