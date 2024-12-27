import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      //   e.preventDefault();
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-formInput py-2 px-3 rounded outline-none placeholder:text-[#eee]"
          placeholder="Add Tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#00afb9]  hover:bg-white hover:border-none"
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className="text-2xl text-primary hover:text-[#333]" />
        </button>
      </div>

      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-x-2 text-[#464646] text-sm bg-[#f9f9f9] p-1 rounded"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-[#333]"
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
