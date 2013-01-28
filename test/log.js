var fs = require('fs'),
    Log = require('log'),
    log = new Log('debug', fs.createWriteStream('log.log'));

log.debug('preparing email');
log.info('sending email');
log.error('failed to send email');
