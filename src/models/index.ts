import Class from './Class';
import ClassMember from './ClassMember';

Class.hasMany(ClassMember, { foreignKey: 'class_id', as: 'members' });
ClassMember.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

export { Class, ClassMember };
