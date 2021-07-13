const { GraphQLEnumType } = require("graphql")

const TaskStateEnumType = new GraphQLEnumType({
  name: "TaskStateEnum",
  values: {
    NOT_STARTED: {
      value: 0,
    },
    IN_PROGRESS: {
      value: 1,
    },
    DONE: {
      value: 2,
    }
  }
})

module.exports = TaskStateEnumType


