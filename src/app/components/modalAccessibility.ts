/** Classes partilhadas para modais (modo normal e alto contraste WCAG). */
export function modalA11yClasses(highContrast: boolean) {
  const hc = highContrast;

  return {
    backdrop: "fixed inset-0 bg-black/60 z-50",
    panel: hc
      ? "bg-black border-2 border-white rounded-3xl shadow-none max-w-md w-full p-8 relative text-white max-h-[90dvh] overflow-y-auto"
      : "bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative max-h-[90dvh] overflow-y-auto",
    closeBtn: hc
      ? "absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-xl border border-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
      : "absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500",
    title: hc
      ? "text-2xl font-bold text-white"
      : "text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent",
    subtitle: hc ? "text-white/85" : "text-slate-600",
    label: hc ? "text-white" : "text-slate-700",
    icon: hc ? "text-yellow-300" : "text-cyan-600",
    heading: hc
      ? "text-sm mb-1 text-white font-semibold"
      : "text-sm mb-1 text-slate-800 font-medium",
    body: hc
      ? "text-sm text-white/90 leading-relaxed"
      : "text-sm text-slate-600 leading-relaxed",
    callout: hc
      ? "rounded-2xl p-4 border-2 border-white bg-black text-white/90"
      : "bg-slate-50 rounded-2xl p-4 border border-slate-100",
    calloutStrong: hc ? "text-yellow-300" : "text-slate-800",
    link: hc
      ? "text-cyan-300 hover:text-yellow-300 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
      : "text-cyan-600 hover:text-cyan-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500",
    primaryBtn: hc
      ? "w-full py-3 bg-yellow-300 text-black font-bold border-2 border-white rounded-2xl transition-all hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
      : "w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl shadow-md transition-all hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500",
    chipInactive: hc
      ? "bg-black text-white border-2 border-white hover:bg-neutral-900"
      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
    chipActive: hc
      ? "bg-yellow-300 text-black border-2 border-white font-bold"
      : "bg-cyan-500 text-white shadow-md",
    toggleTrackOn: hc ? "bg-yellow-300" : "bg-cyan-500",
    toggleTrackOff: hc ? "bg-black border-2 border-white" : "bg-slate-200",
    toggleThumb: hc ? "bg-black" : "bg-white",
    range: hc
      ? "w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-yellow-300 border border-white"
      : "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500",
    speedLabel: hc ? "text-xs font-bold text-yellow-300" : "text-xs font-bold text-cyan-600",
    avatarFrame: hc
      ? "w-24 h-24 rounded-2xl overflow-hidden border-4 border-white bg-black"
      : "w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-900",
  };
}
