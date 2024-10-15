import React from "react";

interface PlanCategory {
  title: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
}

export const Categories: React.FC = () => {
  const categories: PlanCategory[] = [
    {
      title: "Students",
      description:
        "Designed for current students to get personalized guidance for coursework and projects.",
      features: [
        "Course assistance (Java, MERN, Cybersecurity)",
        "Resume tips and building advice",
        "Access to community forums",
      ],
      isHighlighted: true, // Highlight the students plan
    },
    {
      title: "Alumni",
      description:
        "Ideal for graduates looking to stay connected and continue career growth.",
      features: [
        "Ongoing career support",
        "Advanced resume feedback",
        "Networking opportunities",
        "Access to alumni-exclusive resources",
      ],
    },
    {
      title: "Instructors",
      description:
        "Tailored for educators to support their students and stay updated with the latest tools.",
      features: [
        "Curriculum resources",
        "Student progress tracking tools",
        "Access to professional development materials",
        "Community of fellow educators",
      ],
    },
  ];

  return (
    <section className="text-white sm:mb-[100px] px-8">
      <div
        className="max-w-[1200px] 
       mt-0 mx-auto text-center"
      >
        <h2 className="text-4xl sm:mt-[100px]  md:text-4xl lg:text-7xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-sky-500 via-sky-800 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white mb-10">
          Categories <br />
          AI Assistant
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`p-8 rounded-2xl flex flex-col justify-between shadow-lg transition-transform transform ${
                category.isHighlighted
                  ? "bg-white text-sky-700 scale-105 border border-yellow-400" // Highlight the Students category
                  : "bg-sky-700 text-white"
              }`}
            >
              <h3 className="text-3xl font-bold mb-4">{category.title}</h3>
              <p className="mb-6">{category.description}</p>
              <ul className="mb-8 space-y-2">
                {category.features.map((feature, index) => (
                  <li key={index} className="text-lg">
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 px-6 rounded-xl font-semibold ${
                  category.isHighlighted
                    ? "bg-yellow-400 text-sky-700 hover:bg-yellow-500"
                    : "bg-white text-sky-700 hover:bg-yellow-500 cursor-not-allowed opacity-50"
                } transition duration-300`}
                disabled={!category.isHighlighted} // Disable buttons for non-highlighted categories
              >
                {category.isHighlighted
                  ? "Get Started as a Student"
                  : "Coming Soon"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
