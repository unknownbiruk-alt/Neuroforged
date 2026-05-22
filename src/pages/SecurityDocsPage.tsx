import { Shield, Webhook, Database, Lock, Key } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function SecurityDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-violet-400" />
          <span className="text-violet-400 text-sm font-medium">Architecture</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Security & Integration Reference</h1>
        <p className="text-gray-400 text-sm">Production security patterns, Paddle webhook handling, and data isolation architecture.</p>
      </div>

      {/* Prisma Schema */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-white">Prisma Schema (Production)</h2>
        </div>
        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                String        @id @default(cuid())
  email             String        @unique
  name              String
  passwordHash      String
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  onboardingComplete Boolean      @default(false)
  xp                Int           @default(0)
  sessions          TestSession[]
  subscription      Subscription?
}

model TestSession {
  id              String   @id @default(cuid())
  userId          String   // REQUIRED — never null
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  testType        String
  score           Int
  accuracy        Float
  reactionTimeMs  Int?
  difficulty      Int
  durationSeconds Int
  xpEarned        Int
  completedAt     DateTime @default(now())
  metrics         Json

  @@index([userId])          // Always query by userId
  @@index([userId, testType])
  @@index([userId, completedAt])
}

model Subscription {
  id                 String   @id @default(cuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  paddleSubscriptionId String  @unique
  paddleCustomerId   String
  tier               String   // "free" | "pro" | "elite"
  status             String   // "active" | "cancelled" | "past_due"
  currentPeriodEnd   DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}`}
        </pre>
      </Card>

      {/* Data Isolation Middleware */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-white">Auth Middleware (Next.js App Router)</h2>
        </div>
        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Authenticated routes only
    const protectedPaths = ["/dashboard", "/tests", "/analytics", "/leaderboard", "/profile", "/settings"]
    const isProtected = protectedPaths.some(p => pathname.startsWith(p))

    if (!token && isProtected) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Onboarding gate
    if (token && !token.onboardingComplete && pathname !== "/onboarding") {
      if (isProtected) {
        return NextResponse.redirect(new URL("/onboarding", req.url))
      }
    }

    // Subscription tier check for Elite-only routes
    if (pathname.startsWith("/tests/focus-endurance")) {
      const tier = token?.subscriptionTier
      if (tier !== "elite") {
        return NextResponse.redirect(new URL("/pricing", req.url))
      }
    }

    return NextResponse.next()
  },
  { callbacks: { authorized: () => true } }
)

export const config = {
  matcher: ["/dashboard/:path*", "/tests/:path*", "/analytics/:path*", "/settings/:path*"]
}`}
        </pre>
      </Card>

      {/* Analytics Query with userId Filter */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-violet-400" />
          <h2 className="font-bold text-white">Analytics Query — Strict userId Isolation</h2>
        </div>
        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`// app/api/analytics/route.ts
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET() {
  // Always authenticate first
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id  // Immutable — from verified JWT

  // CRITICAL: Every query MUST filter by userId
  // Never query TestSession without { where: { userId } }
  const sessions = await prisma.testSession.findMany({
    where: { userId },  // ← NEVER omit this
    orderBy: { completedAt: "desc" },
    select: {
      id: true,
      testType: true,
      score: true,
      accuracy: true,
      reactionTimeMs: true,
      difficulty: true,
      xpEarned: true,
      completedAt: true,
    },
  })

  if (sessions.length === 0) {
    return Response.json({ empty: true, message: "No training data yet." })
  }

  if (sessions.length < 3) {
    return Response.json({
      partial: true,
      sessions,
      message: \`Complete \${3 - sessions.length} more session(s) to unlock analytics.\`
    })
  }

  // Compute analytics from real data only
  const avgScore = sessions.reduce((s, x) => s + x.score, 0) / sessions.length
  // ... additional computations

  return Response.json({ sessions, avgScore })
}`}
        </pre>
      </Card>

      {/* Paddle Webhook */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Webhook className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-white">Paddle Webhook Handler</h2>
        </div>
        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`// app/api/webhooks/paddle/route.ts
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET!

// Verify Paddle webhook signature
function verifyPaddleSignature(rawBody: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", PADDLE_WEBHOOK_SECRET)
  hmac.update(rawBody)
  const expected = hmac.digest("hex")
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

const TIER_MAP: Record<string, string> = {
  [process.env.PADDLE_PRO_PRODUCT_ID!]: "pro",
  [process.env.PADDLE_ELITE_PRODUCT_ID!]: "elite",
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get("Paddle-Signature") ?? ""

  // CRITICAL: Always verify webhook authenticity
  if (!verifyPaddleSignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const { event_type, data } = event

  switch (event_type) {
    case "subscription.created":
    case "subscription.updated": {
      const userId = data.custom_data?.userId
      if (!userId) break

      const tier = TIER_MAP[data.items[0].product.id] ?? "free"

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          paddleSubscriptionId: data.id,
          paddleCustomerId: data.customer_id,
          tier,
          status: data.status === "active" ? "active" : "past_due",
          currentPeriodEnd: new Date(data.current_billing_period.ends_at),
        },
        update: {
          tier,
          status: data.status,
          currentPeriodEnd: new Date(data.current_billing_period.ends_at),
          paddleSubscriptionId: data.id,
        },
      })
      break
    }

    case "subscription.cancelled": {
      const userId = data.custom_data?.userId
      if (!userId) break

      // Downgrade to free on cancellation
      await prisma.subscription.update({
        where: { userId },
        data: {
          tier: "free",
          status: "cancelled",
        },
      })
      break
    }
  }

  return Response.json({ received: true })
}`}
        </pre>
      </Card>

      {/* Session Creation */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-white">TestSession Creation — Authenticated Only</h2>
        </div>
        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`// app/api/sessions/route.ts
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const SessionSchema = z.object({
  testType: z.enum(["reaction_time", "aim_precision", "pattern_recognition",
                     "working_memory", "cognitive_flexibility", "focus_endurance"]),
  score: z.number().int().min(0).max(10000),
  accuracy: z.number().min(0).max(100),
  reactionTimeMs: z.number().int().optional(),
  difficulty: z.number().int().min(1).max(10),
  durationSeconds: z.number().int().min(1),
  metrics: z.record(z.number()),
})

export async function POST(req: Request) {
  // Step 1: Authenticate — no session = 401
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Step 2: Validate input
  const body = await req.json()
  const parsed = SessionSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Invalid data" }, { status: 400 })
  }

  const { testType, score, accuracy, reactionTimeMs, difficulty, durationSeconds, metrics } = parsed.data

  // Step 3: Verify subscription allows this test type
  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  const tier = sub?.tier ?? "free"
  const PRO_TESTS = ["working_memory", "cognitive_flexibility"]
  const ELITE_TESTS = ["focus_endurance"]
  if (ELITE_TESTS.includes(testType) && tier !== "elite") {
    return Response.json({ error: "Elite subscription required" }, { status: 403 })
  }
  if (PRO_TESTS.includes(testType) && !["pro", "elite"].includes(tier)) {
    return Response.json({ error: "Pro subscription required" }, { status: 403 })
  }

  // Step 4: Compute XP
  const base = Math.round(score * 0.5)
  const accBonus = Math.round(accuracy * 0.3)
  const diffMultiplier = 1 + (difficulty - 1) * 0.15
  const xpEarned = Math.round((base + accBonus) * diffMultiplier)

  // Step 5: Create session — userId from verified JWT, never from client
  const testSession = await prisma.testSession.create({
    data: {
      userId: session.user.id,  // ← Always from server session, NEVER from request body
      testType,
      score,
      accuracy,
      reactionTimeMs,
      difficulty,
      durationSeconds,
      xpEarned,
      metrics,
    },
  })

  // Step 6: Update user XP atomically
  await prisma.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: xpEarned } },
  })

  return Response.json({ session: testSession, xpEarned }, { status: 201 })
}`}
        </pre>
      </Card>
    </div>
  );
}
