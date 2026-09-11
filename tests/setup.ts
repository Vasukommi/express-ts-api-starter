process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/express_template_test';
process.env.JWT_SECRET = 'test-secret-with-more-than-thirty-two-characters';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.LOG_LEVEL = 'silent';
