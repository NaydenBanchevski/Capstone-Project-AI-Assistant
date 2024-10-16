import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IconTrash } from "@tabler/icons-react";

export const ChatList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending: isChatsPending,
    error: chatsError,
    data: chatsData,
  } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const deleteChatMutation = useMutation({
    mutationFn: async (chatId) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/${chatId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userChats"]);
    },
  });

  const handleDeleteChat = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChatMutation.mutate(chatId);
      navigate(`/dashboard`);
    }
  };

  return (
    <div className="min-w-[200px] mt-8">
      <p className="text-sm text-white">Recent Chats</p>
      <hr />
      <div className="flex flex-col ">
        {isChatsPending
          ? "Loading..."
          : chatsError
          ? "No Current Chats!"
          : chatsData?.map((chat) => (
              <div
                key={chat._id}
                className="flex items-center justify-between p-2 "
              >
                <Link to={`/dashboard/chat/${chat._id}`} className="text-white">
                  {chat.title}
                </Link>
                <button
                  onClick={() => handleDeleteChat(chat._id)}
                  className="text-white  hover:text-neutral-200 ml-2"
                >
                  <IconTrash width={16} />
                </button>
              </div>
            ))}
      </div>
    </div>
  );
};
