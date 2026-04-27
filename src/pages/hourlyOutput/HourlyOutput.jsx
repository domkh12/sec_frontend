import {useGetProductionLineLookupQuery} from "../../redux/feature/productionLine/productionLineApiSlice.js";
import {useGetWorkOrderQuery} from "../../redux/feature/workOrder/workOrderApiSlice.js";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";

function HourlyOutput(){

    // -- Query --------------------------------------------------------------------------------
    const {data: productionLine} = useGetProductionLineLookupQuery();
    const {data: workOrderData, isLoading: isLoadingWO, isSuccess: isSuccessWO} = useGetWorkOrderQuery({
        pageNo: 1,
        pageSize: 20
    });

    let content;

    if (isLoadingWO) content = (<LoadingComponent/>);

    if (isSuccessWO) {

        const {ids, entities} = workOrderData || {};
        console.log(ids)
        console.log(entities)

        content = (
            <div className="bg-gray-100 absolute top-0 overflow-auto left-0 h-full w-full">
                <div className="pt-20  grid grid-cols-12">
                    <div className="col-span-1 flex flex-col gap-2 justify-start items-center pb-10">
                        {
                            productionLine?.map(item => (
                                <button key={item?.id} className="flex flex-col justify-center items-center gap-1 border border-gray-400 w-20 h-18.75 rounded-xl cursor-pointer shadow-lg hover:scale-105">
                                    <img src={item?.image || "/images/placeholder.png"} alt={item?.line} decoding={"async"} loading={"lazy"} width={"35%"} height={"100%"}/>
                                    <p className="text-sm">{item?.line}</p>
                                </button>
                            ))
                        }
                    </div>
                    <div className="col-span-8 border border-gray-400 rounded-2xl">

                    </div>
                    <div className="col-span-3 border border-gray-400 rounded-2xl">

                    </div>
                </div>
            </div>
        )
    }

    return content;
}

export default HourlyOutput;