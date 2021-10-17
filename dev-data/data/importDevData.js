const delay = require('delay');
const chalk = require('chalk');
const ora = require('ora');
const ConfigStore = require('conf');

const config = new ConfigStore({ accessPropertiesByDotNotation: false });

const { importData, setAutoAuth, connectToDb } = require('./utilities');

class ImportDevData {
  constructor(responses) {
    this.res = responses;
  }

  // Task One: Collect Information giving in the Phase One
  async EntryTask() {
    // Store default answers in configstore
    if (this.res.default_answers) {
      config.set({ defaultResponses: this.res });

      console.log('///////////////////////////////////////////');
      console.log('Imported data using the default :');
      console.log(chalk.cyanBright(`DATA TO IMPORT:`), `${this.res.imported_data}`);
      console.log(chalk.cyanBright(`MONGODB URI: `), `${this.res.mongoDB_URI}`);
      console.log(chalk.cyanBright(`AUTO LOGIN: `), `${this.res.auto_login}`);
      console.log('///////////////////////////////////////////');
    }
    await delay(3000);

    const task = ora('Collect Information').start();

    // Check if imported_data and mongodb_uri are specified
    await delay(2000);
    if (!this.res.imported_data || !this.res.mongoDB_URI)
      return task.fail('  please Provide the information necessary to continue  ');

    task.succeed('Collect Information (completed ✅)');
    return this.taskTwo();
  }

  // Task Two: Connect to Db through mongoose connection
  async taskTwo() {
    const task = ora('Connect to DB').start();

    const { status, message } = await connectToDb(this.res.mongoDB_URI);

    if (status == 'success') {
      task.succeed(message);
      return this.taskThree();
    }
    if (status == 'error') {
      task.succeed(message);
      return this.taskThree();
    }
  }
  async taskThree() {
    const task = ora('Import data').start();
    try {
      // Import Data
      await importData(this.res.imported_data);
      console.log(chalk.blueBright('  => Password for Users is: password123'));

      task.succeed('Import data (completed ✅)');
      if (this.res.auto_login) return this.TaskFour();
      process.exit(0);
    } catch (err) {
      task.fail('Something went wrong (Fail ❌) :');
      console.error(err);
    }
  }
  async TaskFour() {
    const task = ora('Setting up auto login').start();

    // Modifying package.json start script
    const { stderr, stdout } = setAutoAuth();

    // check if task failed
    if (stderr) return task.fail(stderr);

    console.log(
      chalk.blueBright(
        ' => User loged in is User-1 with user-1@exmple.com and 6037a170d10990042799807b (mongodb id)'
      )
    );
    // task completed
    task.succeed('No need to login, User is login automatically (completed ✅) ');
    return process.exit(0);
  }
}

module.exports = ImportDevData;
