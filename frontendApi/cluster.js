const cluster = require('cluster');
const os = require('os');
const log4js = require('./lib/logConfig');
const numCPUs = os.cpus().length;

let logger;

if (cluster.isMaster) {
    logger = log4js.getLogger('oth');
    logger.info('master is start');
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    //当任何一个worker停掉都会触发exit事件，可以在回调里增加fork动作重启
    cluster.on('exit', function(worker, code, signal) {
        logger.error('A worker process died, restarting...');
        cluster.fork();
    });
}
else {
    logger = log4js.getLogger('oth');
    logger.info('worker is start');

    require("./cluster_server.js");
}