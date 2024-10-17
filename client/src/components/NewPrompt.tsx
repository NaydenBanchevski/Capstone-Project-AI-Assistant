import { useEffect, useRef, useState } from "react";
import { IKImage } from "imagekitio-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { model } from "./gemini/gemini";
import { Upload } from "./Upload";
import { IconArrowRight } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";

export const NewPrompt = ({ data }) => {
  const [questions, setQuestions] = useState([]); // Change from string to array
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const [loading, setLoading] = useState(false);

  const chat = model.startChat({
    history: [
      ...(data?.history || []).map(({ role, parts }) => ({
        role: role || "user",
        parts: [{ text: parts[0].text }],
      })),
    ],
    generationConfig: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, questions, answer, img.dbData]);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questions: questions.length ? questions : undefined, // Adjust to handle array
            answer,
            img: img.dbData?.filePath || undefined,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update chat");
      return response.json();
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestions([]); // Reset questions
          setAnswer("");
          setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
        });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const add = async (text) => {
    setLoading(true);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      let newText = "";

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        newText += chunkText;

        setAnswer(newText);
        await delay(100);
      }

      mutation.mutate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    setQuestions((prev) => [...prev, text]); // Append new question
    add(text);
    e.target.reset();
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && data?.history?.length === 1) {
      add(data.history[0].parts[0].text);
      hasRun.current = true;
    }
  }, [data]);

  return (
    <div className="flex sm:w-full px-4 mt-4 justify-center w-[400px]">
      <div className="h-full flex flex-col max-w-[1200px] ">
        {img.isLoading && (
          <div className="text-center text-gray-500 mb-4">Loading...</div>
        )}
        {img.dbData?.filePath && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_URL}
            path={img.dbData?.filePath}
            width="380"
            transformation={[{ width: 380 }]}
            className="rounded-md mb-4"
          />
        )}
        {questions.map((q, index) => (
          <div key={index} className="flex w-full justify-end ">
            <div className="bg-gradient-to-r from-sky-500 rounded-[15px] text-right p-2 px-4 ml-auto my-2 to-sky-800 text-white">
              {q}
            </div>
          </div>
        ))}
        {answer && (
          <div className="message p-4 max-w-[800px] text-justify rounded-[15px] mb-[20px] text-black">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
        <div className="flex justify-center mt-auto" ref={endRef}>
          <form
            className="flex bg-gradient-to-r rounded-2xl xl:w-[800px] from-sky-500 to-sky-800 justify-between items-center"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <div className="flex gap-4 items-center">
              <Upload setImg={setImg} />
              <input
                type="text"
                name="text"
                placeholder="Message Assistant"
                className="bg-transparent p-3 w-[250px] sm:w-[600px] text-white outline-none placeholder:text-neutral-200/50"
                aria-label="Message Assistant"
                disabled={loading}
              />
            </div>
            <button
              className="text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              <IconArrowRight width={20} aria-label="Send message" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
