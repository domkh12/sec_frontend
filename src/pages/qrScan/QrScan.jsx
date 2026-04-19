import { Scanner } from '@yudiel/react-qr-scanner';

function QrScan() {
    return (
        <div className="flex justify-center items-center w-64 h-64">
            <Scanner
                onScan={(result) => console.log(result)}
                onError={(error) => console.log(error?.message)}
            />
        </div>
    )
}

export default QrScan;