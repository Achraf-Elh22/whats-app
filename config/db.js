const mongoose = require('mongoose');
const { MONGO_URI } = require('./index');

const connectDB = async (uri = MONGO_URI) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: false,
    });
  } catch (err) {
    console.log('Some Things went wrong 💣💣💣 : ', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
