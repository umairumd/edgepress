import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
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


