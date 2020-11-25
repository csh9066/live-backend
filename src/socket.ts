import { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

export interface IOnlineMap {
  [userId: string]: string;
}

export enum SocketEvent {
  ONLINE = 'ONLINE',
  DM = 'DM',
  CHANNEL_CHAT = 'CHANNEL_CHAT',
  JOIN_CHANNELS = 'JOIN_CHANNELS',
  JOIN_CHANNEL = 'JOIN_CHANNEL',
  ADD_CHANNEL = 'ADD_CHANNEL',
  REMOVE_CHANNEL = 'REMOVE_CHANNEL',
  LEAVE_CHANNEL_MEMBER = 'LEAVE_CHANNEL_MEMBER',
  ADD_FRIEND = 'ADD_FRIEND',
  REMOVE_FRIEND = 'REMOVE_FRIEND',
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
    socket.on(SocketEvent.ONLINE, (userId: number) => {
      onlineMap[userId] = socket.id;
    });

    socket.on(SocketEvent.JOIN_CHANNELS, (channelIds: number[] = []) => {
      socket.join(channelIds.map((v) => String(v)));
    });

    socket.on(SocketEvent.JOIN_CHANNEL, (channlId: number) => {
      socket.join(String(channlId));
    });

    socket.on(SocketEvent.REMOVE_CHANNEL, (channlId: number) => {
      socket.leave(String(channlId));

      let leavedMemberId;
      Object.keys(onlineMap).forEach((id) => {
        if (onlineMap[id] === socket.id) {
          leavedMemberId = id;
        }
      });

      socket
        .to(String(channlId))
        .emit(SocketEvent.LEAVE_CHANNEL_MEMBER, leavedMemberId, channlId);
    });

    socket.on('disconnect', async () => {
      Object.keys(onlineMap).forEach((id) => {
        if (onlineMap[id] == socket.id) {
          delete onlineMap[id];
        }
      });
    });
  });
};

export default initialSocket;
