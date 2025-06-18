"use client"

import { useEffect } from "react";
import zipy from "zipyai";
import { ZipyAnalyticsProps } from "@/types/analytics"

export function ZipyAnalytics({ id }: ZipyAnalyticsProps) {
    useEffect(() => {
        zipy.init(id);
    }, [id]);

    return null;
}