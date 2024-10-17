import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";

interface Resume {
  _id: string;
  name: string;
  userId: string;
}

export const ResumeList = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const {
    isLoading: isLoadingResumes,
    error: resumeError,
    data: resumes,
  } = useQuery<Resume[]>({
    queryKey: ["Resume"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/resume`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) =>
          data.filter((resume: Resume) => resume.userId === userId)
        ),
  });

  const updateResumeMutation = useMutation({
    mutationFn: async ({ id, newName }: { id: string; newName: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: newName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update resume");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Resume", userId]);
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/${resumeId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Resume", userId]);
    },
  });

  const handleEditClick = (resume: Resume) => {
    setEditingId(resume._id);
    setNewName(resume.name || "Untitled");
  };

  const handleUpdate = (id: string) => {
    updateResumeMutation.mutate({ id, newName });
    setEditingId(null);
    setNewName("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      deleteResumeMutation.mutate(id);
      navigate("/dashboard");
    }
  };

  if (isLoadingResumes) return <div>Loading resumes...</div>;
  if (resumeError)
    return <div>Error loading resumes: {resumeError.message}</div>;

  return (
    <div className="min-w-[300px] mt-8">
      <p className="text-sm text-white ">Recent Resumes</p>
      <hr className="border-white mb-2" />
      <div className="flex flex-col space-y-0">
        {resumes?.map((resume) => (
          <div
            key={resume._id}
            className="flex items-center px-2 w-[350px] justify-between  rounded-lg transition"
          >
            {editingId === resume._id ? (
              <div className="flex items-center justify-between w-full max-w-[250px]">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-grow px-2 py-1 border border-gray-600 rounded-xl"
                />
                <div className="flex  pl-2 gap-2">
                  <button
                    onClick={() => handleUpdate(resume._id)}
                    className=" text-white  "
                  >
                    <IconCheck width={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className=" text-white "
                  >
                    <IconX width={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex max-w-[250px] w-full items-center justify-between">
                <Link
                  to={`/dashboard/resume/${resume._id}`}
                  className="text-white text-sm hover:underline"
                >
                  {resume.name || "Untitled"}
                </Link>
                <div className=" flex gap-2">
                  <button
                    onClick={() => handleEditClick(resume)}
                    className="text-white hover:text-blue-300"
                  >
                    <IconPencil width={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="text-white hover:text-red-300"
                  >
                    <IconTrash width={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {location.pathname.includes("/dashboard/resume") && (
        <p className="text-sm text-gray-400 mt-4">
          You are on the resume edit page.
        </p>
      )}
    </div>
  );
};
