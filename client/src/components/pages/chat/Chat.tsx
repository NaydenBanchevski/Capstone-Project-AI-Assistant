import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { NewPrompt } from "../../NewPrompt";

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
    <div className="sm:w-full flex min-h-[80vh] mt-[50px] px-4 w-[350px] m-auto items-center justify-end  rounded-2xl flex-col">
      <div className="flex max-w-[800px] w-full justify-center">
        <div className="flex flex-col justify-between gap-4 w-full">
          {isLoading ? (
            <div className="text-center flex  text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="text-center text-red-500">
              Something went wrong!
            </div>
          ) : (
            data?.history?.map((message, i) => (
              <div key={i} className="w-full">
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
                  className={`w-fit ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-sky-500 rounded-[15px] text-right p-2 px-4 ml-auto my-2 to-sky-800 text-white"
                      : "rounded-[15px] text-justify  my-2 mr-auto text-black"
                  }`}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {data && <NewPrompt data={data} />}
    </div>
  );
};
