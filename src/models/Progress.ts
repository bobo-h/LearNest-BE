import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface ProgressAttributes {
  id: number;
  user_id: number;
  class_id: number;
  unit_id: number;
  subunit_id: number;
  progress_percent: number;
  is_completed: boolean;
  completed_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

type ProgressCreationAttributes = Optional<
  ProgressAttributes,
  | 'id'
  | 'progress_percent'
  | 'is_completed'
  | 'completed_at'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
>;

class Progress
  extends Model<ProgressAttributes, ProgressCreationAttributes>
  implements ProgressAttributes
{
  public id!: number;
  public user_id!: number;
  public class_id!: number;
  public unit_id!: number;
  public subunit_id!: number;
  public progress_percent!: number;
  public is_completed!: boolean;
  public completed_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Progress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    unit_id: { type: DataTypes.INTEGER, allowNull: false },
    subunit_id: { type: DataTypes.INTEGER, allowNull: false },
    progress_percent: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'Progress',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export default Progress;
