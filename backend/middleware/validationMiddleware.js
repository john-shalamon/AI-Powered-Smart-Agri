// Request validation middleware using simple schema validation
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`);
      }

      if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`${field} must be a number`);
      }

      if (rules.type === 'email' && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
      }

      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }

      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }

      if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }

      if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

// Common validation schemas
const userRegistrationSchema = {
  name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 6 },
  role: { required: true, type: 'string', enum: ['farmer', 'buyer', 'transporter'] },
};

const userLoginSchema = {
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 1 },
};

const cropListingSchema = {
  cropName: { required: true, type: 'string', minLength: 2 },
  category: { required: true, type: 'string' },
  quantity: { required: true, type: 'number', min: 0.1 },
  pricePerUnit: { required: true, type: 'number', min: 0.01 },
  quality: { required: true, type: 'string', enum: ['A', 'B', 'C'] },
};

const orderSchema = {
  cropListingId: { required: true, type: 'string' },
  quantity: { required: true, type: 'number', min: 0.1 },
};

module.exports = {
  validate,
  userRegistrationSchema,
  userLoginSchema,
  cropListingSchema,
  orderSchema,
};
