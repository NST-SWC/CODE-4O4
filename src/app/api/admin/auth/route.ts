import { NextRequest, NextResponse } from "next/server";

// Simple authentication - in production, use proper JWT/session management
export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { success: false, error: "Password is required" },
                { status: 400 }
            );
        }

        // Check against environment variable
        const adminPassword = process.env.ADMIN_PASSWORD || "devforge2025!";

        if (password === adminPassword) {
            // In production, generate JWT token here
            return NextResponse.json({
                success: true,
                token: "authenticated", // In production, use proper JWT
            });
        }

        return NextResponse.json(
            { success: false, error: "Invalid password" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Admin auth error:", error);
        return NextResponse.json(
            { success: false, error: "Authentication failed" },
            { status: 500 }
        );
    }
}
