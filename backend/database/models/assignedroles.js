'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class AssignedRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Role, {as: 'roleData', foreignKey: 'role'})
    }
  }
  AssignedRole.init({
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      default: new Date(Date.now())
    }
  }, {
    sequelize,
    modelName: 'AssignedRole',
    tableName: 'assigned_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return AssignedRole;
};