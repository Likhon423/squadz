"use client";

import { useState } from "react";
import { addGame } from "@/lib/actions";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AddGame = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>("/img_insert.png");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !desc || !img) {
      setError("Please fill in all fields correctly.");
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      await addGame(formData, img);
      router.push("/");
    } catch (error) {
      setError("Error creating game.");
    }
  };

  return (
    <div className="flex flex-col py-4 gap-4">
      <div className="text-2xl red-text font-medium">Add Game</div>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 justify-between text-center">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-md">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm text-black"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="desc" className="text-md">
                Description
              </label>
              <textarea
                placeholder="Game Description"
                id="desc"
                name="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm h-40 text-black"
                maxLength={500}
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="text-md">
              Image
            </label>
            <CldUploadWidget
              uploadPreset="squadz"
              onSuccess={(result) => {
                if (
                  typeof result.info === "object" &&
                  result.info?.secure_url
                ) {
                  setImg(result.info.secure_url);
                } else {
                  console.error(
                    "Upload result is invalid or secure_url is missing."
                  );
                }
              }}
            >
              {({ open }) => (
                <Image
                  src={img || "/img_insert.png"}
                  alt="Game Image"
                  width={260}
                  height={200}
                  className="cursor-pointer self-center ring-1 ring-gray-300"
                  onClick={() => open()}
                />
              )}
            </CldUploadWidget>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <button
            type="submit"
            className="bg-red-500 text-lg rounded-md px-10 py-4"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;
