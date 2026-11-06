# 🖥️ Bhumivera Frontend — Pages & Component Registry Manifest

> **Master Frontend Inventory**: 79 Pages & Studios (43 Storefront & Portal + 36 Admin Studios) | 7 Context Providers | 3 Shell Layouts  
> **Framework**: React 18.3 + Vite 6 + Tailwind CSS v4 + Framer Motion + Capacitor 8.5 Android  
> **Last Verified Audit**: 2026-11-03 Baseline

---

## 1. Global Frontend Counters

```
+-------------------------------------------------------------+
| FRONTEND METRIC                  | CURRENT VERIFIED COUNT    |
+----------------------------------+---------------------------+
| Total Page Modules               | 79 JSX files              |
| Storefront & Public Portals      | 43 pages                  |
| Admin Management Studios         | 36 studios                |
| React Context Providers          | 7 contexts                |
| Primary Routing Shells           | 2 (SiteShell, AdminShell) |
+----------------------------------+---------------------------+
```

---

## 2. Storefront, Authentication & Customer Portal Pages (43 Files)

All files live in `src/pages/`:

| # | Component / File | Route Path in `App.jsx` | Functional Overview |
| :---: | :--- | :--- | :--- |
| **1** | `PremiumHome.jsx` (`Home.jsx`) | `/` | Flagship storefront, 4-pillar stewardship ledger, regimen bundles, ingredient showcase |
| **2** | `Shop.jsx` | `/shop`, `/collections`, `/category/:slug` | Filterable 6-product luxury catalog + 3 architectural regimen bundles with live batch stock |
| **3** | `ProductDetail.jsx` | `/product/:id`, `/products/:id` | Full active potency disclosure table, batch CoA verification link, Wikipedia-linked JSON-LD, reviews tab |
| **4** | `BundleDetail.jsx` | `/combo/:slug` | Regimen bundle page with component breakdown, live component stock, and regimen reviews |
| **5** | `ProductVerification.jsx` | `/verify`, `/genuinity`, `/ewarranty` | Authenticity QR code scanner and bottle serial validation against Railway database |
| **6** | `InventorySoftware.jsx` | `/inventorysoftware`, `/inventorysoftware/*` | **10x Omnichannel Command Center**: Order lifecycle with clickable status/today filters, search, date filter and visible-view refresh; shipping labels, RTO returns, POS, QR pairing, SQL backup |
| **7** | `AdminLogin.jsx` | `/admin/login` | Secure management login with TOTP 2FA, brute-force rate limiter, and role gate |
| **8** | `AdminDashboard.jsx` | `/admin`, `/admin/dashboard` | Website Owner & Marketing Studio (Catalog, Spins, Referrals, GST, CRM, Reviews) |
| **9** | `SuperAdminSupport.jsx` | `/superadminsupport` | SuperAdmin Staff IAM Vault: Support agent roles, warehouse staff IDs, passkeys & TOTP |
| **10** | `SupportPortal.jsx` | `/support/*` | Customer Support Desk (L1–L3 agents): Universal search, customer chat, courtesy coupons |
| **11** | `Checkout.jsx` | `/checkout` | Razorpay payment gateway, wallet redemption, COD, delivery fee calculation |
| **12** | `OrderSuccess.jsx` | `/order-success/:orderId` | Post-purchase celebration, loyalty reward spin, WhatsApp order confirmation link |
| **13** | `OrderTracking.jsx` | `/order-tracking`, `/order-tracking/:id` | Live checkpoint timeline ("Where product is right now"), estimated delivery date, courier AWB |
| **14** | `Login.jsx` | `/login` | Customer login with email/password and mobile OTP authentication |
| **15** | `Register.jsx` | `/register` | Customer registration with welcome bonus shopping wallet credit (₹50) |
| **16** | `Profile.jsx` | `/profile` | Customer profile, past orders, loyalty tier badge, wallet balance, address manager |
| **17** | `Wishlist.jsx` | `/wishlist` | Saved botanical items with one-click "Move to Bag" and restock notifications |
| **18** | `Compare.jsx` | `/compare` | Side-by-side formulation comparison of active percentages and botanical milligram disclosures |
| **19** | `AddressBook.jsx` | `/addresses`, `/address-book` | Customer delivery addresses with Indian pincode auto-resolution and GST state matching |
| **20** | `Affiliate.jsx` | `/affiliate` | Brand Ambassador affiliate portal with tracking links, conversion stats, and payout history |
| **21** | `LabProtocol.jsx` | `/lab` | Sub-28°C cold extraction protocols, pH 5.0–5.5 calibration, third-party heavy metal test reports |
| **22** | `ProvenanceEngine.jsx` | `/provenance`, `/provenance-engine` | Interactive geographic sourcing map of India (Himalayan sea buckthorn, Assam bamboo, etc.) |
| **23** | `SomaticRegistry.jsx` | `/somatic-registry` | Clinical trial registry, skin barrier restoration metrics, trans-epidermal water loss data |
| **24** | `BhumiveraScience.jsx` | `/science`, `/bhumivera-science` | Detailed chemical disclosures and Ayurvedic phyto-active scientific papers |
| **25** | `LuxuryGuides.jsx` | `/guides`, `/guides/:slug` | Curated editorial articles on botanical skin stewardship, scalp health, and circadian rituals |
| **26** | `Impact.jsx` | `/impact` | Corporate stewardship, 1% for rural agro-forestry, clean water harvesting ledger |
| **27** | `ImpactProjectDetail.jsx` | `/impact/:imageId`, `/impact/project/:id` | Deep-dive photo ledger and GPS coordinates of funded environmental restoration sites |
| **28** | `Community.jsx` | `/community` | Patron discussion circles, formulation feedback, and botanical harvest diaries |
| **29** | `Legal.jsx` | `/legal`, `/legal/:sectionSlug` | Terms of service, privacy policy, shipping policy, zero post-delivery return policy |
| **30** | `Contact.jsx` | `/contact`, `/support-center` | Corporate inquiries, headquarters visit booking, partner distribution inquiries |
| **31** | `PurchaseProtection.jsx` | `/purchase-protection` | Sealed bottle tamper-evidence disclosure and safe transit guarantee policy |
| **32** | `SellOnBhumivera.jsx` | `/sell-on-bhumivera` | Organic grower application, botanical farm certification requirements |
| **33** | `MPGEBusinessLanding.jsx` | `/mpgebusiness` | Parent corporate entity overview (MPG E Business Private Limited history since 2016) |
| **34** | `FlashSales.jsx` | `/flash-sales` | Scarcity drops, micro-batch release timers, and limited allocations |
| **35** | `ForgotPassword.jsx` | `/forgot-password` | Self-service customer password recovery via verified email OTP |
| **36** | `ResetPassword.jsx` | `/reset-password` | New password submission with cryptographic token verification |
| **37** | `SpinRegistration.jsx` | `/spin-registration` | Redirect to `/register` with retained campaign coupon payload |
| **38**–**43** | Additional views & tests | Sub-routes | `AddressBook.test.jsx`, `ImpactProjectDetail.test.jsx`, `Login.test.jsx`, `ProductVerification.test.jsx`, etc. |

---

## 3. Admin Command Center Studios (36 Files)

Located in `src/pages/admin/` and loaded dynamically via `AdminDashboard.jsx`:

1. **`DashboardOverview.jsx`**: High-level platform health, live order counter, daily gross revenue, and direct jump cards to `/inventorysoftware`.
2. **`ProductManagement.jsx`**: Website product catalog, active percentages, milligram disclosures, SEO metadata. (Stock editing locked to `/inventorysoftware`).
3. **`ReviewManagement.jsx`**: Moderation & studio for all 1,500 authentic pan-India reviews across all 6 products & 3 combos. Full edit of names, cities, dates (2020-2026), photos, videos.
4. **`UserManagement.jsx`**: Complete Customer CRM, LTV calculation, order histories, account status, role management.
5. **`GSTAccounting.jsx`**: Financial ledger, GSTIN reports, state tax breakup (CGST, SGST, IGST), downloadable branded tax invoices.
6. **`GamificationStudio.jsx`**: Wheel of Fortune reward spin configuration, probability weights, and prize allocation.
7. **`GrowthOffersHub.jsx`**: Promotional flash sales, sitewide banners, countdown timers, first-order welcome discounts.
8. **`CouponManagement.jsx`**: Coupon code generation, usage caps, minimum cart value thresholds, and category restrictions.
9. **`CartRulesEngine.jsx`**: Dynamic checkout rules, tier-based automatic discounts, and free shipping conditions.
10. **`LoyaltyTierForge.jsx`**: Loyalty tier definitions (Silver, Gold, Platinum, Maison Patron), point multipliers, and VIP rewards.
11. **`LoyaltyMembers.jsx`**: Loyalty point ledger per patron, tier upgrades, and manual reward credits.
12. **`AffiliateManagement.jsx`**: Brand ambassador approvals, commission rates (5%–15%), conversion audit, and payout reconciliation.
13. **`AuthenticityBatchManagement.jsx`**: Micro-batch creation (250 bottles), serialized QR code generation, and lab CoA assignment.
14. **`ScarcitySimulator.jsx`**: Live batch allocation pacing and stock countdown visualizer for luxury marketing.
15. **`PersonalizationCenter.jsx`**: AI-driven product recommendation rules and customer skin-type matching.
16. **`LifecycleOffers.jsx`**: Automated re-order triggers (30-day, 60-day botanical replenishment reminders).
17. **`MinCartValueCenter.jsx`**: Dynamic cart checkout restrictions based on regional delivery logistics.
18. **`SupportAgentManagement.jsx`**: Support desk staff permissions, queue allocations, and response SLA monitoring.
19. **`SupportManagement.jsx`**: Global customer ticket supervision and live customer sentiment escalations.
20. **`CategoryManagement.jsx`**: Master catalog categories, HSN mapping, and navigation menu sorting.
21. **`NotificationManagement.jsx`**: Push notification composer, targeted marketing campaigns, and delivery stats.
22. **`ImpactManagement.jsx`**: Verified carbon offset projects, tree planting GPS updates, and donation receipts.
23. **`WalletManagement.jsx`**: Client shopping wallet manual adjustments, courtesy balances, and audit records.
24. **`ContactManagement.jsx`**: Contact form triage, supplier leads, and partnership inquiries.
25. **`FlashSalesManagement.jsx`**: Timed price drops and homepage scarcity ribbon scheduler.
26. **`TaxManagement.jsx`**: HSN/SAC code registry and tax rate configuration.
27. **`AnalyticsManagement.jsx`**: Conversion funnels, average order value (AOV), cart abandonment rates.
28. **`AdminSettings.jsx`**: Master website toggles, Redis cache flush, emergency maintenance mode.
29. **`SystemHealth.jsx`**: Railway server ping, database pool utilization, Redis latency checks.
30. **`SystemLogs.jsx`**: Real-time server exception stream and security audit logs.
31. **`AdminForgotPassword.jsx`**: Staff password reset with 2FA verification.
32. **`AdminTheme.css`**: Luxury obsidian & gold theme stylesheets for admin command center.
33. **`AdminLogin.css`**: Secure glassmorphic styling for admin authentication portal.
34. **`CategoryManagement.test.jsx`**, **`AffiliateManagement.test.jsx`**, **`UserManagement.test.jsx`**: Component test suites.

---

## 4. Omnichannel Inventory Software (`InventorySoftware.jsx`)

The entire operational engine for warehouse, orders, and retail POS is encapsulated in `InventorySoftware.jsx` and navigated via URL query parameters:

* `?view=online`: **Online Order Lifecycle** (`pending` → `confirmed` → `packed` → `shipped` → `delivered`), tracking AWB editor, live checkpoint updater.
* `?view=labels`: **Auto-Fetched Customer Shipping Labels** (4x6 thermal courier labels with barcode and parsed Indian address snapshot).
* `?view=ret`: **RTO (Return to Origin) Studio** (`RESTOCK` mode for unopened parcels vs `QUARANTINE` mode for transit damage).
* `?view=inv`: **Master Stock Control** (Unified stock locking online website stock `products.quantity` and physical warehouse stock).
* `?view=sale`: **Offline POS Terminal** (Live cart, barcode scan bar, dynamic Indian UPI QR, 1-click WhatsApp e-billing).
* `?view=scanner`: **Mobile Android Scanner Pairing** (Displays live session pairing QR with API credentials).
* `?view=keeper`: **Storage Bin Keeper** (Warehouse rack, shelf, and bin allocation `A1-R02-B05`).
* `?view=grn`: **Goods Received Notes** (Factory batch inwarding and stock increment).
* `?view=audit`: **Physical Stock Audit** (Variance check between physical floor count and database count).
* `?view=backup`: **Daily SQL Disaster Recovery Center** (Trigger manual MySQL backup, download encrypted dump, or perform 1-click restore).
