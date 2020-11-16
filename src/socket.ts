import { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

export interface IOnlineMap {
  [userId: string]: string;
}

const onlineMap: IOnlineMap = {};

const initialSocket = (appServer: http.Server, app: Application) => {
  const io = new Server(appServer, {
    cors: {
      origin: '*',
    },
  });
  app.set('onlineMap', onlineMap);
  app.set('io', io);

  io.on('connection', (socket: Socket) => {
    console.log('connected user: ', onlineMap);

    socket.on('login', (userId: string) => {
      // onlineMap[userId] = socket.id
      onlineMap[userId] = socket.id;
    });

    socket.on('disconnect', () => {
      Object.keys(onlineMap).forEach((userId) => {
        if (onlineMap[userId] == socket.id) {
          delete onlineMap[userId];
          console.log('disconnect', socket.id);
        }
      });
    });
  });
};

export default initialSocket;
