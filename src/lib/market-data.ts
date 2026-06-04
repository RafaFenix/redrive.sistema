import { getSupabaseClient } from "@/lib/supabase/client";
import type { AppRole, UserStatus } from "@/lib/auth-client";

export type VehicleStatus = "draft" | "active" | "sold" | "archived";
export type AuctionStatus = "scheduled" | "active" | "ended" | "cancelled";
export type AuctionMode = "standard" | "blind";
export type BidStatus = "active" | "outbid" | "won" | "cancelled";
export type NegotiationStatus = "open" | "accepted" | "rejected" | "expired";
export type NegotiationActor = "admin" | "buyer";
export type OrderStatus = "pending_payment" | "paid" | "cancelled" | "completed";
export type DeliveryStatus =
  | "pending"
  | "awaiting_payment"
  | "documentation"
  | "in_transit"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled";
export type NotificationType =
  | "account_approved"
  | "account_rejected"
  | "bid_placed"
  | "bid_outbid"
  | "auction_won"
  | "auction_lost"
  | "auction_ending"
  | "watchlist_starting"
  | "negotiation_started"
  | "negotiation_received"
  | "negotiation_accepted"
  | "negotiation_rejected"
  | "order_created";

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
  powerCv?: number | null;
  power: string;
  doors: number;
  condition: string;
  description: string;
  vin?: string | null;
  originPlate?: string | null;
  photos: string[];
  damageReportUrl: string;
  additionalServices: { name: string; price: number }[];
  legalizationCost: number;
  marketPriceRef?: number | null;
  leadTimeDays?: number | null;
  hasDamageReport: boolean;
  hasAppraisal: boolean;
  hasServiceHistory: boolean;
  hasCoc: boolean;
  damageReportPath?: string | null;
  appraisalPath?: string | null;
  serviceHistoryPath?: string | null;
  cocPath?: string | null;
}

export interface Auction {
  id: string;
  lotNumber: string;
  vehicleId: string;
  status: AuctionStatus;
  mode?: AuctionMode;
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice: number | null;
  currentPrice: number;
  bidIncrements: number[];
  startsAt: string;
  endsAt: string;
  reserveMet: boolean;
  bidCount: number;
  viewerCount: number;
  vehicle?: Vehicle;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderHint: string;
  amount: number;
  status: BidStatus;
  isBuyNow: boolean;
  createdAt: string;
}

export type BuyerBid = Bid & {
  auction?: Auction;
};

export interface NegotiationRound {
  id: string;
  negotiationId: string;
  round: number;
  initiatedBy: NegotiationActor;
  amount: number;
  message: string;
  createdAt: string;
}

export interface Negotiation {
  id: string;
  auctionId: string;
  buyerId: string;
  status: NegotiationStatus;
  maxRounds: number;
  expiresAt: string;
  acceptedAmount: number | null;
  createdAt: string;
  updatedAt: string;
  rounds: NegotiationRound[];
  auction?: Auction;
  buyer?: {
    id: string;
    companyName: string;
    contactName: string;
  };
}

export interface BuyerOrder {
  id: string;
  auctionId: string;
  buyerId: string;
  vehicleId: string;
  winningBidId: string | null;
  amount: number;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  depositAmount: number;
  deliveryNotes: string;
  createdAt: string;
  updatedAt: string;
  auction?: Auction;
  vehicle?: Vehicle;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export type VehicleDocumentUploadKind = "damage" | "appraisal" | "service" | "coc";

export interface BuyerWatchlistItem {
  id: string;
  auctionId: string;
  createdAt: string;
  auction?: Auction;
}

export interface AuctionWatcher {
  id: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
}

export interface AdminUserDetail {
  id: string;
  status: UserStatus;
  companyName: string;
  vatNumber: string;
  contactName: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  tradeRegistryPath: string | null;
  rejectedReason: string;
  suspendedReason: string;
  approvedAt: string | null;
  createdAt: string;
  roles: AppRole[];
  bids: BuyerBid[];
  orders: BuyerOrder[];
}

type VehicleRow = {
  id: string;
  status: VehicleStatus;
  make: string;
  model: string;
  variant: string | null;
  year: number;
  mileage: number;
  color: string | null;
  fuel_type: string | null;
  transmission: string | null;
  power_cv: number | null;
  doors: number | null;
  condition: string | null;
  description: string | null;
  vin?: string | null;
  origin_plate?: string | null;
  photos: string[] | null;
  damage_report_path?: string | null;
  appraisal_path?: string | null;
  service_history_path?: string | null;
  coc_path?: string | null;
  has_damage_report?: boolean | null;
  has_appraisal?: boolean | null;
  has_service_history?: boolean | null;
  has_coc?: boolean | null;
  additional_services: { name: string; price: number }[] | null;
  legalization_cost: number;
  market_price_ref?: number | null;
  lead_time_days?: number | null;
};

type AuctionRow = {
  id: string;
  lot_number: string;
  vehicle_id: string;
  status: AuctionStatus;
  mode: AuctionMode;
  starting_price: number;
  reserve_price?: number;
  buy_now_price: number | null;
  current_price: number;
  bid_increments: number[] | null;
  starts_at: string;
  ends_at: string;
  reserve_met?: boolean | null;
  bid_count: number;
  viewer_count: number;
};

type BidRow = {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  status: BidStatus;
  is_buy_now: boolean;
  created_at: string;
};

type NegotiationRow = {
  id: string;
  auction_id: string;
  buyer_id: string;
  status: NegotiationStatus;
  max_rounds: number;
  expires_at: string;
  accepted_amount: number | null;
  created_at: string;
  updated_at: string;
};

type NegotiationRoundRow = {
  id: string;
  negotiation_id: string;
  round_number: number;
  initiated_by: NegotiationActor;
  amount: number;
  message: string | null;
  created_at: string;
};

type NotificationRow = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

type WatchlistRow = {
  id: string;
  user_id: string;
  auction_id: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  status: UserStatus;
  company_name: string | null;
  vat_number: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  trade_registry_path: string | null;
  rejected_reason: string | null;
  suspended_reason: string | null;
  approved_at: string | null;
  created_at: string;
};

type OrderRow = {
  id: string;
  auction_id: string;
  buyer_id: string;
  vehicle_id: string;
  winning_bid_id: string | null;
  amount: number;
  status: OrderStatus;
  delivery_status: DeliveryStatus;
  deposit_amount: number;
  delivery_notes: string | null;
  created_at: string;
  updated_at: string;
};

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

export function euroToCents(value: FormDataEntryValue | null): number | null {
  const normalized = String(value ?? "")
    .trim()
    .replace(",", ".");

  if (!normalized) return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return null;

  return Math.round(amount * 100);
}

export function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    status: row.status,
    make: row.make,
    model: row.model,
    variant: row.variant ?? "",
    year: row.year,
    mileage: row.mileage,
    color: row.color ?? "—",
    fuelType: row.fuel_type ?? "—",
    transmission: row.transmission ?? "—",
    powerCv: row.power_cv,
    power: row.power_cv ? `${row.power_cv} cv` : "—",
    doors: row.doors ?? 0,
    condition: row.condition ?? "—",
    description: row.description ?? "",
    vin: row.vin,
    originPlate: row.origin_plate,
    photos: row.photos?.length ? row.photos : ["/placeholder.svg"],
    damageReportUrl: row.damage_report_path ?? "#",
    additionalServices: row.additional_services ?? [],
    legalizationCost: row.legalization_cost,
    marketPriceRef: row.market_price_ref,
    leadTimeDays: row.lead_time_days,
    hasDamageReport: row.has_damage_report ?? Boolean(row.damage_report_path),
    hasAppraisal: row.has_appraisal ?? Boolean(row.appraisal_path),
    hasServiceHistory: row.has_service_history ?? Boolean(row.service_history_path),
    hasCoc: row.has_coc ?? Boolean(row.coc_path),
    damageReportPath: row.damage_report_path,
    appraisalPath: row.appraisal_path,
    serviceHistoryPath: row.service_history_path,
    cocPath: row.coc_path,
  };
}

export function mapAuction(row: AuctionRow): Auction {
  return {
    id: row.id,
    lotNumber: row.lot_number,
    vehicleId: row.vehicle_id,
    status: row.status,
    mode: row.mode,
    startingPrice: row.starting_price,
    reservePrice: row.reserve_price,
    buyNowPrice: row.buy_now_price,
    currentPrice: row.current_price,
    bidIncrements: row.bid_increments?.length ? row.bid_increments : [10000, 20000, 50000],
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    reserveMet:
      row.reserve_met ?? Boolean(row.reserve_price && row.current_price >= row.reserve_price),
    bidCount: row.bid_count,
    viewerCount: row.viewer_count,
  };
}

export function mapBid(row: BidRow, index: number, bidderHint?: string): Bid {
  return {
    id: row.id,
    auctionId: row.auction_id,
    bidderId: row.bidder_id,
    bidderHint: bidderHint ?? `Comprador ${String(index + 1).padStart(2, "0")}`,
    amount: row.amount,
    status: row.status,
    isBuyNow: row.is_buy_now,
    createdAt: row.created_at,
  };
}

export function mapNegotiationRound(row: NegotiationRoundRow): NegotiationRound {
  return {
    id: row.id,
    negotiationId: row.negotiation_id,
    round: row.round_number,
    initiatedBy: row.initiated_by,
    amount: row.amount,
    message: row.message ?? "",
    createdAt: row.created_at,
  };
}

export function mapNegotiation(row: NegotiationRow): Omit<Negotiation, "rounds"> {
  return {
    id: row.id,
    auctionId: row.auction_id,
    buyerId: row.buyer_id,
    status: row.status,
    maxRounds: row.max_rounds,
    expiresAt: row.expires_at,
    acceptedAmount: row.accepted_amount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body ?? "",
    data: row.data ?? {},
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

function mapProfile(row: ProfileRow, roles: AppRole[] = []): AdminUserDetail {
  return {
    id: row.id,
    status: row.status,
    companyName: row.company_name ?? "",
    vatNumber: row.vat_number ?? "",
    contactName: row.contact_name ?? "",
    contactPhone: row.contact_phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    country: row.country ?? "PT",
    tradeRegistryPath: row.trade_registry_path,
    rejectedReason: row.rejected_reason ?? "",
    suspendedReason: row.suspended_reason ?? "",
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    roles,
    bids: [],
    orders: [],
  };
}

export function mapOrder(row: OrderRow): BuyerOrder {
  return {
    id: row.id,
    auctionId: row.auction_id,
    buyerId: row.buyer_id,
    vehicleId: row.vehicle_id,
    winningBidId: row.winning_bid_id,
    amount: row.amount,
    status: row.status,
    deliveryStatus: row.delivery_status,
    depositAmount: row.deposit_amount,
    deliveryNotes: row.delivery_notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function readStringData(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return typeof value === "string" && value.trim() ? value : null;
}

export function resolveNotificationHref(notification: AppNotification) {
  const orderId = readStringData(notification.data, "order_id");
  if (orderId) return `/buyer/won/${orderId}`;

  const negotiationId = readStringData(notification.data, "negotiation_id");
  if (negotiationId) return "/buyer/negotiations";

  const auctionId = readStringData(notification.data, "auction_id");
  if (auctionId) return `/auctions/${auctionId}`;

  return null;
}

export async function listAdminVehicles() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(
      "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,vin,origin_plate,photos,damage_report_path,appraisal_path,service_history_path,coc_path,additional_services,legalization_cost,market_price_ref,lead_time_days",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as VehicleRow[]).map(mapVehicle);
}

export async function getAdminVehicle(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(
      "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,vin,origin_plate,photos,damage_report_path,appraisal_path,service_history_path,coc_path,additional_services,legalization_cost,market_price_ref,lead_time_days",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapVehicle(data as VehicleRow) : null;
}

export async function listAdminVehicleAuctionLinks() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("auctions")
    .select("id,lot_number,vehicle_id,status")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return new Map(
    (data ?? []).map((auction) => [
      auction.vehicle_id as string,
      {
        id: auction.id as string,
        lotNumber: auction.lot_number as string,
        status: auction.status as AuctionStatus,
      },
    ]),
  );
}

export async function getAdminVehicleAuctionLink(vehicleId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("auctions")
    .select("id,lot_number,vehicle_id,status")
    .eq("vehicle_id", vehicleId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id as string,
    lotNumber: data.lot_number as string,
    status: data.status as AuctionStatus,
  };
}

export async function listAdminAuctions() {
  const supabase = getSupabaseClient();
  const [{ data: auctionRows, error: auctionsError }, { data: vehicleRows, error: vehiclesError }] =
    await Promise.all([
      supabase
        .from("auctions")
        .select(
          "id,lot_number,vehicle_id,status,mode,starting_price,reserve_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("vehicles")
        .select(
          "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,vin,origin_plate,photos,damage_report_path,appraisal_path,service_history_path,coc_path,additional_services,legalization_cost,market_price_ref,lead_time_days",
        ),
    ]);

  if (auctionsError) throw auctionsError;
  if (vehiclesError) throw vehiclesError;

  const vehiclesById = new Map(
    ((vehicleRows ?? []) as VehicleRow[]).map((row) => [row.id, mapVehicle(row)]),
  );
  return ((auctionRows ?? []) as AuctionRow[]).map((row) => ({
    ...mapAuction(row),
    vehicle: vehiclesById.get(row.vehicle_id),
  }));
}

export async function getAdminAuction(id: string) {
  const supabase = getSupabaseClient();
  const { data: auctionRow, error: auctionError } = await supabase
    .from("auctions")
    .select(
      "id,lot_number,vehicle_id,status,mode,starting_price,reserve_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count",
    )
    .eq("id", id)
    .maybeSingle();

  if (auctionError) throw auctionError;
  if (!auctionRow) return null;

  const auction = mapAuction(auctionRow as AuctionRow);
  const [{ data: vehicleRow, error: vehicleError }, { data: bidRows, error: bidsError }] =
    await Promise.all([
      supabase
        .from("vehicles")
        .select(
          "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,vin,origin_plate,photos,damage_report_path,appraisal_path,service_history_path,coc_path,additional_services,legalization_cost,market_price_ref,lead_time_days",
        )
        .eq("id", auction.vehicleId)
        .maybeSingle(),
      supabase
        .from("bids")
        .select("id,auction_id,bidder_id,amount,status,is_buy_now,created_at")
        .eq("auction_id", id)
        .order("amount", { ascending: false }),
    ]);

  if (vehicleError) throw vehicleError;
  if (bidsError) throw bidsError;
  if (!vehicleRow) return null;

  const bidderIds = [...new Set((bidRows ?? []).map((row) => row.bidder_id as string))];
  const { data: profiles, error: profilesError } = bidderIds.length
    ? await supabase.from("profiles").select("id,company_name").in("id", bidderIds)
    : { data: [], error: null };

  if (profilesError) throw profilesError;

  const companiesById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id as string,
      (profile.company_name as string) || "Comprador",
    ]),
  );

  return {
    auction,
    vehicle: mapVehicle(vehicleRow as VehicleRow),
    bids: ((bidRows ?? []) as BidRow[]).map((row, index) =>
      mapBid(row, index, companiesById.get(row.bidder_id)),
    ),
  };
}

export async function cancelAuction(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("auctions")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function listPublicAuctions() {
  const supabase = getSupabaseClient();
  const [{ data: auctionRows, error: auctionsError }, { data: vehicleRows, error: vehiclesError }] =
    await Promise.all([
      supabase
        .from("public_auctions")
        .select(
          "id,lot_number,vehicle_id,status,mode,starting_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count,reserve_met",
        )
        .order("ends_at", { ascending: true }),
      supabase
        .from("public_vehicles")
        .select(
          "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,photos,additional_services,legalization_cost,market_price_ref,lead_time_days,has_damage_report,has_appraisal,has_service_history,has_coc",
        ),
    ]);

  if (auctionsError) throw auctionsError;
  if (vehiclesError) throw vehiclesError;

  const vehiclesById = new Map(
    ((vehicleRows ?? []) as VehicleRow[]).map((row) => [row.id, mapVehicle(row)]),
  );
  return ((auctionRows ?? []) as AuctionRow[])
    .map((row) => ({ ...mapAuction(row), vehicle: vehiclesById.get(row.vehicle_id) }))
    .filter((auction) => auction.vehicle);
}

export async function getPublicAuction(id: string) {
  const supabase = getSupabaseClient();
  const { data: auctionRow, error: auctionError } = await supabase
    .from("public_auctions")
    .select(
      "id,lot_number,vehicle_id,status,mode,starting_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count,reserve_met",
    )
    .eq("id", id)
    .maybeSingle();

  if (auctionError) throw auctionError;
  if (!auctionRow) return null;

  const auction = mapAuction(auctionRow as AuctionRow);
  const [{ data: vehicleRow, error: vehicleError }, { data: bidRows, error: bidsError }] =
    await Promise.all([
      supabase
        .from("public_vehicles")
        .select(
          "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,photos,additional_services,legalization_cost,market_price_ref,lead_time_days,has_damage_report,has_appraisal,has_service_history,has_coc",
        )
        .eq("id", auction.vehicleId)
        .maybeSingle(),
      supabase
        .from("bids")
        .select("id,auction_id,bidder_id,amount,status,is_buy_now,created_at")
        .eq("auction_id", id)
        .order("amount", { ascending: false }),
    ]);

  if (vehicleError) throw vehicleError;
  if (!vehicleRow) return null;

  return {
    auction,
    vehicle: mapVehicle(vehicleRow as VehicleRow),
    bids: bidsError ? [] : ((bidRows ?? []) as BidRow[]).map((row, index) => mapBid(row, index)),
  };
}

export async function placeAuctionBid({
  auctionId,
  amount,
  isBuyNow = false,
}: {
  auctionId: string;
  amount: number;
  isBuyNow?: boolean;
}) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("place_bid", {
    target_auction_id: auctionId,
    bid_amount: amount,
    is_buy_now: isBuyNow,
  });

  if (error) throw error;
  return data as string;
}

export async function listBuyerBids(): Promise<BuyerBid[]> {
  const supabase = getSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data: bidRows, error: bidsError } = await supabase
    .from("bids")
    .select("id,auction_id,bidder_id,amount,status,is_buy_now,created_at")
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false });

  if (bidsError) throw bidsError;
  if (!bidRows?.length) return [];

  const auctionIds = [...new Set(bidRows.map((row) => row.auction_id as string))];
  const [{ data: auctionRows, error: auctionsError }, { data: vehicleRows, error: vehiclesError }] =
    await Promise.all([
      supabase
        .from("public_auctions")
        .select(
          "id,lot_number,vehicle_id,status,mode,starting_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count,reserve_met",
        )
        .in("id", auctionIds),
      supabase
        .from("public_vehicles")
        .select(
          "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,photos,additional_services,legalization_cost,market_price_ref,lead_time_days,has_damage_report,has_appraisal,has_service_history,has_coc",
        ),
    ]);

  if (auctionsError) throw auctionsError;
  if (vehiclesError) throw vehiclesError;

  const vehiclesById = new Map(
    ((vehicleRows ?? []) as VehicleRow[]).map((row) => [row.id, mapVehicle(row)]),
  );
  const auctionsById = new Map(
    ((auctionRows ?? []) as AuctionRow[]).map((row) => [
      row.id,
      { ...mapAuction(row), vehicle: vehiclesById.get(row.vehicle_id) },
    ]),
  );

  return (bidRows as BidRow[]).map((row, index) => ({
    ...mapBid(row, index),
    auction: auctionsById.get(row.auction_id),
  }));
}

export async function listBuyerWonAuctions() {
  const bids = await listBuyerBids();
  return bids
    .filter((bid) => bid.status === "won" && bid.auction)
    .map((bid) => ({ bid, auction: bid.auction! }));
}

async function hydrateBuyerOrders(orderRows: OrderRow[]): Promise<BuyerOrder[]> {
  if (!orderRows.length) return [];

  const supabase = getSupabaseClient();
  const auctionIds = [...new Set(orderRows.map((order) => order.auction_id))];
  const vehicleIds = [...new Set(orderRows.map((order) => order.vehicle_id))];

  const [{ data: auctionRows, error: auctionsError }, { data: vehicleRows, error: vehiclesError }] =
    await Promise.all([
      supabase
        .from("public_auctions")
        .select(
          "id,lot_number,vehicle_id,status,mode,starting_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count,reserve_met",
        )
        .in("id", auctionIds),
      supabase
        .from("public_vehicles")
        .select(
          "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,photos,additional_services,legalization_cost,market_price_ref,lead_time_days,has_damage_report,has_appraisal,has_service_history,has_coc",
        )
        .in("id", vehicleIds),
    ]);

  if (auctionsError) throw auctionsError;
  if (vehiclesError) throw vehiclesError;

  const vehiclesById = new Map(
    ((vehicleRows ?? []) as VehicleRow[]).map((row) => [row.id, mapVehicle(row)]),
  );
  const auctionsById = new Map(
    ((auctionRows ?? []) as AuctionRow[]).map((row) => [
      row.id,
      { ...mapAuction(row), vehicle: vehiclesById.get(row.vehicle_id) },
    ]),
  );

  return orderRows.map((row) => ({
    ...mapOrder(row),
    auction: auctionsById.get(row.auction_id),
    vehicle: vehiclesById.get(row.vehicle_id),
  }));
}

export async function listBuyerOrders(): Promise<BuyerOrder[]> {
  const supabase = getSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,auction_id,buyer_id,vehicle_id,winning_bid_id,amount,status,delivery_status,deposit_amount,delivery_notes,created_at,updated_at",
    )
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return hydrateBuyerOrders((data ?? []) as OrderRow[]);
}

export async function getBuyerOrder(orderId: string): Promise<BuyerOrder | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,auction_id,buyer_id,vehicle_id,winning_bid_id,amount,status,delivery_status,deposit_amount,delivery_notes,created_at,updated_at",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [order] = await hydrateBuyerOrders([data as OrderRow]);
  return order ?? null;
}

async function listNegotiations({ admin }: { admin: boolean }): Promise<Negotiation[]> {
  const supabase = getSupabaseClient();
  const query = supabase
    .from("negotiations")
    .select(
      "id,auction_id,buyer_id,status,max_rounds,expires_at,accepted_amount,created_at,updated_at",
    )
    .order("updated_at", { ascending: false });

  if (!admin) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) return [];

    query.eq("buyer_id", user.id);
  }

  const { data: negotiationRows, error: negotiationsError } = await query;
  if (negotiationsError) throw negotiationsError;
  if (!negotiationRows?.length) return [];

  const negotiations = (negotiationRows ?? []) as NegotiationRow[];
  const negotiationIds = negotiations.map((negotiation) => negotiation.id);
  const auctionIds = [...new Set(negotiations.map((negotiation) => negotiation.auction_id))];
  const buyerIds = [...new Set(negotiations.map((negotiation) => negotiation.buyer_id))];

  const [
    { data: roundRows, error: roundsError },
    { data: auctionRows, error: auctionsError },
    { data: vehicleRows, error: vehiclesError },
    { data: profileRows, error: profilesError },
  ] = await Promise.all([
    supabase
      .from("negotiation_rounds")
      .select("id,negotiation_id,round_number,initiated_by,amount,message,created_at")
      .in("negotiation_id", negotiationIds)
      .order("round_number", { ascending: true }),
    admin
      ? supabase
          .from("auctions")
          .select(
            "id,lot_number,vehicle_id,status,mode,starting_price,reserve_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count",
          )
          .in("id", auctionIds)
      : supabase
          .from("public_auctions")
          .select(
            "id,lot_number,vehicle_id,status,mode,starting_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count,reserve_met",
          )
          .in("id", auctionIds),
    admin
      ? supabase
          .from("vehicles")
          .select(
            "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,vin,origin_plate,photos,damage_report_path,appraisal_path,service_history_path,coc_path,additional_services,legalization_cost,market_price_ref,lead_time_days",
          )
      : supabase
          .from("public_vehicles")
          .select(
            "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,photos,additional_services,legalization_cost,market_price_ref,lead_time_days,has_damage_report,has_appraisal,has_service_history,has_coc",
          ),
    admin
      ? supabase.from("profiles").select("id,company_name,contact_name").in("id", buyerIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (roundsError) throw roundsError;
  if (auctionsError) throw auctionsError;
  if (vehiclesError) throw vehiclesError;
  if (profilesError) throw profilesError;

  const roundsByNegotiation = ((roundRows ?? []) as NegotiationRoundRow[]).reduce<
    Record<string, NegotiationRound[]>
  >((acc, row) => {
    acc[row.negotiation_id] = [...(acc[row.negotiation_id] ?? []), mapNegotiationRound(row)];
    return acc;
  }, {});

  const vehiclesById = new Map(
    ((vehicleRows ?? []) as VehicleRow[]).map((row) => [row.id, mapVehicle(row)]),
  );
  const auctionsById = new Map(
    ((auctionRows ?? []) as AuctionRow[]).map((row) => [
      row.id,
      { ...mapAuction(row), vehicle: vehiclesById.get(row.vehicle_id) },
    ]),
  );
  const buyersById = new Map(
    (profileRows ?? []).map((profile) => [
      profile.id as string,
      {
        id: profile.id as string,
        companyName: (profile.company_name as string) || "Comprador",
        contactName: (profile.contact_name as string) || "",
      },
    ]),
  );

  return negotiations.map((row) => ({
    ...mapNegotiation(row),
    rounds: roundsByNegotiation[row.id] ?? [],
    auction: auctionsById.get(row.auction_id),
    buyer: buyersById.get(row.buyer_id),
  }));
}

export function listBuyerNegotiations() {
  return listNegotiations({ admin: false });
}

export function listAdminNegotiations() {
  return listNegotiations({ admin: true });
}

export async function openAuctionNegotiation({
  auctionId,
  buyerId,
  amount,
  message,
}: {
  auctionId: string;
  buyerId: string;
  amount: number;
  message?: string;
}) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("open_negotiation", {
    target_auction_id: auctionId,
    target_buyer_id: buyerId,
    offer_amount: amount,
    offer_message: message ?? null,
  });

  if (error) throw error;
  return data as string;
}

export async function submitNegotiationRound({
  negotiationId,
  amount,
  message,
}: {
  negotiationId: string;
  amount: number;
  message?: string;
}) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("submit_negotiation_round", {
    target_negotiation_id: negotiationId,
    offer_amount: amount,
    offer_message: message ?? null,
  });

  if (error) throw error;
  return data as string;
}

export async function acceptNegotiationOffer(negotiationId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("accept_negotiation_offer", {
    target_negotiation_id: negotiationId,
  });

  if (error) throw error;
  return data as string;
}

export async function listNotifications(limit = 20) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id,type,title,body,data,read_at,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return ((data ?? []) as NotificationRow[]).map(mapNotification);
}

export async function markNotificationRead(notificationId: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);

  if (error) throw error;
}

export async function markAllNotificationsRead() {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);

  if (error) throw error;
}

export function listAllNotifications() {
  return listNotifications(100);
}

export async function getWatchlistAuctionIds() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("watchlist").select("auction_id");

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.auction_id as string));
}

export async function isAuctionWatched(auctionId: string) {
  const supabase = getSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return false;

  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("auction_id", auctionId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function toggleAuctionWatchlist(auctionId: string) {
  const supabase = getSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Inicie sessão para adicionar leilões à watchlist.");

  const { data: existing, error: existingError } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("auction_id", auctionId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const { error } = await supabase.from("watchlist").delete().eq("id", existing.id);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase.from("watchlist").insert({
    user_id: user.id,
    auction_id: auctionId,
  });

  if (error) throw error;
  return true;
}

export async function listBuyerWatchlistAuctions(): Promise<BuyerWatchlistItem[]> {
  const supabase = getSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data: watchRows, error: watchError } = await supabase
    .from("watchlist")
    .select("id,user_id,auction_id,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (watchError) throw watchError;
  if (!watchRows?.length) return [];

  const watchlist = watchRows as WatchlistRow[];
  const auctionIds = watchlist.map((row) => row.auction_id);
  const [{ data: auctionRows, error: auctionsError }, { data: vehicleRows, error: vehiclesError }] =
    await Promise.all([
      supabase
        .from("public_auctions")
        .select(
          "id,lot_number,vehicle_id,status,mode,starting_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count,reserve_met",
        )
        .in("id", auctionIds),
      supabase
        .from("public_vehicles")
        .select(
          "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,photos,additional_services,legalization_cost,market_price_ref,lead_time_days,has_damage_report,has_appraisal,has_service_history,has_coc",
        ),
    ]);

  if (auctionsError) throw auctionsError;
  if (vehiclesError) throw vehiclesError;

  const vehiclesById = new Map(
    ((vehicleRows ?? []) as VehicleRow[]).map((row) => [row.id, mapVehicle(row)]),
  );
  const auctionsById = new Map(
    ((auctionRows ?? []) as AuctionRow[]).map((row) => [
      row.id,
      { ...mapAuction(row), vehicle: vehiclesById.get(row.vehicle_id) },
    ]),
  );

  return watchlist.map((row) => ({
    id: row.id,
    auctionId: row.auction_id,
    createdAt: row.created_at,
    auction: auctionsById.get(row.auction_id),
  }));
}

export async function listAuctionWatchers(auctionId: string): Promise<AuctionWatcher[]> {
  const supabase = getSupabaseClient();
  const { data: watchRows, error: watchError } = await supabase
    .from("watchlist")
    .select("user_id,created_at")
    .eq("auction_id", auctionId)
    .order("created_at", { ascending: false });

  if (watchError) throw watchError;
  if (!watchRows?.length) return [];

  const userIds = watchRows.map((row) => row.user_id as string);
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id,company_name,contact_name,contact_phone")
    .in("id", userIds);

  if (profilesError) throw profilesError;

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id as string,
      {
        companyName: (profile.company_name as string | null) ?? "",
        contactName: (profile.contact_name as string | null) ?? "",
        contactPhone: (profile.contact_phone as string | null) ?? "",
      },
    ]),
  );

  return watchRows.map((row) => {
    const profile = profilesById.get(row.user_id as string);
    return {
      id: row.user_id as string,
      companyName: profile?.companyName || "Comprador",
      contactName: profile?.contactName || "",
      contactPhone: profile?.contactPhone || "",
      createdAt: row.created_at as string,
    };
  });
}

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const supabase = getSupabaseClient();
  const [
    { data: profile, error: profileError },
    { data: roleRows, error: rolesError },
    { data: bidRows, error: bidsError },
    { data: orderRows, error: ordersError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id,status,company_name,vat_number,contact_name,contact_phone,address,city,country,trade_registry_path,rejected_reason,suspended_reason,approved_at,created_at",
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
    supabase
      .from("bids")
      .select("id,auction_id,bidder_id,amount,status,is_buy_now,created_at")
      .eq("bidder_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("orders")
      .select(
        "id,auction_id,buyer_id,vehicle_id,winning_bid_id,amount,status,delivery_status,deposit_amount,delivery_notes,created_at,updated_at",
      )
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (profileError) throw profileError;
  if (rolesError) throw rolesError;
  if (bidsError) throw bidsError;
  if (ordersError) throw ordersError;
  if (!profile) return null;

  const detail = mapProfile(
    profile as ProfileRow,
    (roleRows ?? []).map((row) => row.role as AppRole),
  );

  const auctionIds = [
    ...new Set([
      ...(bidRows ?? []).map((row) => row.auction_id as string),
      ...(orderRows ?? []).map((row) => row.auction_id as string),
    ]),
  ];
  const vehicleIds = [...new Set((orderRows ?? []).map((row) => row.vehicle_id as string))];

  const [{ data: auctionRows, error: auctionsError }, { data: vehicleRows, error: vehiclesError }] =
    await Promise.all([
      auctionIds.length
        ? supabase
            .from("public_auctions")
            .select(
              "id,lot_number,vehicle_id,status,mode,starting_price,buy_now_price,current_price,bid_increments,starts_at,ends_at,bid_count,viewer_count,reserve_met",
            )
            .in("id", auctionIds)
        : Promise.resolve({ data: [], error: null }),
      vehicleIds.length
        ? supabase
            .from("public_vehicles")
            .select(
              "id,status,make,model,variant,year,mileage,color,fuel_type,transmission,power_cv,doors,condition,description,photos,additional_services,legalization_cost,market_price_ref,lead_time_days,has_damage_report,has_appraisal,has_service_history,has_coc",
            )
            .in("id", vehicleIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (auctionsError) throw auctionsError;
  if (vehiclesError) throw vehiclesError;

  const vehiclesById = new Map(
    ((vehicleRows ?? []) as VehicleRow[]).map((row) => [row.id, mapVehicle(row)]),
  );
  const auctionsById = new Map(
    ((auctionRows ?? []) as AuctionRow[]).map((row) => [
      row.id,
      { ...mapAuction(row), vehicle: vehiclesById.get(row.vehicle_id) },
    ]),
  );

  detail.bids = ((bidRows ?? []) as BidRow[]).map((row, index) => ({
    ...mapBid(row, index, detail.companyName || "Comprador"),
    auction: auctionsById.get(row.auction_id),
  }));

  detail.orders = ((orderRows ?? []) as OrderRow[]).map((row) => ({
    ...mapOrder(row),
    auction: auctionsById.get(row.auction_id),
    vehicle: vehiclesById.get(row.vehicle_id),
  }));

  return detail;
}

export async function getTradeRegistrySignedUrl(path: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from("trade-registry")
    .createSignedUrl(path, 60 * 10);

  if (error) throw error;
  return data.signedUrl;
}

export async function uploadVehiclePhoto(vehicleId: string, file: File) {
  const supabase = getSupabaseClient();
  const path = `vehicles/${vehicleId}/photos/${Date.now()}-${safeStorageFileName(file.name)}`;
  const { error } = await supabase.storage.from("vehicle-photos").upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadVehicleDocument(
  vehicleId: string,
  kind: VehicleDocumentUploadKind,
  file: File,
) {
  const supabase = getSupabaseClient();
  const path = `vehicles/${vehicleId}/documents/${kind}-${Date.now()}-${safeStorageFileName(file.name)}`;
  const { error } = await supabase.storage.from("vehicle-documents").upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw error;
  return path;
}

function safeStorageFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
}

export function parseInteger(value: FormDataEntryValue | null): number | null {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parsePhotoUrls(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
}

export function parseBidIncrements(value: FormDataEntryValue | null): number[] {
  const increments = String(value ?? "")
    .split(",")
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item) && item > 0);

  return increments.length ? increments : [10000, 20000, 50000];
}

export type VehicleDocumentKind = "damage" | "appraisal" | "service" | "coc";

export interface VehicleDocumentLink {
  kind: VehicleDocumentKind;
  label: string;
  url: string;
}

const DOC_LABELS: Record<VehicleDocumentKind, string> = {
  damage: "Relatório de danos",
  appraisal: "Avaliação independente",
  service: "Histórico de manutenção",
  coc: "Certificado de conformidade (COC)",
};

export async function getVehicleDocuments(vehicleId: string): Promise<VehicleDocumentLink[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_vehicle_documents", {
    target_vehicle_id: vehicleId,
  });
  if (error) throw error;
  const row = (Array.isArray(data) ? data[0] : data) as {
    damage_report_path: string | null;
    appraisal_path: string | null;
    service_history_path: string | null;
    coc_path: string | null;
  } | null;
  if (!row) return [];

  const entries: { kind: VehicleDocumentKind; path: string }[] = [];
  if (row.damage_report_path) entries.push({ kind: "damage", path: row.damage_report_path });
  if (row.appraisal_path) entries.push({ kind: "appraisal", path: row.appraisal_path });
  if (row.service_history_path) entries.push({ kind: "service", path: row.service_history_path });
  if (row.coc_path) entries.push({ kind: "coc", path: row.coc_path });

  const links = await Promise.all(
    entries.map(async ({ kind, path }) => {
      const { data: signed, error: signError } = await supabase.storage
        .from("vehicle-documents")
        .createSignedUrl(path, 60 * 10);
      if (signError || !signed) return null;
      return { kind, label: DOC_LABELS[kind], url: signed.signedUrl } as VehicleDocumentLink;
    }),
  );
  return links.filter((link): link is VehicleDocumentLink => link !== null);
}
