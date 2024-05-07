const ColorSwitcher = (prop) => {
  const { handleSetColor, changeColor, colorValues } = prop;

  const colors = [
    { name: "Red", color: "bg-red-500" },
    { name: "Blue", color: "bg-blue-500" },
    { name: "Green", color: "bg-green-500" },
    { name: "Yellow", color: "bg-yellow-500" },
    { name: "Purple", color: "bg-purple-500" },
    { name: "Pink", color: "bg-pink-500" },
    { name: "Black", color: "bg-black" },
    { name: "White", color: "bg-white" },
    { name: "Grey", color: "bg-gray-500" },
  ];

  const toggleColor = (color) => {
    changeColor([color]);
    handleSetColor(color);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-3 mt-1">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`ml-2 w-7 h-7 rounded-full cursor-pointer ${color.color} ${
            colorValues.includes(color.name) ? "border-4 border-gray-700" : ""
          }`}
          onClick={() => toggleColor(color.name)}
        ></div>
      ))}
    </div>
  );
};

export default ColorSwitcher;
