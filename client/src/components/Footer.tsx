import { TextHoverEffect } from "./ui/text-hover-effect";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="w-full flex flex-col items-center mt-[100px] bg-gradient-to-r from-sky-800 to-sky-600 text-white py-6"
    >
      <div className="w-full max-w-[1440px] flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm text-center md:text-left mb-4 md:mb-0">
          &copy; 2024 AI Assistant Per Scholas. All rights reserved.
        </p>
        <div className="flex items-center gap-4  mb-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaLinkedinIn size={24} />
          </a>
        </div>
        <div className="flex gap-6">
          <a href="/privacy-policy" className="text-sm hover:underline">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="text-sm hover:underline">
            Terms of Service
          </a>
        </div>
      </div>

      <TextHoverEffect text="AI Assistant" />
    </footer>
  );
};
