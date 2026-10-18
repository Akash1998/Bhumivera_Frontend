import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  FileCheck2,
  Lock,
  AlertTriangle,
  Search,
  Printer,
  CheckCircle2,
  BookOpen,
  Gavel,
  ArrowRight,
} from 'lucide-react';
import SEO from '../components/SEO';
import { LEGAL_SECTION_PROFILES } from '../data/bhumiveraUniqueData';

const SLUG_TO_SECTION = {
  'conditions-of-use': 'terms',
  'shipping-hygiene': 'orders',
  'unboxing-antiscam': 'antifraud',
  'wallet-loyalty-referrals': 'referrals',
  'warranty-affiliate-b2b': 'warranty_affiliate',
  'privacy-dpdp': 'privacy',
  'medical-ip-shield': 'ip_disclaimer',
  'arbitration-grievance': 'grievance',
  'all': 'all',
};

const SECTION_TO_PATH = {
  terms: '/legal/conditions-of-use',
  orders: '/legal/shipping-hygiene',
  antifraud: '/legal/unboxing-antiscam',
  referrals: '/legal/wallet-loyalty-referrals',
  warranty_affiliate: '/legal/warranty-affiliate-b2b',
  privacy: '/legal/privacy-dpdp',
  ip_disclaimer: '/legal/medical-ip-shield',
  grievance: '/legal/arbitration-grievance',
  all: '/legal?section=all',
};

const SECTIONS = [
  { id: 'terms', code: 'PART I', label: 'Conditions of Use & Sale', count: 16 },
  { id: 'orders', code: 'PART II', label: 'Orders, Sanitary Virgin Custody & Concierge Care', count: 12 },
  { id: 'antifraud', code: 'PART III', label: 'Anti-Scam, 360° Unboxing & Chargeback Shield', count: 10 },
  { id: 'referrals', code: 'PART IV', label: 'Wallet, Loyalty, Spin & Referral Governance', count: 10 },
  { id: 'warranty_affiliate', code: 'PART V', label: 'Product Verification, Affiliate & B2B Terms', count: 10 },
  { id: 'privacy', code: 'PART VI', label: 'Privacy Notice & DPDP Act 2023 Governance', count: 11 },
  { id: 'ip_disclaimer', code: 'PART VII', label: 'Medical Disclaimer, IP & Liability Cap', count: 10 },
  { id: 'grievance', code: 'PART VIII', label: 'Arbitration, Jurisdiction & Grievance Officer', count: 9 },
  { id: 'all', code: 'MASTER', label: 'View All 88 Clauses (Full Agreement)', count: 88 },
];

const PROTECTION_MATRIX = [
  {
    scenario: 'Delivered Personal Care Custody & Hygiene Standard',
    policy: '100% Sealed Virgin Unit Custody. Sealed at compounding facility; serialized in small artisanal batches to guarantee absolute purity.',
    evidence: 'Sealed dispatch weight & warehouse CCTV record.',
    statute: 'Drugs & Cosmetics Act, 1940; Consumer Protection (E-Commerce) Rules, 2020.',
  },
  {
    scenario: 'Damaged, Leaking, Defective or Wrong Item on Arrival',
    policy: 'Direct Concierge Review for Verified Patrons with direct refund or spendable store credit.',
    evidence: 'Mandatory uncut 360° unboxing video showing intact outer AWB & seal + photos within 48 hours of delivery.',
    statute: 'Consumer Protection Act, 2019; Indian Sale of Goods Act, 1930.',
  },
  {
    scenario: 'Missing Item / Empty Box / Tampered Parcel Claim',
    policy: 'Evaluated strictly by cross-checking customer’s uncut 360° unboxing video against warehouse digital weight-scan & CCTV packing logs.',
    evidence: 'Uncut 360° video starting BEFORE breaking outer courier seal + pre-dispatch weight certificate.',
    statute: 'Section 63, Bharatiya Sakshya Adhiniyam, 2023 (Electronic Evidence).',
  },
  {
    scenario: 'Order Cancellation After Confirmation / Processing / Dispatch',
    policy: 'Self-cancellation and bot cancellation are locked once confirmed/processing/shipped. Only SuperAdmin may authorize exceptions.',
    evidence: 'Immutable order state machine & SHA-512 audit ledger.',
    statute: 'Indian Contract Act, 1872 (Binding Electronic Offer & Acceptance).',
  },
  {
    scenario: 'Referral Rewards, Shopping Rewards & Loyalty Points',
    policy: 'Promotional, order-only credits; strictly non-cash, non-withdrawable, non-transferable, and subject to server-side tier caps.',
    evidence: 'Dual-ledger cryptographic wallet & referral audit trail.',
    statute: 'Indian Contract Act, 1872; Promotional Scheme Governance.',
  },
  {
    scenario: 'False Chargebacks, UPI Fraud, Prank COD or Sybil Multi-Accounts',
    policy: 'Immediate account termination, forfeiture of promotional balances, recovery of two-way freight/gateway fees, and legal escalation.',
    evidence: 'Gateway webhook signatures, SHA-512 ledger hashes, carrier POD, and server security logs.',
    statute: 'Information Technology Act, 2000; Bharatiya Nyaya Sanhita (BNS), 2023.',
  },
];

const LEGAL_CLAUSES = {
  terms: [
    {
      num: '1.1',
      title: '1. Who these terms cover & binding electronic contract',
      body: [
        '“Bhumivera”, “we”, “us” and “our” refer to the Bhumivera-branded e-commerce platform, mobile/web applications, and the operating enterprise (RS Enterprises / Bhumivera Maison, headquartered in West Bengal, India) and/or the seller identified on the relevant product listing, checkout summary, and tax invoice. These Master Conditions of Use & Sale (“Conditions”) constitute a legally binding electronic contract under the Indian Contract Act, 1872 and Section 10A of the Information Technology Act, 2000.',
        'By accessing, browsing, registering an account, using the AI Client Concierge, participating in any loyalty/referral/spin program, or placing an order on Bhumivera, you unconditionally agree to be bound by all 8 Parts of these Conditions. Product-specific disclosures, checkout breakdowns, and GST tax invoices form an integral part of the transaction record. Where any mandatory statutory consumer protection, product-safety, or data-protection right cannot lawfully be waived, these Conditions operate harmoniously with that statutory right.',
      ],
    },
    {
      num: '1.2',
      title: '2. Eligibility, legal capacity and account security',
      body: [
        'You must be at least 18 years of age and legally competent to contract under Section 11 of the Indian Contract Act, 1872. A minor may browse or use the platform only under the direct supervision and explicit legal assumption of responsibility by a parent or lawful guardian.',
        'You are solely responsible for maintaining the strict confidentiality of your account password, WebAuthn Passkeys, one-time passwords (OTPs), session tokens, and recovery credentials. Bhumivera personnel and AI systems will NEVER ask for your password or OTP. Any action, order, wallet redemption, or communication authenticated through your account credentials or registered device is legally attributable to you. Notify support@bhumivera.com immediately if you suspect unauthorized access.',
        'You must provide truthful, current, and complete registration, contact, billing, and delivery information (including accurate pin codes and Google Maps coordinates where used). Impersonation, disposable-email farming, multi-account creation to bypass promotional limits, automated scraping, or interference with Cloudflare Turnstile / rate-limiting controls is strictly prohibited and grounds for immediate account termination.',
      ],
    },
    {
      num: '1.3',
      title: '3. Product information, botanical context and responsible cosmetic use',
      body: [
        'Product pages, botanical films, ingredient notes, concentration ranges, prices, and availability descriptions are provided to help you make an informed choice and may be updated prospectively. Visual media, videos, and bottle renders represent the product line; natural botanical extracts (such as Himalayan Sea Buckthorn, Kumkumadi Saffron, Aloe Vera, Tulsi, and Activated Bamboo Charcoal) exhibit natural batch-to-batch variations in colour, aroma, and viscosity.',
        'Always read the physical product label, full ingredient list (INCI/key actives), batch details, expiry date, and directions before use. For all skincare, haircare, botanical, and personal-care products sold on Bhumivera, website content and AI Concierge responses constitute general cosmetic and educational information—NOT medical advice, dermatological diagnosis, or a therapeutic claim to cure, treat, mitigate, or prevent any disease under the Drugs and Cosmetics Act, 1940.',
      ],
    },
    {
      num: '1.4',
      title: '4. Mandatory 24–48 hour patch test & allergen assumption of risk',
      body: [
        'Even pure natural botanicals, essential oils, herbal extracts, and modern dermatological actives (such as Niacinamide or Hyaluronic Acid) can trigger individual skin or scalp sensitivities or allergic reactions. Before first full use of any Bhumivera product, you MUST perform a 24-to-48-hour patch test on a small area of clean skin (such as the inner forearm or behind the ear).',
        'If redness, itching, burning, rash, or discomfort occurs during the patch test or routine use, rinse immediately with cool water, discontinue use, and consult a qualified physician. By purchasing and using Bhumivera cosmetics, you acknowledge that individual skin compatibility varies and that Bhumivera is not liable for idiosyncratic allergic reactions, sensitivities, or misuse contrary to label instructions.',
      ],
    },
    {
      num: '1.5',
      title: '5. Prices, typographical errors, taxes and payment authorization',
      body: [
        'All prices are listed in Indian Rupees (INR / ₹) and include or itemize applicable Goods and Services Tax (GST), delivery charges, and eligible discounts at checkout. The final checkout summary displayed immediately prior to payment authorization is the authoritative payable amount. If a manifest typographical, catalog, or system pricing/calculation error occurs prior to dispatch, Bhumivera reserves the right to cancel the affected order and issue a full refund of any captured payment.',
        'Online payments are processed through RBI-authorized, PCI-DSS compliant payment gateways (such as Razorpay, UPI, NetBanking, and Cards). Bhumivera does not store raw payment-card numbers or UPI PINs. Opening a payment modal does not constitute payment; an order is marked paid only upon cryptographic webhook or server-to-server capture confirmation from the payment gateway. Do not repeatedly retry a pending UPI debit; check your order status or contact support with the UTR/payment reference.',
        'Your downloadable GST Tax Invoice is the definitive fiscal record for the transaction. Where B2B GSTIN details are entered by the buyer, the buyer warrants that the GSTIN is active and valid; Bhumivera is not responsible for input-tax-credit (ITC) mismatches caused by inaccurate buyer GSTIN inputs.',
      ],
    },
    {
      num: '1.6',
      title: '6. Order offer, acceptance & SuperAdmin-exclusive cancellation lock',
      body: [
        'Submitting an order at checkout constitutes a binding offer to purchase the selected merchandise under these Conditions. Order acceptance occurs when our system confirms the order and allocates warehouse inventory. We reserve the right to decline or cancel any order prior to delivery due to stock unavailability, unserviceable pin code, failed security/fraud screening, pricing error, or regulatory restriction, with a full refund of any captured online payment.',
        'To maintain automated warehouse picking, barcode serialization, and carrier manifest integrity, orders that have entered Confirmed, Processing, Packed, or Shipped status CANNOT be self-cancelled by the customer or cancelled by automated chat bots or L1/L2/L3 support agents. Only the authorized SuperAdmin control centre may execute an administrative cancellation where operationally feasible prior to delivery.',
      ],
    },
    {
      num: '1.7',
      title: '7. Cash-on-Delivery (COD) governance & refusal countermeasures',
      body: [
        'Cash-on-Delivery (COD) is a privilege extended for customer convenience on eligible pin codes and order values. Placing a COD order creates a binding contractual commitment to accept delivery and tender the exact invoice amount upon courier arrival.',
        'Habitual refusal of COD parcels at the doorstep, providing fabricated addresses/phone numbers, or placing prank COD orders causes measurable two-way logistics and packaging loss. Bhumivera automatically logs COD refusals; accounts with repeated unjustified COD refusals will have COD privileges permanently revoked, promotional/referral balances forfeited, and may be required to prepay all future orders.',
      ],
    },
    {
      num: '1.8',
      title: '8. Coupons, cart promotions, loyalty and dual-ledger wallets',
      body: [
        'Coupons and cart-rule offers are subject to their displayed minimum order value, validity window, customer eligibility, usage limits, and stacking rules enforced server-side at checkout. Promotional codes have zero cash value, cannot be sold or transferred, and cannot be applied retroactively after an order is placed.',
        'Spendable Bhumivera Wallet funds (originating from approved prepaid order refunds or verified courtesy damage credits) and Restricted Shopping/Referral Rewards are maintained in strictly separate cryptographic ledgers. Spendable Wallet funds may be applied toward eligible purchases on Bhumivera. Restricted Shopping and Referral Rewards are promotional, order-only discount credits: they can NEVER be withdrawn to a bank account, transferred via UPI, encashed, assigned, or used to pay shipping fees or taxes.',
        'Eligible paid orders earn 10% of eligible net merchandise value in restricted shopping rewards (plus an additional 5% welcome bonus on a customer’s first eligible order), capped at ₹500 per order. Online rewards are credited after payment capture and COD rewards after verified delivery and cash reconciliation. Credits auto-apply only when the cart meets the admin-configured minimum subtotal tier and only up to the configured per-order ceiling.',
      ],
    },
    {
      num: '1.9',
      title: '9. Loyalty matrix: earning, tiers and redemption',
      body: [
        'The Clientele Privilege (Loyalty) programme is promotional and governed by server-side rates shown at checkout. The baseline earning rate is 0.1 point per ₹1 of eligible net merchandise spend (1 point per ₹10), with 10 points converting to ₹1 of checkout discount, a minimum redemption threshold of 100 points, and a maximum redemption ceiling of 20% of remaining eligible merchandise value. Points have zero cash or monetary value and cannot be withdrawn or transferred.',
        'Tier qualification is based on lifetime net points earned: Bronze (0+), Silver (500+), Gold (1,000+), and Platinum (5,000+), unlocking 1.0×, 1.25×, 1.5×, and 2.0× base point multipliers respectively, plus configured tier discounts (2% Gold, 3% Platinum), loyalty cashback points (0.5% Gold, 1% Platinum), and tier shipping privileges. Cancelled, returned, or reversed transactions automatically reverse earned points and adjust lifetime tier qualification.',
      ],
    },
    {
      num: '1.10',
      title: '10. Voluntary impact pledges & non-charitable ledger status',
      body: [
        'Any optional environmental or community impact contribution selected during eligible COD checkout is 100% voluntary (₹0 is always the default). An order-linked contribution begins as an uncollected pledge and is recorded in the public Impact Ledger only after successful parcel delivery and manual cash collection reconciliation with a staff audit reference.',
        'Optional impact pledges are internal operational allocations toward future stewardship directions—they are NOT charitable donations to a registered NGO/trust, do NOT qualify for Section 80G or other income-tax deductions, and do not represent that a specific tree-planting or river project has already been completed unless published as a verified Field Note.',
      ],
    },
    {
      num: '1.11',
      title: '11. Reviews, photos, videos and user submissions',
      body: [
        'When you submit a product review, rating, photograph, unboxing video, or support attachment, you warrant that it is your genuine, original work and reflects your honest first-hand experience with the ordered product. You grant Bhumivera a non-exclusive, royalty-free, worldwide license to host, verify, display, format, and reproduce your approved review content across our storefront and marketing channels, subject to your privacy settings and applicable law.',
        'Do not submit defamatory, obscene, extortionate, competitor-sponsored, fabricated, or unlawful material, or third-party personal data without consent. Bhumivera reserves the right to moderate, verify against confirmed purchase records, or remove any submission that violates these rules.',
      ],
    },
    {
      num: '1.12',
      title: '12. Optional first-party product recommendations',
      body: [
        'At registration, a separate unchecked opt-in allows you to choose whether Bhumivera may use your first-party purchases, saved wishlist items, approved reviews, and product views recorded while opted in to tailor product recommendations on Bhumivera. This choice is never a condition of registration or order placement. You may withdraw consent at any time in your Profile, which immediately deletes stored product-view signals and reverts recommendations to non-personalized popular items.',
      ],
    },
    {
      num: '1.13',
      title: '13. Website material, video assets and third-party services',
      body: [
        'All storefront design, source code, botanical cinema videos, graphics, logos, trade dress, formulation descriptions, and AI Concierge architectures are the exclusive intellectual property of Bhumivera or its licensors. You may use the site solely for personal, non-commercial retail shopping. Copying, mirroring, scraping, framing, commercial redistribution, or unauthorized resale of Bhumivera products or media is strictly prohibited.',
      ],
    },
    {
      num: '1.14',
      title: '14. Business, wholesale, MPGE and affiliate enquiries',
      body: [
        'Submitting an enquiry regarding affiliate marketing, retail dealership, wholesale supply, cultivation, contract manufacturing, or MPGE work-from-home opportunities does NOT create an offer, employment relationship, agency, franchise, direct-selling appointment, buyback guarantee, or promise of income. No commercial arrangement is valid unless executed in a formal written agreement signed by authorized signatories of the legal entity. Never pay any unauthorized registration or material fee based on informal phone or chat messages.',
      ],
    },
    {
      num: '1.15',
      title: '15. Service availability, limitation of liability and changes',
      body: [
        'While we engineer our platform for high availability and cryptographic integrity, scheduled maintenance, telecom disruptions, or third-party cloud/gateway outages may occasionally interrupt access. To the maximum extent permitted by applicable Indian law, Bhumivera’s aggregate financial liability for any claim arising out of or relating to an order or product shall never exceed the net amount actually paid by the customer for that specific disputed order.',
        'We may update these Conditions prospectively to reflect legal, regulatory, security, or operational developments. The current version number and effective date are published at the top of this page. Completed orders remain governed by the lawful terms in force at the time of checkout.',
      ],
    },
    {
      num: '1.16',
      title: '16. Consumer law compliance & severability',
      body: [
        'These Conditions are drafted in compliance with the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023, the Legal Metrology (Packaged Commodities) Rules, 2011, and the Drugs and Cosmetics Act, 1940. If any clause is held partially unenforceable by a court or commission of competent jurisdiction, that clause shall be enforced to the maximum permissible extent and the remaining clauses shall remain in full force and effect.',
      ],
    },
  ],

  orders: [
    {
      num: '2.1',
      title: '1. Dispatch cutoffs (14:00 IST), delivery estimates and tracking',
      body: [
        'Available delivery tiers (Standard and Premium), shipping charges, free-shipping thresholds, and estimated delivery windows are displayed at checkout. Orders confirmed before 2:00 PM (14:00) IST are scheduled for same-day or next-business-day warehouse processing; orders placed after 2:00 PM IST begin processing the following business day.',
        'Delivery dates shown on product pages and checkout are good-faith carrier estimates, not guaranteed fixed-date warranties unless explicitly labeled as a guaranteed service. National holidays, monsoon/weather disruptions, state border checks, or courier network delays do not entitle a buyer to punitive damages. Keep your registered phone number reachable for carrier OTP and doorstep coordination.',
      ],
    },
    {
      num: '2.2',
      title: '2. Artisanal Sealed Virgin Custody Standard for Personal Care Cosmetics',
      body: [
        'Bhumivera formulations—including Face Washes, Shampoos, Hair Cleansers, Night Elixirs, Serums, and Botanical Gels—are intimate, microbial-sensitive personal hygiene and cosmetic products compounded in small artisanal batches of 250 units. In compliance with health and cosmetic safety standards under the Drugs and Cosmetics Act, 1940 and sealed-hygiene custody practices, all delivered vessels are sealed with tamper-evident virgin security to guarantee 100% untouched botanical purity for every patron.',
        'Each bottle carries a unique serial number verifiable on our /verify portal to inspect individual batch laboratory assays, calibrated pH, and chemical purity.',
      ],
    },
    {
      num: '2.3',
      title: '3. Dedicated Concierge Resolution for Verified Patrons',
      body: [
        'Every loyal patron is protected by our Dedicated Concierge Service. If a parcel arrives with evidence of external transit compromise, leaking through a damaged primary seal, or materially discordant from the tax invoice, our executive concierge reviews the incident directly.',
        'Upon verification of your claim under Clause 2.4, our concierge team processes direct resolution (including immediate wallet credit or direct payment refund) without requiring return shipping.',
      ],
    },
    {
      num: '2.4',
      title: '4. Mandatory 48-hour reporting window & 360° uncut unboxing video requirement',
      body: [
        'To qualify for Concierge Resolution, Wallet Credit, or transit dispute resolution, the customer MUST submit a claim within 48 hours of the courier’s recorded delivery timestamp.',
        'Every claim for transit damage, leakage, missing item, wrong item, or empty/tampered parcel MUST be accompanied by a continuous, uncut, unedited 360-degree Unboxing Video recorded from start to finish. The video must clearly show: (i) all 6 sides (360°) of the unopened outer shipping box, (ii) the legible courier AWB shipping label and intact tamper-evident seal BEFORE any tape or seal is cut, (iii) the continuous opening of the box in frame without any pause, cut, splice, fast-forward, or camera obstruction, and (iv) the close-up condition of the inner product bottle, cap seal, and batch/serial label.',
        'Claims submitted after 48 hours of delivery, or claims accompanied only by post-opening photographs without a valid uncut 360° unboxing video (or with a video started after the outer seal was already cut and re-taped), will be respectfully declined as unverifiable post-delivery handling.',
      ],
    },
    {
      num: '2.5',
      title: '5. Warehouse CCTV, digital weight-scan & barcode serialization proof',
      body: [
        'Every Bhumivera order is packed under high-definition overhead warehouse CCTV cameras. Prior to sealing, each item’s barcode/serial is scanned and the final sealed parcel is weighed on calibrated digital scales, with the exact gram weight recorded on the shipping manifest and carrier handover log.',
        'In the event of any dispute regarding missing items, short shipment, or parcel contents, the warehouse CCTV packing footage and pre-dispatch digital weight-scan record—cross-referenced with the customer’s uncut 360° unboxing video—serve as the primary, conclusive operational evidence.',
      ],
    },
    {
      num: '2.6',
      title: '6. Prepaid order refunds & atomic wallet ledger reconciliation',
      body: [
        'When an unfulfilled or pre-dispatch cancelled prepaid order is approved for a refund, or when a verified transit-damage claim is resolved via refund, our Atomic Refund & Wallet Restoration Ledger executes within a locked database transaction.',
        'Any portion of the order paid via Spendable Bhumivera Wallet or Restricted Referral Credit is restored to its respective ledger with a cryptographic SHA-512 audit hash. Any portion captured via online gateway (Razorpay/UPI/Card) is initiated back to the original payment source within 5–7 business days (subject to banking network settlement schedules) or credited to the Spendable Bhumivera Wallet at the customer’s election.',
      ],
    },
    {
      num: '2.7',
      title: '7. Exclusions from Courtesy Protection & warranty',
      body: [
        'Courtesy Protection and warranty coverage do NOT apply to: (a) products damaged due to customer misuse, dropping, exposure to extreme heat/sunlight, or water contamination after delivery; (b) products whose batch number, serial number, or label has been defaced, removed, or tampered with; (c) products purchased from unauthorized third-party resellers or grey-market sellers; (d) normal cosmetic zużycie (consumption) where more than 10% of the bottle has been used; or (e) subjective dissatisfaction with natural herbal scent or skin feel where the product meets its published specification.',
      ],
    },
    {
      num: '2.8',
      title: '8. Address accuracy, Google Maps pinpoint & failed delivery re-dispatch',
      body: [
        'Customers are responsible for providing a complete, accurate delivery address, landmark, pin code, and active 10-digit Indian mobile number. If a parcel is returned to origin (RTO) due to an incomplete address, unreachable phone, false courier OTP refusal, or repeated customer unavailability after 3 carrier attempts, Bhumivera may deduct actual two-way carrier freight and packaging charges before crediting any remaining prepaid balance.',
      ],
    },
    {
      num: '2.9',
      title: '9. Prohibition on unauthorized commercial resale & bulk hoarding',
      body: [
        'Bhumivera storefront orders are strictly for personal, household consumption by end consumers. We reserve the right to limit per-order or per-household quantities and to cancel orders that exhibit commercial bulk purchasing, arbitrage, or unauthorized resale patterns unless placed under a signed B2B Wholesale Dealership Agreement.',
      ],
    },
    {
      num: '2.10',
      title: '10. Product warranty & serial registration scope',
      body: [
        'Where a product carries a stated warranty period, coverage is governed by the duration and terms displayed on its product page. The product verification page only checks whether a serial number matches an issued record; it does not activate or extend warranty coverage or override the 48-hour unboxing verification rule.',
      ],
    },
    {
      num: '2.11',
      title: '11. Promotional gifts, freebies & bundle adjustments on partial claims',
      body: [
        'If an order qualified for a free gift, tier discount, or threshold coupon, and a partial cancellation or refund reduces the net retained order value below the qualifying threshold, the value of the unreturned free gift or threshold discount is proportionally adjusted in the refund calculation.',
      ],
    },
    {
      num: '2.12',
      title: '12. Safe order support communication rules',
      body: [
        'When contacting support regarding an order, include only your 9-digit Order ID, registered email/phone, description of the issue, and your 360° unboxing video/photos. Never transmit passwords, OTPs, CVV numbers, or UPI PINs.',
      ],
    },
  ],

  antifraud: [
    {
      num: '3.1',
      title: '1. Zero-tolerance policy against e-commerce scams & claim abuse',
      body: [
        'Bhumivera enforces a strict zero-tolerance policy against all forms of e-commerce fraud, including but not limited to: “empty-box” claims, “brick/stone-in-box” claims, item tampering (altering genuine botanical liquid), intentional post-delivery damage claims, courier-collusion false non-delivery claims, and abusive serial dispute attempts.',
      ],
    },
    {
      num: '3.2',
      title: '2. Technical specification for valid 360° uncut unboxing videos',
      body: [
        'To prevent manipulated video evidence, an unboxing video submitted for any claim must satisfy all of the following forensic criteria: (a) Single continuous take with zero edits, cuts, pauses, jump-cuts, or speed alterations; (b) Clear, well-lit focus on the shipping label (AWB number, barcode, and declared weight) at the start of the video; (c) Full 360-degree rotation of the sealed parcel showing all 6 faces and intact tamper-evident security tape before any blade or scissors touch the box; and (d) Continuous framing of the parcel while opening and extracting the product.',
        'Videos that begin after the box is already slit open, where the parcel leaves the camera frame during opening, or where metadata/visual inspection reveals splicing or re-taping are invalid and will be rejected.',
      ],
    },
    {
      num: '3.3',
      title: '3. Chargeback fraud, false UPI disputes & bank reversal defense',
      body: [
        'Filing a false chargeback, unauthorized-transaction dispute, or UPI cyber-cell complaint with a bank or payment gateway after receiving a valid order (or after receiving a concierge resolution) constitutes actionable financial fraud and breach of contract.',
        'Upon receipt of any disputed chargeback notice, Bhumivera automatically compiles and submits to the payment processor and acquiring bank: (a) the authenticated login/OTP/Passkey session log, (b) IP and device security telemetry, (c) the GST Tax Invoice, (d) warehouse CCTV packing footage and digital weight-scan certificate, and (e) carrier Proof of Delivery (POD) with OTP/signature confirmation. The disputing account is immediately frozen, all wallet/loyalty balances are forfeited, and the customer is liable for the full order amount plus gateway chargeback dispute fees and legal recovery costs.',
      ],
    },
    {
      num: '3.4',
      title: '4. Referral, coupon, spin-the-wheel & Sybil multi-account countermeasures',
      body: [
        'Our referral, welcome-reward, coupon, and Spin-the-Wheel systems are protected by automated Sybil-detection heuristics. Creating multiple accounts using variations of emails, alias addresses (+tags), disposable mail domains, virtual phone numbers, shared device fingerprints, or identical delivery addresses/UPI VPA handles to farm ₹500 referral credits or welcome bonuses is strictly prohibited.',
        'Any referral or reward cluster flagged for self-referral, household loop abuse, or synthetic registration is automatically voided and reversed across all linked accounts without notice.',
      ],
    },
    {
      num: '3.5',
      title: '5. Anti-scraping, bot defense & session-flooding protection',
      body: [
        'Automated access to Bhumivera APIs, checkout endpoints, OTP endpoints, or the AI Client Concierge via headless browsers, scripts, cURL loops, or credential-stuffing tools is prohibited. Our architecture enforces strict Redis/memory rate-limiting, Cloudflare Turnstile verification, and two-tier chat gating (requiring a verified order in the database before unlocking live order-support ticketing).',
      ],
    },
    {
      num: '3.6',
      title: '6. Extortionate reviews & reputational blackmail defense',
      body: [
        'Threatening to post fabricated 1-star reviews, false social-media allegations, or baseless regulatory complaints in order to extort free products, cash refunds outside policy, or waiver of the 360° unboxing video requirement constitutes unlawful coercion. Bhumivera documents all such communications in our immutable support ledger and reserves the right to reject the demand, publish a factual public response, and pursue legal remedies.',
      ],
    },
    {
      num: '3.7',
      title: '7. Official communication channels & anti-phishing warning',
      body: [
        'Bhumivera communicates exclusively through our official domain (bhumivera.com), official email (support@bhumivera.com), verified Telegram bot (@BhumiveraBot), and published helpline numbers (+91 74309 85647 / +91 83708 04458). We never ask customers to install remote-desktop apps (AnyDesk/TeamViewer), scan QR codes to “receive” a refund, or pay “customs/insurance/spin-claim fees” to external UPI IDs.',
      ],
    },
    {
      num: '3.8',
      title: '8. Evidentiary admissibility of SHA-512 cryptographic ledgers',
      body: [
        'All order state transitions, payment captures, wallet credits/debits, referral approvals, and support escalations on Bhumivera are recorded in relational database tables protected by cryptographic SHA-512 audit hashes and server timestamps. You agree that these computer-generated records constitute authentic, admissible electronic evidence under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (formerly Section 65B of the Indian Evidence Act, 1872) in any court, arbitration, or consumer forum.',
      ],
    },
    {
      num: '3.9',
      title: '9. Account suspension, permanent blacklisting & balance forfeiture',
      body: [
        'Where reasonable evidence indicates fraud, tampered unboxing media, abusive chargebacks, COD prank ordering, or harassment of customer-support staff, Bhumivera reserves the right to immediately suspend or permanently blacklist the customer’s account, phone number, email, and delivery address, and to cancel any pending orders and forfeit all promotional, loyalty, and referral balances.',
      ],
    },
    {
      num: '3.10',
      title: '10. Civil recovery & criminal prosecution under Indian law',
      body: [
        'Deliberate defrauding of an e-commerce enterprise—through stolen payment instruments, falsified unboxing evidence, identity theft, or cyber sabotage—will be reported to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and local law enforcement for prosecution under applicable provisions of the Bharatiya Nyaya Sanhita (BNS), 2023 (cheating, forgery, criminal breach of trust) and Sections 43, 66, 66C, and 66D of the Information Technology Act, 2000.',
      ],
    },
  ],

  referrals: [
    {
      num: '4.1',
      title: '1. How Brand Ambassador & referral attribution works',
      body: [
        'An eligible existing customer with an active account may share the personal referral code or signed referral link displayed in their Profile. A genuinely new customer must enter that code on the registration page or arrive via the signed link at the time of initial account creation. Attribution is locked at registration and cannot be added retroactively after sign-up.',
      ],
    },
    {
      num: '4.2',
      title: '2. Verification hold, 1-hour review window & abuse checks',
      body: [
        'When a referred user completes email/account verification, the referral claim enters a pending verification state. If no administrative rejection occurs and automated abuse checks pass, the system approves the claim 1 hour after verification. Administrators may reject or reverse any referral claim where duplicate device, shared IP/address, disposable email, or self-referral indicators are detected.',
      ],
    },
    {
      num: '4.3',
      title: '3. Restricted referral balance vs. spendable Wallet funds',
      body: [
        'The default approved referral reward is ₹500 of restricted referral balance for the referrer and ₹500 for the referred new customer (subject to current admin-configured rates). Restricted referral funds and shopping rewards are strictly promotional order-discount credits: they are NOT cash, NOT bank deposits, NOT Pre-Paid Instruments (PPI), and CANNOT be withdrawn, cashed out, transferred between accounts, or used to pay shipping or taxes.',
      ],
    },
    {
      num: '4.4',
      title: '4. Minimum order subtotal tiers & per-order redemption caps',
      body: [
        'Restricted referral/shopping rewards apply automatically at checkout only when the cart’s eligible net merchandise subtotal reaches the admin-configured tier thresholds. Under current default settings, an order subtotal of ₹700–₹1,099 unlocks ₹100 of reward redemption, and an order subtotal of ₹1,100 or more unlocks ₹200 of reward redemption. Only the single highest qualifying tier applies per order, and redemption can never exceed the customer’s available balance or remaining eligible merchandise value.',
      ],
    },
    {
      num: '4.5',
      title: '5. Shopping Wallet Rewards (10% returning / 15% first order)',
      body: [
        'Eligible paid orders earn 10% of net merchandise spend as restricted shopping rewards, plus a 5% welcome bonus (15% total) on a customer’s first completed order, subject to a hard cap of ₹500 per order. Shipping fees, taxes, free gifts, and redeemed discounts/credits are excluded from the reward calculation.',
      ],
    },
    {
      num: '4.6',
      title: '6. Spin-the-Wheel & gamified promotional mechanics',
      body: [
        'Where Spin-the-Wheel or scratch/gamified promotional features are active for eligible orders or serial registrations, each qualifying transaction grants at most one spin/entry as validated by the backend policy engine (`orderSpinPolicy`). Client-side manipulation of wheel angles, replay of API requests, or refreshing during a spin does not alter the server-determined cryptographic outcome. Promotional prizes are non-transferable, non-cash, and subject to their stated expiry and minimum cart rules.',
      ],
    },
    {
      num: '4.7',
      title: '7. Clawback and reversal on cancelled or refunded orders',
      body: [
        'If an order that generated shopping rewards, loyalty points, spin rewards, or referral qualification is subsequently cancelled, returned, refused on COD, or refunded, all promotional credits and points earned from that order are automatically reversed from the customer’s ledger. If the customer has already redeemed those promotional credits on a subsequent order, the redeemed value may be deducted from any refund due or recorded as a negative promotional adjustment.',
      ],
    },
    {
      num: '4.8',
      title: '8. Prohibition on brand-keyword bidding, spam & deceptive promotion',
      body: [
        'Participants sharing referral links must not send unsolicited bulk spam (SMS/WhatsApp/email), impersonate official Bhumivera corporate accounts, bid on “Bhumivera” brand keywords in paid search ads, or misrepresent referral credits as cash employment income.',
      ],
    },
    {
      num: '4.9',
      title: '9. Personal tax & statutory compliance on rewards',
      body: [
        'Any promotional discount or reward received by a participant is a retail trade discount/promotional credit. To the extent any personal income tax or statutory reporting obligation arises for a participant under the Income-tax Act, 1961, it is the sole responsibility of the participant.',
      ],
    },
    {
      num: '4.10',
      title: '10. Administrative right to modify, pause or terminate programs',
      body: [
        'Bhumivera reserves the right to modify reward percentages, tier minimums, per-order caps, eligibility rules, or to pause or terminate the Referral, Shopping Reward, Spin, or Loyalty program prospectively at any time via the Executive Admin Suite.',
      ],
    },
  ],

  warranty_affiliate: [
    {
      num: '5.1',
      title: '1. Product serial number verification',
      body: [
        'The Product Verification page checks whether an entered serial number matches an issued record in Bhumivera’s database. It is a record lookup only and does not collect customer registration details or activate product coverage.',
      ],
    },
    {
      num: '5.2',
      title: '2. Database lookup vs. physical chemical verification',
      body: [
        'A matching serial number on the digital portal confirms that the serial string exists in our registry; however, because outer packaging or labels can be copied by third-party counterfeiters if bought from unauthorized sources, a database match alone does not independently certify the physical chemical contents of an item purchased outside official Bhumivera channels. Always purchase directly from bhumivera.com or verified authorized partners.',
      ],
    },
    {
      num: '5.3',
      title: '3. Unauthorized resellers & voiding of protection',
      body: [
        'Products purchased from unauthorized marketplace sellers, unverified social-media pages, or second-hand sources carry zero Bhumivera warranty, zero Courtesy Protection, and zero authenticity guarantee.',
      ],
    },
    {
      num: '5.4',
      title: '4. Affiliate Partner Program: written agreement requirement',
      body: [
        'Applying to or browsing the Bhumivera Affiliate / Partner Program page (`/affiliate`) does not automatically appoint you as an agent, employee, or commercial partner. Commission rates, attribution windows, payout schedules, and tax deductions (TDS) apply only when confirmed in a formal written partner agreement or active affiliate dashboard account approved by Bhumivera.',
      ],
    },
    {
      num: '5.5',
      title: '5. Strict compliance with advertising & cosmetic laws by affiliates',
      body: [
        'Affiliates and creators must use only approved product descriptions and honest disclosures (including `#ad` or `#affiliate` tags as required by ASCI guidelines and the Central Consumer Protection Authority (CCPA) Guidelines for Prevention of Misleading Advertisements, 2022). Affiliates must NEVER make false medical/drug cures claims or guaranteed clinical promises about Bhumivera cosmetics.',
      ],
    },
    {
      num: '5.6',
      title: '6. B2B wholesale, spa/salon supply & "Sell on Bhumivera" enquiries',
      body: [
        'Submitting a “Sell on Bhumivera” or B2B partnership enquiry via `/contact?topic=sell` is an expression of interest only. Vendor onboarding requires thorough KYC, GSTIN verification, Drugs & Cosmetics manufacturing/distribution license verification, quality testing, and execution of a written Master Vendor Agreement.',
      ],
    },
    {
      num: '5.7',
      title: '7. MPGE / Work-from-Home / Cultivation / Supply enquiry anti-scam notice',
      body: [
        'Our Business Enquiries landing page (`/earn-from-home` and `/mpgebusiness`) provides a transparent channel to request written information regarding potential supply, craft, or production arrangements. That page is NOT a job offer, guaranteed income scheme, buyback contract, or investment solicitation. Bhumivera strictly warns the public NEVER to pay any cash deposit, registration fee, or raw-material fee to any individual based on verbal phone or WhatsApp promises without a signed written contract from the registered legal entity.',
      ],
    },
    {
      num: '5.8',
      title: '8. Independent due diligence & counterparty verification',
      body: [
        'Before entering into any commercial, supply, or B2B arrangement, prospective partners must independently verify the counterparty’s legal name, GST registration, bank account beneficiary name, and statutory licenses, and obtain independent legal/financial advice.',
      ],
    },
    {
      num: '5.9',
      title: '9. Protection of Bhumivera trademarks, trade dress & brand reputation',
      body: [
        'No partner, affiliate, or vendor may register domain names, social-media handles, company names, or trademarks containing “Bhumivera” or confusingly similar variations, nor repackage, relabel, or dilute any Bhumivera product.',
      ],
    },
    {
      num: '5.10',
      title: '10. Immediate termination & forfeiture for partner misconduct',
      body: [
        'Bhumivera may immediately terminate any affiliate or partner relationship and forfeit unpaid commissions if the partner engages in misleading advertising, fake traffic/click-farm fraud, coupon hijacking, or brand disparagement.',
      ],
    },
  ],

  privacy: [
    {
      num: '6.1',
      title: '1. Personal data we process (Data Fiduciary disclosure)',
      body: [
        'In accordance with the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, Bhumivera acts as the Data Fiduciary for personal data collected on our platform. Depending on your interactions, we process: (a) Account identity data (full name, email address, 10-digit mobile number); (b) Authentication & security data (Scrypt/PBKDF2 password hashes, WebAuthn Passkey public keys, OTP verification logs); (c) Fulfilment & billing data (shipping/billing addresses, pin codes, optional Google Maps coordinates, GSTIN); (d) Transaction & ledger data (orders, payment reference IDs, Wallet/Loyalty/Referral ledgers); and (e) Support & review submissions (chat transcripts, 360° unboxing videos, review photos, consent versions).',
      ],
    },
    {
      num: '6.2',
      title: '2. Privacy-by-design operational request diagnostics',
      body: [
        'To maintain platform reliability and troubleshoot errors, our backend request observability middleware records request timestamp, HTTP method, route path (stripped of query strings), HTTP status code, latency duration, and a random request UUID. Sanitized backend HTTP error records and database error fingerprints are retained for up to 30 days, while aggregate in-memory request counters expire within 15 minutes. Our application diagnostics do NOT harvest raw visitor IP addresses, Wi-Fi SSID names, precise GPS background tracking, or cross-site ad-network fingerprints.',
      ],
    },
    {
      num: '6.3',
      title: '3. Lawful purposes & consent architecture under the DPDP Act, 2023',
      body: [
        'We process personal data strictly for lawful purposes for which you have given consent or for certain legitimate uses permitted under the DPDP Act, 2023—specifically: account registration and security, order processing and doorstep delivery, payment reconciliation and GST tax invoicing, Courtesy Protection and warranty verification, fraud/abuse prevention, and statutory compliance.',
      ],
    },
    {
      num: '6.4',
      title: '4. Granular opt-in for first-party product recommendations',
      body: [
        'During registration or in your Profile, you may separately and optionally opt in to first-party product recommendations (`product-recommendations-v2`). This consent is completely independent of accepting these Conditions or marketing emails. When active, it uses only your Bhumivera purchases, wishlist items, approved reviews, and product views to suggest relevant items on our site. Withdrawing this consent in your Profile immediately purges your stored product-view signals.',
      ],
    },
    {
      num: '6.5',
      title: '5. Transactional vs. promotional communications',
      body: [
        'Promotional marketing emails and campaigns are sent only to customers who have explicitly opted in, and you may unsubscribe at any time via your Profile or email footer. Essential transactional, security, OTP, order-tracking, invoice, and support-ticket communications are necessary for contract performance and account safety and are not affected by marketing opt-outs.',
      ],
    },
    {
      num: '6.6',
      title: '6. PCI-DSS payment security & zero raw card storage',
      body: [
        'Online payments are processed directly by regulated payment gateways (such as Razorpay). Bhumivera never receives or stores your raw credit/debit card number, CVV, net-banking password, or UPI PIN on our application servers.',
      ],
    },
    {
      num: '6.7',
      title: '7. Data sharing with fulfilment partners & statutory authorities',
      body: [
        'We NEVER sell your personal data to third parties or data brokers. We share strictly necessary data only with: (a) logistics and courier partners (name, delivery address, phone, parcel weight/collectable amount) to deliver your order; (b) payment gateways and banks to process payments/refunds; (c) cloud hosting, object storage (Cloudflare R2), and transactional email/SMS/OTP infrastructure providers bound by confidentiality; and (d) courts, law enforcement, or tax/regulatory authorities when required by a lawful order.',
      ],
    },
    {
      num: '6.8',
      title: '8. Fortress cryptographic security controls',
      body: [
        'Bhumivera protects stored credentials and administrative vaults using industry-leading cryptography, including hybrid Scrypt + PBKDF2-HMAC-SHA512 key derivation, AES-256-GCM authenticated encryption, constant-time token comparisons (`crypto.timingSafeEqual`), HTTP-Only `Secure` `SameSite=Strict` cookies, CSRF protection, and role-based access control (RBAC). While no internet system can guarantee absolute immunity from every external threat, we maintain rigorous technical and organizational safeguards.',
      ],
    },
    {
      num: '6.9',
      title: '9. Data retention schedules & statutory ledger preservation',
      body: [
        'We retain account and transaction records for as long as your account remains active and for the statutory retention period required under Indian tax, GST, accounting, audit, and cyber-security laws (typically 8 financial years for tax invoices and financial ledgers under the CGST Act, 2017 and Income-tax Act, 1961).',
      ],
    },
    {
      num: '6.10',
      title: '10. Rights & duties of Data Principals (DPDP Act, 2023)',
      body: [
        'Under the DPDP Act, 2023, you have the right to access a summary of your personal data, request correction or updating of inaccurate data, withdraw optional consent, and request erasure of personal data that is no longer necessary for the purpose collected or required to be retained by law. Simultaneously, under Section 15 of the DPDP Act, 2023, Data Principals have a statutory duty NOT to impersonate another person, NOT to suppress material information, and NOT to register false or frivolous grievances or complaints.',
      ],
    },
    {
      num: '6.11',
      title: '11. Children’s privacy & Data Protection Grievance contact',
      body: [
        'Our services are not directed to children under 18 without verifiable parental involvement. If a parent or guardian believes a child has provided personal data without consent, or if you wish to exercise any privacy right, email our Grievance Officer at support@bhumivera.com from your registered email address (never include passwords or OTPs).',
      ],
    },
  ],

  ip_disclaimer: [
    {
      num: '7.1',
      title: '1. Explicit cosmetic & non-medical classification',
      body: [
        'All Bhumivera skincare, haircare, and personal-care products are cosmetic formulations intended solely for cleansing, beautifying, promoting attractiveness, or altering the appearance of the skin/hair. They are NOT pharmaceutical drugs, prescription medications, or clinical treatments. No statement on our website, videos, packaging, or AI Client Concierge has been evaluated as a medical claim to diagnose, cure, mitigate, treat, or prevent any disease or medical disorder.',
      ],
    },
    {
      num: '7.2',
      title: '2. Individual skin variability, pregnancy & medical conditions',
      body: [
        'Results from botanical and dermatological cosmetics vary by skin type, climate, diet, and routine. If you are pregnant, nursing, undergoing dermatological treatment (such as prescription retinoids, chemical peels, or laser therapy), or have a compromised skin barrier, eczema, psoriasis, or severe cystic acne, consult a licensed dermatologist or physician before introducing any new cosmetic product.',
      ],
    },
    {
      num: '7.3',
      title: '3. AI Client Concierge, Skin Quiz & Somatic Registry disclaimer',
      body: [
        'The Bhumivera AI Client Concierge, Interactive Formulation Guide, Biometric Skin Quiz visualizer, and Somatic Label Registry are automated informational tools that match user-selected preferences against our product catalog and ingredient memory graph. They do NOT perform medical or clinical diagnostics, do not analyze biometric health data, and do not substitute for professional dermatological advice.',
      ],
    },
    {
      num: '7.4',
      title: '4. Ownership of intellectual property, videos & trade dress',
      body: [
        'The “Bhumivera” name, tree crest emblem, bottle designs, label trade dress, original botanical cinema MP4 videos, product photography, text copy, ingredient memory graphs, and software code are protected under the Trade Marks Act, 1999 and the Copyright Act, 1957 (India) and international treaties. All rights are reserved.',
      ],
    },
    {
      num: '7.5',
      title: '5. Prohibition on commercial scraping, cloning & AI training',
      body: [
        'You may not use any robot, spider, scraper, or automated extraction tool to copy our catalog, pricing, reviews, or video assets, nor use any Bhumivera content, images, or videos to train third-party machine-learning models or create lookalike/phishing websites.',
      ],
    },
    {
      num: '7.6',
      title: '6. Disclaimer of implied digital platform warranties',
      body: [
        'Except for the express statutory obligations of a seller regarding confirmed product orders, the Bhumivera website, mobile application, and AI features are provided on an “as is” and “as available” basis without warranties of uninterrupted uptime or compatibility with every device configuration.',
      ],
    },
    {
      num: '7.7',
      title: '7. Strict cap on aggregate liability',
      body: [
        'To the fullest extent permitted by applicable law, in no event shall Bhumivera, its founder, directors, officers, employees, or suppliers be liable for any claim, loss, or damage (whether in contract, tort, negligence, or otherwise) in an amount exceeding the actual net purchase price paid by the customer to Bhumivera for the specific product giving rise to the claim.',
      ],
    },
    {
      num: '7.8',
      title: '8. Exclusion of indirect, consequential & punitive damages',
      body: [
        'To the fullest extent permitted by law, Bhumivera shall not be liable for any indirect, incidental, special, punitive, exemplary, or consequential damages, loss of profits, loss of business opportunity, or reputational harm arising out of the use of or inability to use the platform or products.',
      ],
    },
    {
      num: '7.9',
      title: '9. Customer indemnification obligation',
      body: [
        'You agree to indemnify, defend, and hold harmless Bhumivera and its proprietors, officers, and staff from and against any third-party claims, liabilities, losses, penalties, and reasonable legal fees arising out of: (a) your breach of these Conditions; (b) your submission of fraudulent claims, edited unboxing videos, or false chargebacks; (c) your violation of any law or third-party rights; or (d) your misuse or unauthorized resale of Bhumivera products.',
      ],
    },
    {
      num: '7.10',
      title: '10. Force Majeure',
      body: [
        'Bhumivera shall not be held in breach or liable for any delay or failure in performance resulting from causes beyond its reasonable control, including acts of God, floods, cyclones, earthquakes, epidemics/pandemics, war, civil commotion, government lockdowns, strikes, carrier network shutdowns, power-grid or internet backbone failures, or cyber-attacks.',
      ],
    },
  ],

  grievance: [
    {
      num: '8.1',
      title: '1. Mandatory 3-Tier internal escalation & pre-litigation resolution',
      body: [
        'Before initiating any external proceeding, chargeback, or formal dispute, the customer agrees to give Bhumivera a fair opportunity to resolve the issue through our structured 3-Tier Customer Care & Grievance Escalation process: (a) Tier 1: Submit the query with Order ID and 360° unboxing video/photos via `/contact`, the Order Support Concierge, or support@bhumivera.com; (b) Tier 2: Escalate via our Verified Buyer HMAC Escalation Flow for a specialist callback/email within 12–24 hours; and (c) Tier 3: Escalate to the Designated Grievance Officer below.',
      ],
    },
    {
      num: '8.2',
      title: '2. Statutory Grievance Officer & Nodal Entity disclosure',
      body: [
        'In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the enterprise and Grievance Redressal Desk are published below:',
        '• Brand & Platform: Bhumivera (Operated by RS Enterprises / Bhumivera Maison)\n• Founder & Designated Grievance Officer: Akash Prasad (Grievance & Compliance Desk)\n• Principal Region of Operations: Asansol, Paschim Bardhaman, West Bengal, India\n• Official Grievance Email: support@bhumivera.com (Subject line: “GRIEVANCE - ORDER #[Your Order ID]”)\n• Official Customer Care & WhatsApp Helpline: +91 74309 85647 / +91 83708 04458\n• Operating Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST (excluding national holidays).',
      ],
    },
    {
      num: '8.3',
      title: '3. Statutory 48-hour acknowledgement & 30-day resolution timeline',
      body: [
        'Every genuine written grievance submitted with a valid Order ID and registered email/phone will be acknowledged within 48 hours of receipt with a unique ticket tracking reference and resolved within 30 days from the date of receipt, in full compliance with Rule 4(4) of the Consumer Protection (E-Commerce) Rules, 2020.',
      ],
    },
    {
      num: '8.4',
      title: '4. Verification of genuine buyer status to prevent vexatious claims',
      body: [
        'To protect customer privacy and prevent competitor harassment or automated spam, Bhumivera requires any complainant raising an order-related grievance to verify their Order ID and registered email/10-digit phone number. Anonymous demands, third-party social-media trolls with no purchase record, or complaints refusing to provide the order number and mandatory 360° unboxing video cannot be processed as order claims.',
      ],
    },
    {
      num: '8.5',
      title: '5. Governing law of the Republic of India',
      body: [
        'These Conditions, all policies referenced herein, and every transaction on Bhumivera shall be governed by and construed in accordance with the laws of the Republic of India, without regard to conflict-of-law principles.',
      ],
    },
    {
      num: '8.6',
      title: '6. Binding arbitration clause (Arbitration and Conciliation Act, 1996)',
      body: [
        'If any dispute, controversy, or claim arising out of or relating to these Conditions or a Bhumivera transaction is not resolved within 30 days through the Grievance Redressal Mechanism above, either party may refer the dispute to binding arbitration under the provisions of the Arbitration and Conciliation Act, 1996 (as amended). The arbitration shall be conducted by a sole arbitrator mutually appointed in accordance with the Act. The seat and venue of arbitration shall be in Paschim Bardhaman (Asansol), West Bengal, India, and the proceedings shall be conducted in the English language.',
      ],
    },
    {
      num: '8.7',
      title: '7. Exclusive territorial jurisdiction of courts in West Bengal, India',
      body: [
        'Subject to the arbitration clause above and without prejudice to any non-waivable statutory venue right granted to an individual consumer under the Consumer Protection Act, 2019, the competent courts at Asansol / Paschim Bardhaman, West Bengal, India shall have exclusive territorial jurisdiction over all judicial proceedings arising out of or relating to Bhumivera.',
      ],
    },
    {
      num: '8.8',
      title: '8. Waiver of class actions & consolidated proceedings',
      body: [
        'To the fullest extent permitted by applicable law, all disputes and claims must be brought in the customer’s individual capacity relating to their own verified order, and not as a plaintiff or class member in any purported class, collective, or representative proceeding.',
      ],
    },
    {
      num: '8.9',
      title: '9. Preservation of non-waivable statutory consumer rights',
      body: [
        'Nothing in this dispute-resolution section removes or restricts an individual consumer’s mandatory statutory right to approach a competent Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019 after exhausting our internal grievance redressal channel.',
      ],
    },
  ],
};


export default function Legal() {
  const { sectionSlug } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSection = useMemo(() => {
    if (sectionSlug && SLUG_TO_SECTION[sectionSlug]) {
      return SLUG_TO_SECTION[sectionSlug];
    }
    const raw = (searchParams.get('section') || '').toLowerCase();
    if (raw && (LEGAL_CLAUSES[raw] || raw === 'all')) {
      return raw;
    }
    if (location.hash) {
      const hashClean = location.hash.replace('#', '').replace('legal-part-', '');
      if (LEGAL_CLAUSES[hashClean]) return hashClean;
    }
    return 'terms';
  }, [sectionSlug, searchParams, location.hash]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSection, sectionSlug]);

  const activeProfile = LEGAL_SECTION_PROFILES[selectedSection] || LEGAL_SECTION_PROFILES.terms;

  const activeSectionsToRender = useMemo(() => {
    const baseList =
      selectedSection === 'all' || searchQuery.trim().length > 0
        ? SECTIONS.filter(s => s.id !== 'all')
        : SECTIONS.filter(s => s.id === selectedSection);

    if (!searchQuery.trim()) {
      return baseList.map(sec => ({
        ...sec,
        clauses: LEGAL_CLAUSES[sec.id] || [],
      }));
    }

    const q = searchQuery.toLowerCase().trim();
    return baseList
      .map(sec => ({
        ...sec,
        clauses: (LEGAL_CLAUSES[sec.id] || []).filter(
          c =>
            c.title.toLowerCase().includes(q) ||
            c.num.toLowerCase().includes(q) ||
            c.body.some(p => p.toLowerCase().includes(q))
        ),
      }))
      .filter(sec => sec.clauses.length > 0);
  }, [selectedSection, searchQuery]);

  return (
    <main className="min-h-screen bg-[#070a0e] px-4 py-10 font-sans text-[#e2e8f0] sm:px-8 sm:py-14 selection:bg-[#d4af37]/30 selection:text-white print:bg-white print:p-0">
      <SEO
        title={`${activeProfile.title} | Bhumivera Legal & Anti-Fraud Charter`}
        description={activeProfile.subtitle}
        route={SECTION_TO_PATH[selectedSection] || '/legal'}
      />
      <div className="mx-auto max-w-6xl">
        {/* 1. DYNAMIC DOMAIN-SPECIFIC LEGAL HEADER WITH UNIQUE REAL-LIFE PHOTOGRAPHY */}
        <header className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#0d1520] text-[#e2e8f0] shadow-xl">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-9 lg:p-11">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sub-gold inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-3.5 py-1 text-[10px] tracking-[0.2em] text-[#fce096]">
                  <Scale size={12} className="text-[#d4af37]" /> {activeProfile.code} · Bhumivera Legal Shield
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#cbd5e1]">
                  <ShieldCheck size={12} className="text-[#d4af37]" /> {activeProfile.statuteBadge}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl sm:text-5xl uppercase tracking-wider font-normal leading-tight text-white">
                <span className="font-headline-gold">{activeProfile.title}</span>
              </h1>
              <div className="gold-hairline my-4 max-w-xs" />
              <p className="mt-4 max-w-2xl text-xs leading-6 text-[#cbd5e1] sm:text-sm sm:leading-7">
                {activeProfile.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#94a3b8]">
                <span>Effective &amp; Verified: 17 October 2026</span>
                <span>·</span>
                <span>Charter Version: 2026-10-17-v4X</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-silver-luxury inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#cbd5e1] transition"
                >
                  <Printer size={13} className="text-[#d4af37]" /> Print / Save Official PDF
                </button>
              </div>
            </div>

            {/* Unique Domain-Specific High-Resolution Static Photograph */}
            <div className="relative min-h-[260px] border-t border-white/10 bg-[#070a0e] lg:border-l lg:border-t-0">
              <img
                src={activeProfile.heroImage}
                alt={activeProfile.title}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-[#d4af37]/40 bg-black/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#fce096] backdrop-blur-md">
                {activeProfile.code} · Verified Statutory Dossier
              </div>
            </div>
          </div>

          {/* Domain-Specific Key Metrics Bar */}
          <div className="grid grid-cols-2 gap-px border-t border-[#d4af37]/20 bg-white/10 text-[11px] sm:grid-cols-4">
            {activeProfile.keyMetrics.map(([val, label]) => (
              <div key={label} className="bg-[#070a0e] p-3.5">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#fce096]">{val}</p>
                <p className="mt-1 font-medium text-[#cbd5e1]">{label}</p>
              </div>
            ))}
          </div>
        </header>

        {/* 2. STICKY SECTION NAVIGATION (LINKS TO ALL 8 UNIQUE LEGAL ROUTES) */}
        <div className="sticky top-0 z-20 -mx-4 mt-6 border-b border-[#d4af37]/20 bg-[#070a0e]/95 px-4 py-3.5 backdrop-blur-md sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Legal policy sections" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {SECTIONS.map(section => (
                <Link
                  key={section.id}
                  to={SECTION_TO_PATH[section.id] || `/legal?section=${section.id}`}
                  aria-current={selectedSection === section.id ? 'page' : undefined}
                  onClick={() => setSearchQuery('')}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    selectedSection === section.id
                      ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black font-bold shadow-md'
                      : 'border-white/15 bg-white/5 text-[#cbd5e1] hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  <span className="mr-1.5 font-mono text-[10px] opacity-75">{section.code}:</span>
                  {section.label}
                </Link>
              ))}
            </nav>

            <div className="relative min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any clause, law, unboxing, wallet..."
                aria-label="Search legal clauses"
                className="w-full rounded-lg border border-white/20 bg-[#0d1520] pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 3. REAL-LIFE ILLUSTRATED CASE EXAMPLES FOR THIS SPECIFIC LEGAL LINK */}
        {activeProfile.realLifeExamples && activeProfile.realLifeExamples.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-sub-gold text-[10px] tracking-[0.2em] text-[#fce096] block">
                Real-Life Case Precedents · {activeProfile.code}
              </span>
              <span className="text-xs text-[#94a3b8]">Photographic &amp; Operational Examples</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {activeProfile.realLifeExamples.map((ex) => (
                <article
                  key={ex.caseCode}
                  className="two-tone-card overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] shadow-md transition-all hover:border-[#d4af37]/60"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-[#070a0e]">
                    <img
                      src={ex.image}
                      alt={ex.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="rounded bg-[#070a0e] border border-[#d4af37]/35 px-2.5 py-1 font-mono text-[10px] font-bold text-[#fce096]">
                      {ex.caseCode}
                    </span>
                    <h2 className="mt-3 font-serif text-xl font-bold text-white">{ex.title}</h2>
                    <p className="mt-2 text-xs leading-6 text-[#94a3b8] sm:text-sm">{ex.summary}</p>
                    <div className="mt-4 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] p-3 text-xs font-medium text-[#cbd5e1]">
                      <strong className="text-white">Verified Resolution:</strong> <span className="text-[#fce096]">{ex.outcome}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 4. DETAILED CLAUSE ARTICLES */}
        <div className="mt-8 space-y-10">
          {activeSectionsToRender.length === 0 ? (
            <div className="two-tone-card rounded-xl border border-white/15 bg-[#0d1520] p-8 text-center">
              <p className="font-serif text-xl text-white">No clauses matched &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="btn-gold-luxury mt-4 rounded-lg px-4 py-2 text-xs font-semibold text-white"
              >
                Reset search filter
              </button>
            </div>
          ) : (
            activeSectionsToRender.map(sec => (
              <article
                key={sec.id}
                id={`legal-part-${sec.id}`}
                className="two-tone-card rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] p-6 shadow-md sm:p-9"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-sub-gold text-[10px] tracking-[0.2em] text-[#fce096] block">
                      {sec.code} · BHUMIVERA MASTER LEGAL SUITE
                    </span>
                    <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl font-bold">{sec.label}</h2>
                  </div>
                  <span className="rounded-full border border-white/15 bg-[#070a0e] px-3.5 py-1 font-mono text-[11px] font-bold text-[#fce096]">
                    {sec.clauses.length} Clauses
                  </span>
                </div>

                <div className="space-y-7 text-sm leading-7 text-[#cbd5e1]">
                  {sec.clauses.map(clause => (
                    <section
                      key={clause.num}
                      className="border-l-2 border-[#d4af37]/40 pl-4 transition hover:border-[#d4af37] sm:pl-5"
                    >
                      <div className="flex items-baseline gap-2.5">
                        <span className="rounded bg-[#070a0e] border border-[#d4af37]/40 px-2 py-0.5 font-mono text-[10px] font-bold text-[#fce096]">
                          § {clause.num}
                        </span>
                        <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">
                          {clause.title}
                        </h3>
                      </div>
                      <div className="mt-2.5 space-y-3">
                        {clause.body.map((paragraph, pIdx) => (
                          <p key={pIdx} className="whitespace-pre-line text-[#cbd5e1] leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>

        {/* 5. MASTER PROTECTION MATRIX */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] shadow-md">
          <div className="border-b border-[#d4af37]/20 bg-[#070a0e] px-5 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gavel size={16} className="text-[#fce096]" />
              <h2 className="font-serif text-lg font-bold text-white">
                Quick Statutory &amp; Anti-Fraud Governance Matrix
              </h2>
            </div>
            <span className="font-sub-gold text-[10px] tracking-wider text-[#fce096]">
              Binding Operational Rules Across All Orders
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#070a0e] text-[10px] font-bold uppercase tracking-wider text-[#fce096]">
                  <th className="py-3 px-4">Scenario / Module</th>
                  <th className="py-3 px-4">Binding Bhumivera Rule</th>
                  <th className="py-3 px-4">Required Verification Proof</th>
                  <th className="py-3 px-4">Governing Legal Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[#cbd5e1]">
                {PROTECTION_MATRIX.map(row => (
                  <tr key={row.scenario} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{row.scenario}</td>
                    <td className="py-3.5 px-4 leading-relaxed">{row.policy}</td>
                    <td className="py-3.5 px-4 leading-relaxed text-[#fce096] font-medium">{row.evidence}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#94a3b8]">{row.statute}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
