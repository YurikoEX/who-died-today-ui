angular.module('socketModule').factory('socketService',function(socketFactory) {
    //var myIoSocket = io.connect('/');
    //
    //var mySocket = socketFactory({
    //    ioSocket: myIoSocket
    //});

    return socketFactory();
});
