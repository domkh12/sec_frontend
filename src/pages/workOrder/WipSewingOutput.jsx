import StatCardsDash from "../../components/card/StatCardsDash.jsx";
import useGenerateColor from "../../hook/useGenerateColor.jsx";

function WipSewingOutput() {
    const colors = useGenerateColor();
    console.log(colors);
    return (
        <div className="card-glass flex gap-5 items-center">
            <StatCardsDash/>
            <StatCardsDash/>
            <StatCardsDash/>
            <StatCardsDash/>
        </div>
    )
}

export default WipSewingOutput;