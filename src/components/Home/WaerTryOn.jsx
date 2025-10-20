export default function WearTryOn() {
    return (
        <div
            className="hidden md:flex h-[80%] col-span-3 flex-col justify-between mb-8 md:mb-0"
            style={{
                position: 'absolute',
                width: 373,
                
                left: 7,
                top: 30,
                fontFamily: 'Kantumruy Pro',
                zIndex: 99,
                fontStyle: 'normal',
                fontWeight: 700,
                color: '#00397B',
                WebkitTextStroke: "0.2px white",
                textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
            }}
        >
            <div>

            <h1
                className="mb-2"
                style={{
                    fontSize: 55,
                    lineHeight: '99px',
                }}
            >
                WEAR
            </h1>
            <div className="mb-2">
                <span className="block text-2xl md:text-3xl font-bold leading-tight" style={{ color: '#00397B', fontFamily: 'Kantumruy Pro' }}>
                    See How Clothes
                    <br />
                     Look On You
                </span>
                <span className="block text-4xl md:text-5xl font-bold mt-2" style={{ color: '#FF8800', fontFamily: 'Kantumruy Pro' }}>
                    Instantly!
                </span>
            </div>
            </div>
            <button
                className="w-[255px] h-[49px] self-center ml-16 bg-orange-500 hover:bg-orange-600 text-white font-normal px-8 py-2 rounded-lg transition-all duration-300 shadow-lg mt-auto"
                style={{
                    fontFamily: 'Kanit',
                    fontStyle: 'normal',
                    zIndex: 10,
                    fontWeight: 400,
                    fontSize: 20,
                }}
            >
                Start Try-On Now
            </button>
        </div>
    );
}



