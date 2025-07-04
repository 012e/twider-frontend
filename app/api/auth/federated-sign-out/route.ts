import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const refreshToken = req.headers.get("refresh_token");

    if (
      !refreshToken ||
      !process.env.AUTH_KEYCLOAK_ISSUER ||
      !process.env.AUTH_KEYCLOAK_ID
    ) {
      throw Error("Missing required environment variables or headers");
    }

    const endSession = await fetch(
      process.env.AUTH_KEYCLOAK_ISSUER + "/protocol/openid-connect/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: new URLSearchParams({
          client_id: process.env.AUTH_KEYCLOAK_ID,
          refresh_token: refreshToken,
        }),
      },
    );

    console.log(endSession);
    console.log(await endSession.json());
    if (endSession && endSession.status && endSession.status >= 300) {
      console.warn("END_SESSION ERROR", endSession.status);
      throw Error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error Sign out",
    });
  }
}
