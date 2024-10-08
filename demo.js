import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const ChatList = () => {
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userChats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: (chatId) =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => {
      // Invalidate and refetch the chats query
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
  });

  const handleDelete = async (chatId, e) => {
    e.preventDefault(); // Prevent link navigation
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteMutation.mutate(chatId);
    }
  };

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <nav>
        <Link to="/new-chat">Create a new chat</Link>
        <Link to="/explore">Explore Chats</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="mt-6">
        <h2>Recent Chats</h2>
        {isPending ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading chats</div>
        ) : (
          <ul className="space-y-2">
            {data?.map((chat) => (
              <li
                key={chat._id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <Link to={`/chat/${chat._id}`} className="flex-1">
                  {chat.title}
                </Link>
                <button
                  onClick={(e) => handleDelete(chat._id, e)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                >
                  <MdDelete size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 p-4  rounded">
        <h3>Upgrade to Google AI</h3>
        <p>Get unlimited access to all features</p>
      </div>
    </div>
  );
};

export default ChatList;
