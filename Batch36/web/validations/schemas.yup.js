const yup = require('yup');

const loginSchema = yup
  .object({
    body: yup.object({
      username: yup.string().email().required(),
      password: yup.string().min(3).max(31).required(),
    }),
    params: yup.object({}),
  })
  .required();

const registerSchema = yup
  .object({
    body: yup.object({
      username: yup.string().email().required(),
      password: yup.string().min(3).max(31).required(),
      name: yup.string().min(3).max(31).required(),
    }),
    params: yup.object({}),
  })
  .required();

module.exports = {
  loginSchema,
  registerSchema,
};
