const messagingport = browser.runtime.connectNative("singlefile_companion");

! function () {
    "use strict";
    async function e(t, a) {
        let n;
        try {
            n = await browser.downloads.download(t)
        } catch (n) {
            if (n.message) {
                const r = n.message.toLowerCase(),
                    o = r.includes("illegal characters") || r.includes("invalid filename");
                if (o && t.filename.startsWith(".")) return t.filename = a + t.filename, e(t, a);
                if (o && t.filename.includes(",")) return t.filename = t.filename.replace(/,/g, a), e(t, a);
                if (o && !t.filename.match(/^[\x00-\x7F]+$/)) return t.filename = t.filename.replace(/[^\x00-\x7F]+/g, a), e(t, a);
                if ((r.includes("'incognito'") || r.includes('"incognito"')) && t.incognito) return delete t.incognito, e(t, a);
                if ("conflictaction prompt not yet implemented" == r && t.conflictAction) return delete t.conflictAction, e(t, a);
                if (r.includes("canceled")) return {};
                throw n
            }
            throw n
        }
        return new Promise(((e, t) => {
            browser.downloads.onChanged.addListener((function a(r) {
                r.id == n && r.state && ("complete" == r.state.current && (browser.downloads.search({
                    id: n
                }).then((t => e({
                    filename: t[0] && t[0].filename
                }))).catch((() => e({}))), browser.downloads.onChanged.removeListener(a)), "interrupted" == r.state.current && (r.error && "USER_CANCELED" == r.error.current ? e({}) : t(new Error(r.state.current)), browser.downloads.onChanged.removeListener(a)))
            }))
        }))
    }
    let t, a, n;
    async function r(e) {
        a && delete a[e];
        const t = await s();
        if (t[e]) {
            const a = t[e].autoSave;
            t[e] = {
                autoSave: a
            }, await i(t)
        }
    }

    function o(e) {
        return a || (a = {}), void 0 === e || a[e] || (a[e] = {}), a
    }
    async function s(e) {
        if (!t) {
            const e = await browser.storage.local.get();
            t = e.tabsData || {}
        }
        return async function () {
            if (!n) {
                n = !0;
                const e = await browser.tabs.query({
                    currentWindow: !0,
                    highlighted: !0
                });
                Object.keys(t).filter((t => {
                    if ("autoSaveAll" != t && "autoSaveUnpinned" != t && "profileName" != t) return !e.find((e => e.id == t))
                })).forEach((e => delete t[e])), await browser.storage.local.set({
                    tabsData: t
                })
            }
        }(), void 0 === e || t[e] || (t[e] = {}), t
    }
    async function i(e) {
        t = e, await browser.storage.local.set({
            tabsData: e
        })
    }
    setTimeout((() => s().then((e => t = e))), 0);
    const c = "-",
        l = "__Default_Settings__",
        d = "__Disabled_Settings__",
        u = "regexp:",
        f = {
            removeHiddenElements: !0,
            removeUnusedStyles: !0,
            removeUnusedFonts: !0,
            removeFrames: !1,
            removeImports: !0,
            removeScripts: !0,
            compressHTML: !0,
            compressCSS: !1,
            loadDeferredImages: !0,
            loadDeferredImagesMaxIdleTime: 1500,
            loadDeferredImagesBlockCookies: !1,
            loadDeferredImagesBlockStorage: !1,
            loadDeferredImagesKeepZoomLevel: !1,
            filenameTemplate: "{page-title} ({date-locale} {time-locale}).html",
            infobarTemplate: "",
            includeInfobar: !1,
            confirmInfobarContent: !1,
            autoClose: !1,
            confirmFilename: !1,
            filenameConflictAction: "uniquify",
            filenameMaxLength: 192,
            filenameMaxLengthUnit: "bytes",
            filenameReplacedCharacters: ["~", "+", "\\\\", "?", "%", "*", ":", "|", '"', "<", ">", "\0-", ""],
            filenameReplacementCharacter: "_",
            contextMenuEnabled: !0,
            tabMenuEnabled: !0,
            browserActionMenuEnabled: !0,
            shadowEnabled: !0,
            logsEnabled: !0,
            progressBarEnabled: !0,
            maxResourceSizeEnabled: !1,
            maxResourceSize: 10,
            removeAudioSrc: !0,
            removeVideoSrc: !0,
            displayInfobar: !0,
            displayStats: !1,
            backgroundSave: !/Mobile.*Firefox/.test(navigator.userAgent),
            defaultEditorMode: "normal",
            applySystemTheme: !0,
            autoSaveDelay: 1,
            autoSaveLoad: !1,
            autoSaveUnload: !1,
            autoSaveLoadOrUnload: !0,
            autoSaveDiscard: !1,
            autoSaveRemove: !1,
            autoSaveRepeat: !1,
            autoSaveRepeatDelay: 10,
            removeAlternativeFonts: !0,
            removeAlternativeMedias: !0,
            removeAlternativeImages: !0,
            groupDuplicateImages: !0,
            saveRawPage: !1,
            saveToClipboard: !1,
            addProof: !1,
            saveToGDrive: !1,
            saveToGitHub: !1,
            githubToken: "",
            githubUser: "",
            githubRepository: "SingleFile-Archives",
            githubBranch: "main",
            saveWithCompanion: !1,
            forceWebAuthFlow: !1,
            resolveFragmentIdentifierURLs: !1,
            userScriptEnabled: !1,
            openEditor: !1,
            openSavedPage: !1,
            autoOpenEditor: !1,
            saveCreatedBookmarks: !1,
            allowedBookmarkFolders: [],
            ignoredBookmarkFolders: [],
            replaceBookmarkURL: !0,
            saveFavicon: !0,
            includeBOM: !1,
            warnUnsavedPage: !0,
            autoSaveExternalSave: !1,
            insertMetaNoIndex: !1,
            insertMetaCSP: !0,
            passReferrerOnError: !1,
            insertSingleFileComment: !0,
            blockMixedContent: !1,
            saveOriginalURLs: !1,
            acceptHeaders: {
                font: "application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8",
                image: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                stylesheet: "text/css,*/*;q=0.1",
                script: "*/*",
                document: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                video: "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
                audio: "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"
            },
            moveStylesInHead: !1,
            woleetKey: ""
        },
        h = [{
            url: "file:",
            profile: "__Default_Settings__",
            autoSaveProfile: "__Disabled_Settings__"
        }];
    let m, w = p();
    async function p() {
        const {
            sync: e
        } = await browser.storage.local.get();
        m = e ? browser.storage.sync : browser.storage.local;
        const t = await m.get();
        if (t.profiles) t.rules || (t.rules = h), Object.keys(t.profiles).forEach((e => b(t.profiles[e]))), await m.remove(["profiles", "defaultProfile", "rules"]), await m.set({
            profiles: t.profiles,
            rules: t.rules
        });
        else {
            const e = t;
            delete e.tabsData, b(e);
            const a = {
                profiles: {},
                rules: h
            };
            a.profiles.__Default_Settings__ = e, m.remove(Object.keys(f)), await m.set(a)
        }
        t.maxParallelWorkers || await m.set({
            maxParallelWorkers: navigator.hardwareConcurrency || 4
        })
    }

    function b(e) {
        Object.keys(f).forEach((t => function (e, t) {
            void 0 === e[t] && (e[t] = f[t])
        }(e, t)))
    }
    async function g(e, t) {
        const a = await y(),
            n = a.rules.filter((e => k(e)));
        let r = n.sort(v).find((t => e && e.match(new RegExp(t.url.split(u)[1]))));
        if (!r) {
            const n = a.rules.filter((e => !k(e)));
            r = n.sort(v).find((a => !t && "*" == a.url || e && e.includes(a.url)))
        }
        return r
    }
    async function y() {
        return await w, m.get(["profiles", "rules", "maxParallelWorkers"])
    }

    function v(e, t) {
        return t.url.length - e.url.length
    }

    function k(e) {
        return e.url.toLowerCase().startsWith(u)
    }
    async function I(t) {
        if (t.method.endsWith(".deleteRules") && await async function (e) {
                const t = await y();
                t.rules = t.rules = e ? t.rules.filter((t => t.autoSaveProfile != e && t.profile != e)) : [], await m.set({
                    rules: t.rules
                })
            }(t.profileName), t.method.endsWith(".deleteRule") && await async function (e) {
                if (!e) throw new Error("URL is empty");
                const t = await y();
                t.rules = t.rules.filter((t => t.url != e)), await m.set({
                    rules: t.rules
                })
            }(t.url), t.method.endsWith(".addRule") && await T(t.url, t.profileName, t.autoSaveProfileName), t.method.endsWith(".createProfile") && await async function (e, t) {
                const a = await y();
                if (Object.keys(a.profiles).includes(e)) throw new Error("Duplicate profile name");
                a.profiles[e] = JSON.parse(JSON.stringify(a.profiles[t])), await m.set({
                    profiles: a.profiles
                })
            }(t.profileName, t.fromProfileName || l), t.method.endsWith(".renameProfile") && await async function (e, t) {
                const [a, n] = await Promise.all([y(), s()]);
                if (!Object.keys(a.profiles).includes(e)) throw new Error("Profile not found");
                if (Object.keys(a.profiles).includes(t)) throw new Error("Duplicate profile name");
                if (e == l) throw new Error("Default settings cannot be renamed");
                n.profileName == e && (n.profileName = t, await i(n));
                a.profiles[t] = a.profiles[e], a.rules.forEach((a => {
                    a.profile == e && (a.profile = t), a.autoSaveProfile == e && (a.autoSaveProfile = t)
                })), delete a.profiles[e], await m.set({
                    profiles: a.profiles,
                    rules: a.rules
                })
            }(t.profileName, t.newProfileName), t.method.endsWith(".deleteProfile") && await async function (e) {
                const [t, a] = await Promise.all([y(), s()]);
                if (!Object.keys(t.profiles).includes(e)) throw new Error("Profile not found");
                if (e == l) throw new Error("Default settings cannot be deleted");
                a.profileName == e && (delete a.profileName, await i(a));
                t.rules.forEach((t => {
                    t.profile == e && (t.profile = l), t.autoSaveProfile == e && (t.autoSaveProfile = l)
                })), delete t.profiles[e], await m.set({
                    profiles: t.profiles,
                    rules: t.rules
                })
            }(t.profileName), t.method.endsWith(".resetProfiles") && await async function () {
                await w;
                const e = await s();
                delete e.profileName, await i(e), await m.remove(["profiles", "rules", "maxParallelWorkers"]), await browser.storage.local.set({
                    sync: !1
                }), m = browser.storage.local, await p()
            }(), t.method.endsWith(".resetProfile") && await async function (e) {
                const t = await y();
                if (!Object.keys(t.profiles).includes(e)) throw new Error("Profile not found");
                t.profiles[e] = f, await m.set({
                    profiles: t.profiles
                })
            }(t.profileName), t.method.endsWith(".importConfig") && await async function (e) {
                await m.remove(["profiles", "rules", "maxParallelWorkers"]), await m.set({
                    profiles: e.profiles,
                    rules: e.rules,
                    maxParallelWorkers: e.maxParallelWorkers
                }), await p()
            }(t.config), t.method.endsWith(".updateProfile") && await async function (e, t) {
                const a = await y();
                if (!Object.keys(a.profiles).includes(e)) throw new Error("Profile not found");
                Object.keys(t).forEach((n => a.profiles[e][n] = t[n])), await m.set({
                    profiles: a.profiles
                })
            }(t.profileName, t.profile), t.method.endsWith(".updateRule") && await P(t.url, t.newUrl, t.profileName, t.autoSaveProfileName), t.method.endsWith(".getConstants")) return {
            DISABLED_PROFILE_NAME: d,
            DEFAULT_PROFILE_NAME: l,
            CURRENT_PROFILE_NAME: c
        };
        if (t.method.endsWith(".getRules")) return async function () {
            return (await y()).rules
        }();
        if (t.method.endsWith(".getProfiles")) return x();
        if (t.method.endsWith(".exportConfig")) return async function () {
            const t = await y(),
                a = URL.createObjectURL(new Blob([JSON.stringify({
                    profiles: t.profiles,
                    rules: t.rules,
                    maxParallelWorkers: t.maxParallelWorkers
                }, null, 2)], {
                    type: "text/json"
                })),
                n = {
                    url: a,
                    filename: `singlefile-settings-${(new Date).toISOString().replace(/:/g,"_")}.json`,
                    saveAs: !0
                };
            try {
                await e(n, "_")
            } finally {
                URL.revokeObjectURL(a)
            }
        }();
        if (t.method.endsWith(".enableSync")) {
            await browser.storage.local.set({
                sync: !0
            });
            const e = await browser.storage.sync.get();
            if (!e || !e.profiles) {
                const e = await browser.storage.local.get();
                await browser.storage.sync.set({
                    profiles: e.profiles,
                    rules: e.rules,
                    maxParallelWorkers: e.maxParallelWorkers
                })
            }
            return m = browser.storage.sync, {}
        }
        if (t.method.endsWith(".disableSync")) {
            await browser.storage.local.set({
                sync: !1
            });
            const e = await browser.storage.sync.get();
            e && e.profiles && await browser.storage.local.set({
                profiles: e.profiles,
                rules: e.rules,
                maxParallelWorkers: e.maxParallelWorkers
            }), m = browser.storage.local
        }
        return t.method.endsWith(".isSync") ? {
            sync: (await browser.storage.local.get()).sync
        } : {}
    }
    async function x() {
        return (await y()).profiles
    }
    async function S(e, t) {
        const [a, n, r] = await Promise.all([y(), g(e), s()]), o = r.profileName || l;
        let i;
        if (n) {
            const e = n[t ? "autoSaveProfile" : "profile"];
            i = e == c ? o : e
        } else i = o;
        return Object.assign({
            profileName: i
        }, a.profiles[i])
    }
    async function T(e, t, a) {
        if (!e) throw new Error("URL is empty");
        const n = await y();
        if (n.rules.find((t => t.url == e))) throw new Error("URL already exists");
        n.rules.push({
            url: e,
            profile: t,
            autoSaveProfile: a
        }), await m.set({
            rules: n.rules
        })
    }
    async function P(e, t, a, n) {
        if (!e || !t) throw new Error("URL is empty");
        const r = await y(),
            o = r.rules.find((t => t.url == e));
        if (!o) throw new Error("URL not found");
        if (r.rules.find((a => a.url == t && a.url != e))) throw new Error("New URL already exists");
        o.url = t, o.profile = a, o.autoSaveProfile = n, await m.set({
            rules: r.rules
        })
    }
    async function E() {
        return (await m.get()).authInfo
    }
    async function M(e) {
        await m.set({
            authInfo: e
        })
    }
    async function L() {
        let e = E();
        e.revokableAccessToken ? M({
            revokableAccessToken: e.revokableAccessToken
        }) : await m.remove(["authInfo"])
    }
    async function W(e) {
        if (e) {
            const [t, a] = await Promise.all([s(), g(e.url)]);
            return Boolean(t.autoSaveAll || t.autoSaveUnpinned && !e.pinned || t[e.id] && t[e.id].autoSave) && (!a || a.autoSaveProfile != d)
        }
    }
    const R = 33554432,
        A = "/src/extension/ui/pages/editor.html",
        C = new Map,
        U = new Map,
        _ = browser.runtime.getURL(A);

    function B(e) {
        return e.url == _
    }
    const D = new Map,
        O = "x-single-file-request-id",
        j = 8388608;
    async function N(e, t, a) {
        for (let n = 0; n * j <= a.array.length; n++) {
            const r = {
                method: "singlefile.fetchResponse",
                requestId: t,
                headers: a.headers,
                status: a.status,
                error: a.error
            };
            r.truncated = a.array.length > j, r.truncated ? (r.finished = (n + 1) * j > a.array.length, r.array = a.array.slice(n * j, (n + 1) * j)) : r.array = a.array, await browser.tabs.sendMessage(e, r)
        }
        return {}
    }

    function q(e, t = {}, a) {
        return new Promise(((n, r) => {
            const o = new XMLHttpRequest;
            if (o.withCredentials = !0, o.responseType = "arraybuffer", o.onerror = e => r(new Error(e.detail)), o.onreadystatechange = () => {
                    o.readyState == XMLHttpRequest.DONE && (o.status || o.response.byteLength ? 401 != o.status && 403 != o.status && 404 != o.status || a ? n({
                        array: Array.from(new Uint8Array(o.response)),
                        headers: {
                            "content-type": o.getResponseHeader("Content-Type")
                        },
                        status: o.status
                    }) : q(e, t, !0).then(n).catch(r) : r())
                }, o.open("GET", e, !0), t.headers)
                for (const e of Object.entries(t.headers)) o.setRequestHeader(e[0], e[1]);
            if (a) {
                const e = String(Math.random()).substring(2);
                ! function (e, t) {
                    D.set(e, t)
                }(e, t.referrer), o.setRequestHeader(O, e)
            }
            o.send()
        }))
    }
    browser.runtime.onMessage.addListener(((e, t) => {
        if (e.method && e.method.startsWith("singlefile.fetch")) return new Promise((a => {
            (async function (e, t) {
                if ("singlefile.fetch" == e.method) try {
                    const a = await q(e.url, {
                        referrer: e.referrer,
                        headers: e.headers
                    });
                    return N(t.tab.id, e.requestId, a)
                } catch (a) {
                    return N(t.tab.id, e.requestId, {
                        error: a.message,
                        arrray: []
                    })
                } else if ("singlefile.fetchFrame" == e.method) return browser.tabs.sendMessage(t.tab.id, e)
            })(e, t).then(a).catch((e => a({
                error: e && e.toString()
            })))
        }))
    }));
    let F = !1;

    function z(e) {
        return e.method.endsWith(".enableReferrerOnError") ? (J(), {}) : e.method.endsWith(".disableReferrerOnError") ? (function () {
            try {
                browser.webRequest.onBeforeSendHeaders.removeListener(H)
            } catch (e) {}
            F = !1
        }(), {}) : void 0
    }

    function H(e) {
        if (F) {
            let t = e.requestHeaders.find((e => e.name === O));
            if (t) {
                e.requestHeaders = e.requestHeaders.filter((e => e.name !== O));
                const a = D.get(t.value);
                if (a) {
                    D.delete(t.value);
                    if (!e.requestHeaders.find((e => "referer" === e.name.toLowerCase()))) return e.requestHeaders.push({
                        name: "Referer",
                        value: a
                    }), {
                        requestHeaders: e.requestHeaders
                    }
                }
            }
        }
    }

    function J() {
        if (!F) {
            try {
                browser.webRequest.onBeforeSendHeaders.addListener(H, {
                    urls: ["<all_urls>"]
                }, ["blocking", "requestHeaders", "extraHeaders"])
            } catch (e) {
                browser.webRequest.onBeforeSendHeaders.addListener(H, {
                    urls: ["<all_urls>"]
                }, ["blocking", "requestHeaders"])
            }
            F = !0
        }
    }
    async function G(e) {
        return (await browser.tabs.query(e)).sort(((e, t) => e.index - t.index))
    }
    const K = "/src/extension/ui/resources/icon_128.png",
        $ = "/src/extension/ui/resources/icon_128_wait",
        X = browser.i18n.getMessage("buttonDefaultTooltip"),
        Y = browser.i18n.getMessage("buttonBlockedTooltip"),
        Z = browser.i18n.getMessage("buttonInitializingBadge"),
        V = browser.i18n.getMessage("buttonInitializingTooltip"),
        Q = browser.i18n.getMessage("buttonErrorBadge"),
        ee = browser.i18n.getMessage("buttonBlockedBadge"),
        te = browser.i18n.getMessage("buttonOKBadge"),
        ae = browser.i18n.getMessage("buttonSaveProgressTooltip"),
        ne = browser.i18n.getMessage("buttonUploadProgressTooltip"),
        re = browser.i18n.getMessage("buttonAutoSaveActiveBadge"),
        oe = browser.i18n.getMessage("buttonAutoSaveActiveTooltip"),
        se = [2, 147, 20, 192],
        ie = [4, 229, 36, 192],
        ce = {
            default: {
                setBadgeBackgroundColor: {
                    color: se
                },
                setBadgeText: {
                    text: ""
                },
                setTitle: {
                    title: X
                },
                setIcon: {
                    path: K
                }
            },
            inject: {
                setBadgeBackgroundColor: {
                    color: se
                },
                setBadgeText: {
                    text: Z
                },
                setTitle: {
                    title: V
                }
            },
            execute: {
                setBadgeBackgroundColor: {
                    color: ie
                },
                setBadgeText: {
                    text: Z
                }
            },
            progress: {
                setBadgeBackgroundColor: {
                    color: ie
                },
                setBadgeText: {
                    text: ""
                }
            },
            edit: {
                setBadgeBackgroundColor: {
                    color: se
                },
                setBadgeText: {
                    text: ""
                },
                setTitle: {
                    title: X
                },
                setIcon: {
                    path: K
                }
            },
            end: {
                setBadgeBackgroundColor: {
                    color: ie
                },
                setBadgeText: {
                    text: te
                },
                setTitle: {
                    title: X
                },
                setIcon: {
                    path: K
                }
            },
            error: {
                setBadgeBackgroundColor: {
                    color: [229, 4, 12, 192]
                },
                setBadgeText: {
                    text: Q
                },
                setTitle: {
                    title: ""
                },
                setIcon: {
                    path: K
                }
            },
            forbidden: {
                setBadgeBackgroundColor: {
                    color: [255, 255, 255, 1]
                },
                setBadgeText: {
                    text: ee
                },
                setTitle: {
                    title: Y
                },
                setIcon: {
                    path: K
                }
            },
            autosave: {
                inject: {
                    setBadgeBackgroundColor: {
                        color: [64, 64, 64, 192]
                    },
                    setBadgeText: {
                        text: re
                    },
                    setTitle: {
                        title: oe
                    },
                    setIcon: {
                        path: K
                    }
                },
                default: {
                    setBadgeBackgroundColor: {
                        color: [208, 208, 208, 192]
                    },
                    setBadgeText: {
                        text: re
                    },
                    setTitle: {
                        title: oe
                    },
                    setIcon: {
                        path: K
                    }
                }
            }
        };
    let le;

    function de(e, t) {
        if (e.method.endsWith(".processInit")) {
            delete o(t.tab.id)[t.tab.id].button, we(t.tab)
        }
        var a, n, r;
        return e.method.endsWith(".processProgress") && e.maxIndex && (a = t.tab.id, n = e.index, r = e.maxIndex, me(a, n, r, ae)), e.method.endsWith(".processEnd") && fe(t.tab.id), e.method.endsWith(".processError") && (e.error && console.error("Initialization error", e.error), ue(t.tab.id)), e.method.endsWith(".processCancelled") && he(t.tab), Promise.resolve({})
    }

    function ue(e) {
        pe(e, ge("error"))
    }

    function fe(e, t) {
        pe(e, t ? ge("default", !0) : ge("end"))
    }

    function he(e) {
        we(e)
    }

    function me(e, t, a, n) {
        const r = Math.max(Math.min(20, Math.floor(t / a * 20)), 0),
            o = Math.min(Math.floor(t / a * 8), 8),
            s = $ + o + ".png",
            i = ge("progress");
        i.setTitle = {
            title: n + 5 * r + "%"
        }, i.setIcon = {
            path: s
        }, pe(e, i)
    }
    async function we(e) {
        const t = ge("default", await W(e));
        await pe(e.id, t)
    }
    async function pe(e, t) {
        const a = o(e);
        if (t) {
            a[e].button || (a[e].button = {
                lastState: null
            });
            const n = a[e].button.lastState || {},
                r = {};
            Object.keys(t).forEach((e => {
                void 0 !== t[e] && JSON.stringify(n[e]) != JSON.stringify(t[e]) && (r[e] = t[e])
            })), Object.keys(r).length && (a[e].button.lastState = t, await async function (e, t) {
                for (const a of Object.keys(t)) await be(e, a, t[a])
            }(e, r))
        }
    }
    async function be(e, t, a) {
        if (browser.browserAction[t]) {
            const n = JSON.parse(JSON.stringify(a));
            n.tabId = e, await browser.browserAction[t](n)
        }
    }

    function ge(e, t) {
        return JSON.parse(JSON.stringify(t ? ce.autosave[e] : ce[e]))
    }
    browser.browserAction.onClicked.addListener((async e => {
        const t = await G({
            currentWindow: !0,
            highlighted: !0
        });
        t.length <= 1 ? function (e) {
            le.isSavingTab(e) ? le.cancelTab(e.id) : le.saveTabs([e])
        }(e) : le.saveTabs(t)
    }));
    const ye = browser.menus,
        ve = ye && ye.onClicked && ye.create && ye.update && ye.removeAll,
        ke = "save-page",
        Ie = "edit-and-save-page",
        xe = "save-with-profile",
        Se = "save-selected-links",
        Te = "view-pendings",
        Pe = "select-profile",
        Ee = "wasve-with-profile-",
        Me = "select-profile-",
        Le = "associate-with-profile",
        We = "associate-with-profile-",
        Re = "save-selected",
        Ae = "save-frame",
        Ce = "save-tabs",
        Ue = "save-selected-tabs",
        _e = "save-unpinned-tabs",
        Be = "save-all-tabs",
        De = "batch-save-urls",
        Oe = "button-save-selected-tabs",
        je = "button-save-unpinned-tabs",
        Ne = "button-save-all-tabs",
        qe = "auto-save",
        Fe = "auto-save-disabled",
        ze = "auto-save-tab",
        He = "auto-save-unpinned",
        Je = "auto-save-all",
        Ge = browser.i18n.getMessage("menuCreateDomainRule"),
        Ke = browser.i18n.getMessage("menuUpdateRule"),
        $e = browser.i18n.getMessage("menuSavePage"),
        Xe = browser.i18n.getMessage("menuSaveWithProfile"),
        Ye = browser.i18n.getMessage("menuSaveSelectedLinks"),
        Ze = browser.i18n.getMessage("menuEditPage"),
        Ve = browser.i18n.getMessage("menuEditAndSavePage"),
        Qe = browser.i18n.getMessage("menuViewPendingSaves"),
        et = browser.i18n.getMessage("menuSaveSelection"),
        tt = browser.i18n.getMessage("menuSaveFrame"),
        at = browser.i18n.getMessage("menuSaveTabs"),
        nt = browser.i18n.getMessage("menuSaveSelectedTabs"),
        rt = browser.i18n.getMessage("menuSaveUnpinnedTabs"),
        ot = browser.i18n.getMessage("menuSaveAllTabs"),
        st = browser.i18n.getMessage("menuBatchSaveUrls"),
        it = browser.i18n.getMessage("menuSelectProfile"),
        ct = browser.i18n.getMessage("profileDefaultSettings"),
        lt = browser.i18n.getMessage("menuAutoSave"),
        dt = browser.i18n.getMessage("menuAutoSaveDisabled"),
        ut = browser.i18n.getMessage("menuAutoSaveTab"),
        ft = browser.i18n.getMessage("menuAutoSaveUnpinnedTabs"),
        ht = browser.i18n.getMessage("menuAutoSaveAllTabs"),
        mt = [Ie, Se, Re, Ae, qe, Le],
        wt = new Map,
        pt = new Map;
    let bt, gt, yt, vt = !0,
        kt = !0,
        It = new Map;
    async function xt(e) {
        const [t, a] = await Promise.all([x(), s()]), n = await S(e && e.url);
        if (ve && n) {
            const r = ["page", "frame", "image", "link", "video", "audio", "selection"],
                o = [];
            if (n.browserActionMenuEnabled && o.push("browser_action"), n.tabMenuEnabled) try {
                ye.create({
                    id: "temporary-id",
                    contexts: ["tab"],
                    title: "title"
                }), o.push("tab")
            } catch (e) {
                n.tabMenuEnabled = !1
            }
            await ye.removeAll();
            const s = o.concat(...r),
                i = n.contextMenuEnabled ? s : o;
            if (ye.create({
                    id: ke,
                    contexts: i,
                    title: $e
                }), ye.create({
                    id: Ie,
                    contexts: i,
                    title: Ve
                }), ye.create({
                    id: Se,
                    contexts: n.contextMenuEnabled ? o.concat(["selection"]) : o,
                    title: Ye
                }), Object.keys(t).length > 1 && ye.create({
                    id: xe,
                    contexts: i,
                    title: Xe
                }), n.contextMenuEnabled && ye.create({
                    id: "separator-1",
                    contexts: r,
                    type: "separator"
                }), ye.create({
                    id: Re,
                    contexts: i,
                    title: et
                }), n.contextMenuEnabled && ye.create({
                    id: Ae,
                    contexts: ["frame"],
                    title: tt
                }), ye.create({
                    id: Ce,
                    contexts: o,
                    title: at
                }), ye.create({
                    id: Oe,
                    contexts: o,
                    title: nt,
                    parentId: Ce
                }), ye.create({
                    id: je,
                    contexts: o,
                    title: rt,
                    parentId: Ce
                }), ye.create({
                    id: Ne,
                    contexts: o,
                    title: ot,
                    parentId: Ce
                }), n.contextMenuEnabled && (ye.create({
                    id: Ue,
                    contexts: r,
                    title: nt
                }), ye.create({
                    id: _e,
                    contexts: r,
                    title: rt
                }), ye.create({
                    id: Be,
                    contexts: r,
                    title: ot
                }), ye.create({
                    id: "separator-2",
                    contexts: r,
                    type: "separator"
                })), Object.keys(t).length > 1) {
                ye.create({
                    id: Pe,
                    title: it,
                    contexts: i
                }), ye.create({
                    id: "wasve-with-profile-default",
                    contexts: i,
                    title: ct,
                    parentId: xe
                });
                const o = "select-profile-default",
                    s = !a.profileName || a.profileName == l;
                let d;
                ye.create({
                    id: o,
                    type: "radio",
                    contexts: i,
                    title: ct,
                    checked: s,
                    parentId: Pe
                }), wt.set(o, s), ye.create({
                    id: Le,
                    title: Ge,
                    contexts: i
                }), pt.set(Le, Ge), e && e.url && (d = await g(e.url, !0));
                const u = "associate-with-profile-current",
                    f = !d || d.profile == c;
                ye.create({
                    id: u,
                    type: "radio",
                    contexts: i,
                    title: c,
                    checked: f,
                    parentId: Le
                }), wt.set(u, f);
                const h = "associate-with-profile-default",
                    m = Boolean(d) && d.profile == l;
                ye.create({
                    id: h,
                    type: "radio",
                    contexts: i,
                    title: ct,
                    checked: m,
                    parentId: Le
                }), wt.set(h, m), It = new Map, Object.keys(t).forEach(((e, t) => {
                    if (e != l) {
                        let n = Ee + t;
                        ye.create({
                            id: n,
                            contexts: i,
                            title: e,
                            parentId: xe
                        }), n = Me + t;
                        let r = a.profileName == e;
                        ye.create({
                            id: n,
                            type: "radio",
                            contexts: i,
                            title: e,
                            checked: r,
                            parentId: Pe
                        }), wt.set(n, r), n = We + t, r = Boolean(d) && d.profile == e, ye.create({
                            id: n,
                            type: "radio",
                            contexts: i,
                            title: e,
                            checked: r,
                            parentId: Le
                        }), wt.set(n, r), It.set(e, t)
                    }
                })), n.contextMenuEnabled && ye.create({
                    id: "separator-3",
                    contexts: r,
                    type: "separator"
                })
            }
            ye.create({
                id: qe,
                contexts: i,
                title: lt
            }), ye.create({
                id: Fe,
                type: "radio",
                title: dt,
                contexts: i,
                checked: !0,
                parentId: qe
            }), wt.set(Fe, !0), ye.create({
                id: ze,
                type: "radio",
                title: ut,
                contexts: i,
                checked: !1,
                parentId: qe
            }), wt.set(ze, !1), ye.create({
                id: He,
                type: "radio",
                title: ft,
                contexts: i,
                checked: !1,
                parentId: qe
            }), wt.set(He, !1), ye.create({
                id: Je,
                type: "radio",
                title: ht,
                contexts: i,
                checked: !1,
                parentId: qe
            }), wt.set(Je, !1), ye.create({
                id: "separator-4",
                contexts: i,
                type: "separator"
            }), ye.create({
                id: De,
                contexts: i,
                title: st
            }), ye.create({
                id: Te,
                contexts: i,
                title: Qe
            })
        }
        bt = !0, gt && (gt = !1, (await browser.tabs.query({})).forEach((async e => await Tt(e))))
    }
    async function St(e) {
        const t = await s(e.id);
        await async function () {
            const e = await browser.tabs.query({});
            return Promise.all(e.map((async e => {
                const [t, a] = await Promise.all([S(e.url, !0), W(e)]);
                try {
                    await browser.tabs.sendMessage(e.id, {
                        method: "content.init",
                        autoSaveEnabled: a,
                        options: t
                    })
                } catch (e) {}
            })))
        }(), await we(e);
        try {
            await browser.runtime.sendMessage({
                method: "options.refresh",
                profileName: t.profileName
            })
        } catch (e) {}
    }
    async function Tt(e) {
        if (ve && bt) {
            const t = [],
                a = await s(e.id);
            if (a[e.id].editorDetected) Pt(!1);
            else if (Pt(!0), t.push(Mt(Fe, !a[e.id].autoSave)), t.push(Mt(ze, a[e.id].autoSave)), t.push(Mt(He, Boolean(a.autoSaveUnpinned))), t.push(Mt(Je, Boolean(a.autoSaveAll))), e && e.url) {
                const n = await S(e.url);
                t.push(async function (e, t) {
                    const a = vt;
                    vt = t, (void 0 === a || a != t) && await xt(e)
                }(e, n.contextMenuEnabled)), t.push(Et(Ie, a[e.id].savedPageDetected ? Ze : Ve)), t.push(ye.update(Re, {
                    visible: !n.saveRawPage
                })), t.push(ye.update(Ie, {
                    visible: !n.openEditor || a[e.id].savedPageDetected
                }));
                let r = "associate-with-profile-default",
                    o = Ge;
                const [s, i] = await Promise.all([x(), g(e.url)]);
                if (i) {
                    const e = It.get(i.profile);
                    e && (r = We + e, o = Ke)
                }
                Object.keys(s).length > 1 && (Object.keys(s).forEach(((e, a) => {
                    e == l ? t.push(Mt("associate-with-profile-default", "associate-with-profile-default" == r)) : t.push(Mt(We + a, r == We + a))
                })), t.push(Et(Le, o)))
            }
            await Promise.all(t)
        }
    }
    async function Pt(e) {
        const t = kt;
        if (kt = e, void 0 === t || t != e) {
            const t = [];
            try {
                mt.forEach((a => t.push(ye.update(a, {
                    visible: e
                })))), await Promise.all(t)
            } catch (e) {}
        }
    }

    function Et(e, t) {
        const a = pt.get(e);
        return pt.set(e, t), void 0 === a || a != t ? ye.update(e, {
            title: t
        }) : void 0
    }
    async function Mt(e, t) {
        t = Boolean(t), wt.set(e, t), await ye.update(e, {
            checked: t
        })
    }
    Promise.resolve().then((async function () {
        ve && (xt(), ye.onClicked.addListener((async (e, t) => {
            if (e.menuItemId == ke && (e.linkUrl ? yt.saveUrls([e.linkUrl]) : yt.saveTabs([t])), e.menuItemId == Ie) {
                (await s(t.id))[t.id].savedPageDetected ? yt.openEditor(t) : e.linkUrl ? yt.saveUrls([e.linkUrl], {
                    openEditor: !0
                }) : yt.saveTabs([t], {
                    openEditor: !0
                })
            }
            if (e.menuItemId == Se && yt.saveSelectedLinks(t), e.menuItemId == Te && await browser.tabs.create({
                    active: !0,
                    url: "/src/extension/ui/pages/pendings.html"
                }), e.menuItemId == Re && yt.saveTabs([t], {
                    selected: !0
                }), e.menuItemId == Ae && yt.saveTabs([t], {
                    frameId: e.frameId
                }), e.menuItemId == Ue || e.menuItemId == Oe) {
                const e = await G({
                    currentWindow: !0,
                    highlighted: !0
                });
                yt.saveTabs(e)
            }
            if (e.menuItemId == _e || e.menuItemId == je) {
                const e = await G({
                    currentWindow: !0,
                    pinned: !1
                });
                yt.saveTabs(e)
            }
            if (e.menuItemId == Be || e.menuItemId == Ne) {
                const e = await G({
                    currentWindow: !0
                });
                yt.saveTabs(e)
            }
            if (e.menuItemId == De && yt.batchSaveUrls(), e.menuItemId == ze) {
                const e = await s(t.id);
                e[t.id].autoSave = !0, await i(e), St(t)
            }
            if (e.menuItemId == Fe) {
                const e = await s();
                Object.keys(e).forEach((t => {
                    "object" == typeof e[t] && e[t].autoSave && (e[t].autoSave = !1)
                })), e.autoSaveUnpinned = e.autoSaveAll = !1, await i(e), St(t)
            }
            if (e.menuItemId == Je) {
                const a = await s();
                a.autoSaveAll = e.checked, await i(a), St(t)
            }
            if (e.menuItemId == He) {
                const a = await s();
                a.autoSaveUnpinned = e.checked, await i(a), St(t)
            }
            if (e.menuItemId.startsWith(Ee)) {
                const a = await x(),
                    n = e.menuItemId.split(Ee)[1];
                let r;
                if ("default" == n) r = l;
                else {
                    const e = Number(n);
                    r = Object.keys(a)[e]
                }
                a[r].profileName = r, yt.saveTabs([t], a[r])
            }
            if (e.menuItemId.startsWith(Me)) {
                const [a, n] = await Promise.all([x(), s()]), r = e.menuItemId.split(Me)[1];
                if ("default" == r) n.profileName = l;
                else {
                    const e = Number(r);
                    n.profileName = Object.keys(a)[e]
                }
                await i(n), St(t)
            }
            if (e.menuItemId.startsWith(We)) {
                const [a, n] = await Promise.all([x(), g(t.url, !0)]), r = e.menuItemId.split(We)[1];
                let o;
                if ("default" == r) o = l;
                else if ("current" == r) o = c;
                else {
                    const e = Number(r);
                    o = Object.keys(a)[e]
                }
                n ? await P(n.url, n.url, o, o) : (await Et(Le, Ke), await T(new URL(t.url).hostname, o, o))
            }
        })), bt ? gt = !0 : (await browser.tabs.query({})).forEach((async e => await Tt(e))))
    }));
    const Lt = browser.commands;
    let Wt, Rt, At;

    function Ct(e, t) {
        return e.method.endsWith(".refreshMenu") ? function (e) {
            if (e.method.endsWith("refreshMenu")) return xt(), Promise.resolve({})
        }(e) : de(e, t)
    }

    function Ut(e) {
        ! function (e) {
            pe(e.id, ge("forbidden"))
        }(e)
    }

    function _t(e, t, a) {
        ! function (e, t, a) {
            let n;
            a ? n = ge("inject", !0) : (n = ge(1 == t ? "inject" : "execute"), n.setTitle = {
                title: V + " (" + t + "/2)"
            }, n.setIcon = {
                path: $ + "0.png"
            }), pe(e, n)
        }(e, t, a)
    }
    async function Bt(e, t, a) {
        ue(e), t && await browser.tabs.sendMessage(e, {
            method: "content.error",
            error: t.toString(),
            link: a
        })
    }

    function Dt(e) {
        ! function (e) {
            pe(e, ge("edit"))
        }(e)
    }

    function Ot(e, t) {
        fe(e, t)
    }

    function jt(e, t, a) {
        ! function (e, t, a) {
            me(e, t, a, ne)
        }(e, t, a)
    }

    function Nt(e) {
        Tt(e)
    }
    Lt && Lt.onCommand && Lt.onCommand.addListener && Lt.onCommand.addListener((async e => {
        if ("save-selected-tabs" == e) {
            const e = await G({
                currentWindow: !0,
                highlighted: !0
            });
            Wt.saveTabs(e, {
                optionallySelected: !0
            })
        }
        if ("save-all-tabs" == e) {
            const e = await G({
                currentWindow: !0
            });
            Wt.saveTabs(e)
        }
    }));
    const qt = ["lib/chrome-browser-polyfill.js", "lib/single-file.js"],
        Ft = ["lib/chrome-browser-polyfill.js", "lib/single-file-frames.js"];
    async function zt(e, t) {
        let a;
        if (await async function (e) {
                const t = e.extensionScriptFiles || [];
                Rt || At || ([Rt, At] = await Promise.all([Ht(qt.concat(t)), Ht(Ft)]))
            }(t), !t.removeFrames) try {
            await browser.tabs.executeScript(e, {
                code: At,
                allFrames: !0,
                matchAboutBlank: !0,
                runAt: "document_start"
            })
        } catch (e) {}
        try {
            await browser.tabs.executeScript(e, {
                code: Rt,
                allFrames: !1,
                runAt: "document_idle"
            }), a = !0
        } catch (e) {}
        return a && t.frameId && await browser.tabs.executeScript(e, {
            code: "document.documentElement.dataset.requestedFrameId = true",
            frameId: t.frameId,
            matchAboutBlank: !0,
            runAt: "document_start"
        }), a
    }
    async function Ht(e) {
        const t = e.map((async e => {
            if ("function" == typeof e) return "(" + e.toString() + ")();"; {
                const t = await fetch(browser.runtime.getURL("../../../" + e));
                return (new TextDecoder).decode(await t.arrayBuffer())
            }
        }));
        let a = "";
        for (const e of t) a += await e;
        return a
    }
    const Jt = "single-file-response-fetch",
        Gt = (e, t) => window.fetch(e, t);
    let Kt = 0,
        $t = new Map;
    async function Xt(e, t = {}) {
        try {
            let a = await Gt(e, {
                cache: "force-cache",
                headers: t.headers
            });
            return 401 != a.status && 403 != a.status && 404 != a.status || (a = await Vt(e)), a
        } catch (a) {
            Kt++;
            const n = new Promise(((e, t) => $t.set(Kt, {
                resolve: e,
                reject: t
            })));
            return await Zt({
                method: "singlefile.fetch",
                url: e,
                requestId: Kt,
                referrer: t.referrer,
                headers: t.headers
            }), n
        }
    }
    async function Yt(e, t) {
        const a = await Zt({
            method: "singlefile.fetchFrame",
            url: e,
            frameId: t.frameId,
            referrer: t.referrer,
            headers: t.headers
        });
        return {
            status: a.status,
            headers: new Map(a.headers),
            arrayBuffer: async () => new Uint8Array(a.array).buffer
        }
    }
    async function Zt(e) {
        const t = await browser.runtime.sendMessage(e);
        if (!t || t.error) throw new Error(t && t.error && t.error.toString());
        return t
    }

    function Vt(e) {
        return new Promise(((t, a) => {
            var n, r, o, s;
            n = new CustomEvent("single-file-request-fetch", {
                detail: e
            }), window.dispatchEvent(n), r = Jt, o = function n(r) {
                var o, s, i;
                r.detail ? r.detail.url == e && (o = Jt, s = n, i = !1, window.removeEventListener(o, s, i), r.detail.response ? t({
                    status: r.detail.status,
                    headers: new Map(r.detail.headers),
                    arrayBuffer: async () => r.detail.response
                }) : a(r.detail.error)) : a()
            }, s = !1, window.addEventListener(r, o, s)
        }))
    }

    function Qt(e, t) {
        return zt(e, t)
    }
    browser.runtime.onMessage.addListener((e => "singlefile.fetchFrame" == e.method && window.frameId && window.frameId == e.frameId ? async function (e) {
        try {
            let t = await Gt(e.url, {
                cache: "force-cache",
                headers: e.headers
            });
            return 401 != t.status && 403 != t.status && 404 != t.status || (t = await Promise.race([Vt(e.url), new Promise(((e, t) => setTimeout((() => t()), 5e3)))])), {
                status: t.status,
                headers: [...t.headers],
                array: Array.from(new Uint8Array(await t.arrayBuffer()))
            }
        } catch (e) {
            return {
                error: e && e.toString()
            }
        }
    }(e): "singlefile.fetchResponse" == e.method ? async function (e) {
        const t = $t.get(e.requestId);
        t && (e.error ? (t.reject(new Error(e.error)), $t.delete(e.requestId)) : (e.truncated && (t.array ? t.array = t.array.concat(e.array) : (t.array = e.array, $t.set(e.requestId, t)), e.finished && (e.array = t.array)), e.truncated && !e.finished || (t.resolve({
            status: e.status,
            headers: {
                get: t => e.headers && e.headers[t]
            },
            arrayBuffer: async () => new Uint8Array(e.array).buffer
        }), $t.delete(e.requestId))));
        return {}
    }(e): void 0));
    const ea = "Could not establish connection. Receiving end does not exist.",
        ta = "The message port closed before a response was received.",
        aa = "Message manager disconnected",
        na = "Cannot access contents of url ",
        ra = "pending",
        oa = "processing",
        sa = ["lib/infobar.js", "lib/extension.js"],
        ia = [];
    let ca, la = 0;
    var da;
    async function ua() {
        return browser.tabs.create({
            active: !0,
            url: "/src/extension/ui/pages/batch-save-urls.html"
        })
    }
    async function fa(e, t = {}) {
        await wa(), await Promise.all(e.map((async e => {
            const a = await S(e);
            Object.keys(t).forEach((e => a[e] = t[e])), a.autoClose = !0, a.extensionScriptFiles = sa, a.passReferrerOnError && await J(), ma({
                tab: {
                    url: e
                },
                status: ra,
                options: a,
                method: "content.save"
            })
        }))), pa()
    }
    async function ha(e, t = {}) {
        await wa(), await Promise.all(e.map((async e => {
            const a = e.id,
                n = await S(e.url);
            if (Object.keys(t).forEach((e => n[e] = t[e])), n.tabId = a, n.tabIndex = e.index, n.extensionScriptFiles = sa, n.passReferrerOnError && await J(), t.autoSave) {
                if (W(e)) {
                    ba(ma({
                        status: oa,
                        tab: e,
                        options: n,
                        method: "content.autosave"
                    }))
                }
            } else {
                _t(a, 1);
                await Qt(a, n) || B(e) ? (_t(a, 2), ma({
                    status: ra,
                    tab: e,
                    options: n,
                    method: "content.save"
                })) : Ut(e)
            }
        }))), pa()
    }

    function ma(e) {
        const t = {
            id: la,
            status: e.status,
            tab: e.tab,
            options: e.options,
            method: e.method,
            done: function () {
                ia.splice(ia.findIndex((e => e.id == this.id)), 1), pa()
            }
        };
        return ia.push(t), la++, t
    }
    async function wa() {
        ca || (ca = (await y()).maxParallelWorkers)
    }

    function pa() {
        const e = ia.filter((e => e.status == oa)).length;
        for (let t = 0; t < Math.min(ia.length - e, ca - e); t++) {
            const e = ia.find((e => e.status == ra));
            e && ba(e)
        }
    }
    async function ba(e) {
        const t = e.id;
        if (e.status = oa, !e.tab.id) {
            let t;
            try {
                const a = await async function (e) {
                    const t = await browser.tabs.create(e);
                    return new Promise(((e, a) => {
                        function n(a, o) {
                            a == t.id && "complete" == o.status && (e(t), browser.tabs.onUpdated.removeListener(n), browser.tabs.onRemoved.removeListener(r))
                        }

                        function r(e) {
                            e == t.id && (a(e), browser.tabs.onRemoved.removeListener(r))
                        }
                        browser.tabs.onUpdated.addListener(n), browser.tabs.onRemoved.addListener(r)
                    }))
                }({
                    url: e.tab.url,
                    active: !1
                });
                e.tab.id = e.options.tabId = a.id, e.tab.index = e.options.tabIndex = a.index, _t(e.tab.id, 1), t = await Qt(e.tab.id, e.options)
            } catch (t) {
                e.tab.id = t
            }
            if (!t) return void e.done();
            _t(e.tab.id, 2)
        }
        e.options.taskId = t;
        try {
            await browser.tabs.sendMessage(e.tab.id, {
                method: e.method,
                options: e.options
            })
        } catch (t) {
            !t || t.message && function (e) {
                return e.message == ta || e.message == ea || e.message == aa || e.message.startsWith(na + JSON.stringify(_))
            }(t) || (console.log(t.message ? t.message : t), Bt(e.tab.id, t.message, t.link), e.done())
        }
    }

    function ga(e) {
        const t = ia.find((t => t.id == e));
        t && (t.options.autoClose && !t.cancelled && browser.tabs.remove(t.tab.id), t.done())
    }

    function ya(e, t) {
        const a = ia.find((t => t.id == e));
        a && (a.cancel = t)
    }

    function va(e) {
        Array.from(ia).filter((t => t.tab.id == e && !t.options.autoSave)).forEach(Ia)
    }

    function ka(e) {
        return ia.find((t => t.id == e))
    }

    function Ia(e) {
        const t = e.tab.id;
        e.cancelled = !0, browser.tabs.sendMessage(t, {
                method: "content.cancelSave",
                options: {
                    loadDeferredImages: e.options.loadDeferredImages,
                    loadDeferredImagesKeepZoomLevel: e.options.loadDeferredImagesKeepZoomLevel
                }
            }), e.cancel && e.cancel(), "content.autosave" == e.method && Ot(t, !0),
            function (e) {
                he(e)
            }(e.tab), e.done()
    }

    function xa(e) {
        return {
            id: e.id,
            tabId: e.tab.id,
            index: e.tab.index,
            url: e.tab.url,
            title: e.tab.title,
            cancelled: e.cancelled,
            status: e.status
        }
    }
    da = {
            isSavingTab: function (e) {
                return Boolean(ia.find((t => t.tab.id == e.id)))
            },
            saveTabs: ha,
            saveUrls: fa,
            cancelTab: va,
            openEditor: function (e) {
                browser.tabs.sendMessage(e.id, {
                    method: "content.openEditor"
                })
            },
            saveSelectedLinks: async function (e) {
                const t = {
                    extensionScriptFiles: sa,
                    tabId: e.id,
                    tabIndex: e.index
                };
                if (await Qt(e.id, t)) {
                    const t = await browser.tabs.sendMessage(e.id, {
                        method: "content.getSelectedLinks"
                    });
                    if (t.urls && t.urls.length) {
                        const e = await ua(),
                            a = (n, r) => {
                                "complete" == r.status && n == e.id && (browser.tabs.onUpdated.removeListener(a), browser.tabs.sendMessage(e.id, {
                                    method: "newUrls.addURLs",
                                    urls: t.urls
                                }))
                            };
                        browser.tabs.onUpdated.addListener(a)
                    }
                } else Ut(e)
            },
            batchSaveUrls: ua
        },
        function (e) {
            yt = e
        }(da),
        function (e) {
            le = e
        }(da),
        function (e) {
            Wt = e
        }(da);
    async function Sa(e) {
        messagingport.postMessage({
            method: "save",
            pageData: e
        }), await new Promise(((e, a) => {
            messagingport.onDisconnect.addListener((() => {
                messagingport.error ? a(new Error(messagingport.error.message + " (Companion)")) : browser.runtime.lastError && !browser.runtime.lastError.message.includes("Native host has exited") || e()
            }))
        }))
    }
    async function Ta(e) {
        return e.method.endsWith(".saveCreatedBookmarks") ? (Pa(), {}) : e.method.endsWith(".disable") ? (async function () {
            let e;
            const t = await x();
            Object.keys(t).forEach((a => e = e || !t[a].saveCreatedBookmarks)), e && browser.bookmarks.onCreated.removeListener(Ea)
        }(), {}) : void 0
    }
    async function Pa() {
        try {
            browser.bookmarks.onCreated.removeListener(Ea)
        } catch (e) {}
        let e;
        const t = await x();
        Object.keys(t).forEach((a => {
            t[a].saveCreatedBookmarks && (e = !0)
        })), e && browser.bookmarks.onCreated.addListener(Ea)
    }
    async function Ea(e, t) {
        const a = await browser.tabs.query({
                lastFocusedWindow: !0,
                active: !0
            }),
            n = await S(t.url);
        if (n.saveCreatedBookmarks) {
            const o = await async function e(t, a = []) {
                if (t) {
                    const n = (await browser.bookmarks.get(t))[0];
                    n && n.title && (a.unshift(n.title), await e(n.parentId, a))
                }
                return a
            }(t.parentId), s = n.allowedBookmarkFolders.toString(), i = o.find((e => n.allowedBookmarkFolders.includes(e))), c = n.ignoredBookmarkFolders.toString(), l = o.find((e => n.ignoredBookmarkFolders.includes(e)));
            if ((s && i || !s) && (c && !l || !c))
                if (a.length && a[0].url == t.url) ha(a, {
                    bookmarkId: e,
                    bookmarkFolders: o
                });
                else {
                    const a = await browser.tabs.query({});
                    if (a.length) {
                        const n = a.find((e => e.url == t.url));
                        n ? ha([n], {
                            bookmarkId: e,
                            bookmarkFolders: o
                        }) : t.url && ("about:blank" == t.url ? browser.bookmarks.onChanged.addListener((function t(a, n) {
                            a == e && n.url && (browser.bookmarks.onChanged.removeListener(t), r(n.url))
                        })) : r(t.url))
                    }
                }
        }

        function r(t) {
            fa([t], {
                bookmarkId: e
            })
        }
    }
    Promise.resolve().then(Pa);
    async function Ma(e, t) {
        let a = t || "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYzZmZTMzMi0wODNjLTRjZmMtYmYxNC0xNWU5MTJmMWY4OWIiLCJpYXQiOjE1NzYxNzQzNDV9.n31j9ctJj7R1Vjwyc5yd1d6Cmg0NDnpwSaLWsqtZJQA";
        const n = await fetch("https://api.woleet.io/v1/anchor", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + a
            },
            body: JSON.stringify({
                name: e,
                hash: e,
                public: !0
            })
        });
        if (401 == n.status) {
            const e = new Error("Your access token on Woleet is invalid. Go to __DOC_LINK__ to create your account.");
            throw e.link = "https://app.woleet.io/", e
        }
        if (402 == n.status) {
            const e = new Error("You have no more credits on Woleet. Go to __DOC_LINK__ to recharge them.");
            throw e.link = "https://app.woleet.io/", e
        }
        if (n.status >= 400) throw new Error((n.statusText || "Error " + n.status) + " (Woleet)");
        return n.json()
    }
    const La = "https://oauth2.googleapis.com/token",
        Wa = "https://www.googleapis.com/drive/v3/files";
    let Ra, Aa = !0;
    class Ca {
        constructor(e) {
            this.file = e.file, this.onProgress = e.onProgress, this.contentType = this.file.type || "application/octet-stream", this.metadata = {
                name: e.filename,
                mimeType: this.contentType,
                parents: e.parents || ["root"]
            }, this.token = e.token, this.offset = 0, this.chunkSize = e.chunkSize || 524288
        }
        async upload() {
            const e = Na(await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + this.token,
                    "Content-Type": "application/json",
                    "X-Upload-Content-Length": this.file.size,
                    "X-Upload-Content-Type": this.contentType
                },
                body: JSON.stringify(this.metadata)
            })).headers.get("Location");
            if (this.url = e, !this.cancelled) return this.onProgress && this.onProgress(0, this.file.size), Oa(this)
        }
    }
    async function Ua(e, t) {
        const a = await fetch(La, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "client_id=" + e.clientId + "&client_secret=" + e.clientKey + "&grant_type=authorization_code&code=" + t.code + "&redirect_uri=" + browser.identity.getRedirectURL()
            }),
            n = await ja(a);
        return e.accessToken = n.access_token, e.refreshToken = n.refresh_token, e.expirationDate = Date.now() + 1e3 * n.expires_in, {
            accessToken: e.accessToken,
            refreshToken: e.refreshToken,
            expirationDate: e.expirationDate
        }
    }

    function _a(e = {}) {
        return Boolean(browser.identity && browser.identity.getAuthToken) && !e.forceWebAuthFlow
    }
    async function Ba(e, t, a = !0) {
        const n = t.split("/");
        n.pop();
        const r = e.folderIds.get(n.join("/"));
        if (r) return r;
        let o = "root";
        if (n.length) {
            let r = "";
            for (const s of n) {
                r && (r += "/"), r += s;
                const n = e.folderIds.get(r);
                if (n) o = n;
                else try {
                    o = await Da(e, s, o), e.folderIds.set(r, o)
                } catch (n) {
                    if ("path_not_found" == n.message && a) return e.folderIds.clear(), Ba(e, t, !1);
                    throw n
                }
            }
        }
        return o
    }
    async function Da(e, t, a) {
        const n = await async function (e, t, a) {
            return ja(await fetch(Wa + "?q=mimeType = 'application/vnd.google-apps.folder' and name = '" + t + "' and trashed != true and '" + a + "' in parents", {
                headers: {
                    Authorization: "Bearer " + e.accessToken
                }
            }))
        }(e, t, a);
        if (n.files.length) return n.files[0].id; {
            const n = await async function (e, t, a) {
                return ja(await fetch(Wa, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + e.accessToken,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: t,
                        parents: [a],
                        mimeType: "application/vnd.google-apps.folder"
                    })
                }))
            }(e, t, a);
            return n.id
        }
    }
    async function Oa(e) {
        let t = e.file,
            a = e.file.size;
        (e.offset || e.chunkSize) && (e.chunkSize && (a = Math.min(e.offset + e.chunkSize, e.file.size)), t = t.slice(e.offset, a));
        const n = await fetch(e.url, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + e.token,
                "Content-Type": e.contentType,
                "Content-Range": "bytes " + e.offset + "-" + (a - 1) + "/" + e.file.size,
                "X-Upload-Content-Type": e.contentType
            },
            body: t
        });
        if (e.onProgress && !e.cancelled && e.onProgress(e.offset + e.chunkSize, e.file.size), 200 == n.status || 201 == n.status) return n.json();
        if (308 == n.status) {
            const t = n.headers.get("Range");
            if (t && (e.offset = parseInt(t.match(/\d+/g).pop(), 10) + 1), e.cancelled) throw new Error("upload_cancelled");
            return Oa(e)
        }
        Na(n)
    }
    async function ja(e) {
        e = Na(e);
        const t = await e.json();
        if (t.error) throw new Error(t.error);
        return t
    }

    function Na(e) {
        if (200 == e.status) return e;
        throw 404 == e.status ? new Error("path_not_found") : 401 == e.status ? new Error("invalid_token") : new Error("unknown_error (" + e.status + ")")
    }
    async function qa(e, t, a, n, r, o) {
        for (; Ra;) await Ra;
        const s = new AbortController;
        return Ra = (async () => {
            try {
                await async function ({
                    path: r,
                    content: o,
                    message: s = ""
                }, i) {
                    try {
                        const c = await fetch(`https://api.github.com/repos/${t}/${a}/contents/${r.replace(/#/g,"%23")}`, {
                                method: "PUT",
                                headers: new Map([
                                    ["Authorization", `token ${e}`],
                                    ["Accept", "application/vnd.github.v3+json"]
                                ]),
                                body: JSON.stringify({
                                    content: btoa(unescape(encodeURIComponent(o))),
                                    message: s,
                                    branch: n
                                }),
                                signal: i
                            }),
                            l = await c.json();
                        if (c.status < 400) return l;
                        throw new Error(l.message)
                    } catch (e) {
                        if ("AbortError" != e.name) throw e
                    }
                }({
                    path: r,
                    content: o
                }, s.signal)
            } finally {
                Ra = null
            }
        })(), {
            cancelPush: () => s.abort(),
            pushPromise: Ra
        }
    }
    const Fa = new Map,
        za = "text/html",
        Ha = /([{}()^$&.*?/+|[\\\\]|\]|-)/g,
        Ja = browser.runtime.getManifest(),
        Ga = Ja.optional_permissions && Ja.optional_permissions.includes("identity"),
        Ka = new class {
            constructor(e, t, a) {
                this.clientId = e, this.clientKey = t, this.scopes = a, this.folderIds = new Map, setInterval((() => this.folderIds.clear()), 6e4)
            }
            async auth(e = {
                interactive: !0
            }) {
                if (e.requestPermissionIdentity && Aa) try {
                    await browser.permissions.request({
                        permissions: ["identity"]
                    }), Aa = !1
                } catch (e) {}
                return _a(e) ? (this.accessToken = await browser.identity.getAuthToken({
                    interactive: e.interactive
                }), {
                    revokableAccessToken: this.accessToken
                }) : (this.authURL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + this.clientId + "&response_type=code&access_type=offline&redirect_uri=" + browser.identity.getRedirectURL() + "&scope=" + this.scopes.join(" "), e.code ? Ua(this, e) : async function (e, t) {
                    let a;
                    try {
                        if (browser.identity && browser.identity.launchWebAuthFlow && !t.forceWebAuthFlow) {
                            const a = await browser.identity.launchWebAuthFlow({
                                interactive: t.interactive,
                                url: e.authURL
                            });
                            return t.code = new URLSearchParams(new URL(a).search).get("code"), await Ua(e, t)
                        }
                        if (t.launchWebAuthFlow) return t.extractAuthCode(browser.identity.getRedirectURL()).then((e => a = e)).catch((() => {})), await t.launchWebAuthFlow({
                            url: e.authURL
                        });
                        throw new Error("auth_not_supported")
                    } catch (n) {
                        if (n.message && ("code_required" == n.message || n.message.includes("access"))) {
                            if (a) return t.code = a, await Ua(e, t);
                            throw new Error("code_required")
                        }
                        throw n
                    }
                }(this, e))
            }
            setAuthInfo(e, t) {
                _a(t) || (e ? (this.accessToken = e.accessToken, this.refreshToken = e.refreshToken, this.expirationDate = e.expirationDate) : (delete this.accessToken, delete this.refreshToken, delete this.expirationDate))
            }
            async refreshAuthToken() {
                if (this.refreshToken) {
                    const e = await fetch(La, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: "client_id=" + this.clientId + "&refresh_token=" + this.refreshToken + "&grant_type=refresh_token"
                    });
                    if (400 == e.status) throw new Error("unknown_token");
                    const t = await ja(e);
                    return this.accessToken = t.access_token, t.refresh_token && (this.refreshToken = t.refresh_token), t.expires_in && (this.expirationDate = Date.now() + 1e3 * t.expires_in), {
                        accessToken: this.accessToken,
                        refreshToken: this.refreshToken,
                        expirationDate: this.expirationDate
                    }
                }
            }
            async revokeAuthToken(e) {
                if (e) {
                    if (browser.identity && browser.identity.removeCachedAuthToken) try {
                        await browser.identity.removeCachedAuthToken({
                            token: e
                        })
                    } catch (e) {}
                    const t = await fetch("https://accounts.google.com/o/oauth2/revoke", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: "token=" + e
                    });
                    try {
                        await ja(t)
                    } catch (e) {
                        if ("invalid_token" != e.message) throw e
                    } finally {
                        delete this.accessToken, delete this.refreshToken, delete this.expirationDate
                    }
                }
            }
            async upload(e, t, a, n = !0) {
                const r = await Ba(this, e),
                    o = e.split("/").pop(),
                    s = new Ca({
                        token: this.accessToken,
                        file: t,
                        parents: [r],
                        filename: o,
                        onProgress: a.onProgress
                    });
                try {
                    return {
                        cancelUpload: () => s.cancelled = !0,
                        uploadPromise: s.upload()
                    }
                } catch (r) {
                    if ("path_not_found" == r.message && n) return this.folderIds.clear(), this.upload(e, t, a, !1);
                    throw r
                }
            }
        }("207618107333-h1220p1oasj3050kr5r416661adm091a.apps.googleusercontent.com", "VQJ8Gq8Vxx72QyxPyeLtWvUt", ["https://www.googleapis.com/auth/drive.file"]);
    async function $a(e, t) {
        if (e.method.endsWith(".download")) return async function (e, t) {
            let a;
            e.truncated ? (a = Fa.get(t.id), a || (a = [], Fa.set(t.id, a)), a.push(e.content), e.finished && Fa.delete(t.id)) : e.content && (a = [e.content]);
            e.truncated && !e.finished || (e.openEditor ? (Dt(t.id), await async function ({
                tabIndex: e,
                content: t,
                filename: a
            }) {
                const n = {
                    active: !0,
                    url: A
                };
                null != e && (n.index = e);
                const r = await browser.tabs.create(n);
                C.set(r.id, {
                    content: t,
                    filename: a
                })
            }({
                tabIndex: t.index + 1,
                filename: e.filename,
                content: a.join("")
            })) : e.saveToClipboard ? (e.content = a.join(""), function (e) {
                const t = "copy";

                function a(t) {
                    t.clipboardData.setData(za, e.content), t.clipboardData.setData("text/plain", e.content), t.preventDefault()
                }
                document.addEventListener(t, a), document.execCommand(t), document.removeEventListener(t, a)
            }(e), Ot(t.id)) : await async function (e, t, a, n) {
                try {
                    if (n.saveToGDrive ? await (await Za(n.taskId, n.filename, new Blob(e, {
                            type: za
                        }), {
                            forceWebAuthFlow: n.forceWebAuthFlow
                        }, {
                            onProgress: (e, a) => jt(t.id, e, a)
                        })).uploadPromise : n.saveToGitHub ? await (await Ya(n.taskId, n.filename, e.join(""), n.githubToken, n.githubUser, n.githubRepository, n.githubBranch)).pushPromise : n.saveWithCompanion ? await Sa({
                            filename: n.filename,
                            content: n.content,
                            filenameConflictAction: n.filenameConflictAction
                        }) : (n.url = URL.createObjectURL(new Blob(e, {
                            type: za
                        })), await Va(n, {
                            confirmFilename: n.confirmFilename,
                            incognito: a,
                            filenameConflictAction: n.filenameConflictAction,
                            filenameReplacementCharacter: n.filenameReplacementCharacter,
                            includeInfobar: n.includeInfobar
                        })), Ot(t.id), n.openSavedPage) {
                        const a = {
                            active: !0,
                            url: URL.createObjectURL(new Blob(e, {
                                type: za
                            }))
                        };
                        null != t.index && (a.index = t.index + 1), browser.tabs.create(a)
                    }
                } catch (e) {
                    e.message && "upload_cancelled" == e.message || (console.error(e), Bt(t.id, e.message, e.link))
                } finally {
                    n.url && URL.revokeObjectURL(n.url)
                }
            }(a, t, t.incognito, e));
            return {}
        }(e, t.tab);
        if (e.method.endsWith(".disableGDrive")) {
            const e = await E();
            return L(), await Ka.revokeAuthToken(e && (e.accessToken || e.revokableAccessToken)), {}
        }
        if (e.method.endsWith(".end")) {
            if (e.hash) try {
                await Ma(e.hash, e.woleetKey)
            } catch (e) {
                Bt(t.tab.id, e.message, e.link)
            }
            return ga(e.taskId), {}
        }
        return e.method.endsWith(".getInfo") ? ia.map(xa) : e.method.endsWith(".cancel") ? (a = e.taskId, Ia(ia.find((e => e.id == a))), {}) : e.method.endsWith(".cancelAll") ? (Array.from(ia).forEach(Ia), {}) : e.method.endsWith(".saveUrls") ? (fa(e.urls), {}) : void 0;
        var a
    }
    async function Xa(e, t) {
        let a = await E();
        const n = {
            interactive: !0,
            forceWebAuthFlow: e.forceWebAuthFlow,
            requestPermissionIdentity: Ga,
            launchWebAuthFlow: e => async function (e) {
                const t = await browser.tabs.create({
                    url: e.url,
                    active: !0
                });
                return new Promise(((e, a) => {
                    browser.tabs.onRemoved.addListener((function e(n) {
                        n == t.id && (browser.tabs.onRemoved.removeListener(e), a(new Error("code_required")))
                    }))
                }))
            }(e),
            extractAuthCode: e => function (e) {
                return new Promise(((t, a) => {
                    browser.tabs.onUpdated.addListener((function n(r, o) {
                        if (o && o.url.startsWith(e)) {
                            browser.tabs.onUpdated.removeListener(n);
                            const e = new URLSearchParams(new URL(o.url).search).get("code");
                            e ? (browser.tabs.remove(r), t(e)) : a()
                        }
                    }))
                }))
            }(e)
        };
        return Ka.setAuthInfo(a, n), a && a.accessToken && !t || (a = await Ka.auth(n), a ? await M(a) : await L()), a
    }
    async function Ya(e, t, a, n, r, o, s) {
        const i = ka(e);
        if (!i || !i.cancelled) {
            const i = qa(n, r, o, s, t, a);
            ya(e, i.cancelPush);
            try {
                return await (await i).pushPromise, i
            } catch (e) {
                throw new Error(e.message + " (GitHub)")
            }
        }
    }
    async function Za(e, t, a, n, r) {
        try {
            await Xa(n);
            const o = ka(e);
            if (!o || !o.cancelled) {
                const n = await Ka.upload(t, a, r);
                return ya(e, n.cancelUpload), n
            }
        } catch (o) {
            if ("invalid_token" != o.message) throw new Error(o.message + " (Google Drive)"); {
                let o;
                try {
                    o = await Ka.refreshAuthToken()
                } catch (e) {
                    if ("unknown_token" != e.message) throw new Error(e.message + " (Google Drive)");
                    o = await Xa(n, !0)
                }
                o ? await M(o) : await L(), await Za(e, t, a, n, r)
            }
        }
    }
    async function Va(t, a) {
        let n;
        if ("skip" == a.filenameConflictAction) {
            (await browser.downloads.search({
                filenameRegex: "(\\\\|/)" + (r = t.filename, r.replace(Ha, "\\$1") + "$"),
                exists: !0
            })).length ? n = !0 : a.filenameConflictAction = "uniquify"
        }
        var r;
        if (!n) {
            const n = {
                url: t.url,
                saveAs: a.confirmFilename,
                filename: t.filename,
                conflictAction: a.filenameConflictAction
            };
            a.incognito && (n.incognito = !0);
            const r = await e(n, a.filenameReplacementCharacter);
            r.filename && t.bookmarkId && t.replaceBookmarkURL && (r.filename.startsWith("file:") || (r.filename.startsWith("/") && (r.filename = r.filename.substring(1)), r.filename = "file:///" + r.filename.replace(/#/g, "%23")), await async function (e, t) {
                try {
                    await browser.bookmarks.update(e, t)
                } catch (e) {}
            }(t.bookmarkId, {
                url: r.filename
            }))
        }
    }
    const Qa = {},
        en = {};
    async function tn(e, t) {
        if ("enableAutoSave" == e.method) {
            const a = await s(t.id);
            a[t.id].autoSave = e.enabled, await i(a), async function (e) {
                Promise.all([xt(e), we(e)])
            }(t)
        }
        if ("isAutoSaveEnabled" == e.method) return W(t)
    }
    async function an(e, t) {
        const a = t.id,
            n = await S(t.url, !0);
        if (n) {
            let r;
            _t(a, 1, !0), n.content = e.content, n.url = e.url, n.frames = e.frames, n.canvases = e.canvases, n.fonts = e.fonts, n.stylesheets = e.stylesheets, n.images = e.images, n.posters = e.posters, n.videos = e.videos, n.usedFonts = e.usedFonts, n.shadowRoots = e.shadowRoots, n.imports = e.imports, n.referrer = e.referrer, n.updatedResources = e.updatedResources, n.visitDate = new Date(e.visitDate), n.backgroundTab = !0, n.autoSave = !0, n.incognito = t.incognito, n.tabId = a, n.tabIndex = t.index;
            try {
                if (n.autoSaveExternalSave) await async function (e) {
                    e.autoSaveExternalSave = !1;
                    messagingport.postMessage({
                        method: "externalSave",
                        pageData: e
                    }), await new Promise(((e, a) => {
                        messagingport.onDisconnect.addListener((() => {
                            messagingport.error ? a(new Error(messagingport.error.message + " (Companion)")) : browser.runtime.lastError && !browser.runtime.lastError.message.includes("Native host has exited") || e()
                        }))
                    }))
                }(n);
                else {
                    if (r = await
                        function (e, t, a, n = {
                            fetch: Xt,
                            frameFetch: Yt
                        }) {
                            return globalThis.singlefile.getPageData(e, n, t, a)
                        }(n, null, null, {
                            fetch: nn
                        }), n.includeInfobar && await infobar.includeScript(r), n.saveToGDrive) {
                        const t = new Blob([r.content], {
                            type: "text/html"
                        });
                        await (await Za(e.taskId, r.filename, t, n, {})).uploadPromise
                    } else if (n.saveToGitHub) await (await Ya(e.taskId, r.filename, r.content, n.githubToken, n.githubUser, n.githubRepository, n.githubBranch)).pushPromise;
                    else if (n.saveWithCompanion) await Sa({
                        filename: r.filename,
                        content: r.content,
                        filenameConflictAction: r.filenameConflictAction
                    });
                    else {
                        const e = new Blob([r.content], {
                            type: "text/html"
                        });
                        if (r.url = URL.createObjectURL(e), await Va(r, n), n.openSavedPage) {
                            const n = {
                                    active: !0,
                                    url: URL.createObjectURL(e),
                                    windowId: t.windowId
                                },
                                r = t.index;
                            try {
                                await browser.tabs.get(a), n.index = r + 1
                            } catch (e) {
                                n.index = r
                            }
                            browser.tabs.create(n)
                        }
                    }
                    r.hash && await Ma(r.hash, n.woleetKey)
                }
            } finally {
                e.taskId ? ga(e.taskId) : n.autoClose && (browser.tabs.remove(en[a] || a), delete en[a]), r && r.url && URL.revokeObjectURL(r.url), Ot(a, !0)
            }
        }
    }

    function nn(e, t = {}) {
        return new Promise(((a, n) => {
            const r = new XMLHttpRequest;
            if (r.withCredentials = !0, r.responseType = "arraybuffer", r.onerror = e => n(new Error(e.detail)), r.onreadystatechange = () => {
                    r.readyState == XMLHttpRequest.DONE && a({
                        status: r.status,
                        headers: {
                            get: e => r.getResponseHeader(e)
                        },
                        arrayBuffer: async () => r.response
                    })
                }, r.open("GET", e, !0), t.headers)
                for (const e of Object.entries(t.headers)) r.setRequestHeader(e[0], e[1]);
            r.send()
        }))
    }
    async function rn(e, t) {
        if (e.method.endsWith(".init") && (await async function (e, t) {
                    await r(e.id);
                    const a = await s(e.id);
                    a[e.id].savedPageDetected = t.savedPageDetected, await i(a)
                }(t.tab, e), Tt(t.tab),
                function (e) {
                    va(e.id)
                }(t.tab), async function (e) {
                    const [t, a] = await Promise.all([S(e.url, !0), W(e)]);
                    t && (t.autoSaveLoad || t.autoSaveLoadOrUnload) && a && ha([e], {
                        autoSave: !0
                    })
                }(t.tab)), e.method.endsWith(".getOptions")) return S(e.url);
        e.method.endsWith(".activate") && await browser.tabs.update(e.tabId, {
            active: !0
        })
    }
    browser.tabs.onCreated.addListener((e => function (e) {
        ! function (e) {
            Tt(e)
        }(e)
    }(e))), browser.tabs.onActivated.addListener((e => async function (e) {
        Nt(await browser.tabs.get(e.tabId))
    }(e))), browser.tabs.onRemoved.addListener((e => function (e) {
        r(e),
            function (e) {
                C.delete(e)
            }(e), va(e), async function (e) {
                const t = Qa[e];
                t ? t.autoSaveRemove && (delete Qa[e], await an(t, t.tab)) : Qa[e] = {
                    removed: !0
                }
            }(e)
    }(e))), browser.tabs.onUpdated.addListener(((e, t) => async function (e, t) {
        if ("complete" == t.status) {
            setTimeout((async () => {
                    try {
                        await browser.tabs.sendMessage(e, {
                            method: "content.maybeInit"
                        })
                    } catch (e) {}
                }), 1500),
                function (e) {
                    delete Qa[e]
                }(e);
            const t = await browser.tabs.get(e);
            if (B(t)) {
                const e = await s(t.id);
                e[t.id].editorDetected = !0, await i(e), Nt(t)
            }
        }
        t.discarded && async function (e) {
            const t = Qa[e];
            t ? (delete Qa[e], await an(t, t.tab)) : Qa[e] = {
                discarded: !0
            }
        }(e)
    }(e, t))), browser.tabs.onReplaced.addListener(((e, t) => function (e, t) {
        !async function (e, t) {
            Qa[t] && !Qa[e] && (Qa[e] = Qa[t], delete Qa[t], en[t] = e);
            const a = await s();
            a[t] && !a[e] && (a[e] = a[t], delete a[t], await i(a))
        }(e, t)
    }(e, t))), browser.runtime.onMessage.addListener(((e, t) => {
        if ("singlefile.frameTree.initResponse" == e.method || "singlefile.frameTree.ackInitRequest" == e.method) return browser.tabs.sendMessage(t.tab.id, e, {
            frameId: 0
        }), Promise.resolve({})
    }));
    const on = new Map;

    function sn(e, t) {
        e.delete(t)
    }
    browser.runtime.onMessage.addListener(((e, t) => {
        if ("singlefile.lazyTimeout.setTimeout" == e.method) {
            let a, n = on.get(t.tab.id);
            if (n)
                if (a = n.get(t.frameId), a) {
                    const t = a.get(e.type);
                    t && clearTimeout(t)
                } else a = new Map;
            const r = setTimeout((async () => {
                try {
                    const a = on.get(t.tab.id),
                        n = a.get(t.frameId);
                    a && n && sn(n, e.type), await browser.tabs.sendMessage(t.tab.id, {
                        method: "singlefile.lazyTimeout.onTimeout",
                        type: e.type
                    })
                } catch (e) {}
            }), e.delay);
            return n || (n = new Map, a = new Map, n.set(t.frameId, a), on.set(t.tab.id, n)), a.set(e.type, r), Promise.resolve({})
        }
        if ("singlefile.lazyTimeout.clearTimeout" == e.method) {
            let a = on.get(t.tab.id);
            if (a) {
                const n = a.get(t.frameId);
                if (n) {
                    const t = n.get(e.type);
                    t && clearTimeout(t), sn(n, e.type)
                }
            }
            return Promise.resolve({})
        }
    })), browser.tabs.onRemoved.addListener((e => on.delete(e))), browser.runtime.onMessage.addListener(((e, t) => e.method.startsWith("tabs.") ? rn(e, t) : e.method.startsWith("downloads.") ? $a(e, t) : e.method.startsWith("autosave.") ? async function (e, t) {
        if (e.method.endsWith(".save")) return e.autoSaveDiscard || e.autoSaveRemove ? (t.tab ? (e.tab = t.tab, Qa[t.tab.id] = e) : Qa[e.tabId] && (Qa[e.tabId].removed && e.autoSaveRemove || Qa[e.tabId].discarded && e.autoSaveDiscard) && (delete Qa[e.tabId], await an(e, {
            id: e.tabId,
            index: e.tabIndex,
            url: t.url
        })), e.autoSaveUnload && (delete Qa[e.tabId], await an(e, t.tab))) : (delete Qa[e.tabId], await an(e, t.tab)), {}
    }(e, t): e.method.startsWith("ui.") ? Ct(e, t) : e.method.startsWith("config.") ? I(e) : e.method.startsWith("tabsData.") ? function (e) {
        return e.method.endsWith(".get") ? s() : e.method.endsWith(".set") ? i(e.tabsData) : void 0
    }(e) : e.method.startsWith("devtools.") ? async function (e) {
        e.method.endsWith(".resourceCommitted") && e.tabId && e.url && ("stylesheet" == e.type || "script" == e.type) && await browser.tabs.sendMessage(e.tabId, e)
    }(e): e.method.startsWith("editor.") ? async function (e, t) {
        if (e.method.endsWith(".getTabData")) {
            const e = t.tab,
                a = C.get(e.id);
            if (a) {
                const t = await S(a.url),
                    n = JSON.stringify(a);
                for (let a = 0; a * R < n.length; a++) {
                    const r = {
                        method: "editor.setTabData"
                    };
                    r.truncated = n.length > R, r.truncated ? (r.finished = (a + 1) * R > n.length, r.content = n.substring(a * R, (a + 1) * R), r.finished && (r.options = t)) : (r.content = n, r.options = t), await browser.tabs.sendMessage(e.id, r)
                }
            }
            return {}
        }
        if (e.method.endsWith(".open")) {
            let a;
            const n = t.tab;
            if (e.truncated ? (a = U.get(n.id), a || (a = [], U.set(n.id, a)), a.push(e.content), e.finished && U.delete(n.id)) : e.content && (a = [e.content]), !e.truncated || e.finished) {
                const t = {
                    url: A
                };
                await browser.tabs.update(n.id, t), C.set(n.id, {
                    url: n.url,
                    content: a.join(""),
                    filename: e.filename
                })
            }
            return {}
        }
    }(e, t): e.method.startsWith("bookmarks.") ? Ta(e) : e.method.startsWith("companion.") ? async function (e) {
        if (e.method.endsWith(".state")) return {
            enabled: !0
        }
    }(e): e.method.startsWith("requests.") ? z(e) : e.method.startsWith("bootstrap.") ? async function (e, t) {
        if (e.method.endsWith(".init")) {
            const [e, a, n] = await Promise.all([S(t.tab.url, !0), S(t.tab.url), W(t.tab)]);
            return {
                optionsAutoSave: e,
                options: a,
                autoSaveEnabled: n,
                tabId: t.tab.id,
                tabIndex: t.tab.index
            }
        }
    }(e, t): void 0)), browser.runtime.onMessageExternal && browser.runtime.onMessageExternal.addListener((async (e, t) => {
        const a = (await browser.tabs.query({
            currentWindow: !0,
            active: !0
        }))[0];
        return !!a && tn(e, a)
    }))
}();