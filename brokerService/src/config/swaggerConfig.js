const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const swaggerOptions = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "ADS-B RESTful Data Exchange Broker API",
         version: "1.0.0",
         description: "API documentation for the ADS-B RESTful Data Exchange Broker Service",
      },
      servers: [
         {
            url: "http://localhost:3000",
         },
      ],
   },
   apis: ["./src/routes/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

module.exports = { swaggerUi, swaggerDocs }
