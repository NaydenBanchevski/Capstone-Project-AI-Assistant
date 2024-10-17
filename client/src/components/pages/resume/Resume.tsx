import { useCallback, useEffect, useState, useRef } from "react";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { useParams, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Quill, { Quill as QuillType } from "quill";
import { useAuth } from "@clerk/clerk-react";

import Markdown from "react-markdown";
import { IconArrowRight } from "@tabler/icons-react";
import { model } from "../../gemini/gemini";

interface ChatMessage {
  sender: "user" | "assistant";
  message: string;
  timestamp: Date;
}

interface JobResumePageProps {
  data: {
    chatHistory?: ChatMessage[];
  };
}

const printButton = {
  icon: '<span class="ql-print">🖨️</span>',
  title: "Print",
};

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export const Resume: React.FC<JobResumePageProps> = ({ data }) => {
  const { id: documentId } = useParams<{ id: string }>();
  const location = useLocation();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quill, setQuill] = useState<QuillType | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const { userId } = useAuth();

  const chat = model.startChat({
    history:
      data?.chatHistory?.map(({ sender, message }) => ({
        role: sender === "user" ? "user" : "model",
        parts: [{ text: message }],
      })) || [],
    generationConfig: {},
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      content,
      chatMessage,
    }: {
      content: any;
      chatMessage: ChatMessage[] | null;
    }) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/resume/${documentId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, chatMessage, userId }),
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error during mutation:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("Resume");
    },
  });

  useEffect(() => {
    const s = io("http://localhost:3001", {
      query: { userId },
    });
    setSocket(s);

    return () => s.disconnect();
  }, [userId]);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document: any) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      const content = quill.getContents();
      mutation.mutate({ content, chatMessage: null });
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill, mutation]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);

    return () => socket.off("receive-changes", handler);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta: any, oldDelta: any, source: string) => {
      if (source !== "user") return;

      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = (e.target as any).text.value; // Use `as any` for simpler access

    if (text) {
      addPrompt(text);
      (e.target as HTMLFormElement).reset();
    }
  };

  const addPrompt = async (text: string) => {
    setQuestion(text);

    try {
      const result = await chat.sendMessageStream([text]);
      let accumulatedText = "";

      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
        setAnswer(accumulatedText);
      }

      const userMessage: ChatMessage = {
        sender: "user",
        message: text,
        timestamp: new Date(),
      };

      const assistantMessage: ChatMessage = {
        sender: "assistant",
        message: accumulatedText,
        timestamp: new Date(),
      };

      setChatHistory((prevHistory) => [
        ...prevHistory,
        userMessage,
        assistantMessage,
      ]);

      mutation.mutate({
        content: quill.getContents(),
        chatMessage: [userMessage, assistantMessage],
        userId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);

    const toolbar: any = q.getModule("toolbar");
    toolbar.addHandler("print", printDocument);

    const toolbarContainer = toolbar.container;
    const button = document.createElement("button");
    button.innerHTML = printButton.icon;
    button.title = printButton.title;
    button.classList.add("ql-print");
    button.addEventListener("click", printDocument);
    toolbarContainer.appendChild(button);
  }, []);

  const printDocument = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const quillHtml = quill?.root.innerHTML || "";

    const doc = iframe.contentWindow!.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print Document</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.6/quill.snow.css">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            @media print {
              @page {
                margin: 0;
              }
              body {
                margin: 10;
                padding: 20;
              }
            }
          </style>
        </head>
        <body>
          ${quillHtml}
        </body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      document.body.removeChild(iframe);
    };
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/${documentId}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      setChatHistory(result.chatHistory || []);
    } catch (error) {
      console.error("Error during fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [location.key]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [chatHistory]);

  return (
    <div className="block lg:flex mt-8 w-full  justify-evenly h-[90vh]">
      <div className="mb-4 w-full max-h-[80vh] h-full" ref={wrapperRef}></div>
      <div className="flex w-full pt-[20px]  max-w-[800px] h-full lg:mt-0  max-h-[83vh] flex-col flex-grow items-center justify-end">
        <div
          ref={chatContainerRef}
          className="flex flex-col mb-[20px]   overflow-auto w-full p-4 space-y-4"
        >
          {chatHistory.map((message, index) => (
            <div key={index}>
              {message.sender === "user" ? (
                <div className="flex w-full justify-end ">
                  <div className="bg-gradient-to-r from-sky-500  to-sky-800 rounded-[15px] text-right p-2 px-4 ml-auto  text-white">
                    {message.message}
                  </div>
                </div>
              ) : (
                <div className="message p-2  max-w-[800px] text-justify rounded-[15px] mb-[20px] text-black">
                  <Markdown>{message.message}</Markdown>
                </div>
              )}
            </div>
          ))}
        </div>
        <form
          className="flex bg-gradient-to-r  from-sky-500 to-sky-800 rounded-2xl w-[300px] md:w-[600px] justify-between items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="text"
            placeholder="Message Assistant"
            className="bg-transparent p-3 pl-6 w-full text-white outline-none placeholder:text-white/50 autofill:rounded-2xl"
          />
          <button type="submit" className=" text-white px-4 py-2 rounded-md">
            <IconArrowRight width={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
