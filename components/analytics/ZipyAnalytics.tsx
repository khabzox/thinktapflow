"use client"

import { useEffect } from "react";
import zipy from "zipyai";

export function ZipyAnalytics() {
    useEffect(() => {
        zipy.init("b2f9120d");
    }, []);

    return null;
}
