require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { graphqlHTTP } = require("express-graphql")
const { GraphQLSchema } = require("graphql")
const { RootQueryType, RootMutationType } = require("./graphql")

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}))

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

mongoose
  .connect(process.env.MONGO_URI, options)
  .then(() => app.listen(process.env.PORT, console.log(`Server is running on ${process.env.PORT}`)))
  .catch(error => {
    throw error
  })