import Sequelize from 'sequelize';

// Import Models
import User from '../app/models/User';

import databaseConfig from '../config/database';

// Array dos models
const models = [User];

class Database {
  constructor() {
    this.init()

  }

  init(){
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();