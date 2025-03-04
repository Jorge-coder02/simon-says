interface Props {
  bg_color: "yellow" | "red" | "blue" | "green";
  active: boolean;
  onClick: (e: string) => void;
}

const SimonPad = ({ bg_color, active, onClick }: Props) => {
  const colorClasses = {
    yellow: "bg-yellow-200",
    red: "bg-red-200",
    blue: "bg-blue-200",
    green: "bg-green-200",
  };
  const activeColorClasses = {
    yellow: "bg-yellow-400",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-400",
  };
  return (
    <button
      onClick={() => onClick(bg_color)}
      className={`${
        !active ? colorClasses[bg_color] : activeColorClasses[bg_color]
      } w-16 h-16 sm:w-20 sm:h-20 rounded-lg`}
    ></button>
  );
};

export default SimonPad;
