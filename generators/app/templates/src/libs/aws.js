const AWS = require('aws-sdk');
const config = require('config');

const options = {
    accessKeyId: config.get('aws').get('accessKeyId'),
    secretAccessKey: config.get('aws').get('secretAccessKey'),
};

AWS.config.update(options);

const s3 = new AWS.S3();

function upload(fileName, fileStream) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: config.get('aws').get('bucketName'),
            Key: fileName,
            Body: fileStream,
        };

        s3.upload(params, (err, data) => {
            if (err) return reject(err)
            return resolve(data.Location)
        });
    })
}

function remove(pathsToDel) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: config.get('aws').get('bucketName'),
            Delete: {
                Objects: pathsToDel.map(path => ({ Key: path })),
            },
        };

        s3.deleteObjects(params, (err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

const setFileName = (folder, name, ext) => (`${folder}/${name}${ext ? `.${ext}` : ''}`);

module.exports = {
    async uploadFile(folder, fileObj) {
        // TODO: need to correct way for check file extension
        const ext = fileObj.type.split('/').slice(-1)[0];
        const timestamp = + new Date();
        const fileName = setFileName(folder, timestamp, ext);

        return upload(fileName, fs.createReadStream(fileObj.path));
    },

    deleteFile(folder, filePath) {
        return remove([setFileName(folder, filePath)]);
    },
}
