import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { NewPrompt } from "../../components/NewPrompt";

interface Message {
  img?: string;
  role: string;
  parts: Array<{ text: string }>;
}

interface ChatData {
  history: Message[];
}

export const Chat = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isLoading, isError, data } = useQuery<ChatData, Error>({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chat/${chatId}`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
  });

  return (
    <div className="w-full flex h-full rounded-2xl flex-col">
      <div className="mx-auto h-full min-h-[80vh] p-4 flex flex-col">
        <div className="flex-grow justify-end flex flex-col ">
          {isLoading ? (
            <div className="text-center flex  text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="text-center text-red-500">
              Something went wrong!
            </div>
          ) : (
            data?.history?.map((message, i) => (
              <div key={i} className="flex flex-col w-full mb-[50px]">
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_URL}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: "300", width: "400" }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                    className="rounded-md mb-2"
                  />
                )}
                <div
                  className={`message mb-auto p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-sky-500 rounded-[15px] text-right max-w-[500px] ml-auto to-sky-800 text-white"
                      : "rounded-[15px] max-w-[800px] my-1 mr-auto text-black"
                  }`}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-4 absolute left-[25%] right-[25%] bottom-10">
        {data && <NewPrompt data={data} />}
      </div>
    </div>
  );
};
