module.exports = {
    mongoose: {
        uri: ''
    },
    jwtsecret: '',
    crypto: {
        hash: {
            length: 128,
            iterations: 12000
        }
    },
    password: { length: 10, numbers: true },
    socials: {
        google: {
            clientId: '',
            clientSecret: '',
            callbackUrl: ''
        },
        facebook: {
            appId: '',
            appSecret: '',
            callbackUrl: ''
        }
    },
    aws: {
        defaultImg: '',
        awsURL: '',
        accessKeyId: '',
        secretAccessKey: '',
        bucketName: ''
    },
    docs: {
        routePrefix: '/docs',
        swaggerOptions: {
            url: '',
        },
        hideTopbar: true
    }
};
