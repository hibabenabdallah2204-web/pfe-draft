import MockAdapter from "axios-mock-adapter";

// Mock Data
export const usersData = [
  {
    id: "USR-001",
    fullName: "Ahmed Ben Salah",
    role: "Investor",
    status: "Approved",
    accountSource: "Self Registration",
    email: "ahmed@example.com",
    createdAt: "2026-03-28",
  },
  {
    id: "USR-002",
    fullName: "Sarra Trabelsi",
    role: "Promoter",
    status: "Pending",
    accountSource: "Self Registration",
    email: "sarra@example.com",
    createdAt: "2026-03-27",
  },
  {
    id: 5,
    name: "Khaled Zairi",
    email: "khaled@agence.tn",
    role: "Real Estate Agent / Agency",
    status: "Active",
    lastLogin: "2026-03-31 09:12",
  },
  {
    id: 6,
    name: "Sonia Mansour",
    email: "sonia@kyc.tn",
    role: "Vérificateur KYC",
    status: "Active",
    lastLogin: "2026-04-09 11:20",
  },
  {
    id: 7,
    name: "Tarek Legal",
    email: "tarek@legal.tn",
    role: "Agent judiciaire",
    status: "Active",
    lastLogin: "2026-04-08 14:15",
  },
  {
    id: "USR-003",
    fullName: "Yassine Mhiri",
    role: "Real Estate Agent",
    status: "Approved",
    accountSource: "Self Registration",
    email: "yassine@example.com",
    createdAt: "2026-03-26",
  },
  {
    id: "USR-004",
    fullName: "Meriem Jlassi",
    role: "Customer Support",
    status: "Approved",
    accountSource: "Admin Created",
    email: "meriem@example.com",
    createdAt: "2026-03-25",
  },
  {
    id: "USR-005",
    fullName: "Hatem Gharbi",
    role: "Financial Manager",
    status: "Approved",
    accountSource: "Admin Created",
    email: "hatem@example.com",
    createdAt: "2026-03-24",
  },
  {
    id: "USR-006",
    fullName: "",
    role: "Customer Support",
    status: "Pending",
    accountSource: "Self Registration",
    email: "",
    createdAt: "",
  },
];

export const platformAssets = [
  {
    id: "AST-001",
    title: "Skyline Business Center",
    location: "Tunis, Tunisia",
    assetType: "Building",
    status: "FUNDING_OPEN",
    createdAt: "2026-03-28",
    views: 1240,
    reports: 0,
    submittedByRole: "Real Estate Developer",
    ownerName: "Skyline Development Group",
  },
  {
    id: "AST-002",
    title: "Green Family House",
    location: "Sousse, Tunisia",
    assetType: "House",
    status: "Pending",
    createdAt: "2026-03-27",
    views: 860,
    reports: 2,
    submittedByRole: "Real Estate Agent / Agency",
    ownerName: "Sousse Premium Agency",
  },
  {
    id: "AST-003",
    title: "Blue Coast Expansion Land",
    location: "Hammamet, Tunisia",
    assetType: "Bare Land",
    status: "Rejected",
    createdAt: "2026-03-26",
    views: 430,
    reports: 1,
    submittedByRole: "Real Estate Developer",
    ownerName: "Blue Coast Promotion",
  },
  {
    id: "AST-004",
    title: "Olive Valley Agricultural Plot",
    location: "Sfax, Tunisia",
    assetType: "Agricultural Land",
    status: "Not Submitted",
    createdAt: "2026-03-25",
    views: 210,
    reports: 0,
    submittedByRole: "Real Estate Agent / Agency",
    ownerName: "AgriLand Agency",
  },
  {
    id: "AST-005",
    title: "Palm Residence",
    location: "Djerba, Tunisia",
    assetType: "House",
    status: "PUBLISHED",
    createdAt: "2026-03-24",
    views: 1780,
    reports: 0,
    submittedByRole: "Real Estate Developer",
    ownerName: "Palm Horizon Developer",
  },
];

export const projectsData = [
  {
    id: "AST-001",
    title: "Skyline Business Center",
    location: "Tunis, Tunisia",
    assetType: "Building",
    description: "A modern building investment opportunity located in the city center.",
    targetAmount: 250000,
    raisedAmount: 120000,
    status: "FUNDING_OPEN",
    createdAt: "2026-03-28",
    submittedByRole: "Real Estate Developer",
    ownerName: "Skyline Development Group",
    ownerApprovalStatus: "Approved",
  },
  {
    id: "AST-002",
    title: "Green Valley Family House",
    location: "Sousse, Tunisia",
    assetType: "House",
    description: "",
    targetAmount: 180000,
    raisedAmount: 200000,
    status: "PUBLISHED",
    createdAt: "2026-03-27",
    submittedByRole: "Real Estate Agent / Agency",
    ownerName: "Sousse Premium Agency",
    ownerApprovalStatus: "Pending",
  },
  {
    id: "AST-003",
    title: "Blue Coast Agricultural Land",
    location: "",
    assetType: "Agricultural Land",
    description: "Agricultural land opportunity intended for long-term collaborative investment.",
    targetAmount: 0,
    raisedAmount: 15000,
    status: "DRAFT",
    createdAt: "",
    submittedByRole: "Real Estate Developer",
    ownerName: "",
    ownerApprovalStatus: "Approved",
  },
];

export const disputesData = [
  {
    id: "DSP-001",
    reason: "Fraudulent property submission without proper documentation.",
    status: "Open",
    createdAt: "2026-04-01",
    raisedByRole: "Normal User",
    againstRole: "Real Estate Developer",
    assetType: "Building",
  },
  {
    id: "DSP-002",
    reason: "Incorrect asset evaluation details.",
    status: "Under Review",
    createdAt: "2026-03-30",
    raisedByRole: "Real Estate Agent / Agency",
    againstRole: "Real Estate Developer",
    assetType: "House",
  }
];

export default function setupMockBackend(axiosInstance) {
  // Pass the axios instance to the mock adapter
  const mock = new MockAdapter(axiosInstance, { delayResponse: 800 });

  console.log("Mock Adapter initialized: intercepting responses!");

  // GET Requests
  mock.onGet("/users").reply(200, usersData);
  mock.onGet("/assets").reply(200, platformAssets);
  mock.onGet("/projects").reply(200, projectsData);
  mock.onGet("/disputes").reply(200, disputesData);

  // POST Login
  mock.onPost("/login").reply((config) => {
    const { email, password } = JSON.parse(config.data);
    if (email === "admin@admin.com") {
      return [200, { message: "Welcome Admin!", role: "Admin" }];
    }
    if (email === "promoter@test.com" || email === "agence@test.com") {
      return [200, { message: "Welcome Promoter!", role: "Real Estate Developer" }];
    }
    return [200, { message: "Login successful.", role: "Normal User" }];
  });

  // POST Register
  mock.onPost("/register").reply(() => {
    return [200, { message: "Account requested successfully." }];
  });

  // POST Project Deposit
  mock.onPost("/projects/deposit").reply((config) => {
    // We are trusting FormData in a real payload, but for mock:
    return [200, { message: "Project received and is pending validation." }];
  });

  // GET Single Project
  mock.onGet(/\/projects\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    const project = [...platformAssets, ...projectsData].find(p => p.id === id);
    if (!project) return [404, { message: "Project not found" }];
    
    // Enrich with detailed MVP data dynamically for the view
    return [200, {
      ...project,
      propertyType: project.assetType,
      constructionStage: "Foundation laying",
      globalBudget: (project.targetAmount || 500000) * 1.5,
    }];
  });

  // POST Investment
  mock.onPost("/investments").reply((config) => {
    return [200, { message: "Investment successfully registered!" }];
  });

  // GET My Investments (Investor Dashboard)
  mock.onGet("/investments").reply((config) => {
    return [200, [
      {
        id: "INV-001",
        projectId: "AST-001",
        title: "Skyline Business Center",
        amountInvested: 50000,
        equityShare: 2.5,
        projectStage: "Structural frame",
        investedAt: "2026-04-05"
      },
      {
        id: "INV-002",
        projectId: "AST-005",
        title: "Palm Residence",
        amountInvested: 15000,
        equityShare: 1.2,
        projectStage: "Foundation laying",
        investedAt: "2026-04-08"
      }
    ]];
  });

  // DELETE Asset (Platform Monitoring)
  mock.onDelete(/\/assets\/.+/).reply(200, { message: "Asset deleted successfully." });

  // Pass through any unhandled requests
  mock.onAny().passThrough();
}
