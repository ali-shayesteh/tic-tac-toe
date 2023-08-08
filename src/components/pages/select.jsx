const modes = [
    { 
        title: "Single Player",
        value: "s"
    },
    { 
        title: "Multi Player",
        value: "m"
    }
]
export default function Select({onClick}) {
    return (
        <>
         {
            modes.map((mode) => {
                return(
                    <button onClick={() => onClick(mode.value)}>{mode.title}</button>
                )
            } )
         }
        </>
    )
}