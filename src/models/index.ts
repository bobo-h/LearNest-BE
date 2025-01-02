import Class from './Class';
import ClassMember from './ClassMember';
import Unit from './Unit';
import Subunit from './Subunit';

Class.hasMany(ClassMember, { foreignKey: 'class_id', as: 'members' });
ClassMember.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Class.hasMany(Unit, { foreignKey: 'class_id', as: 'units' });
Unit.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Unit.hasMany(Subunit, { foreignKey: 'unit_id', as: 'subunits' });
Subunit.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

export { Class, ClassMember, Unit, Subunit };
