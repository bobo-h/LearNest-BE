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
  members?: ClassMember[];
}

type ClassCreationAttributes = Optional<
  ClassAttributes,
  'id' | 'main_image' | 'description' | 'created_at' | 'updated_at'
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
  public created_at!: Date;
  public updated_at!: Date;
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
  },
  {
    sequelize,
    tableName: 'Classes',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  },
);

export default Class;
