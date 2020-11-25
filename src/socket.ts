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
  ADD_CHANNEL: 'ADD_CHANNEL' as const,
  ADD_FRIEND: 'ADD_FRIEND' as const,
  REMOVE_CHANNEL: 'REMOVE_CHANNEL' as const,
  LEAVE_CHANNEL_MEMBER: 'LEAVE_CHANNEL_MEMBER' as const,
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
