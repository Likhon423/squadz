"use client";

import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  acceptApplication,
  declineApplication,
  getUserById,
  sendMessage,
} from "@/lib/actions";

interface Message {
  id: number;
  content: string;
  createdAt: Date;
  senderId: string;
  username: string;
}

interface User {
  id: string;
  username: string;
}

interface PendingApplication {
  id: number;
  userId: string;
}

interface PostDetailsProps {
  messages: Message[];
  users: User[];
  pendingApplications: PendingApplication[];
  isPrivate: boolean;
  postId: number;
  postCreatorId: string;
}

const PostDetails: React.FC<PostDetailsProps> = ({
  messages,
  users,
  pendingApplications,
  isPrivate,
  postId,
  postCreatorId,
}) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const onSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(postId, newMessage);
        setNewMessage(""); // Clear the input after sending
      } catch (error) {
        setError("Error sending message.");
      }
    }
  };

  const onAcceptApplication = async (application: PendingApplication) => {
    if (user?.id !== postCreatorId) {
      setError("Only squad creator can accept applications");
      return;
    }
    try {
      await acceptApplication(application.userId, postId);
    } catch (error) {
      setError("Error accepting application.");
    }
  };

  const onDeclineApplication = async (application: PendingApplication) => {
    if (user?.id !== postCreatorId) {
      setError("Only squad creator can decline applications");
      return;
    }
    try {
      await declineApplication(application.id, postId);
    } catch (error) {
      setError("Error declining application.");
    }
  };

  const getPendingApplicationsWithUsernames = async () => {
    const applicationsWithUsernames = await Promise.all(
      pendingApplications.map(async (application) => {
        const userDetails = await getUserById(application.userId);
        return { ...application, username: userDetails.username };
      })
    );
    return applicationsWithUsernames;
  };

  const pendingApplicationsWithUsernames =
    getPendingApplicationsWithUsernames();

  return (
    <div className="flex">
      {/* Left Side: Messages */}
      <div className="w-2/3 pr-4 overflow-auto">
        <div className="mb-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <div className="text-sm font-bold">{message.username}</div>
              <div className="text-sm">{message.content}</div>
            </div>
          ))}
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={onMessageChange}
            className="border p-2 w-full"
            placeholder="Type your message..."
          />
          <button
            onClick={onSendMessage}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>

      {/* Right Side: Users and Pending Applications */}
      <div className="w-1/3 pl-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Users in Post</h3>
          {users.map((user) => (
            <div key={user.id} className="text-sm mb-2">
              {user.username}
            </div>
          ))}
        </div>

        {isPrivate && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Pending Applications</h3>
            {pendingApplicationsWithUsernames.length > 0 ? (
              pendingApplicationsWithUsernames.map((application) => (
                <div key={application.id} className="flex items-center mb-2">
                  <div className="text-sm">{application.username}</div>
                  <button
                    onClick={() => onAcceptApplication(application)}
                    className="ml-2 bg-green-500 text-white py-1 px-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onDeclineApplication(application)}
                    className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Decline
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">
                No pending applications.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
