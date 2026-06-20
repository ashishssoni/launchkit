import { createHash, randomBytes, scryptSync } from 'node:crypto';
import {
  AuditActorType,
  PrismaClient,
  SubscriptionStatus,
  WorkspacePlan,
  WorkspaceRole,
} from '@prisma/client';

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

async function main() {
  const founderPassword = 'StrongPass123!';
  const adminPassword = 'AdminPass123!';

  const founder = await prisma.user.upsert({
    where: { email: 'founder@launchkit.dev' },
    update: {
      fullName: 'Ashish Soni',
      passwordHash: hashPassword(founderPassword),
      emailVerified: true,
    },
    create: {
      email: 'founder@launchkit.dev',
      fullName: 'Ashish Soni',
      passwordHash: hashPassword(founderPassword),
      emailVerified: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@launchkit.dev' },
    update: {
      fullName: 'LaunchKit Admin',
      passwordHash: hashPassword(adminPassword),
      emailVerified: true,
    },
    create: {
      email: 'admin@launchkit.dev',
      fullName: 'LaunchKit Admin',
      passwordHash: hashPassword(adminPassword),
      emailVerified: true,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@launchkit.dev' },
    update: {
      fullName: 'Product Member',
      passwordHash: hashPassword('MemberPass123!'),
      emailVerified: true,
    },
    create: {
      email: 'member@launchkit.dev',
      fullName: 'Product Member',
      passwordHash: hashPassword('MemberPass123!'),
      emailVerified: true,
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: 'launchkit-labs' },
    update: {
      name: 'LaunchKit Labs',
      plan: WorkspacePlan.PRO,
      stripeCustomerId: 'cus_launchkit_demo',
    },
    create: {
      name: 'LaunchKit Labs',
      slug: 'launchkit-labs',
      plan: WorkspacePlan.PRO,
      stripeCustomerId: 'cus_launchkit_demo',
    },
  });

  const secondaryWorkspace = await prisma.workspace.upsert({
    where: { slug: 'founder-ops' },
    update: {
      name: 'Founder Ops',
      plan: WorkspacePlan.FREE,
    },
    create: {
      name: 'Founder Ops',
      slug: 'founder-ops',
      plan: WorkspacePlan.FREE,
    },
  });

  await prisma.membership.deleteMany({
    where: { workspaceId: { in: [workspace.id, secondaryWorkspace.id] } },
  });

  await prisma.apiKey.deleteMany({
    where: { workspaceId: { in: [workspace.id, secondaryWorkspace.id] } },
  });

  await prisma.auditLog.deleteMany({
    where: { workspaceId: { in: [workspace.id, secondaryWorkspace.id] } },
  });

  await prisma.subscription.deleteMany({
    where: { workspaceId: { in: [workspace.id, secondaryWorkspace.id] } },
  });

  await prisma.membership.createMany({
    data: [
      {
        userId: founder.id,
        workspaceId: workspace.id,
        role: WorkspaceRole.OWNER,
      },
      {
        userId: admin.id,
        workspaceId: workspace.id,
        role: WorkspaceRole.ADMIN,
      },
      {
        userId: member.id,
        workspaceId: workspace.id,
        role: WorkspaceRole.MEMBER,
      },
      {
        userId: founder.id,
        workspaceId: secondaryWorkspace.id,
        role: WorkspaceRole.OWNER,
      },
    ],
  });

  await prisma.subscription.create({
    data: {
      workspaceId: workspace.id,
      stripeSubscriptionId: 'sub_launchkit_demo',
      stripePriceId: 'price_pro_demo',
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      cancelAtPeriodEnd: false,
    },
  });

  await prisma.apiKey.createMany({
    data: [
      {
        workspaceId: workspace.id,
        createdById: founder.id,
        name: 'Production Integration Key',
        prefix: 'lk_live_prod',
        secretHash: sha256('lk_live_prod_demo_secret'),
      },
      {
        workspaceId: workspace.id,
        createdById: admin.id,
        name: 'Analytics Sync Key',
        prefix: 'lk_live_anal',
        secretHash: sha256('lk_live_analytics_demo_secret'),
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        workspaceId: workspace.id,
        actorUserId: founder.id,
        actorType: AuditActorType.USER,
        action: 'workspace.created',
        entityType: 'workspace',
        entityId: workspace.id,
        metadata: { source: 'seed' },
      },
      {
        workspaceId: workspace.id,
        actorUserId: founder.id,
        actorType: AuditActorType.USER,
        action: 'billing.checkout_session.created',
        entityType: 'stripe_checkout_session',
        entityId: 'cs_demo_123',
        metadata: { plan: 'PRO' },
      },
      {
        workspaceId: workspace.id,
        actorType: AuditActorType.SYSTEM,
        action: 'billing.subscription.synced',
        entityType: 'subscription',
        entityId: 'sub_launchkit_demo',
        metadata: { status: 'active', plan: 'PRO' },
      },
      {
        workspaceId: workspace.id,
        actorUserId: admin.id,
        actorType: AuditActorType.USER,
        action: 'api_key.created',
        entityType: 'api_key',
        entityId: 'demo_api_key_1',
        metadata: { name: 'Analytics Sync Key' },
      },
      {
        workspaceId: secondaryWorkspace.id,
        actorUserId: founder.id,
        actorType: AuditActorType.USER,
        action: 'workspace.created',
        entityType: 'workspace',
        entityId: secondaryWorkspace.id,
        metadata: { source: 'seed' },
      },
    ],
  });

  console.log('Seeded demo data successfully.');
  console.log('Founder login: founder@launchkit.dev / StrongPass123!');
  console.log('Admin login: admin@launchkit.dev / AdminPass123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
