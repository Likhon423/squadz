import prisma from "@/lib/client";
import { getUserById } from "@/lib/actions";
import { addUserToPending, addUserToPost } from "@/lib/actions";
import PostDetails from "./PostDetails";
import GamePost from "@/app/components/GamePost";

const PostPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const postId = Number(params.id);

  if (isNaN(postId)) {
    return <div className="text-center py-8">Invalid Post ID</div>;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: { select: { username: true } },
      gameMode: { select: { name: true } },
      game: { select: { name: true, img: true, desc: true } },
      users: {
        select: {
          userId: true,
        },
      },
      PendingApplication: {
        select: {
          id: true,
          userId: true,
        },
      },
      messages: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
        },
      },
    },
  });

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  // Fetch usernames for users and pending applications
  const usersWithDetails = await Promise.all(
    post.users.map(async (user) => {
      const userDetails = await getUserById(user.userId);
      return { id: userDetails.id, username: userDetails.username };
    })
  );

  const pendingApplicationsWithDetails = await Promise.all(
    post.PendingApplication.map(async (application) => {
      const userDetails = await getUserById(application.userId);
      return { id: userDetails.id, username: userDetails.username };
    })
  );

  const messagesWithDetails = await Promise.all(
    post.messages.map(async (message) => {
      const userDetails = await getUserById(message.senderId);
      return { ...message, username: userDetails.username };
    })
  );

  const game = post.game; // Extract game details from post

  return (
    <div className="relative">
      <div className="mx-auto py-6">
        <h2 className="text-2xl font-semibold red-text mb-4">Post Details</h2>
        <GamePost
          post={post}
          gameData={{
            name: game.name,
            img: game.img || "/img_insert.png",
          }}
        />
        <PostDetails
          messages={messagesWithDetails}
          users={usersWithDetails}
          pendingApplications={pendingApplicationsWithDetails}
          isPrivate={post.privacy === "PRIVATE"}
        />
      </div>
    </div>
  );
};

export default PostPage;
