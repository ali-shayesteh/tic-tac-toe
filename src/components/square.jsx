export default function Square({val, onClick}){
    return(
        <div onClick={onClick} className="square">{val}</div>
    )
}