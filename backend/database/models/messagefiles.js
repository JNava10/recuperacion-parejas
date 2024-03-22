'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class MessageFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Message)
    }
  }
  MessageFile.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    message: DataTypes.INTEGER,
    file_link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MessageFile',
    tableName: 'message_files'
  });
  return MessageFile;
};