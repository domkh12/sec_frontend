import "./ui.css";
function LoadingComponent() {
    return (
       <div className="w-full h-full pt-32 flex items-center justify-center">
           <div className="lds-ellipsis"><div></div><div></div><div></div></div>
       </div>
    )
}

export default LoadingComponent;