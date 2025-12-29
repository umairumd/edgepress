import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

function isAuthorized(req: NextRequest) {
  const token = (process.env.HEALTHCHECK_TOKEN || "").trim();
  if (!token) return false;
  const provided = req.nextUrl.searchParams.get("token") || "";
  return provided === token;
}

export async function GET(req: NextRequest) {
  // Don't expose deployment metadata publicly unless explicitly authorized.
  if (!isAuthorized(req)) return new NextResponse("Not Found", { status: 404 });

  return NextResponse.json({
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelDeploymentId: process.env.VERCEL_DEPLOYMENT_ID,
    vercelCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
    vercelCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    vercelCommitRef: process.env.VERCEL_GIT_COMMIT_REF,
  });
}


