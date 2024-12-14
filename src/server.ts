import app from './app';
import sequelize from './database';

const PORT = process.env.PORT || 8080;

sequelize
  .sync()
  .then(() => {
    console.log('✅ MySQL Database connected successfully!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MySQL Database connection failed:', err);
    process.exit(1);
  });
