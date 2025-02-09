import Class from './Class';
import ClassMember from './ClassMember';
import Unit from './Unit';
import Subunit from './Subunit';
import Assignment from './Assignment';
import Submission from './Submission';
import Progress from './Progress';

Class.hasMany(ClassMember, { foreignKey: 'class_id', as: 'members' });
ClassMember.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Class.hasMany(Unit, { foreignKey: 'class_id', as: 'units' });
Unit.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Unit.hasMany(Subunit, { foreignKey: 'unit_id', as: 'subunits' });
Subunit.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

Subunit.hasMany(Assignment, { foreignKey: 'subunit_id', as: 'assignments' });
Assignment.belongsTo(Subunit, { foreignKey: 'subunit_id', as: 'subunit' });

Assignment.hasMany(Submission, {
  foreignKey: 'assignment_id',
  as: 'submissions',
});
Submission.belongsTo(Assignment, {
  foreignKey: 'assignment_id',
  as: 'assignment',
});

ClassMember.hasMany(Submission, { foreignKey: 'user_id', as: 'submissions' });
Submission.belongsTo(ClassMember, { foreignKey: 'user_id', as: 'user' });

ClassMember.hasMany(Progress, { foreignKey: 'user_id', as: 'progress' });
Progress.belongsTo(ClassMember, { foreignKey: 'user_id', as: 'user' });

Class.hasMany(Progress, { foreignKey: 'class_id', as: 'progress' });
Progress.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Unit.hasMany(Progress, { foreignKey: 'unit_id', as: 'progress' });
Progress.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

Subunit.hasMany(Progress, { foreignKey: 'subunit_id', as: 'progress' });
Progress.belongsTo(Subunit, { foreignKey: 'subunit_id', as: 'subunit' });

export { Class, ClassMember, Unit, Subunit, Assignment, Submission, Progress };
