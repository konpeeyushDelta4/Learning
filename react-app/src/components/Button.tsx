import { useState } from "react";

interface ButtonProps {
  text: string | number | boolean;
  onClick?: () => void;
}

type ButtonProps2= {
  text: string | number | boolean;
  onClick?: () => void;
}


interface Book{
    title: string;
    price: number;
}

//Implementation of generic type

// const Button:React.FC<ButtonProps> = (props) => {

//Implementation using type

const Button = (props:ButtonProps2) => {

    //destructring the props
   const {text, onClick}=props;

   const [value, setValue]=useState<Book>({
         title: 'Think and Grow Rich',
         price: 10
   });

  return (
    <>
    <h3>{value.title} is for {value.price} Rs.</h3>
    <button onClick={()=>setValue({title:"Wings of fire", price:250})}>{text}</button>
    </>
);
};

export default Button;
