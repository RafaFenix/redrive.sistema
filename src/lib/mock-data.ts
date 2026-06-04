// Mock data for ReDrive MVP — visual phase, no backend yet.
// All monetary values in cents (EUR). Timestamps absolute.

export type UserRole = "admin" | "buyer";
export type UserStatus = "pending" | "approved" | "rejected" | "suspended";
export type VehicleStatus = "draft" | "active" | "sold" | "archived";
export type AuctionStatus = "scheduled" | "active" | "ended" | "cancelled";
export type BidStatus = "active" | "outbid" | "won" | "cancelled";
export type NegotiationStatus = "open" | "accepted" | "rejected" | "expired";

export interface Profile {
  id: string;
  role: UserRole;
  status: UserStatus;
  companyName: string;
  vatNumber: string;
  contactName: string;
  contactPhone: string;
  city: string;
  country: string;
  createdAt: string;
  approvedAt?: string;
}

export interface Vehicle {
  id: string;
  status: VehicleStatus;
  make: string;
  model: string;
  variant: string;
  year: number;
  mileage: number;
  color: string;
  fuelType: string;
  transmission: string;
  power: string;
  doors: number;
  condition: string;
  description: string;
  vin: string; // admin only
  originPlate: string; // admin only
  photos: string[];
  damageReportUrl: string;
  additionalServices: { name: string; price: number }[];
  legalizationCost: number;
}

export interface Auction {
  id: string;
  lotNumber: string;
  vehicleId: string;
  status: AuctionStatus;
  startingPrice: number;
  reservePrice: number; // admin only
  buyNowPrice: number | null;
  currentPrice: number;
  bidIncrements: number[];
  startsAt: string;
  endsAt: string;
  reserveMet: boolean;
  winnerId?: string;
  bidCount: number;
  viewerCount: number;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderHint: string; // anonymized for buyer view
  amount: number;
  status: BidStatus;
  isBuyNow: boolean;
  createdAt: string;
}

export interface Negotiation {
  id: string;
  auctionId: string;
  buyerId: string;
  status: NegotiationStatus;
  rounds: {
    round: number;
    initiatedBy: "admin" | "buyer";
    amount: number;
    message: string;
    createdAt: string;
  }[];
  maxRounds: number;
  expiresAt: string;
}

// ─────────────────────────────────────────────────────────
// PROFILES

export const profiles: Profile[] = [
  {
    id: "u-admin",
    role: "admin",
    status: "approved",
    companyName: "ReDrive Operações",
    vatNumber: "PT500000001",
    contactName: "Sofia Marques",
    contactPhone: "+351 912 000 001",
    city: "Lisboa",
    country: "PT",
    createdAt: "2025-01-10T09:00:00Z",
    approvedAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "u-buyer-1",
    role: "buyer",
    status: "approved",
    companyName: "Auto Marques Lda",
    vatNumber: "PT508123456",
    contactName: "João Marques",
    contactPhone: "+351 933 111 222",
    city: "Porto",
    country: "PT",
    createdAt: "2025-03-12T14:20:00Z",
    approvedAt: "2025-03-14T10:00:00Z",
  },
  {
    id: "u-buyer-2",
    role: "buyer",
    status: "approved",
    companyName: "Premium Cars PT",
    vatNumber: "PT509876543",
    contactName: "Rita Andrade",
    contactPhone: "+351 967 222 333",
    city: "Braga",
    country: "PT",
    createdAt: "2025-04-02T11:00:00Z",
    approvedAt: "2025-04-03T09:15:00Z",
  },
  {
    id: "u-buyer-3",
    role: "buyer",
    status: "pending",
    companyName: "Global Motors SA",
    vatNumber: "PT510555444",
    contactName: "Pedro Costa",
    contactPhone: "+351 919 333 444",
    city: "Faro",
    country: "PT",
    createdAt: "2026-05-28T16:40:00Z",
  },
  {
    id: "u-buyer-4",
    role: "buyer",
    status: "rejected",
    companyName: "AutoStar Comércio",
    vatNumber: "PT511222111",
    contactName: "Ana Lopes",
    contactPhone: "+351 925 444 555",
    city: "Coimbra",
    country: "PT",
    createdAt: "2026-05-20T10:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────
// VEHICLES

const PHOTOS = {
  bmwM4: [
    "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
  ],
  porsche911: [
    "https://images.unsplash.com/photo-1611821064430-0d40291922d2?w=1200&q=80",
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
  ],
  golf: [
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
  ],
  mercedes: [
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80",
  ],
  audi: [
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
    "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80",
  ],
  renault: [
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=80",
    "https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=800&q=80",
  ],
  peugeot: [
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
    "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6b?w=800&q=80",
  ],
};

export const vehicles: Vehicle[] = [
  {
    id: "v-001",
    status: "active",
    make: "BMW",
    model: "M4",
    variant: "Competition M xDrive",
    year: 2022,
    mileage: 12450,
    color: "Brooklyn Grey",
    fuelType: "Gasolina",
    transmission: "Automática 8-Vel",
    power: "510 cv",
    doors: 2,
    condition: "Excelente",
    description:
      "BMW M4 Competition M xDrive importado da Alemanha. Único proprietário, manutenção sempre em concessionário oficial. Pacote Carbono Exterior, jantes 826M forjadas, sistema áudio Harman Kardon.",
    vin: "WBS12A90D2J2X8782",
    originPlate: "M-XX 1234",
    photos: PHOTOS.bmwM4,
    damageReportUrl: "#",
    additionalServices: [
      { name: "Garantia 12 meses", price: 75000 },
      { name: "Transporte para concessão", price: 35000 },
    ],
    legalizationCost: 850000,
  },
  {
    id: "v-002",
    status: "active",
    make: "Porsche",
    model: "911",
    variant: "Carrera GTS",
    year: 2022,
    mileage: 14280,
    color: "Jet Black Metallic",
    fuelType: "Gasolina",
    transmission: "PDK 8-Vel",
    power: "480 cv",
    doors: 2,
    condition: "Excelente",
    description:
      "Porsche 911 Carrera GTS, pacote Sport Chrono, escape desportivo, bancos desportivos adaptáveis Plus.",
    vin: "WP0ZZZ99ZLS200118",
    originPlate: "S-PO 9921",
    photos: PHOTOS.porsche911,
    damageReportUrl: "#",
    additionalServices: [{ name: "Inspeção 150 pontos", price: 25000 }],
    legalizationCost: 1250000,
  },
  {
    id: "v-003",
    status: "active",
    make: "Volkswagen",
    model: "Golf",
    variant: "1.6 TDI Highline",
    year: 2021,
    mileage: 68500,
    color: "Branco Puro",
    fuelType: "Gasóleo",
    transmission: "Manual 6-Vel",
    power: "115 cv",
    doors: 5,
    condition: "Bom",
    description: "Volkswagen Golf TDI em excelente estado, ideal para frota empresarial.",
    vin: "WVWZZZAUZMW123456",
    originPlate: "HH-VW 4488",
    photos: PHOTOS.golf,
    damageReportUrl: "#",
    additionalServices: [
      { name: "Kit Airbags", price: 150000 },
      { name: "Garantia 6 meses", price: 35000 },
    ],
    legalizationCost: 320000,
  },
  {
    id: "v-004",
    status: "active",
    make: "Mercedes-Benz",
    model: "C220d",
    variant: "AMG Line",
    year: 2020,
    mileage: 89400,
    color: "Cinza Selenita",
    fuelType: "Gasóleo",
    transmission: "Automática 9G-Tronic",
    power: "194 cv",
    doors: 4,
    condition: "Bom",
    description: "Mercedes C220d AMG Line, faróis Multibeam LED, MBUX widescreen.",
    vin: "WDD2050211R789012",
    originPlate: "M-MB 7890",
    photos: PHOTOS.mercedes,
    damageReportUrl: "#",
    additionalServices: [{ name: "Garantia 12 meses", price: 60000 }],
    legalizationCost: 420000,
  },
  {
    id: "v-005",
    status: "active",
    make: "Audi",
    model: "A4 Avant",
    variant: "2.0 TDI S-Line",
    year: 2021,
    mileage: 54200,
    color: "Azul Navarra",
    fuelType: "Gasóleo",
    transmission: "S-Tronic 7-Vel",
    power: "190 cv",
    doors: 5,
    condition: "Excelente",
    description: "Audi A4 Avant S-Line, Virtual Cockpit, Matrix LED, bancos pele Nappa.",
    vin: "WAUZZZF45MA011223",
    originPlate: "IN-AU 5566",
    photos: PHOTOS.audi,
    damageReportUrl: "#",
    additionalServices: [],
    legalizationCost: 480000,
  },
  {
    id: "v-006",
    status: "active",
    make: "Renault",
    model: "Clio",
    variant: "1.5 dCi Intens",
    year: 2022,
    mileage: 34800,
    color: "Vermelho Fogo",
    fuelType: "Gasóleo",
    transmission: "Manual 5-Vel",
    power: "85 cv",
    doors: 5,
    condition: "Bom",
    description: "Renault Clio dCi económico, ideal para frota urbana.",
    vin: "VF1RJA00867891234",
    originPlate: "FR-92 RX 88",
    photos: PHOTOS.renault,
    damageReportUrl: "#",
    additionalServices: [],
    legalizationCost: 180000,
  },
  {
    id: "v-007",
    status: "active",
    make: "Peugeot",
    model: "3008",
    variant: "1.5 BlueHDi GT-Line",
    year: 2021,
    mileage: 72100,
    color: "Cinza Platinum",
    fuelType: "Gasóleo",
    transmission: "EAT8 Automática",
    power: "130 cv",
    doors: 5,
    condition: "Bom",
    description: "Peugeot 3008 GT-Line com i-Cockpit 3D, FOCAL áudio.",
    vin: "VF3MJEHZRMS445566",
    originPlate: "75-AB-789",
    photos: PHOTOS.peugeot,
    damageReportUrl: "#",
    additionalServices: [{ name: "Transporte", price: 25000 }],
    legalizationCost: 380000,
  },
  {
    id: "v-008",
    status: "active",
    make: "BMW",
    model: "320d",
    variant: "Touring xDrive",
    year: 2020,
    mileage: 95300,
    color: "Preto Safira",
    fuelType: "Gasóleo",
    transmission: "Automática 8-Vel",
    power: "190 cv",
    doors: 5,
    condition: "Razoável",
    description:
      "BMW 320d Touring com pequenos danos cosméticos no para-choques traseiro (ver relatório).",
    vin: "WBA5K71050B112233",
    originPlate: "M-BM 3210",
    photos: PHOTOS.bmwM4,
    damageReportUrl: "#",
    additionalServices: [
      { name: "Reparação para-choques", price: 65000 },
      { name: "Garantia 6 meses", price: 40000 },
    ],
    legalizationCost: 390000,
  },
];

// ─────────────────────────────────────────────────────────
// AUCTIONS — use times relative to "now" so the visual feels alive.

const now = Date.now();
const min = 60 * 1000;
const hour = 60 * min;
const day = 24 * hour;

export const auctions: Auction[] = [
  {
    id: "a-001",
    lotNumber: "#88241",
    vehicleId: "v-001",
    status: "active",
    startingPrice: 5500000,
    reservePrice: 6800000,
    buyNowPrice: 8150000,
    currentPrice: 7240000,
    bidIncrements: [10000, 20000, 50000],
    startsAt: new Date(now - 2 * day).toISOString(),
    endsAt: new Date(now + 2 * hour + 14 * min).toISOString(),
    reserveMet: true,
    bidCount: 23,
    viewerCount: 47,
  },
  {
    id: "a-002",
    lotNumber: "#88242",
    vehicleId: "v-002",
    status: "active",
    startingPrice: 9000000,
    reservePrice: 12500000,
    buyNowPrice: 14500000,
    currentPrice: 12450000,
    bidIncrements: [20000, 50000, 100000],
    startsAt: new Date(now - 3 * day).toISOString(),
    endsAt: new Date(now + 14 * min).toISOString(),
    reserveMet: false,
    bidCount: 18,
    viewerCount: 62,
  },
  {
    id: "a-003",
    lotNumber: "#88243",
    vehicleId: "v-003",
    status: "active",
    startingPrice: 800000,
    reservePrice: 1100000,
    buyNowPrice: 1450000,
    currentPrice: 1050000,
    bidIncrements: [5000, 10000, 20000],
    startsAt: new Date(now - 1 * day).toISOString(),
    endsAt: new Date(now + 1 * day + 4 * hour).toISOString(),
    reserveMet: false,
    bidCount: 8,
    viewerCount: 21,
  },
  {
    id: "a-004",
    lotNumber: "#88244",
    vehicleId: "v-004",
    status: "active",
    startingPrice: 2200000,
    reservePrice: 2900000,
    buyNowPrice: null,
    currentPrice: 2750000,
    bidIncrements: [10000, 20000, 50000],
    startsAt: new Date(now - 5 * hour).toISOString(),
    endsAt: new Date(now + 18 * hour).toISOString(),
    reserveMet: false,
    bidCount: 12,
    viewerCount: 33,
  },
  {
    id: "a-005",
    lotNumber: "#88245",
    vehicleId: "v-005",
    status: "active",
    startingPrice: 2800000,
    reservePrice: 3300000,
    buyNowPrice: 3950000,
    currentPrice: 3380000,
    bidIncrements: [10000, 20000, 50000],
    startsAt: new Date(now - 2 * day).toISOString(),
    endsAt: new Date(now + 6 * hour).toISOString(),
    reserveMet: true,
    bidCount: 15,
    viewerCount: 28,
  },
  {
    id: "a-006",
    lotNumber: "#88246",
    vehicleId: "v-006",
    status: "scheduled",
    startingPrice: 600000,
    reservePrice: 850000,
    buyNowPrice: 1100000,
    currentPrice: 600000,
    bidIncrements: [5000, 10000, 20000],
    startsAt: new Date(now + 4 * hour).toISOString(),
    endsAt: new Date(now + 3 * day).toISOString(),
    reserveMet: false,
    bidCount: 0,
    viewerCount: 12,
  },
  {
    id: "a-007",
    lotNumber: "#88240",
    vehicleId: "v-007",
    status: "ended",
    startingPrice: 1500000,
    reservePrice: 1900000,
    buyNowPrice: 2400000,
    currentPrice: 2100000,
    bidIncrements: [10000, 20000, 50000],
    startsAt: new Date(now - 5 * day).toISOString(),
    endsAt: new Date(now - 1 * day).toISOString(),
    reserveMet: true,
    winnerId: "u-buyer-1",
    bidCount: 19,
    viewerCount: 41,
  },
  {
    id: "a-008",
    lotNumber: "#88239",
    vehicleId: "v-008",
    status: "ended",
    startingPrice: 1200000,
    reservePrice: 1800000,
    buyNowPrice: null,
    currentPrice: 1620000,
    bidIncrements: [10000, 20000, 50000],
    startsAt: new Date(now - 7 * day).toISOString(),
    endsAt: new Date(now - 2 * day).toISOString(),
    reserveMet: false,
    bidCount: 11,
    viewerCount: 24,
  },
];

// ─────────────────────────────────────────────────────────
// BIDS

const HINTS = ["PORS***", "VWAG***", "RENA***", "ALFA***", "MERC***", "AUDI***"];

function genBids(
  auctionId: string,
  currentPrice: number,
  count: number,
  startingPrice: number,
): Bid[] {
  if (count === 0) return [];
  const step = Math.max(10000, Math.floor((currentPrice - startingPrice) / Math.max(count, 1)));
  return Array.from({ length: count }).map((_, i) => {
    const amount = currentPrice - i * step;
    return {
      id: `b-${auctionId}-${i}`,
      auctionId,
      bidderId: i === 0 ? "u-buyer-1" : `u-buyer-${(i % 3) + 1}`,
      bidderHint: HINTS[i % HINTS.length],
      amount: Math.max(amount, startingPrice),
      status: i === 0 ? "active" : "outbid",
      isBuyNow: false,
      createdAt: new Date(now - i * 8 * min - 20 * 1000).toISOString(),
    };
  });
}

export const bids: Bid[] = auctions.flatMap((a) =>
  genBids(a.id, a.currentPrice, Math.min(a.bidCount, 8), a.startingPrice),
);

// ─────────────────────────────────────────────────────────
// NEGOTIATIONS

export const negotiations: Negotiation[] = [
  {
    id: "n-001",
    auctionId: "a-008",
    buyerId: "u-buyer-2",
    status: "open",
    maxRounds: 5,
    expiresAt: new Date(now + 36 * hour).toISOString(),
    rounds: [
      {
        round: 1,
        initiatedBy: "admin",
        amount: 1750000,
        message: "O lance mais alto ficou abaixo do preço de reserva. Proponho 17.500€.",
        createdAt: new Date(now - 1 * day).toISOString(),
      },
      {
        round: 2,
        initiatedBy: "buyer",
        amount: 1680000,
        message: "Considerando o estado, 16.800€ é o meu limite.",
        createdAt: new Date(now - 18 * hour).toISOString(),
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// HELPERS

export function formatEUR(cents: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-PT").format(value);
}

export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getAuction(id: string): Auction | undefined {
  return auctions.find((a) => a.id === id);
}

export function getBidsForAuction(auctionId: string): Bid[] {
  return bids.filter((b) => b.auctionId === auctionId).sort((a, b) => b.amount - a.amount);
}

export function getProfile(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id);
}
