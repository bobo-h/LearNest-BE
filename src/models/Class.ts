import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';
import ClassMember from './ClassMember';

interface ClassAttributes {
  id: number;
  name: string;
  main_image?: string | null;
  description?: string | null;
  visibility: 'public' | 'private';
  created_at?: Date;
  updated_at?: Date;
  created_by: number;
  deleted_at?: Date | null;
  members?: ClassMember[];
}

type ClassCreationAttributes = Optional<
  ClassAttributes,
  | 'id'
  | 'main_image'
  | 'description'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
>;

export class Class
  extends Model<ClassAttributes, ClassCreationAttributes>
  implements ClassAttributes
{
  public id!: number;
  public name!: string;
  public main_image!: string | null;
  public description!: string | null;
  public visibility!: 'public' | 'private';
  public created_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
  public members?: ClassMember[];
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    main_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'private',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'Classes',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export default Class;
