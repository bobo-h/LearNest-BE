import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name: string;
  birth_date: string;
  role: 'user' | 'admin';
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public birth_date!: string;
  public role!: 'user' | 'admin';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'Users',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export default User;
