module.exports = {

"[project]/src/app/utils/cyclePredictor.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EnhancedCyclePredictor": (()=>EnhancedCyclePredictor)
});
class EnhancedCyclePredictor {
    constructor(history = []){
        this.history = history; // List of { startDate, length }
    }
    predictNextCycle() {
        if (this.history.length < 2) return null;
        const sorted = [
            ...this.history
        ].sort((a, b)=>new Date(a.startDate) - new Date(b.startDate));
        const lengths = [];
        for(let i = 1; i < sorted.length; i++){
            const prev = new Date(sorted[i - 1].startDate);
            const curr = new Date(sorted[i].startDate);
            lengths.push((curr - prev) / (1000 * 60 * 60 * 24));
        }
        const avgLength = lengths.reduce((a, b)=>a + b) / lengths.length;
        const stdDev = Math.sqrt(lengths.map((x)=>Math.pow(x - avgLength, 2)).reduce((a, b)=>a + b) / lengths.length);
        const lastStart = new Date(sorted[sorted.length - 1].startDate);
        const predicted = new Date(lastStart.getTime() + avgLength * 24 * 60 * 60 * 1000);
        const fertileStart = new Date(lastStart.getTime() + (avgLength - 14 - 5) * 24 * 60 * 60 * 1000);
        const fertileEnd = new Date(lastStart.getTime() + (avgLength - 14 + 5) * 24 * 60 * 60 * 1000);
        return {
            predictedStartDate: predicted.toISOString().split("T")[0],
            confidenceInterval: [
                new Date(predicted.getTime() - stdDev * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                new Date(predicted.getTime() + stdDev * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            ],
            averageCycleLength: avgLength.toFixed(1),
            irregularityIndex: stdDev.toFixed(2),
            fertileWindow: [
                fertileStart.toISOString().split("T")[0],
                fertileEnd.toISOString().split("T")[0]
            ]
        };
    }
    addCycle(cycleEntry) {
        this.history.push(cycleEntry);
    }
}
}}),
"[project]/src/app/components/OvulationTracker.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AppContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/context/AppContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$cyclePredictor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/cyclePredictor.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$calendar$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-calendar/dist/index.js [app-ssr] (ecmascript) <locals>");
"use client";
;
;
;
;
;
;
const OvulationTracker = ()=>{
    const { cycles, token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AppContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppContext"])();
    const [insights, setInsights] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        ovulationDate: null,
        fertileWindow: {
            start: "-",
            end: "-"
        }
    });
    // Client-side prediction fallback
    const latestCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!cycles || cycles.length === 0) return null;
        return cycles[cycles.length - 1];
    }, [
        cycles
    ]);
    const calculateOvulationDate = ()=>{
        if (!latestCycle) return "-";
        const ovulationDate = new Date(latestCycle.startDate);
        ovulationDate.setDate(ovulationDate.getDate() + (latestCycle.length - 14));
        return ovulationDate.toLocaleDateString();
    };
    const calculateFertileWindow = ()=>{
        if (!latestCycle) return {
            start: "-",
            end: "-"
        };
        const ovulationDate = new Date(latestCycle.startDate);
        ovulationDate.setDate(ovulationDate.getDate() + (latestCycle.length - 14));
        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(ovulationDate.getDate() - 5);
        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(ovulationDate.getDate() + 1);
        return {
            start: fertileStart.toLocaleDateString(),
            end: fertileEnd.toLocaleDateString()
        };
    };
    // Fetch backend insights
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchInsights = async ()=>{
            if (!token || !navigator.onLine) {
                // Fallback to client-side prediction if offline
                const predictor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$cyclePredictor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EnhancedCyclePredictor"](cycles);
                const prediction = predictor.predictNextCycle();
                if (prediction) {
                    setInsights({
                        ovulationDate: prediction.predictedStartDate ? new Date(new Date(prediction.predictedStartDate).getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString() : "-",
                        fertileWindow: {
                            start: prediction.fertileWindow?.[0] ? new Date(prediction.fertileWindow[0]).toLocaleDateString() : "-",
                            end: prediction.fertileWindow?.[1] ? new Date(prediction.fertileWindow[1]).toLocaleDateString() : "-"
                        }
                    });
                }
                return;
            }
            try {
                const res = await fetch("http://localhost:8080/api/insights/cycle", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setInsights({
                        ovulationDate: data.nextPeriodPrediction ? new Date(new Date(data.nextPeriodPrediction).getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString() : calculateOvulationDate(),
                        fertileWindow: data.fertileWindow?.length ? {
                            start: new Date(data.fertileWindow[0]).toLocaleDateString(),
                            end: new Date(data.fertileWindow[1]).toLocaleDateString()
                        } : calculateFertileWindow()
                    });
                } else {
                    setInsights({
                        ovulationDate: calculateOvulationDate(),
                        fertileWindow: calculateFertileWindow()
                    });
                }
            } catch (err) {
                console.error("Failed to fetch insights:", err);
                setInsights({
                    ovulationDate: calculateOvulationDate(),
                    fertileWindow: calculateFertileWindow()
                });
            }
        };
        fetchInsights();
    }, [
        token,
        cycles
    ]);
    // Calendar tile content
    const tileContent = ({ date })=>{
        if (!insights.fertileWindow.start || !insights.fertileWindow.end) return null;
        const start = new Date(insights.fertileWindow.start);
        const end = new Date(insights.fertileWindow.end);
        const ovulation = new Date(insights.ovulationDate);
        if (date.toDateString() >= start.toDateString() && date.toDateString() <= end.toDateString()) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-pink-300 font-bold",
                children: "●"
            }, void 0, false, {
                fileName: "[project]/src/app/components/OvulationTracker.js",
                lineNumber: 121,
                columnNumber: 14
            }, this);
        }
        if (date.toDateString() === ovulation.toDateString()) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-pink-500 font-bold",
                children: "★"
            }, void 0, false, {
                fileName: "[project]/src/app/components/OvulationTracker.js",
                lineNumber: 124,
                columnNumber: 14
            }, this);
        }
        return null;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl font-semibold mb-6 text-foreground",
                children: "Ovulation Tracker"
            }, void 0, false, {
                fileName: "[project]/src/app/components/OvulationTracker.js",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            !latestCycle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-foreground/80",
                children: "No cycle data available. Please log a cycle to see ovulation predictions."
            }, void 0, false, {
                fileName: "[project]/src/app/components/OvulationTracker.js",
                lineNumber: 136,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md  bg-light-bg/50 dark:bg-dark-bg/50  transition-colors duration-300 ease",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-foreground mb-3",
                                children: "Estimated Ovulation Date"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-foreground text-lg font-semibold",
                                children: insights.ovulationDate
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/OvulationTracker.js",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md  bg-light-bg/50 dark:bg-dark-bg/50  transition-colors duration-300 ease",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-foreground mb-3",
                                children: "Fertile Window"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Start:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-foreground/90",
                                                children: insights.fertileWindow.start
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/OvulationTracker.js",
                                        lineNumber: 164,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "End:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-foreground/90",
                                                children: insights.fertileWindow.end
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/OvulationTracker.js",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/OvulationTracker.js",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md  bg-light-bg/50 dark:bg-dark-bg/50  transition-colors duration-300 ease",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-foreground mb-3",
                                children: "Fertile Window Calendar"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$calendar$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                tileContent: tileContent,
                                className: "border-none bg-transparent"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/OvulationTracker.js",
                                lineNumber: 187,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/OvulationTracker.js",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md  bg-light-bg/30 dark:bg-dark-bg/30  text-foreground/80 text-sm transition-colors duration-300 ease",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Note: These dates are estimates based on your logged cycles. Your actual fertile window may vary. Consider tracking additional fertility signs for more accuracy."
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/OvulationTracker.js",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/OvulationTracker.js",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/OvulationTracker.js",
                lineNumber: 141,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/OvulationTracker.js",
        lineNumber: 130,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = OvulationTracker;
}}),
"[project]/src/app/components/ProtectedRoute.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProtectedRoute)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AppContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/context/AppContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ProtectedRoute({ children, allowedRoles }) {
    const { user, token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AppContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!token) {
            router.push("/login");
        } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            router.push("/"); // Redirect to home if role not allowed
        }
    }, [
        token,
        user,
        allowedRoles,
        router
    ]);
    if (!token || allowedRoles && user && !allowedRoles.includes(user.role)) {
        return null;
    }
    return children;
}
}}),
"[project]/src/app/ovulation/page.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>OvulationTrackerPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$OvulationTracker$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/OvulationTracker.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ProtectedRoute$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ProtectedRoute.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AppContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/context/AppContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function OvulationTrackerPage() {
    const { cycles, fetchCycles } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AppContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchCycles();
    }, [
        fetchCycles
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ProtectedRoute$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        allowedRoles: [
            "user",
            "doctor",
            "admin"
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-semibold mb-4",
                    children: "Ovulation Tracker"
                }, void 0, false, {
                    fileName: "[project]/src/app/ovulation/page.js",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$OvulationTracker$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    cycles: cycles
                }, void 0, false, {
                    fileName: "[project]/src/app/ovulation/page.js",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/ovulation/page.js",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/ovulation/page.js",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_app_0863e62a._.js.map