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
    this.destinationRoot('../');
  }

  async prompting() {
    this.projectName = await this.prompt({
      type: 'input',
      name: 'val',
      message: 'Project name',
      store: true
    });
  }

  writing() {
    this._loadMiddlewares();
    // this._loadConfig();
    // this.__loadCodeStylesConfigs();
  }

  install() {
    // this.npmInstall();
  }

  end() {
    this.log('-------------------------');
    this.log('|    GENERATION DONE    |');
    this.log('-------------------------');
  }

  _loadMiddlewares() {
    const middlewareFolder = '/src/middlewares/';
    const files = fs.readdirSync(`${this.contextRoot}/generators/app/templates${middlewareFolder}`);

    files.forEach(file => {
      this.fs.copyTpl(this.templatePath('.' + middlewareFolder + file),
        this.destinationPath(this.projectName.val + middlewareFolder + file));
    });
  }

  // _loadConfig() {
  //   const configFolder = '/config/';
  //   const files = fs.readdirSync(`${this.contextRoot}/generators/app/templates${configFolder}`);

  //   files.forEach((file) => {
  //     this.fs.copyTpl(this.templatePath(path.join('./', configFolder, file)),
  //       this.destinationPath(path.join(this.projectName.val, configFolder, file)));
  //   });

  //   files.forEach((file) => {
  //     this.fs.copyTpl(this.templatePath(`./${configFolder}${file}`),
  //       this.destinationPath(`${this.projectName.val}${configFolder}${file}`));
  //   });
  // }

  // _loadCodeStylesConfigs() {
  //   this.fs.copyTpl(this.templatePath('app.js'),
  //     this.destinationPath(`${this.projectName.val}/app.js`), {

  //     });

  //   this.fs.copy(
  //     this.templatePath('./.eslintrc'),
  //     this.destinationPath('./.eslintrc')
  //   );
  //   this.fs.copy(
  //     this.templatePath('./.editorconfig'),
  //     this.destnationPath('./.editorconfig')
  //   );
  // }

  // _loadGitIgnore() {
  //   this.fs.copy(
  //     this.templatePath('./.gitignore'),
  //     this.destinationPath('./.gitignore')
  //   );
  // }
};
