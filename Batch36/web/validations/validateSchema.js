const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message, provider: 'yup' });
  }
};

module.exports = {
  validateSchema,
};
