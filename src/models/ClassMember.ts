import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface ClassMemberAttributes {
  id: number;
  class_id: number;
  user_id: number;
  role: 'instructor' | 'student';
  joined_at: Date;
}

type ClassMemberCreationAttributes = Optional<
  ClassMemberAttributes,
  'id' | 'joined_at'
>;

export class ClassMember
  extends Model<ClassMemberAttributes, ClassMemberCreationAttributes>
  implements ClassMemberAttributes
{
  public id!: number;
  public class_id!: number;
  public user_id!: number;
  public role!: 'instructor' | 'student';
  public joined_at!: Date;
}

ClassMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('instructor', 'student'),
      allowNull: false,
      defaultValue: 'student',
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Class_Members',
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

export default ClassMember;
