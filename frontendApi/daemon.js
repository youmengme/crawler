/*
 * 守护进程
 * 用主进程来启动子进程，如果子进程死了就重启子进程
 */
const cp = require('child_process');
const os = require('os');
const numCPUs = os.cpus().length;

var workers = {};
function spawn(server) {
    var worker = cp.spawn('node', [ server ]);

    //监听子进程exit事件
    worker.on('exit', function (code) {
        delete workers[worker.pid];
        if (code !== 0) {
            spawn(server);
        }
    });
    workers[worker.pid] = worker;
}

function main() {
    //启动多个子进程
    for (var i = 0; i < numCPUs; i++) {
        spawn('daemon_server.js');
    }

    /*
     * 为了能够正常终止服务，让守护进程在接收到SIGTERM信号时终止服务器进程
     * 终止进程信号
     */
    process.on('SIGTERM', function () {
        /*
         * kill方法结束对应某pid的进程并发送一个信号（若没定义信号值则默认为'SIGTERM'）：
         * 父进程通过.kill方法向子进程发送SIGTERM信号
         * 父进程退出时杀死所有子进程
         */
        for(var pid in workers){
            workers[pid].kill();
        }
        process.exit(0);
    });
}

main();