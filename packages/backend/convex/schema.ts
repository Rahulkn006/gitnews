import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Multi-tenant: resources carry workspaceId. It is `optional` on pre-existing tables only so
// deploys don't fail validation against pre-migration rows; the function layer always sets it.
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    username: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  }).index("email", ["email"]),

  events: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    source: v.string(),
    type: v.string(),
    payload: v.any(),
    receivedAt: v.number(),
  })
    .index("by_received", ["receivedAt"])
    .index("by_workspace", ["workspaceId"]),

  jobs: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    kind: v.string(),
    status: v.string(),
    input: v.optional(v.any()),
    result: v.optional(v.any()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"]),

  auditLogs: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    action: v.string(),
    meta: v.optional(v.any()),
    at: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"]),

  usage: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.optional(v.id("users")),
    metric: v.string(),
    count: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_metric", ["userId", "metric"])
    .index("by_workspace_metric", ["workspaceId", "metric"]),

  apiKeys: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    name: v.string(),
    prefix: v.string(),
    hash: v.string(),
    revoked: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_hash", ["hash"]),

  // Files (workspace-scoped). Stored in Convex file storage; row holds metadata.
  files: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    name: v.string(),
    storageId: v.id("_storage"),
    size: v.number(),
    contentType: v.string(),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  repositorySnapshots: defineTable({
    repoId: v.string(), // GitHub ID
    owner: v.string(),
    name: v.string(),
    stars: v.number(),
    forks: v.number(),
    watchers: v.number(),
    contributors: v.number(),
    topics: v.array(v.string()),
    language: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_repo_id", ["repoId"])
    .index("by_timestamp", ["timestamp"]),

  repositories: defineTable({
    githubId: v.string(),
    name: v.string(),
    owner: v.string(),
    avatar: v.optional(v.string()),
    description: v.optional(v.string()),
    stars: v.number(),
    forks: v.number(),
    language: v.optional(v.string()),
    topics: v.array(v.string()),
    readme: v.optional(v.string()),
    repoUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    trendingScore: v.number(),
    growth24h: v.optional(v.number()),
    growth7d: v.optional(v.number()),
    starsPerDay: v.optional(v.number()),
    velocityScore: v.optional(v.number()),
    gitnewsScore: v.optional(v.number()),
    aiSummary: v.optional(v.string()),
    developerAnalysis: v.optional(
      v.object({
        targetAudience: v.string(),
        ecosystemFit: v.string(),
      })
    ),
    verdict: v.optional(
      v.object({
        learningValue: v.string(),
        futurePotential: v.string(),
        communityStrength: v.string(),
        summary: v.string(),
      })
    ),
    category: v.optional(v.string()),
    primaryCategory: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    categoryUpdatedAt: v.optional(v.number()),
  })
    .index("by_github_id", ["githubId"])
    .index("by_updated", ["updatedAt"])
    .index("by_stars", ["stars"])
    .index("by_trending", ["trendingScore"])
    .index("by_growth24h", ["growth24h"])
    .index("by_gitnewsScore", ["gitnewsScore"])
    .index("by_category", ["category"])
    .index("by_owner_name", ["owner", "name"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    repositoryId: v.id("repositories"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_repository", ["repositoryId"])
    .index("by_user_repository", ["userId", "repositoryId"]),

  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  }),
  members: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_user_workspace", ["userId", "workspaceId"]),
  invites: defineTable({
    workspaceId: v.id("workspaces"),
    email: v.string(),
    role: v.string(),
    invitedBy: v.id("users"),
    accepted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_email", ["email"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),

  news: defineTable({
    title: v.string(),
    source: v.string(),
    summary: v.string(),
    category: v.string(),
    date: v.string(),
    url: v.string(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  // Maintained counters so dashboard.stats is O(1) instead of scanning every row.
  counters: defineTable({
    workspaceId: v.id("workspaces"),
    metric: v.string(),
    value: v.number(),
  }).index("by_workspace_metric", ["workspaceId", "metric"]),
});
