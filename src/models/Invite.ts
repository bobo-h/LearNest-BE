import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface InviteAttributes {
  id: number;
  class_id: number;
  created_by: number;
  expires_at: Date;
  created_at?: Date;
}

type InviteCreationAttributes = Optional<InviteAttributes, 'id' | 'created_at'>;

export class Invite
  extends Model<InviteAttributes, InviteCreationAttributes>
  implements InviteAttributes
{
  public id!: number;
  public class_id!: number;
  public created_by!: number;
  public expires_at!: Date;
  public created_at!: Date;
}

Invite.init(
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Invites',
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export default Invite;
