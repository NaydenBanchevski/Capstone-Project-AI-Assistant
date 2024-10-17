import { IconPlus } from "@tabler/icons-react";
import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_URL;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

interface ImageData {
  filePath: string;
}

interface UploadProps {
  setImg: React.Dispatch<
    React.SetStateAction<{
      isLoading: boolean;
      error?: string;
      dbData: ImageData | {};
      aiData: { inlineData?: { data: string; mimeType: string } } | {};
    }>
  >;
}

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export const Upload: React.FC<UploadProps> = ({ setImg }) => {
  const ikUploadRef = useRef<HTMLInputElement | null>(null);

  const onError = (err: Error) => {
    console.log("Error", err);
  };

  const onSuccess = (res: ImageData) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress: number) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg((prev) => ({
          ...prev,
          isLoading: true,
          aiData: {
            inlineData: {
              data: reader.result?.toString().split(",")[1] || "",
              mimeType: file.type,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      <label onClick={() => ikUploadRef.current?.click()}>
        <IconPlus className="text-white/50 cursor-pointer ml-4 t" />
      </label>
    </IKContext>
  );
};
