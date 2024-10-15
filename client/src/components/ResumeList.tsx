import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ResumeList = () => {
  return (
    <div className="min-w-[200px] mt-8">
      <p className="text-sm text-white">Recent Resumes</p>
      <hr />
      <ul className="mx-5 my-5 text-white">
        <motion.div
          whileHover={{ scale: 1, opacity: 0.8 }}
          initial={{ scale: 1.01, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Link to="">
            <li>Resume 1</li>
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1, opacity: 0.8 }}
          initial={{ scale: 1.01, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link to="">
            <li>Resume 2</li>
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1, opacity: 0.8 }}
          initial={{ scale: 1.01, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link to="">
            <li>Resume 3</li>
          </Link>
        </motion.div>
      </ul>
    </div>
  );
};
