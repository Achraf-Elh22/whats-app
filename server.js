const app = require('./app.js');
const { PORT } = require('./config/index');

const server = app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT} 👌👌`);
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.error('UNHANDLED REJECTION!!! 💣💣 Shunting down .... ');
  server.close(() => {
    process.exit();
  });
});
