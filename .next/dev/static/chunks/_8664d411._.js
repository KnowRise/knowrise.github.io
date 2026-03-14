(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/TimeLineItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TimelineItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function TimelineItem({ title, period, company, description, direction }) {
    const isRight = direction === 'right';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full mb-7 pl-10 md:pl-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-y-0 left-0 w-10 md:inset-0 md:w-full flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute w-3 h-3 rounded-full z-10",
                    style: {
                        background: 'var(--green)',
                        boxShadow: '0 0 0 4px var(--green-dim)'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/TimeLineItem.tsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/TimeLineItem.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `rounded-xl p-5 w-full md:w-5/12 border backdrop-blur-sm ${isRight ? 'md:ml-auto text-left' : 'md:mr-auto md:text-right'}`,
                style: {
                    background: 'var(--card-bg)',
                    borderColor: 'var(--card-border)'
                },
                "data-aos": isRight ? 'fade-left' : 'fade-right',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold",
                        style: {
                            color: 'var(--green)'
                        },
                        children: period
                    }, void 0, false, {
                        fileName: "[project]/src/components/TimeLineItem.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold mt-1",
                        style: {
                            color: 'var(--text-primary)'
                        },
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/TimeLineItem.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        style: {
                            color: 'var(--text-muted)'
                        },
                        children: company
                    }, void 0, false, {
                        fileName: "[project]/src/components/TimeLineItem.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-3 leading-relaxed",
                        style: {
                            color: 'var(--text-secondary)'
                        },
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/TimeLineItem.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/TimeLineItem.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/TimeLineItem.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = TimelineItem;
var _c;
__turbopack_context__.k.register(_c, "TimelineItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LoadingSkeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoadingSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function LoadingSkeleton({ count = 3, type = 'card' }) {
    const items = Array.from({
        length: count
    });
    if (type === 'text') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3 animate-pulse",
            children: items.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 rounded-full w-3/4",
                    style: {
                        background: 'var(--tag-bg)'
                    }
                }, i, false, {
                    fileName: "[project]/src/components/LoadingSkeleton.tsx",
                    lineNumber: 13,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/LoadingSkeleton.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this);
    }
    if (type === 'list') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 animate-pulse",
            children: items.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border p-5 space-y-3",
                    style: {
                        background: 'var(--card-bg)',
                        borderColor: 'var(--card-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-3 rounded-full w-1/4",
                            style: {
                                background: 'var(--tag-bg)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingSkeleton.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 rounded-full w-3/4",
                            style: {
                                background: 'var(--tag-bg)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingSkeleton.tsx",
                            lineNumber: 29,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-3 rounded-full w-full",
                            style: {
                                background: 'var(--tag-bg)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingSkeleton.tsx",
                            lineNumber: 30,
                            columnNumber: 13
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/LoadingSkeleton.tsx",
                    lineNumber: 23,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/LoadingSkeleton.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this);
    }
    // card (default — for skills grid)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse",
        children: items.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border p-5 space-y-3 h-32",
                style: {
                    background: 'var(--card-bg)',
                    borderColor: 'var(--card-border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 rounded-full w-1/3",
                        style: {
                            background: 'var(--tag-bg)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/LoadingSkeleton.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 rounded-lg w-16",
                                style: {
                                    background: 'var(--tag-bg)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/LoadingSkeleton.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 rounded-lg w-20",
                                style: {
                                    background: 'var(--tag-bg)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/LoadingSkeleton.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 rounded-lg w-14",
                                style: {
                                    background: 'var(--tag-bg)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/LoadingSkeleton.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/LoadingSkeleton.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/LoadingSkeleton.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/LoadingSkeleton.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = LoadingSkeleton;
var _c;
__turbopack_context__.k.register(_c, "LoadingSkeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://hfvtjobqcxeslpubyajq.supabase.co") || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VITE_SUPABASE_URL;
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdnRqb2JxY3hlc2xwdWJ5YWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODM1MzUsImV4cCI6MjA4MzE1OTUzNX0.6J2Oik3RBYjwVMFV-J7fu_O3xFF2MhSIbZ_xuBtYzD8") || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VITE_SUPABASE_ANON_KEY;
// Only create client if env vars are present
const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url';
const supabase = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey) : "TURBOPACK unreachable";
const isSupabaseConfigured = isConfigured;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/json/work_experiences.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v([{"period":"August - December 2024","title":"Web Developer Intern","company":"PT. Makerindo Prima Solusi","description":"I'm directly involved in the full development cycle of internal applications, from discussing requirements with clients and designing APIs using Laravel to assisting with the development of admin interfaces using React. I'm also responsible for deploying applications to the development environment."},{"period":"2025 - Present","title":"Junior Backend Developer","company":"PT. LinkBee Education & Solution","description":"Contribute to the development and maintenance of backend applications using Go and Laravel. Involved in API design, database optimization, and third-party service integration to ensure optimal application performance."}]);}),
"[project]/src/assets/json/education_history.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v([{"period":"2022 - 2025","title":"Software Engineer","company":"SMK Negeri 2 Sukabumi","description":"Complete vocational education with a focus on software development, algorithms, and data structures.","direction":"left"},{"period":"Sept 2025 - Present","title":"Informatics Student","company":"BSI University, Sukabumi","description":"Deepening my theoretical understanding of computer science fundamentals to support my growth as a competent software engineer."}]);}),
"[project]/src/views/Experience.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Experience
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TimeLineItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TimeLineItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoadingSkeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
// Static fallbacks
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2f$work_experiences$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/assets/json/work_experiences.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2f$education_history$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/assets/json/education_history.json (json)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function Experience() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('work');
    const [workExperiences, setWorkExperiences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [educationHistory, setEducationHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Experience.useEffect": ()=>{
            async function fetchData() {
                setLoading(true);
                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"]) {
                    const [{ data: workData }, { data: eduData }] = await Promise.all([
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('work_experiences').select('*').order('sort_order'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('education_history').select('*').order('sort_order')
                    ]);
                    if (workData) setWorkExperiences(workData);
                    if (eduData) setEducationHistory(eduData);
                } else {
                    // Fallback: transform static JSON to match interface
                    setWorkExperiences(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2f$work_experiences$2e$json__$28$json$29$__["default"].map({
                        "Experience.useEffect.fetchData": (w, i)=>({
                                id: String(i),
                                period: w.period,
                                title: w.title,
                                company: w.company,
                                description: w.description,
                                sort_order: i,
                                created_at: ''
                            })
                    }["Experience.useEffect.fetchData"]));
                    setEducationHistory(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2f$education_history$2e$json__$28$json$29$__["default"].map({
                        "Experience.useEffect.fetchData": (e, i)=>({
                                id: String(i),
                                period: e.period,
                                title: e.title,
                                institution: e.company,
                                description: e.description,
                                sort_order: i,
                                created_at: ''
                            })
                    }["Experience.useEffect.fetchData"]));
                }
                setLoading(false);
            }
            fetchData();
        }
    }["Experience.useEffect"], []);
    const tabClass = (tab)=>`py-2 px-6 rounded-lg text-sm font-semibold font-montserrat border transition-all ${activeTab === tab ? 'border-transparent' : 'border-transparent hover:border-[var(--green)]'}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full mx-auto py-14 page-in",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold font-montserrat text-center mb-10",
                style: {
                    color: 'var(--text-primary)'
                },
                children: "My Journey"
            }, void 0, false, {
                fileName: "[project]/src/views/Experience.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center gap-3 mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('work'),
                        className: tabClass('work'),
                        style: {
                            background: activeTab === 'work' ? 'var(--btn-active)' : 'var(--btn-inactive)',
                            color: activeTab === 'work' ? 'var(--btn-active-text)' : 'var(--btn-inactive-text)'
                        },
                        children: "Work Experience"
                    }, void 0, false, {
                        fileName: "[project]/src/views/Experience.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('education'),
                        className: tabClass('education'),
                        style: {
                            background: activeTab === 'education' ? 'var(--btn-active)' : 'var(--btn-inactive)',
                            color: activeTab === 'education' ? 'var(--btn-active-text)' : 'var(--btn-inactive-text)'
                        },
                        children: "Education"
                    }, void 0, false, {
                        fileName: "[project]/src/views/Experience.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/Experience.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 bottom-0 left-5 md:left-1/2 w-px -translate-x-1/2 z-0",
                        style: {
                            background: 'var(--timeline-line)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/views/Experience.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        type: "list",
                        count: 2
                    }, void 0, false, {
                        fileName: "[project]/src/views/Experience.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this) : activeTab === 'work' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: workExperiences.map((exp, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TimeLineItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                period: exp.period,
                                title: exp.title,
                                company: exp.company,
                                description: exp.description,
                                direction: index % 2 === 0 ? 'right' : 'left'
                            }, exp.id, false, {
                                fileName: "[project]/src/views/Experience.tsx",
                                lineNumber: 95,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/views/Experience.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: educationHistory.map((edu, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TimeLineItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                period: edu.period,
                                title: edu.title,
                                company: edu.institution,
                                description: edu.description,
                                direction: index % 2 === 0 ? 'right' : 'left'
                            }, edu.id, false, {
                                fileName: "[project]/src/views/Experience.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/views/Experience.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/Experience.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/Experience.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(Experience, "B+chcrOdXKN3pIBzw4r1Gsm3GgI=");
_c = Experience;
var _c;
__turbopack_context__.k.register(_c, "Experience");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/experience/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$views$2f$Experience$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/views/Experience.tsx [app-client] (ecmascript)");
'use client';
;
;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$views$2f$Experience$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/experience/page.tsx",
        lineNumber: 3,
        columnNumber: 41
    }, this);
}
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_8664d411._.js.map