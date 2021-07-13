const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql")

const Task = require("./models/task")
const User = require("./models/user")
const Comment = require("./models/comment")
const TaskStateEnumType = require("./taskStateEnumType")

const TaskType = new GraphQLObjectType({
  name: "Task",
  description: "This represents a task to be done by a user",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(TaskStateEnumType) },
    userId: { type: GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve: async(task) => {
        return await User.findById(task.userId)
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async(task) => {
        return await Comment.find({"taskId" : { $in : [task.id]}})
      }
    },
    subtasks: {
      type: new GraphQLList(TaskType),
      resolve: async(task) => {
        return await Task.find({"parentId" : { $in : [task.id]}})
      }
    }
  })
})
  
const UserType = new GraphQLObjectType({
  name: "User",
  description: "This represents user of a task",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: async(user) => {
        return await Task.find({"userId" : { $in : [user.id]}})
      }
    }
  })
})

const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "This represent comments of tasks",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    taskId: { type: GraphQLNonNull(GraphQLString) },
    task: {
      type: TaskType,
      resolve: async(comment) => {
        return await Task.findById(comment.taskId)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    task: {
      type: TaskType,
      description: "Returns a Single Task",
      args: {
        id: { type: GraphQLString }
      },
      resolve: async(parent, args) => await Task.findById(args.id)
    },
    tasks: {
      type: new GraphQLList(TaskType),
      description: "Returns List of All Tasks",
      resolve: async() => {
      return Task.find( { parentId : { $exists: false } } )
      }
    },
    user: {
      type: UserType,
      description: "Returns a Single User",
      args: {
        id: { type: GraphQLString }
      },
      resolve: async(parent, args) => await User.findById(args.id)
    },
    users: {
      type: new GraphQLList(UserType),
      description: "Returns List of All Users",
      resolve: async() => await User.find()
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addTask: {
      type: TaskType,
      description: "Adds a task",
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLNonNull(GraphQLString) },
        parentId: { type: GraphQLString }
      },
      resolve: async(parent, args) => {
        return await Task.create({title: args.title, description: args.description, status: 0, userId: args.userId, parentId: args.parentId });
      }
    },
    updateTaskStatus: {
      type: TaskType,
      description: "Updates Status of a task",
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        // status: { type: GraphQLNonNull(GraphQLString) }
        status: { type: new GraphQLNonNull(TaskStateEnumType) },
      },
      resolve: async(parent, args) => {
        await Task.update({_id: args.id}, { status: args.status })
        return { id: args.id }
      }
    },
    deleteTask: {
      type: TaskType,
      description: "Deletes a task",
      args: {
        id: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async(parent, args) => {
        return await Task.findByIdAndDelete(args.id)
      }
    },
    addUser: {
      type: UserType,
      description: "Adds a user",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async(parent, args) => {
        return await User.create({ name: args.name, email: args.email })
      }
    },
    addComment: {
      type: CommentType,
      description: "Adds a comment",
      args: {
        content: { type: GraphQLNonNull(GraphQLString) },
        taskId: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async(parent, args) => {
        return await Comment.create({ content: args.content, taskId: args.taskId })
      }
    }
  })
})

module.exports.RootQueryType = RootQueryType;
module.exports.RootMutationType = RootMutationType;