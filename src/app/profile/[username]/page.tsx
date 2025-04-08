"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getUserProfile,
  getUserNotifications,
  getUserFriends,
  getUserFriendRequests,
} from "@/lib/actions";

const ProfilePage = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        const profileData = await getUserProfile();
        setProfile(profileData);
        const notificationsData = await getUserNotifications();
        setNotifications(notificationsData);
        const friendsData = await getUserFriends();
        setFriends(friendsData);
        const friendRequestsData = await getUserFriendRequests();
        setFriendRequests(friendRequestsData);
      };
      fetchProfileData();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to see your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col items-center space-y-6">
        {/* Profile Info */}
        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-white">{user.username}</h2>
          <p className="text-lg text-gray-400">
            {profile?.description || "No description available"}
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-2/3">
          <h3 className="text-2xl font-semibold text-white">Notifications</h3>
          {notifications.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="bg-gray-700 p-4 rounded">
                  <p className="text-white">{notification.message}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 mt-4">No new notifications</p>
          )}
        </div>

        {/* Friends List */}
        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-2/3">
          <h3 className="text-2xl font-semibold text-white">Friends</h3>
          {friends.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {friends.map((friend) => (
                <li key={friend.id} className="bg-gray-700 p-4 rounded">
                  <p className="text-white">
                    {friend.user.username} and {friend.friend.username}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 mt-4">No friends yet</p>
          )}
        </div>

        {/* Friend Requests */}
        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-2/3">
          <h3 className="text-2xl font-semibold text-white">Friend Requests</h3>
          {friendRequests.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {friendRequests.map((request) => (
                <li key={request.id} className="bg-gray-700 p-4 rounded">
                  <p className="text-white">
                    {request.senderId === user.id
                      ? `Sent to ${request.receiver.username}`
                      : `Received from ${request.sender.username}`}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 mt-4">No pending friend requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
