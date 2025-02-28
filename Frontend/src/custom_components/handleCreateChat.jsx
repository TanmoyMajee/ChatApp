import { useChat } from '../contextApi/ChatProvider';
export default function ChatList() {
  const { chats, setSelectedChat } = useChat();
  const { user, onlineUsers } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(chats);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  

  // Define handleCreateChat to handle new chat creation
  const handleCreateChat = (selectedUsers, groupName) => {
    // Your logic to create a chat goes here.
    // For instance, you might call an API endpoint or update local state:
    console.log("Creating chat with:", selectedUsers, "Group Name:", groupName);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) =>
        chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchTerm, chats]);

  return (
    <div className="p-4">
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full"
      />

      {/* Header with Chats Title and Add Chat Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <button
          className="bg-blue-500 text-white rounded-full p-2 shadow-lg text-2xl"
          onClick={() => setShowNewChatModal(true)}
        >
          +
        </button>
      </div>

      {filteredChats.map((chat) => (
        <ChatListItem
          key={chat._id}
          chat={chat}
          user={user}
          onlineUsers={onlineUsers}
          setSelectedChat={setSelectedChat}
        />
      ))}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <CreateChat
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={handleCreateChat}
        />
      )}
    </div>
  );
}
