"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";

export const addGame = async (formData: FormData, img: string) => {
  const name = formData.get("name") as string;
  const desc = formData.get("desc") as string;
  try {
    await prisma.games.create({
      data: {
        name: name,
        desc: desc,
        img,
      },
    });
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const getGames = async () => {
  try {
    const games = await prisma.games.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return games;
  } catch (err) {
    throw new Error("Failed to fetch games");
  }
};

export const createGameMode = async (
  gameId: number,
  name: string,
  members: number
) => {
  try {
    const newGameMode = await prisma.gameModes.create({
      data: {
        name,
        members,
        gameId: gameId,
      },
    });
    return newGameMode;
  } catch (error) {
    throw new Error("Error creating game mode");
  }
};

export const getAllGames = async () => {
  try {
    const games = await prisma.games.findMany({
      select: {
        id: true,
        name: true,
        img: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return games;
  } catch (error) {
    console.error("Error fetching games: ", error);
    throw new Error("Unable to fetch games.");
  }
};

export const isFollowingGame = async (gameId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated!");
  }

  try {
    const follow = await prisma.gamesOnUsers.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: gameId,
        },
      },
    });
    return follow ? true : false;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

export const switchFollow = async (gameId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated!");
  }

  try {
    const existingFollow = await prisma.gamesOnUsers.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: gameId,
        },
      },
    });

    if (existingFollow) {
      await prisma.gamesOnUsers.delete({
        where: {
          userId_gameId: {
            userId: userId,
            gameId: gameId,
          },
        },
      });
    } else {
      await prisma.gamesOnUsers.create({
        data: {
          userId: userId,
          gameId: gameId,
        },
      });
    }
  } catch (error) {
    console.error("Error following game:", error);
  }
};

export const getFollowedGames = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated!");
  }

  try {
    const games = await prisma.gamesOnUsers.findMany({
      where: { userId },
      include: { game: true },
    });
    return games.map((entry) => entry.game);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createPost = async ({
  gameId,
  gameModeId,
  region,
  platform,
  type,
  description,
  privacy,
  password,
}: {
  gameId: number;
  gameModeId: number;
  region: string;
  platform: string;
  type: string;
  description: string;
  privacy: string;
  password?: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  if (
    !gameId ||
    !gameModeId ||
    !region ||
    !platform ||
    !type ||
    !description ||
    !privacy
  ) {
    throw new Error("All fields are required.");
  }

  if (privacy === "PROTECTED" && !password) {
    throw new Error("Password is required for protected posts.");
  }

  try {
    const post = await prisma.$transaction(async (prisma) => {
      // Create the post
      const createdPost = await prisma.post.create({
        data: {
          gameId: Number(gameId),
          gameModeId: Number(gameModeId),
          region,
          platform,
          type,
          desc: description,
          privacy,
          password: privacy === "PROTECTED" ? password : undefined,
          userId,
        },
      });

      await prisma.usersOnPosts.create({
        data: {
          userId,
          postId: createdPost.id,
        },
      });

      return createdPost;
    });

    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create the post.");
  }
};

export async function getGamesWithModes() {
  try {
    const games = await prisma.games.findMany({
      include: {
        gameModes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return games.map((game) => ({
      id: game.id,
      name: game.name,
      gameModes: game.gameModes, // Include game modes
    }));
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

export const addUserToPost = async (postId: number, password?: string) => {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "User not authenticated." };

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { success: false, message: "Post not found." };

  if (post.privacy === "PROTECTED" && post.password !== password) {
    return { success: false, message: "Incorrect password" };
  }

  // Check if the user already joined
  const existingUser = await prisma.usersOnPosts.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existingUser) {
    return { success: false, message: "You have already joined this post." };
  }

  await prisma.usersOnPosts.create({
    data: { userId, postId },
  });

  await prisma.notification.create({
    data: {
      recipientId: post.userId,
      senderId: userId,
      postId,
      type: "JOIN",
      message: `${userId} has joined your squad.`,
    },
  });

  return { success: true, message: "Joined successfully!" };
};

export const addUserToPending = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");

  // Fetch the post and the post's creator
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { user: true },
  });

  if (!post) throw new Error("Post not found.");

  const existingApplication = await prisma.pendingApplication.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existingApplication)
    throw new Error("You have already applied to this post.");

  const applicant = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  if (!applicant || !applicant.username) {
    throw new Error("Applicant's username could not be found.");
  }

  await prisma.pendingApplication.create({
    data: {
      userId,
      postId,
    },
  });

  await prisma.notification.create({
    data: {
      recipientId: post.userId,
      senderId: userId,
      postId,
      type: "APPLY",
      message: `${applicant.username} has applied to join your squad.`,
    },
  });

  return { success: true, message: "Request sent successfully!" };
};

export const checkUserParticipation = async (postId: number, req: any) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");

  const joined = await prisma.usersOnPosts.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  const pending = await prisma.pendingApplication.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  return {
    joined: !!joined,
    pending: !!pending,
  };
};

export const getUserPosts = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  // Fetch posts created by the user
  const createdPosts = await prisma.post.findMany({
    where: { userId },
    include: {
      user: { select: { username: true } },
      gameMode: { select: { name: true } },
      users: { select: { userId: true } },
      PendingApplication: { select: { userId: true } },
      game: { select: { name: true, img: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch posts joined by the user
  const joinedPosts = await prisma.post.findMany({
    where: {
      users: { some: { userId } },
    },
    include: {
      user: { select: { username: true } },
      gameMode: { select: { name: true } },
      users: { select: { userId: true } },
      PendingApplication: { select: { userId: true } },
      game: { select: { name: true, img: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch posts where the user's application is pending
  const pendingPosts = await prisma.post.findMany({
    where: {
      PendingApplication: { some: { userId } },
    },
    include: {
      user: { select: { username: true } },
      gameMode: { select: { name: true } },
      users: { select: { userId: true } },
      PendingApplication: { select: { userId: true } },
      game: { select: { name: true, img: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { createdPosts, joinedPosts, pendingPosts };
};

export const getUserProfile = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true,
      gamesFollowing: true,
      friendships: true,
      friendsOf: true,
      receivedRequests: true,
      sentRequests: true,
      notifications: {
        where: { read: false },
      },
    },
  });
};

// Get notifications for the user
export const getUserNotifications = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");
  return await prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" },
  });
};

// Get friends of the user
export const getUserFriends = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");
  return await prisma.friend.findMany({
    where: {
      OR: [{ userId }, { friendId: userId }],
    },
    include: {
      user: true,
      friend: true,
    },
  });
};

// Get friend requests for the user
export const getUserFriendRequests = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");
  return await prisma.friendRequest.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });
};

export const cancelPendingRequest = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");

  const pendingRequest = await prisma.pendingApplication.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (!pendingRequest) throw new Error("No pending request found.");

  await prisma.pendingApplication.delete({
    where: { userId_postId: { userId, postId } },
  });

  return { success: true, message: "Request canceled successfully!" };
};

export const deletePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.userId !== userId) {
    throw new Error("You are not authorized to delete this post.");
  }

  await prisma.post.delete({ where: { id: postId } });

  return { success: true, message: "Post deleted successfully!" };
};

export const getPostById = async (postId: number) => {
  try {
    console.log("Fetching post with ID:", postId); // Debugging log
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: { select: { username: true } },
        game: { select: { name: true, img: true } },
        gameMode: { select: { name: true } },
        users: {
          select: { userId: true, user: { select: { username: true } } },
        },
        PendingApplication: { select: { userId: true } },
        messages: { select: { senderId: true, content: true } },
      },
    });

    if (!post) throw new Error("Post not found");

    console.log("Fetched post data:", post); // Debugging log
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Failed to fetch post");
  }
};

export const sendMessage = async (postId: number, content: string) => {
  await prisma.message.create({
    data: {
      content,
      postId,
      senderId: "currentUserId", // Get the current user ID from Clerk
    },
  });
};

export const acceptApplication = async (userId: string, postId: number) => {
  // Add the user to the post's users list (UsersOnPosts)
  await prisma.usersOnPosts.create({
    data: {
      userId,
      postId,
    },
  });

  // Remove the application from PendingApplication
  await prisma.pendingApplication.delete({
    where: { userId_postId: { userId, postId } },
  });
};

export const declineApplication = async (
  applicationId: number,
  postId: number
) => {
  // Remove the pending application from the PendingApplication table
  await prisma.pendingApplication.delete({
    where: { id: applicationId },
  });
};
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }
  return user;
};
