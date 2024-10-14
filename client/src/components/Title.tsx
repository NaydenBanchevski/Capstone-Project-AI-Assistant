import { Cover } from "./ui/cover";

interface TitleProps {
  header?: string;
  subtext?: string;
  scale?: string;
}

export function Title({ header, subtext, scale }: TitleProps) {
  return (
    <div className={`scale-${scale} mt-[100px]`}>
      <h1
        className={`text-4xl md:text-4xl lg:text-8xl font-semibold max-w-7xl mx-auto text-center  relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-sky-500 via-sky-800 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white mb-10`}
      >
        {header} <br /> <Cover>{subtext}</Cover>
      </h1>
    </div>
  );
}
