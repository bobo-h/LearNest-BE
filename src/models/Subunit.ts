import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';
import Assignment from './Assignment';

interface SubunitAttributes {
  id: number;
  unit_id: number;
  sort_order: number;
  name: string;
  description?: string | null;
  content?: object | null;
  materials_path?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  assignment?: Assignment[];
}

type SubunitCreationAttributes = Optional<
  SubunitAttributes,
  | 'id'
  | 'description'
  | 'content'
  | 'materials_path'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
>;

class Subunit
  extends Model<SubunitAttributes, SubunitCreationAttributes>
  implements SubunitAttributes
{
  public id!: number;
  public unit_id!: number;
  public sort_order!: number;
  public name!: string;
  public description!: string | null;
  public content!: object | null;
  public materials_path!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
  public assignments?: Assignment[];
}

Subunit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    unit_id: { type: DataTypes.INTEGER, allowNull: false },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.JSON, allowNull: true },
    materials_path: { type: DataTypes.STRING(255), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'Subunits',
    timestamps: true,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export default Subunit;
