const fs = require('fs');
const Generator = require('yeoman-generator');
const path = require('path')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.log('-------------------------');
    this.log('|   STARTED GENERATION  |')
    this.log('-------------------------');
  }

  async prompting() {
    this.projectName = await this._projectNamePromt();
    this.destinationRoot(this.projectName.val);

    const dbAnswers = await this._dbPrompt();
    if (dbAnswers.includeDB.length) {
      await this._authPromt(dbAnswers);
    }
  }

  writing() {
    this._copyDir('src/middlewares/');
    this._copyDir('config/', { includeMongo: this.includeMongo, includePostgre: this.includePostgre });
    this._loadSettings();

    if (this.includeMongo) {
      this._copySingle('src/libs/mongoose.js');
      if (this.includeBasicAuth) {
        this._copyDir('src/mongo/users/', 'src/users/');
      }
    }
  }

  install() {
    // this.npmInstall();
  }

  end() {
    this.log('-------------------------');
    this.log('|    GENERATION DONE    |');
    this.log('-------------------------');
  }


  _projectNamePromt() {
    return this.prompt({
      type: 'input',
      name: 'val',
      message: 'Project name'
    });
  }

  _dbPrompt() {
    return this.prompt({
      type: 'checkbox',
      name: 'includeDB',
      message: 'Choose DB config:',
      choices: [
        { name: 'MongoDB', value: 'mongo' },
        { name: 'PostgreSQL', value: 'postgre' }
      ]
    });
  }

  async _authPromt(dbAnswers) {
    const auth = await this.prompt([{
      type: 'confirm',
      name: 'basicAuth',
      message: 'Include basic auth?'
    }]);
    this.includeMongo = dbAnswers.includeDB.includes('mongo');
    this.includePostgre = dbAnswers.includeDB.includes('postgre');
    this.includeBasicAuth = auth.basicAuth;
  }


  //: TODO (reorganize)
  _loadSettings() {
    let settings = [
      { src: 'Dockerfile', dest: 'Dockerfile' },
      {
        src: '.circleci/config.yml', dest: '.circleci/config.yml',
        data: { name: this.projectName.val }
      },
      { src: 'app.js', dest: `app.js` },
      { src: 'src/libs/aws.js', dest: 'src/libs/aws.js' },
      {
        src: 'package.json', dest: 'package.json',
        data: { name: this.projectName.val }
      },
      { src: 'package-lock.json', dest: 'package-lock.json' },
      { src: '.eslintrc.yml', dest: '.eslintrc.yml' },
      { src: '.gitignore', dest: '.gitignore' },
      { src: '.editorconfig', dest: '.editorconfig' },
    ];

    settings.forEach(({ src, dest, data = {} }) => {
      this.fs.copyTpl(this.templatePath(src),
        this.destinationPath(dest), data);
    });
  }


  _copySingle(src, dest, data = {}) {
    if (dest instanceof Object) {
      data = dest;
      dest = src;
    }
    this.fs.copyTpl(this.templatePath(src),
      this.destinationPath(dest || src), data);
  }
  _copyDir(srcDirPath, destDirPath, data = {}) {
    if (destDirPath instanceof Object) {
      data = destDirPath;
      destDirPath = srcDirPath;
    }
    const files = fs.readdirSync(`${this.contextRoot}/generators/app/templates/${srcDirPath}`);
    const filesArr = files.map(file => ({ src: srcDirPath + file, dest: (destDirPath || srcDirPath) + file, data }));
    filesArr.forEach(({ src, dest, data = {} }) => {
      this.fs.copyTpl(this.templatePath(src),
        this.destinationPath(dest), data);
    });
  }
};
