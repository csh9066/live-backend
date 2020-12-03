import { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { getRepository } from 'typeorm';
import User from './entity/User';

export interface IUserSocketInfo {
  socketId: string;
  friendIds: number[];
}

export enum SocketEvent {
  ONLINE = 'ONLINE',
  ONLINE_FRIEND = 'ONLINE_FRIEND',
  ONLINE_FRIENDS = 'ONLINE_FRIEND_LIST',
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

const userMap = new Map<number, IUserSocketInfo>();

const initialSocket = (appServer: http.Server, app: Application) => {
  const io = new Server(appServer, {
    cors: {
      origin: '*',
    },
  });

  app.set('userMap', userMap);
  app.set('io', io);

  io.on('connection', (socket: Socket) => {
    socket.on(SocketEvent.ONLINE, async (userId: number) => {
      const user = await getRepository(User).findOne(userId, {
        relations: ['friends'],
      });

      if (user) {
        const onlineFriends = user.friends.filter((friend) =>
          userMap.has(friend.id)
        );

        const onlineFriendIds = onlineFriends.map((friend) => friend.id);
        userMap.set(user.id, {
          socketId: socket.id,
          friendIds: onlineFriendIds,
        });
      }
    });

    socket.on(SocketEvent.JOIN_CHANNELS, (channelIds: number[] = []) => {
      socket.join(channelIds.map((v) => String(v)));
    });

    socket.on(SocketEvent.JOIN_CHANNEL, (channlId: number) => {
      socket.join(String(channlId));
    });

    socket.on(SocketEvent.REMOVE_CHANNEL, (channlId: number) => {
      socket.leave(String(channlId));

      // userMapdp에 있는 정보를 순회해서 현재 나가는 socketId찾아 찾으면 채널에 나갔다고 알림
      for (let [userId, info] of userMap.entries()) {
        if (info.socketId === socket.id) {
          socket
            .to(String(channlId))
            .emit(SocketEvent.LEAVE_CHANNEL_MEMBER, userId, channlId);
          break;
        }
      }
    });

    socket.on('disconnect', async () => {
      for (let [userId, info] of userMap.entries()) {
        if (info.socketId === socket.id) {
          console.log(info.friendIds);
          userMap.delete(userId);
          break;
        }
      }
    });
  });
};

export default initialSocket;
