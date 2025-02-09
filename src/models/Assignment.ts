import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface AssignmentAttributes {
  id: number;
  subunit_id: number;
  title: string;
  content: object;
  attachment?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

type AssignmentCreationAttributes = Optional<
  AssignmentAttributes,
  'id' | 'attachment' | 'created_at' | 'updated_at' | 'deleted_at'
>;

class Assignment
  extends Model<AssignmentAttributes, AssignmentCreationAttributes>
  implements AssignmentAttributes
{
  public id!: number;
  public subunit_id!: number;
  public title!: string;
  public content!: object;
  public attachment!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Assignment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subunit_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    content: { type: DataTypes.JSON, allowNull: false },
    attachment: { type: DataTypes.STRING(255), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'Assignments',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export default Assignment;
