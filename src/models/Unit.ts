import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface UnitAttributes {
  id: number;
  class_id: number;
  sort_order: number;
  name: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

type UnitCreationAttributes = Optional<
  UnitAttributes,
  'id' | 'description' | 'created_at' | 'updated_at' | 'deleted_at'
>;

class Unit
  extends Model<UnitAttributes, UnitCreationAttributes>
  implements UnitAttributes
{
  public id!: number;
  public class_id!: number;
  public sort_order!: number;
  public name!: string;
  public description!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Unit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'Units',
    timestamps: true,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export default Unit;
