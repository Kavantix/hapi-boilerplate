const Joi = require('@hapi/joi')
const { payloadValidation, responseValidation } = require('models/post')
const Boom = require('@hapi/boom')

module.exports = {
  get: {
    description: 'List all posts on the server',
    tags: ['post'],
    response: {
      // validate using the scheme defined in the model
      schema: Joi.array().items(responseValidation),
    },
    plugins: {
      hapiCrudAcl: {
        permissions: ['post:write'],
      },
    },
    async handler(request, h) {
      const { ioc } = request.server.app
      const Post = ioc.resolve('models').post

      const posts = await Post.query()
      return h.response(posts).code(200)
    },
  },
  post: {
    description: 'Create a new post on the server',
    tags: ['api', 'post'],
    validate: {
      // validate using the scheme defined in the model
      payload: payloadValidation,
    },
    response: {
      // validate using the scheme defined in the model
      schema: responseValidation,
    },
    plugins: {
      hapiCrudAcl: {
        permissions: ['post:read'],
      },
    },
    async handler(request, h) {
      const { ioc } = request.server.app
      const Post = ioc.resolve('models').post

      let post
      try {
        // insert the interested persons data into the database
        post = await Post.query().insert(request.payload)
      } catch (error) {
        request.log('error', error)
        throw new Boom('Error while inserting')
      }

      // return the wanted object
      return h.response(post).code(201)
    },
  },
}
