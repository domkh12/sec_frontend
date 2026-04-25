function CardGlassBlur2({ children }) {
    return (
        <div className="
            relative z-10
            px-5 py-2.5 m-2
            rounded-xl overflow-hidden
            border border-white/20
            bg-white/10
            shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.25)]
            transition-all duration-200 ease-out
        ">
            {children}
        </div>
    );
}

export default CardGlassBlur2;