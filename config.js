var config = {}

//Azure configuration
config.certificateConfig = {
    passphrase: 'enterYourCertificatePasswordHere'
};

config.sessionSecret='uwotm8';

config.port='8185';
config.RESTURI='https://enterYourServerNameHere.com:4243/qps/custom';
config.REDIRECT='https://enterYourServerNameHere.com/custom/hub';

module.exports = config;
