import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "History Project API",
      version: "1.0.0",
      description: "API сервера проекта по истории",
    },
  },
  apis: [
    "./src/routes/*.ts",
    "./src/modules/*/schemas/**/*.ts",
    "./src/types/interfaces/http/*.ts"
  ], // пути к файлам с комментариями
});