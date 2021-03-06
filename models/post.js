const Joi = require('@hapi/joi')

const BaseModel = require('models/baseModel')

class Post extends BaseModel {
  static get tableName() {
    return 'posts'
  }

  // virtualAttributes must be defined, is used in crud route generation
  static get virtualAttributes() {
    return ['titleWithAuthor', ...this.addedProperties]
  }

  get titleWithAuthor() {
    return `${this.title} by ${this.author}`
  }

  /* eslint-disable */
  // we need to add setters to make joi work, as joi does not know these
  // attributes are virtual so tries to set them to its converted value
  set titleWithAuthor(_null) {}
  /* eslint-enable */

  static get baseSchema() {
    return {
      id: Joi.number().min(0).description('The identifier of the post'),
      title: Joi.string()
        .max(20)
        .required()
        .description('The title of the post, maxlength of 20'),
      titleWithAuthor: Joi.string().description(
        'The title of the post including the author',
      ),
      contents: Joi.string()
        .max(500)
        .required()
        .description('The contents of the post, maxlength of 500'),
      author: Joi.string()
        .max(100)
        .required()
        .description('The author of the post, maxlength of 100'),
      createdAt: Joi.date().description('When the post was created'),
      updatedAt: Joi.date().description('When the post was last updated'),
    }
  }

  // used by hapi to validate the payload, see the handler
  static get basePayloadSchema() {
    return {
      title: Post.baseSchema.title,
      contents: Post.baseSchema.contents,
      author: Post.baseSchema.author.optional().default('Anonymous'),
    }
  }

  // used by hapi to validate the response, see the handler
  static get baseResponseSchema() {
    return {
      id: Post.baseSchema.id.required(),
      title: Post.baseSchema.title,
      titleWithAuthor: Post.baseSchema.titleWithAuthor,
      contents: Post.baseSchema.contents,
      author: Post.baseSchema.author.optional().default('Anonymous'),
      createdAt: Post.baseSchema.createdAt.required(),
      updatedAt: Post.baseSchema.updatedAt,
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {}
  }
}

module.exports = Post
