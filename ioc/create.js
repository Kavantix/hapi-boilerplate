const Inverse = require('inverse')

// rename make to resolve
Inverse.prototype.resolve = Inverse.prototype.make

const initKnex = require('ioc/initKnex')
const initModels = require('ioc/initModels')
const createServer = require('ioc/createServer')

const createIOC = () => {
  const container = new Inverse()

  container.singleton('config', () => (require('config')))
  container.singleton('knex', initKnex)
  container.singleton('models', initModels)

  container.bind('server', createServer)

  return container
}

module.exports = createIOC
