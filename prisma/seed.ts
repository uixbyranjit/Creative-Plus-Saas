import { PrismaClient, Role, LeadStatus, OrderStatus, Priority, PaymentStatus, PaymentMode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding...");

  // 1. CLEAR EXISTING DATA
  console.log("🧹 Cleaning up old tables...");
  await prisma.activityLog.deleteMany();
  await prisma.file.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderStageHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.task.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.client.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // 2. SEED USERS
  console.log("👥 Seeding Users...");
  const admin = await prisma.user.create({
    data: {
      id: "u-admin",
      name: "Rahul Sharma",
      email: "admin@creativeplus.com",
      password: "password123",
      role: Role.ADMIN,
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    }
  });

  const manager = await prisma.user.create({
    data: {
      id: "u-manager",
      name: "Priya Patel",
      email: "manager@creativeplus.com",
      password: "password123",
      role: Role.MANAGER,
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    }
  });

  const designer = await prisma.user.create({
    data: {
      id: "u-designer",
      name: "Amit Verma",
      email: "designer@creativeplus.com",
      password: "password123",
      role: Role.DESIGNER,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  });

  const employee = await prisma.user.create({
    data: {
      id: "u-employee",
      name: "Sneha Reddy",
      email: "employee@creativeplus.com",
      password: "password123",
      role: Role.EMPLOYEE,
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    }
  });

  const clientUser = await prisma.user.create({
    data: {
      id: "u-client",
      name: "Vikram Malhotra",
      email: "client@creativeplus.com",
      password: "password123",
      role: Role.CLIENT,
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    }
  });

  // 3. SEED LEADS
  console.log("📈 Seeding Leads...");
  await prisma.lead.createMany({
    data: [
      {
        id: "lead-1",
        leadId: "CPD-L-1001",
        clientName: "Rohan Singhal",
        companyName: "Acme Tech Solutions",
        email: "rohan@acmetech.com",
        mobile: "+91 98765 43210",
        source: "Website",
        status: LeadStatus.NEW_LEAD,
        remarks: "Interested in full digital rebranding package. Needs proposal by Monday."
      },
      {
        id: "lead-2",
        leadId: "CPD-L-1002",
        clientName: "Aarti Gupta",
        companyName: "Nisha Cosmetics",
        email: "aarti@nishacosmetics.in",
        mobile: "+91 98765 43211",
        source: "Instagram",
        status: LeadStatus.CONTACTED,
        remarks: "Called to discuss Instagram social media marketing. Requested portfolio links."
      },
      {
        id: "lead-3",
        leadId: "CPD-L-1003",
        clientName: "Karan Johar",
        companyName: "Dharma Productions",
        email: "karan@dharma.com",
        mobile: "+91 98765 43212",
        source: "Reference",
        status: LeadStatus.PROPOSAL,
        remarks: "Sent proposal for movie banner marketing campaign ($5,000 budget). Awaiting feedback."
      },
      {
        id: "lead-4",
        leadId: "CPD-L-1004",
        clientName: "Sarah Jenkins",
        companyName: "FitLife Studios",
        email: "sarah@fitlifestudios.com",
        mobile: "+1 415 555 2671",
        source: "Facebook",
        status: LeadStatus.WON,
        remarks: "Won lead for Gym UI/UX redesign order. Client converted to active."
      }
    ]
  });

  // 4. SEED CLIENTS
  console.log("🏢 Seeding Clients CRM...");
  const c1 = await prisma.client.create({
    data: {
      id: "c-1",
      clientId: "CPD-C-1001",
      name: "Vikram Malhotra",
      companyName: "Malhotra Retail Group",
      mobile: "+91 99999 88888",
      email: "client@creativeplus.com",
      city: "Mumbai",
      pinCode: "400001",
      leadSource: "Reference",
      notes: "High value retail client. Demands clean, premium designs.",
      gstNumber: "27AAAAA1111A1Z1",
      address: "101, Maker Chambers, Nariman Point",
      industry: "Retail",
      status: "Active",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    }
  });

  const c2 = await prisma.client.create({
    data: {
      id: "c-2",
      clientId: "CPD-C-1002",
      name: "Sarah Jenkins",
      companyName: "FitLife Studios",
      mobile: "+1 415 555 2671",
      email: "sarah@fitlifestudios.com",
      city: "San Francisco",
      pinCode: "94103",
      leadSource: "Facebook",
      notes: "Focus is wellness design elements.",
      gstNumber: null,
      address: "525 Brannan St, San Francisco, CA",
      industry: "Fitness & Wellness",
      status: "Active",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    }
  });

  const c3 = await prisma.client.create({
    data: {
      id: "c-3",
      clientId: "CPD-C-1003",
      name: "Meera Nair",
      companyName: "Nair Culinary Arts",
      mobile: "+91 98888 77777",
      email: "meera@nairculinary.com",
      city: "Bangalore",
      pinCode: "560001",
      leadSource: "Instagram",
      notes: "Requires regular monthly social media graphics.",
      gstNumber: "29BBBBB2222B2Z2",
      address: "22, Residency Road, Bangalore",
      industry: "Food & Beverage",
      status: "Active",
      profileImage: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80"
    }
  });

  // 5. SEED SUBSCRIPTIONS
  console.log("🔁 Seeding Recurring Subscriptions...");
  await prisma.subscription.create({
    data: {
      id: "sub-1",
      clientId: c3.id,
      serviceName: "Social Media Retainer (15 Posts/mo)",
      amount: 1200.0,
      status: "ACTIVE",
      nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }
  });

  // 6. SEED ORDERS & HISTORIES
  console.log("🛍️ Seeding Orders...");
  const o1 = await prisma.order.create({
    data: {
      id: "o-1",
      orderId: "CPD-O-1001",
      clientId: c1.id,
      serviceName: "E-Commerce Web Portal Rebrand",
      workType: "Project",
      description: "Full design rebrand of Malhotra Retail e-commerce portal.",
      assignedToId: designer.id,
      priority: Priority.URGENT,
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-07-30"),
      expectedDelivery: new Date("2026-07-25"),
      status: OrderStatus.REVIEW,
      advanceAmount: 3000.0,
      remainingAmount: 4000.0,
      totalAmount: 7000.0,
      notes: "Client has reviewed the initial draft."
    }
  });

  await prisma.orderStageHistory.createMany({
    data: [
      {
        orderId: o1.id,
        stage: OrderStatus.NEW,
        completedBy: "Rahul Sharma",
        comments: "Order registered in operations module.",
      },
      {
        orderId: o1.id,
        stage: OrderStatus.WORKING,
        completedBy: "Amit Verma",
        comments: "Wireframes completed and colored layouts initialized.",
      }
    ]
  });

  // 7. SEED TASKS
  console.log("🛠️ Seeding Tasks...");
  await prisma.task.create({
    data: {
      id: "t-1",
      name: "Design Homepage UI Draft",
      description: "Draw homepage layouts and hero illustration.",
      assignedToId: designer.id,
      deadline: new Date("2026-07-20"),
      priority: Priority.HIGH,
      status: "WORKING",
      workingHours: 8.5,
      checklist: JSON.stringify([
        { text: "Wireframing hero segment", completed: true },
        { text: "Adding product grid sections", completed: true },
        { text: "Tailoring color contrast themes", completed: false }
      ])
    }
  });

  // 8. SEED PAYMENTS
  console.log("💳 Seeding Invoices...");
  await prisma.payment.create({
    data: {
      id: "pay-1",
      orderId: o1.id,
      clientId: c1.id,
      totalAmount: 7000.0,
      advance: 3000.0,
      balance: 4000.0,
      paymentMode: PaymentMode.BANK_TRANSFER,
      invoiceNumber: "INV-2026-001",
      gst: 18.0,
      dueDate: new Date("2026-07-28"),
      status: PaymentStatus.PARTIAL
    }
  });

  // 9. SEED FOLLOW-UPS
  console.log("📞 Seeding Follow-ups CRM...");
  await prisma.followUp.create({
    data: {
      id: "fu-1",
      clientId: c1.id,
      purpose: "Discuss E-commerce design edits feedback.",
      date: new Date("2026-07-17"),
      time: "11:30",
      remarks: "Best to call at 11:30 sharp.",
      status: "PENDING"
    }
  });

  // 10. SEED FILES
  console.log("📁 Seeding Files...");
  await prisma.file.create({
    data: {
      id: "f-1",
      name: "Malhotra-Branding-Moodboard.jpg",
      path: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
      type: "Image",
      size: 2450000,
      orderId: o1.id
    }
  });

  // 11. SEED ACTIVITY LOGS
  console.log("🗒️ Seeding Activity Logs...");
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: "Order Created",
      details: "Rahul Sharma created order CPD-O-1001 for Malhotra Retail."
    }
  });

  console.log("🎉 Database seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
