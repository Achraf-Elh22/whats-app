const app = require('./app.js');
const { PORT } = require('./config/index');
const connectDB = require('./config/db');

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.error('UNHANDLED REJECTION!!! 💣💣 Shunting down .... ');
  server.close(() => {
    process.exit();
  });
});
// Connect to DB
connectDB().then(() => console.log(`MongoDB connected 👍👍👍`));

// Server
const server = app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT} 👌👌`);
});
