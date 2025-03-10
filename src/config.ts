export const config = {
    MONGO_URI: process.env.NODE_ENV === 'test'
        ? "mongodb://localhost:27017/blog_test_db"
        : process.env.MONGO_URI ?? "mongodb://localhost:27017/blog",
    JWT_SECRET: process.env.JWT_SECRET ?? 'JWT_SECRET',
    PORT: process.env.PORT ?? 5000
}