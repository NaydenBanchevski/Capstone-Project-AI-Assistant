import { Cover } from "./ui/cover";

export function Title() {
  return (
    <div>
      <h1 className=" text-4xl md:text-4xl lg:text-8xl font-semibold max-w-7xl mx-auto text-center mt-32 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-sky-500 via-sky-800 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white mb-10">
        Per Scholas <br /> <Cover>AI Assistant</Cover>
      </h1>
    </div>
  );
}
