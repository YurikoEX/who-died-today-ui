angular.module('socketModule').factory('socketService',function(socketFactory) {
    var socketService;

    var myIoSocket = io.connect('/',{port: 4443, secure: true} );

    socketService = socketFactory({
        ioSocket: myIoSocket
    });

    return socketService;
});
