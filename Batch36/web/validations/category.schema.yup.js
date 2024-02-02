const yup = require('yup');

const createCategorySchema = yup
  .object({
    body: yup.object({
      name: yup.string().required(),
      description: yup.string(),
    }),
  })
  .required();

module.exports = {
  createCategorySchema,
};
