import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface SubunitAttributes {
  id: number;
  unit_id: number;
  name: string;
  description?: string | null;
  content?: any | null;
  materials_path?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
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
  public name!: string;
  public description!: string | null;
  public content!: any | null;
  public materials_path!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Subunit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    unit_id: { type: DataTypes.INTEGER, allowNull: false },
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
