interface ButtonProps {
    type: "signin" | "login" | "default"; // You can add more types as needed
    children: React.ReactNode;
  }
  
  const Button: React.FC<ButtonProps> = ({ type, children }) => {
    return (
      <button
        className={
          type === "signin"
            ? `bg-[#000] shadow-xl rounded-[0.5rem] w-[4.1rem] h-[1.69rem] text-[#FFF] text-[0.65rem] font-medium sm:w-[5rem] sm:h-[1.9rem] sm:rounded-[0.7rem] sm:text-[0.8rem] md:w-[6.5625rem] md:h-[2.5625rem] md:rounded-[0.75rem] md:text-[1rem] md:font-semibold transition duration-700 ease-in-out hover:bg-white hover:text-[#000000] hover:border-[#000000] border-[1.3px]`
            : type === "login"
            ? `bg-none rounded-[0.5rem] w-[4.1rem] h-[1.69rem] text-[#000] text-[0.65rem] font-medium sm:w-[5rem] sm:h-[1.9rem] sm:rounded-[0.7rem] sm:text-[0.8rem] md:h-[2.5625rem] md:rounded-[0.75rem] md:text-[1rem] md:font-semibold`
            : ""
        }
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  