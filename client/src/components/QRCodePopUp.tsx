import React from 'react'

const QRCodePopUp = ({setShowSharePopup,qrCode,newURL}:{setShowSharePopup:React.Dispatch<React.SetStateAction<boolean>>,qrCode:string,newURL:string}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center">
    {/* Background Overlay */}
    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80 z-10"></div>

    {/* Modal Content */}
    <div className="bg-white p-5 rounded-md z-30 relative">
        <div className="flex justify-end items-center">
            <button className="text-[20px] font-medium" onClick={() => setShowSharePopup(false)}>×</button>
        </div>
        <div className="flex gap-2 flex-col items-center">
            <img src={qrCode} alt="QR Code" className="w-40 h-40" />
            <div className="flex flex-col items-center text-[14px]">
                <div>Scan the Above QRCode</div>
                <div className="font-medium">OR</div>
                <div>Copy the given link and share it with your friends</div>
            </div>
            <div className="text-blue-800 font-medium underline text-[14px]">{newURL}</div>
            <button onClick={() =>{
                 navigator.clipboard.writeText(newURL);
                 alert("url copied...")
            }}
                className="bg-blue-800 text-white p-2 rounded-md w-full">Copy</button>
        </div>
    </div>
</div>

  )
}

export default QRCodePopUp