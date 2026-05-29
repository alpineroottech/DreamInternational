// Validates req.body against a Zod schema, returning 400 with field errors.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "_";
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      return res.status(400).json({ error: "Validation failed", fieldErrors });
    }
    req.validated = result.data;
    return next();
  };
}
