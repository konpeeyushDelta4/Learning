export const isEvenMemo=(counterOne:number)=>{
    console.log("....waiting for expensive calculation");
    let i=0;
    while(i<2000000000) i++;
    return counterOne%2===0;
}
  