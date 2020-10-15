const mongoose = require('mongoose');
const { MONGO_URI } = require('./index');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log(`MongoDB connected 👍👍👍`);
  } catch (err) {
    console.log('Some Things went wrong 💣💣💣 : ', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
