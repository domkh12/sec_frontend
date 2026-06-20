import ChartGrid from "../../components/chart/ChartGrid"

function Overview() {
  return (
    <div>
        <h1 className="text-white text-2xl text-center">Your Output got 100000pcs in the last 28 days</h1>
        <div className="grid grid-cols-4">
            <div className="sub-card-glass col-span-3">
              <ChartGrid/>
            </div>
            <div className="sub-card-glass"></div>
        </div>
    </div>
  )
}

export default Overview