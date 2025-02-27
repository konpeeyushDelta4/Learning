import React from 'react'

interface ButtonProps {
    handleClick: () => void;
    name: string;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
}

const Button: React.FC<ButtonProps> = React.memo(({handleClick, name, disabled=false, variant="primary"}) => {

    console.log(`${name} button rendered`);

    // Tailwind class mapping based on variant
    const variantClasses = {
        primary: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300",
        secondary: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-300",
        danger: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
    };


    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
                px-4 py-2 rounded-md text-white font-medium
                ${variantClasses[variant]}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                transition duration-200 ease-in-out
                shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
        >
            {name}
        </button>
    )
});

export default Button