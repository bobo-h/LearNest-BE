import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface SubmissionAttributes {
  id: number;
  assignment_id: number;
  user_id: number;
  content: object;
  attachment?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'RETRY' | 'PASS' | 'FAIL';
  feedback?: string | null;
  reviewed_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

type SubmissionCreationAttributes = Optional<
  SubmissionAttributes,
  | 'id'
  | 'attachment'
  | 'feedback'
  | 'reviewed_at'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
>;

class Submission
  extends Model<SubmissionAttributes, SubmissionCreationAttributes>
  implements SubmissionAttributes
{
  public id!: number;
  public assignment_id!: number;
  public user_id!: number;
  public content!: object;
  public attachment!: string | null;
  public status!: 'PENDING' | 'IN_PROGRESS' | 'RETRY' | 'PASS' | 'FAIL';
  public feedback!: string | null;
  public readonly reviewed_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assignment_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.JSON, allowNull: false },
    attachment: { type: DataTypes.STRING(255), allowNull: true },
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'RETRY', 'PASS', 'FAIL'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    feedback: { type: DataTypes.TEXT, allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'Submissions',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export default Submission;
