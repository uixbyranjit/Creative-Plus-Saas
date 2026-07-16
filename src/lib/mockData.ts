export const MOCK_USERS = [
  {
    id: "u-admin",
    name: "Rahul Sharma",
    email: "admin@creativeplus.com",
    password: "password123", // In production, this would be hashed
    role: "ADMIN",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "u-manager",
    name: "Priya Patel",
    email: "manager@creativeplus.com",
    password: "password123",
    role: "MANAGER",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "u-designer",
    name: "Amit Verma",
    email: "designer@creativeplus.com",
    password: "password123",
    role: "DESIGNER",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "u-employee",
    name: "Sneha Reddy",
    email: "employee@creativeplus.com",
    password: "password123",
    role: "EMPLOYEE",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "u-client",
    name: "Vikram Malhotra",
    email: "client@creativeplus.com",
    password: "password123",
    role: "CLIENT",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  }
];

export const MOCK_LEADS = [
  {
    id: "lead-1",
    leadId: "CPD-L-1001",
    clientName: "Rohan Singhal",
    companyName: "Acme Tech Solutions",
    email: "rohan@acmetech.com",
    mobile: "+91 98765 43210",
    source: "Website",
    status: "NEW_LEAD",
    remarks: "Interested in full digital rebranding package. Needs proposal by Monday.",
    createdAt: new Date("2026-07-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-10T10:00:00Z").toISOString()
  },
  {
    id: "lead-2",
    leadId: "CPD-L-1002",
    clientName: "Aarti Gupta",
    companyName: "Nisha Cosmetics",
    email: "aarti@nishacosmetics.in",
    mobile: "+91 98765 43211",
    source: "Instagram",
    status: "CONTACTED",
    remarks: "Called to discuss Instagram social media marketing. Requested portfolio links.",
    createdAt: new Date("2026-07-12T11:30:00Z").toISOString(),
    updatedAt: new Date("2026-07-13T14:15:00Z").toISOString()
  },
  {
    id: "lead-3",
    leadId: "CPD-L-1003",
    clientName: "Karan Johar",
    companyName: "Dharma Productions",
    email: "karan@dharma.com",
    mobile: "+91 98765 43212",
    source: "Reference",
    status: "PROPOSAL",
    remarks: "Sent proposal for movie banner marketing campaign ($5,000 budget). Awaiting feedback.",
    createdAt: new Date("2026-07-11T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-14T16:00:00Z").toISOString()
  },
  {
    id: "lead-4",
    leadId: "CPD-L-1004",
    clientName: "Sarah Jenkins",
    companyName: "FitLife Studios",
    email: "sarah@fitlifestudios.com",
    mobile: "+1 415 555 2671",
    source: "Facebook",
    status: "WON",
    remarks: "Won lead for Gym UI/UX redesign order. Client converted to active.",
    createdAt: new Date("2026-07-08T14:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-15T12:00:00Z").toISOString()
  },
  {
    id: "lead-5",
    leadId: "CPD-L-1005",
    clientName: "David Lee",
    companyName: "Lee Consulting",
    email: "david@leeconsulting.com",
    mobile: "+1 510 555 9831",
    source: "LinkedIn",
    status: "LOST",
    remarks: "Budget was too low ($500 for a complex website design). Archiving lead.",
    createdAt: new Date("2026-07-05T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-09T17:30:00Z").toISOString()
  }
];

export const MOCK_CLIENTS = [
  {
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
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date("2026-06-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-01T10:00:00Z").toISOString()
  },
  {
    id: "c-2",
    clientId: "CPD-C-1002",
    name: "Sarah Jenkins",
    companyName: "FitLife Studios",
    mobile: "+1 415 555 2671",
    email: "sarah@fitlifestudios.com",
    city: "San Francisco",
    pinCode: "94103",
    leadSource: "Facebook",
    notes: "Recently converted from leads. Focus is health and lifestyle design elements.",
    gstNumber: null,
    address: "525 Brannan St, San Francisco, CA",
    industry: "Fitness & Wellness",
    status: "Active",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date("2026-07-15T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-15T12:00:00Z").toISOString()
  },
  {
    id: "c-3",
    clientId: "CPD-C-1003",
    name: "Meera Nair",
    companyName: "Nair Culinary Arts",
    mobile: "+91 98888 77777",
    email: "meera@nairculinary.com",
    city: "Bangalore",
    pinCode: "560001",
    leadSource: "Instagram",
    notes: "Requires regular monthly social media graphics. Focus on premium food styling photography designs.",
    gstNumber: "29BBBBB2222B2Z2",
    address: "22, Residency Road, Bangalore",
    industry: "Food & Beverage",
    status: "Active",
    profileImage: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date("2026-05-15T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-05-15T09:00:00Z").toISOString()
  },
  {
    id: "c-4",
    clientId: "CPD-C-1004",
    name: "George Cooper",
    companyName: "MedHealth Diagnostics",
    mobile: "+1 212 555 4321",
    email: "george@medhealth.com",
    city: "New York",
    pinCode: "10001",
    leadSource: "Website",
    notes: "Clinical corporate style needed. Prefers blue-white schemes.",
    gstNumber: null,
    address: "742 Lexington Ave, New York, NY",
    industry: "Healthcare",
    status: "Inactive",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date("2026-04-10T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-20T15:00:00Z").toISOString()
  }
];

export const MOCK_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    clientId: "c-3",
    serviceName: "Social Media Retainer (15 Posts/mo)",
    amount: 1200.0,
    intervalMonths: 1,
    status: "ACTIVE",
    lastBilled: new Date("2026-07-01T00:00:00Z").toISOString(),
    nextBilling: new Date("2026-08-01T00:00:00Z").toISOString(),
    createdAt: new Date("2026-05-15T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T00:00:00Z").toISOString()
  },
  {
    id: "sub-2",
    clientId: "c-1",
    serviceName: "SEO & Content Marketing Package",
    amount: 2500.0,
    intervalMonths: 1,
    status: "ACTIVE",
    lastBilled: new Date("2026-07-15T00:00:00Z").toISOString(),
    nextBilling: new Date("2026-08-15T00:00:00Z").toISOString(),
    createdAt: new Date("2026-06-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-15T00:00:00Z").toISOString()
  }
];

export const MOCK_ORDERS = [
  {
    id: "o-1",
    orderId: "CPD-O-1001",
    clientId: "c-1",
    serviceName: "E-Commerce Web Portal Rebrand",
    workType: "Project",
    description: "Full design rebrand of Malhotra Retail e-commerce portal. Includes UI/UX mockups, wireframes, style guide, and final assets.",
    assignedToId: "u-designer",
    priority: "URGENT",
    startDate: new Date("2026-07-01T09:00:00Z").toISOString(),
    endDate: new Date("2026-07-30T18:00:00Z").toISOString(),
    expectedDelivery: new Date("2026-07-25T17:00:00Z").toISOString(),
    status: "REVIEW",
    advanceAmount: 3000.0,
    remainingAmount: 4000.0,
    totalAmount: 7000.0,
    notes: "Client has reviewed the initial draft. Now waiting for draft 2 comments.",
    createdAt: new Date("2026-07-01T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-15T15:00:00Z").toISOString()
  },
  {
    id: "o-2",
    orderId: "CPD-O-1002",
    clientId: "c-2",
    serviceName: "FitLife Mobile App Design",
    workType: "Project",
    description: "Designing the gym check-in, tracking, and community UI pages for the new iOS app.",
    assignedToId: "u-designer",
    priority: "HIGH",
    startDate: new Date("2026-07-15T09:00:00Z").toISOString(),
    endDate: new Date("2026-08-15T18:00:00Z").toISOString(),
    expectedDelivery: new Date("2026-08-10T17:00:00Z").toISOString(),
    status: "WORKING",
    advanceAmount: 1500.0,
    remainingAmount: 1500.0,
    totalAmount: 3000.0,
    notes: "Work started on the wireframes. First user journey flows finalized.",
    createdAt: new Date("2026-07-15T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-16T10:00:00Z").toISOString()
  },
  {
    id: "o-3",
    orderId: "CPD-O-1003",
    clientId: "c-3",
    serviceName: "Premium Logo & Brand Guideline",
    workType: "Single Design",
    description: "Minimalist brand logo design and style sheet containing color palettes, font pairings, and icon guidelines.",
    assignedToId: "u-employee",
    priority: "MEDIUM",
    startDate: new Date("2026-06-20T09:00:00Z").toISOString(),
    endDate: new Date("2026-07-10T18:00:00Z").toISOString(),
    expectedDelivery: new Date("2026-07-05T17:00:00Z").toISOString(),
    status: "COMPLETED",
    advanceAmount: 1000.0,
    remainingAmount: 0.0,
    totalAmount: 1000.0,
    notes: "Logo files delivered via zip. Invoice fully settled.",
    createdAt: new Date("2026-06-20T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-08T16:00:00Z").toISOString()
  },
  {
    id: "o-4",
    orderId: "CPD-O-1004",
    clientId: "c-1",
    serviceName: "July Newsletter Creative Campaign",
    workType: "Monthly Package",
    description: "Designing email templates, HTML assets, and custom banners for Malhotra Retail's mid-summer promotional sale campaign.",
    assignedToId: "u-designer",
    priority: "LOW",
    startDate: new Date("2026-07-10T09:00:00Z").toISOString(),
    endDate: new Date("2026-07-28T18:00:00Z").toISOString(),
    expectedDelivery: new Date("2026-07-26T17:00:00Z").toISOString(),
    status: "NEW",
    advanceAmount: 0.0,
    remainingAmount: 1500.0,
    totalAmount: 1500.0,
    notes: "Awaiting down payment to initialize project design mockups.",
    createdAt: new Date("2026-07-10T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-10T09:00:00Z").toISOString()
  }
];

export const MOCK_ORDER_STAGE_HISTORIES = [
  {
    id: "osh-1",
    orderId: "o-1",
    stage: "NEW",
    completedBy: "Rahul Sharma",
    comments: "Created order CPD-O-1001 for Malhotra Retail Group.",
    attachments: null,
    timestamp: new Date("2026-07-01T09:00:00Z").toISOString()
  },
  {
    id: "osh-2",
    orderId: "o-1",
    stage: "WORKING",
    completedBy: "Amit Verma",
    comments: "Design drafts initialized. Working on Landing page first.",
    attachments: null,
    timestamp: new Date("2026-07-03T11:00:00Z").toISOString()
  },
  {
    id: "osh-3",
    orderId: "o-1",
    stage: "REVIEW",
    completedBy: "Amit Verma",
    comments: "Uploaded PDF design drafts. Awaiting client review comments.",
    attachments: JSON.stringify([{ name: "Malhotra-Draft-v1.pdf", path: "#" }]),
    timestamp: new Date("2026-07-15T15:00:00Z").toISOString()
  },
  {
    id: "osh-4",
    orderId: "o-2",
    stage: "NEW",
    completedBy: "Priya Patel",
    comments: "Order registered. Wireframe guidelines set up.",
    attachments: null,
    timestamp: new Date("2026-07-15T12:00:00Z").toISOString()
  },
  {
    id: "osh-5",
    orderId: "o-2",
    stage: "WORKING",
    completedBy: "Amit Verma",
    comments: "Working on the core splash pages and user profiles interface.",
    attachments: null,
    timestamp: new Date("2026-07-16T10:00:00Z").toISOString()
  }
];

export const MOCK_TASKS = [
  {
    id: "t-1",
    name: "Design Homepage UI Draft",
    description: "Draw homepage layouts and hero illustration for Malhotra Retail. Modern, card-based premium style.",
    assignedToId: "u-designer",
    deadline: new Date("2026-07-20T17:00:00Z").toISOString(),
    priority: "HIGH",
    status: "WORKING",
    workingHours: 8.5,
    attachments: null,
    comments: "Amit: Wireframe done. Now styling layout grids.",
    checklist: JSON.stringify([
      { text: "Wireframing hero segment", completed: true },
      { text: "Adding product grid sections", completed: true },
      { text: "Tailoring color contrast themes", completed: false },
      { text: "Adding typography styling sheet", completed: false }
    ]),
    createdAt: new Date("2026-07-02T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-16T11:00:00Z").toISOString()
  },
  {
    id: "t-2",
    name: "Client Feedback Call",
    description: "Discuss Nair Culinary Arts Instagram post creative drafts.",
    assignedToId: "u-employee",
    deadline: new Date("2026-07-16T15:00:00Z").toISOString(),
    priority: "MEDIUM",
    status: "COMPLETED",
    workingHours: 1.0,
    attachments: null,
    comments: "Sneha: Client approved all 5 drafts with no revisions.",
    checklist: null,
    createdAt: new Date("2026-07-15T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-16T16:00:00Z").toISOString()
  },
  {
    id: "t-3",
    name: "Assemble Brand Assets folder",
    description: "Pack logo files (PNG, SVG, AI) and guidelines document for delivery.",
    assignedToId: "u-employee",
    deadline: new Date("2026-07-06T18:00:00Z").toISOString(),
    priority: "LOW",
    status: "COMPLETED",
    workingHours: 2.0,
    attachments: null,
    comments: "Delivered via ZIP upload.",
    checklist: null,
    createdAt: new Date("2026-07-04T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-05T14:00:00Z").toISOString()
  },
  {
    id: "t-4",
    name: "FitLife App Typography & Color Palette Selection",
    description: "Establish primary, secondary, and accent colors, and configure font sizes.",
    assignedToId: "u-designer",
    deadline: new Date("2026-07-22T17:00:00Z").toISOString(),
    priority: "MEDIUM",
    status: "PENDING",
    workingHours: 0.0,
    attachments: null,
    comments: null,
    checklist: JSON.stringify([
      { text: "Research competitor wellness apps styling", completed: false },
      { text: "Draft 3 palette mock suggestions", completed: false }
    ]),
    createdAt: new Date("2026-07-15T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-15T12:00:00Z").toISOString()
  }
];

export const MOCK_PAYMENTS = [
  {
    id: "pay-1",
    orderId: "o-1",
    clientId: "c-1",
    totalAmount: 7000.0,
    advance: 3000.0,
    balance: 4000.0,
    paymentMode: "BANK_TRANSFER",
    invoiceNumber: "INV-2026-001",
    gst: 18.0,
    dueDate: new Date("2026-07-28T00:00:00Z").toISOString(),
    status: "PARTIAL",
    createdAt: new Date("2026-07-01T09:15:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T09:15:00Z").toISOString()
  },
  {
    id: "pay-2",
    orderId: "o-2",
    clientId: "c-2",
    totalAmount: 3000.0,
    advance: 1500.0,
    balance: 1500.0,
    paymentMode: "UPI",
    invoiceNumber: "INV-2026-002",
    gst: 18.0,
    dueDate: new Date("2026-08-15T00:00:00Z").toISOString(),
    status: "PARTIAL",
    createdAt: new Date("2026-07-15T12:15:00Z").toISOString(),
    updatedAt: new Date("2026-07-15T12:15:00Z").toISOString()
  },
  {
    id: "pay-3",
    orderId: "o-3",
    clientId: "c-3",
    totalAmount: 1000.0,
    advance: 1000.0,
    balance: 0.0,
    paymentMode: "CARD",
    invoiceNumber: "INV-2026-003",
    gst: 18.0,
    dueDate: new Date("2026-07-10T00:00:00Z").toISOString(),
    status: "PAID",
    createdAt: new Date("2026-06-20T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-07-08T15:30:00Z").toISOString()
  },
  {
    id: "pay-4",
    orderId: "o-4",
    clientId: "c-1",
    totalAmount: 1500.0,
    advance: 0.0,
    balance: 1500.0,
    paymentMode: "UPI",
    invoiceNumber: "INV-2026-004",
    gst: 18.0,
    dueDate: new Date("2026-07-25T00:00:00Z").toISOString(),
    status: "PENDING",
    createdAt: new Date("2026-07-10T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-10T09:00:00Z").toISOString()
  }
];

export const MOCK_FOLLOWUPS = [
  {
    id: "fu-1",
    clientId: "c-1",
    purpose: "Discuss E-commerce design edits feedback.",
    date: new Date("2026-07-17T00:00:00Z").toISOString(),
    time: "11:30",
    reminder: true,
    remarks: "Client is extremely busy in the morning. Best to ring at 11:30 sharp.",
    status: "PENDING",
    createdAt: new Date("2026-07-15T15:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-15T15:00:00Z").toISOString()
  },
  {
    id: "fu-2",
    clientId: "c-3",
    purpose: "Review august subscription billing renewal setup",
    date: new Date("2026-07-20T00:00:00Z").toISOString(),
    time: "15:00",
    reminder: true,
    remarks: "Confirm if they wish to add 5 more post creatives.",
    status: "PENDING",
    createdAt: new Date("2026-07-16T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-16T11:00:00Z").toISOString()
  },
  {
    id: "fu-3",
    clientId: "c-4",
    purpose: "Check-in call for medical portal phase 2 interest",
    date: new Date("2026-07-14T00:00:00Z").toISOString(),
    time: "10:00",
    remarks: "Called George. He is out of station till next week. Will contact later.",
    status: "CANCELLED",
    createdAt: new Date("2026-07-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-14T10:30:00Z").toISOString()
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n-1",
    title: "New Lead Added",
    message: "Aarti Gupta has registered as a new lead via Instagram.",
    type: "info",
    read: false,
    createdAt: new Date("2026-07-12T11:30:00Z").toISOString()
  },
  {
    id: "n-2",
    title: "Payment Received",
    message: "Malhotra Retail paid advance $3,000 for CPD-O-1001.",
    type: "success",
    read: true,
    createdAt: new Date("2026-07-01T09:15:00Z").toISOString()
  },
  {
    id: "n-3",
    title: "Task Deadline Approaching",
    message: "Homepage UI Draft is due tomorrow.",
    type: "warning",
    read: false,
    createdAt: new Date("2026-07-19T09:00:00Z").toISOString()
  }
];

export const MOCK_FILES = [
  {
    id: "f-1",
    name: "Malhotra-Branding-Moodboard.jpg",
    path: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
    type: "Image",
    size: 2450000,
    orderId: "o-1",
    createdAt: new Date("2026-07-02T10:00:00Z").toISOString()
  },
  {
    id: "f-2",
    name: "Acme-Rebrand-Proposal-v2.pdf",
    path: "#",
    type: "PDF",
    size: 1540000,
    orderId: null,
    createdAt: new Date("2026-07-11T12:00:00Z").toISOString()
  },
  {
    id: "f-3",
    name: "FitLife-wireframes.zip",
    path: "#",
    type: "ZIP",
    size: 14500000,
    orderId: "o-2",
    createdAt: new Date("2026-07-16T10:00:00Z").toISOString()
  }
];

export const MOCK_ACTIVITY_LOGS = [
  {
    id: "al-1",
    userId: "u-admin",
    action: "Order Created",
    details: "Rahul Sharma created order CPD-O-1001.",
    createdAt: new Date("2026-07-01T09:00:00Z").toISOString()
  },
  {
    id: "al-2",
    userId: "u-designer",
    action: "Design Uploaded",
    details: "Amit Verma uploaded draft moodboard for Malhotra Retail.",
    createdAt: new Date("2026-07-02T10:00:00Z").toISOString()
  },
  {
    id: "al-3",
    userId: "u-employee",
    action: "Task Completed",
    details: "Sneha Reddy completed task 'Assemble Brand Assets folder'.",
    createdAt: new Date("2026-07-05T14:00:00Z").toISOString()
  },
  {
    id: "al-4",
    userId: "u-admin",
    action: "Lead Converted",
    details: "Rahul Sharma converted Lead CPD-L-1004 (Sarah Jenkins) to Client.",
    createdAt: new Date("2026-07-15T12:00:00Z").toISOString()
  }
];
