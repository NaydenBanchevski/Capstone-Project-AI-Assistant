export const Footer = () => {
  return (
    <footer
      id="contact"
      className="w-full flex justify-center mt-[100px] bg-sky-800 text-white py-6"
    >
      <div className="w-full max-w-[1440px] flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm text-center md:text-left mb-4 md:mb-0">
          &copy; 2024 AI Assistant Per Scholas. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="/privacy-policy" className="text-sm hover:underline">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="text-sm hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};
