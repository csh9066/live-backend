import { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import Channel from './entity/Channel';

export interface IOnlineMap {
  [userId: string]: string;
}

export const SocketEvent = {
  ONLINE: 'ONLINE' as const,
  DM: 'DM' as const,
  CHANNEL_CHAT: 'CHANNEL_CHAT' as const,
  JOIN_CHANNELS: 'JOIN_CHANNELS' as const,
  JOIN_CHANNEL: 'JOIN_CHANNEL' as const,
  ADD_CHANNEL_MEMBERS: 'ADD_CHANNEL_MEMBERS' as const,
  ADD_CHANNEL: 'ADD_CHANNEL' as const,
};

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
