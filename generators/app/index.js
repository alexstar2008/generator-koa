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
    this.projectName = await this.prompt({
      type: 'input',
      name: 'val',
      message: 'Project name',
      store: true
    });
    this.destinationRoot(this.projectName.val);
  }

  writing() {
    this._loadMiddlewares();
    this._loadConfig();
    this._loadSettings();
  }

  install() {
    this.npmInstall();
  }

  end() {
    this.log('-------------------------');
    this.log('|    GENERATION DONE    |');
    this.log('-------------------------');
  }

  _loadMiddlewares() {
    const middlewareFolder = 'src/middlewares/';
    const files = fs.readdirSync(`${this.contextRoot}/generators/app/templates/${middlewareFolder}`);

    files.forEach(file => {
      this.fs.copyTpl(this.templatePath('./' + middlewareFolder + file),
        this.destinationPath(middlewareFolder + file));
    });
  }

  _loadConfig() {
    const configFolder = 'config/';
    const files = fs.readdirSync(`${this.contextRoot}/generators/app/templates/${configFolder}`);

    files.forEach(file => {
      this.fs.copyTpl(this.templatePath('./' + configFolder + file),
        this.destinationPath(configFolder + file));
    });
  }

  _loadSettings() {
    const settings = [
      { src: 'Dockerfile', dest: 'Dockerfile' },
      {
        src: 'Dockerfile', dest: '.circleci/config.yml',
        data: { name: this.projectName.val }
      },
      { src: 'app.js', dest: `app.js` },
      {
        src: 'package.json', dest: 'package.json',
        data: { name: this.projectName.val }
      },
      { src: 'package-lock.json', dest: 'package-lock.json' },
      { src: '.eslintrc', dest: '.eslintrc' },
      { src: '.gitignore', dest: '.gitignore' },
      { src: '.editorconfig', dest: '.editorconfig' },
    ];
    settings.forEach(({ src, dest, data = {} }) => {
      this.fs.copyTpl(this.templatePath(src),
        this.destinationPath(dest), data);
    });
  }
};
