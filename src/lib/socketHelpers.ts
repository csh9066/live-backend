import { IUserSocketInfo } from '../socket';

export const removeFriendInSocketInfo = (
  socketInfo: IUserSocketInfo,
  friendId: number
): void => {
  const friendIdx = socketInfo.friendIds.findIndex((id) => id === friendId);
  if (friendId >= 0) {
    socketInfo.friendIds.splice(friendIdx, 1);
  }
};
