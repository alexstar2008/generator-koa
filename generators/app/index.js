const fs = require('fs');
const Generator = require('yeoman-generator');

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
        // this.fs.copyTpl(this.templatePath('app.js'),
        //     this.destinationPath(`${this.projectName.val}/app.js`), {

        //     });
        // this.fs.copyTpl(this.templatePath('package.json'),
        //     this.destinationPath(`${this.projectName.val}/package.json`), {
        //         name: this.projectName.val
        //     });
        this._loadMiddlewares();
        this._loadConfig();
    }
    install() {
        // this.npmInstall();
    }
    end() {
        this.log('-------------------------');
        this.log('|     GENERATION DONE    |');
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
    _loadConfig() {
        const configFolder = '/config/';
        const files = fs.readdirSync(`${this.contextRoot}/generators/app/templates${configFolder}`);

        files.forEach(file => {
            this.fs.copyTpl(this.templatePath('.' + configFolder + file),
                this.destinationPath(this.projectName.val + configFolder + file));
        });
    }
};


