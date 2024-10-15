import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ChatList = () => {
  return (
    <div className="min-w-[200px] mt-8">
      <p className="text-sm text-white">Recent Chats</p>
      <hr />
      <ul className="mx-5 my-5 text-white">
        <motion.div
          whileHover={{ scale: 1 }}
          initial={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Link to="">
            <li>Chat</li>
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1 }}
          initial={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link to="">
            <li>Chat</li>
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1 }}
          initial={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link to="">
            <li>Chat</li>
          </Link>
        </motion.div>
      </ul>
    </div>
  );
};
