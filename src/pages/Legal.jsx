import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  Scale,
  Search,
  Printer,
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
  { id: 'orders', code: 'PART II', label: 'Orders, Delivery & Product-Issue Requests', count: 12 },
  { id: 'antifraud', code: 'PART III', label: 'Account Security, Claims & Reviews', count: 10 },
  { id: 'referrals', code: 'PART IV', label: 'Wallet, Loyalty, Spin & Referral Governance', count: 10 },
  { id: 'warranty_affiliate', code: 'PART V', label: 'Product Verification, Affiliate & B2B Terms', count: 10 },
  { id: 'privacy', code: 'PART VI', label: 'Privacy Notice & DPDP Act 2023 Governance', count: 11 },
  { id: 'ip_disclaimer', code: 'PART VII', label: 'Medical Disclaimer, IP & Liability Cap', count: 10 },
  { id: 'grievance', code: 'PART VIII', label: 'Grievance & Customer Support', count: 9 },
  { id: 'all', code: 'MASTER', label: 'View All 88 Clauses (Full Agreement)', count: 88 },
];

const LEGAL_CLAUSES = {
  terms: [
    {
      num: '1.1',
      title: '1. Who these terms cover & binding electronic contract',
      body: [
        '“Bhumivera”, “we”, “us” and “our” refer to the Bhumivera platform and brand. Bhumivera Organics India Private Limited (CIN U20237WB2026PTC295842) was incorporated on August 4, 2026, and was founded by Akash Prasad. Its directors are Akash Prasad, Payal Prasad, and Aman Prasad; its business address is G.T. Road, Gopalpur, Asansol, West Bengal 713304, India. The family-business heritage includes MPG E-Business Private Limited (CIN U74999WB2016PTC217735), incorporated on September 22, 2016, founded by Dilip Prasad Nonia, at 608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, West Bengal 713305, India. MPG E-Business Private Limited is identified here as a heritage entity and is not automatically the seller for an order. For a purchase, the seller is the legal entity named on the product listing and order invoice (“Seller”). The Seller’s identity and contact information must be shown before an order is placed. These Conditions apply to use of the platform and purchases where accepted during account creation or checkout.',
        'These Conditions are read together with the product listing, checkout price and delivery disclosures, and the order invoice. If a term conflicts with a non-waivable right under applicable law, the law prevails. Nothing here makes access to a statutory consumer remedy conditional on first using an internal support process.',
      ],
    },
    {
      num: '1.2',
      title: '2. Eligibility, legal capacity and account security',
      body: [
        'The account holder and purchaser must be an adult legally competent to contract. A parent or lawful guardian must place and manage any order for a minor. Do not create an account in a minor’s name.',
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
      title: '4. Cosmetic-use guidance and individual reactions',
      body: [
        'Individual reactions to cosmetic ingredients vary. Read the product label and directions before use; where the label recommends it, test a small area first. Stop use and seek qualified medical advice if you experience a reaction.',
        'Nothing in this notice excludes or limits a remedy or liability that cannot lawfully be excluded, including for a product defect, misleading information, or failure to meet applicable safety requirements.',
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
      title: '6. Order offer, acceptance & Pre-dispatch cancellation rule',
      body: [
        'Submitting an order is an offer to purchase. Order confirmation, stock availability, and any cancellation by the Seller will be communicated through the order channel. If the Seller cancels an order after payment, any amount due back will be returned as required by law.',
        'You may request cancellation through your account or customer support. Whether an order can still be stopped depends on its fulfilment status. A packed or dispatched order may no longer be cancellable, but this operational limit does not remove any remedy available under applicable law.',
      ],
    },
    {
      num: '1.7',
      title: '7. Cash-on-Delivery (COD) governance & refusal countermeasures',
      body: [
        'Cash-on-Delivery (COD) is a privilege extended for customer convenience on eligible pin codes and order values. Placing a COD order creates a binding contractual commitment to accept delivery and tender the exact invoice amount upon courier arrival.',
        'Please place a COD order only when you intend to receive it. We may restrict COD availability for an account after repeated unexplained refusals or suspected misuse, following a reasonable review. Any restriction will not affect an existing order, an earned cash balance, or a statutory right.',
      ],
    },
    {
      num: '1.8',
      title: '8. Coupons, cart promotions, loyalty and dual-ledger wallets',
      body: [
        'Coupons and cart-rule offers are subject to their displayed minimum order value, validity window, customer eligibility, usage limits, and stacking rules enforced server-side at checkout. Promotional codes have zero cash value, cannot be sold or transferred, and cannot be applied retroactively after an order is placed.',
        'Wallet balances and promotional rewards may have different uses and restrictions, which will be shown in the account and at checkout. A promotional credit is not a substitute for a refund or other remedy required by law. Any cash balance or amount due will be handled under the applicable order terms and law.',
        'Reward rates, caps, eligibility, crediting time, and redemption rules are shown in the applicable offer, account, or checkout before use. If a promotion’s terms differ from a general description here, the specific terms shown with that promotion govern, subject to applicable law.',
      ],
    },
    {
      num: '1.9',
      title: '9. Loyalty matrix: earning, tiers and redemption',
      body: [
        'The applicable earning rate, point conversion, redemption minimums and limits, tiers, and benefits are shown in the account or checkout when available. Check those details before redeeming; points are promotional unless the offer states otherwise. We will not apply a points adjustment to reduce a refund below an amount required by law.',
        'Cancelled or refunded orders may result in an adjustment to points or benefits earned from that order under the terms shown when they were earned. We will explain material adjustments and provide a way to ask for review.',
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
        'Submit only content you have the right to share. We may host and display a review or other content within the service for the purpose for which you submitted it, subject to applicable law. We will seek separate permission before using customer-submitted content in off-platform advertising unless another lawful basis applies.',
        'We may moderate content that violates law or these rules, but will not remove or suppress a good-faith opinion merely because it is critical. Do not include another person’s personal information without permission.',
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
      title: '14. Institutional wholesale, B2B retail and supplier enquiries',
      body: [
        'Submitting an enquiry regarding institutional B2B retail dealership, luxury spa back-bar supply, raw botanical cultivation, or contract manufacturing does NOT create an automatic commercial contract, employment relationship, agency, or franchise. No commercial arrangement is valid unless executed in a formal written agreement signed by authorized signatories of the legal entity. Never pay any unauthorized registration or material fee based on informal phone or chat messages.',
      ],
    },
    {
      num: '1.15',
      title: '15. Service availability, limitation of liability and changes',
      body: [
        'The platform may occasionally be unavailable or affected by third-party service interruptions. Nothing in these Conditions excludes or caps a liability or remedy where applicable law does not permit that exclusion or cap.',
        'We may update these Conditions when our services or legal obligations change. The version shown on this page applies from its stated update date; material changes to an existing service or program will be communicated where required by law. A change does not retrospectively remove an accrued right.',
      ],
    },
    {
      num: '1.16',
      title: '16. Consumer law compliance & severability',
      body: [
        'These Conditions do not replace applicable consumer, product-safety, data-protection, tax, or other statutory requirements. If a provision cannot lawfully be enforced, it will not limit the remaining provisions or any non-waivable right.',
      ],
    },
  ],

  orders: [
    {
      num: '2.1',
      title: '1. Dispatch cutoffs (14:00 IST), delivery estimates and tracking',
      body: [
        'Available delivery tiers (Standard and Premium), shipping charges, free-shipping thresholds, and estimated delivery windows are displayed at checkout. Orders confirmed before 2:00 PM (14:00) IST are scheduled for same-day or next-business-day warehouse processing; orders placed after 2:00 PM IST begin processing the following business day.',
        'Delivery dates shown on product pages and checkout are estimates unless explicitly stated as a guaranteed service. Weather, holidays, or carrier delays may affect delivery. This does not limit any remedy available under applicable law. Keep your registered phone number reachable for carrier coordination.',
      ],
    },
    {
      num: '2.2',
      title: '2. Change-of-mind returns and product-issue requests',
      body: [
        'For hygiene reasons, we do not accept change-of-mind returns of sealed personal-care products unless a product listing says otherwise. This does not prevent you from reporting a defective, damaged, leaking, incorrect, missing, materially misdescribed, or otherwise legally eligible item, or limit any remedy required by law.',
        'Product verification features, where available, provide only the information described on the verification page. They do not replace a customer’s statutory rights or independently certify a product beyond the records expressly shown.',
      ],
    },
    {
      num: '2.3',
      title: '3. Review process and available remedies',
      body: [
        'Contact customer support if an order arrives damaged, leaking, incorrect, incomplete, or materially different from its listing. We will review the information and explain the next steps and any remedy available under the order terms and applicable law.',
        'Depending on the circumstances and applicable law, resolution may include a replacement, repair, refund, or another appropriate remedy. We will tell you if an item needs to be returned and how to do so.',
      ],
    },
    {
      num: '2.4',
      title: '4. Prompt reporting and optional supporting information',
      body: [
        'Please report an issue as soon as reasonably possible so we can investigate while order and carrier information is available. Photographs, packaging, labels, or an unedited unboxing video may help, if available, but a missing video or a report made after 48 hours will not by itself waive a right or automatically decide a claim.',
        'We may ask for information reasonably needed to assess a claim. We will consider the circumstances and available evidence fairly, including where a customer could not record an unboxing video.',
      ],
    },
    {
      num: '2.5',
      title: '5. Records used to review a product or delivery issue',
      body: [
        'We may use order, fulfilment, carrier, and payment records that are available to investigate a reported issue. Records are considered along with the customer’s account and other available evidence; no internal record is conclusive solely because it is held by the Seller.',
      ],
    },
    {
      num: '2.6',
      title: '6. Prepaid order refunds & atomic wallet ledger reconciliation',
      body: [
        'If a refund is approved or required, we will confirm the amount and refund method. Refunds will be made through the payment method or another method permitted by applicable law and agreed for the case. The time for a payment provider or bank to post the refund may vary; we will share any available transaction reference.',
        'Any eligible wallet or promotional-credit restoration will be explained separately. Promotional credits are not a substitute for a cash refund where a cash refund is required by law.',
      ],
    },
    {
      num: '2.7',
      title: '7. Circumstances considered during a product-issue review',
      body: [
        'A claim may be affected by evidence of misuse or damage after delivery, alteration, or purchase from an unauthorized seller. We will assess the facts of each case. No exclusion in this section limits a mandatory legal remedy or any express product warranty.',
      ],
    },
    {
      num: '2.8',
      title: '8. Address accuracy, Google Maps pinpoint & failed delivery re-dispatch',
      body: [
        'Please provide a complete delivery address and reachable contact details. If a delivery fails or a parcel returns to origin, we will contact you about the next steps. Any charge or deduction will be disclosed, supported by the applicable order terms, and applied only where permitted by law.',
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
      title: '10. Product warranty and serial-registration scope',
      body: [
        'Where a product carries a stated warranty period, coverage is governed by the duration and terms displayed on its product page. The product verification page only checks whether a serial number matches an issued record; it does not activate or extend warranty coverage. Optional photos or video do not replace or limit a remedy required by law.',
      ],
    },
    {
      num: '2.11',
      title: '11. Promotional gifts, freebies & bundle adjustments on partial claims',
      body: [
        'If a partial cancellation or refund affects a bundle, gift, coupon, or threshold offer, we will explain any adjustment using the offer terms disclosed when the order was placed. An adjustment will not reduce a refund below an amount required by law.',
      ],
    },
    {
      num: '2.12',
      title: '12. Safe order support communication rules',
      body: [
        'When contacting support regarding an order, include your order number, registered email or phone, and a description of the issue. Photos or video may help but are optional. Never transmit passwords, OTPs, CVV numbers, or UPI PINs.',
      ],
    },
  ],

  antifraud: [
    {
      num: '3.1',
      title: '1. Review of suspected fraud or account abuse',
      body: [
        'We may investigate suspected deliberate fraud, account abuse, or tampering using information reasonably relevant to the matter. A customer’s good-faith complaint, request for a remedy, review, payment dispute, or report to a regulator is not by itself evidence of fraud.',
      ],
    },
    {
      num: '3.2',
      title: '2. Optional supporting information for delivery issues',
      body: [
        'Photos, packaging, labels, or an unedited unboxing video may help us understand a delivery issue. They are optional supporting information, not a mandatory condition for contacting us or exercising a legal right. We will consider other reasonably available information if a video is unavailable.',
      ],
    },
    {
      num: '3.3',
      title: '3. Payment disputes and account review',
      body: [
        'Customers may contact their bank, payment provider, or relevant authority about a payment or account concern. We may respond to a payment dispute with relevant transaction and fulfilment information where lawful. We will not treat a good-faith dispute as fraud or automatically impose a fee, seize a cash balance, or waive a customer’s rights.',
        'Where we have reasonable evidence of deliberate fraud, we may review the account and take proportionate action consistent with applicable law. Any claim for loss or legal costs must be established through the process required by law; it is not automatically owed merely because a dispute was raised.',
      ],
    },
    {
      num: '3.4',
      title: '4. Referral, coupon, spin-the-wheel & Sybil multi-account countermeasures',
      body: [
        'Creating accounts or transactions to obtain a promotion through impersonation, self-referral, or deliberate circumvention of its published limits is prohibited. A shared device, household, address, or network connection alone does not establish abuse.',
        'We may review and temporarily pause a disputed promotional credit while checking credible evidence. If a credit is reversed, we will give a reason and a way to ask for review. Earned cash balances and statutory rights are not forfeited by this clause.',
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
      title: '6. Reviews, complaints, and public feedback',
      body: [
        'Customers and creators may publish honest opinions, raise good-faith complaints, request remedies, and contact consumer authorities. We may address knowingly false statements or unlawful threats through appropriate lawful channels, but will not retaliate against a person merely for criticism or for asserting a legal right.',
      ],
    },
    {
      num: '3.7',
      title: '7. Official communication channels & anti-phishing warning',
      body: [
        'Use the contact details published on the website or your order documents. We will not ask you to disclose a password, UPI PIN, card security code, or one-time passcode to receive a refund. Treat requests to install remote-access software or pay an unrelated third party to release a refund as suspicious.',
      ],
    },
    {
      num: '3.8',
      title: '8. Records used to review a concern',
      body: [
        'We may retain order, payment, support, and account records for business, security, and legal purposes. Any record may be considered with other evidence, subject to the applicable rules of the court, authority, or dispute-resolution body. Nothing in these Conditions predetermines whether evidence is authentic or admissible.',
      ],
    },
    {
      num: '3.9',
      title: '9. Account restrictions and review',
      body: [
        'If there is credible evidence of account compromise, material misuse, or a safety risk, we may restrict or suspend affected features while reviewing the matter. Where practicable, we will explain the reason and provide a contact route for review. Any action will be proportionate and will not remove a cash balance or statutory right except as permitted by law.',
      ],
    },
    {
      num: '3.10',
      title: '10. Suspected unlawful conduct',
      body: [
        'Where we have credible evidence of conduct that may violate the law, we may preserve relevant information and report it to the appropriate authority as permitted or required by law. Authorities decide whether an offence occurred and what action is appropriate.',
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
        'A referral claim may remain pending while account and eligibility checks are completed. A review indicator is not, on its own, proof of abuse. If a claim is declined or reversed, the participant may contact support to request a review.',
      ],
    },
    {
      num: '4.3',
      title: '3. Restricted referral balance vs. spendable Wallet funds',
      body: [
        'Any referral reward, its value, eligible participant, use, expiry, and redemption limits are those disclosed in the offer when it is presented. A promotional discount is not a cash balance unless the offer or applicable law says otherwise. We will show material restrictions before a participant accepts or earns the offer.',
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
      title: '5. Shopping Wallet Rewards (10% repeat buyer / 15% first order)',
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
        'If an order is cancelled or refunded, rewards tied to that order may be adjusted in accordance with the terms shown when the reward was offered. A promotional adjustment will not reduce a refund below the amount required by law.',
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
        'Participants are responsible for understanding their tax obligations. Bhumivera will make any deduction, withholding, or reporting required of it by applicable law; a participant remains responsible for any other obligation that applies to them.',
      ],
    },
    {
      num: '4.10',
      title: '10. Administrative right to modify, pause or terminate programs',
      body: [
        'We may change or end a promotional program prospectively. We will honor rewards already earned under the terms that applied when they were earned, except where an adjustment is required by law or following a substantiated abuse review with an opportunity to ask for reconsideration.',
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
      title: '4. Promoter application, attribution & commission calculation',
      body: [
        'Applying to or browsing the Bhumivera Creator Program page does not appoint you as an agent, employee, or commercial partner. Only an approved, active account may share a promoter code. The customer discount and contribution-profit share for that account are the rates displayed in its dashboard and may differ by partner.',
        'A promoter code may be stored in a customer’s browser for up to 30 days, and a later valid code may replace it. Self-referrals are not eligible. Commission is calculated on eligible delivered orders using the rate and order-economics method displayed to the creator before participation. The dashboard shows an order-level calculation; product costs may be aggregated and supplier identities or invoices are not disclosed.',
        'Commissions are subject to the status and adjustment rules shown in the creator’s separate agreement or program terms. Cancelled, refunded, or otherwise ineligible orders may be reversed under those terms. Payout timing, payment method, tax documentation, and any withholding must be stated in the applicable creator agreement before the creator accepts a campaign; earnings are not guaranteed.',
        'Before a creator accepts a campaign or starts work, the parties must have a written campaign brief or agreement stating the deliverables, compensation and payout timing, attribution and reversal rules, any tax withholding, gifted products or expenses, content usage rights, and campaign dates. Applying does not require a creator to publish content or accept an undisclosed term. Product gifting is campaign-specific; no fixed nature contribution is promised unless a campaign documents it.',
        'Creators must make truthful, substantiated statements and disclose material connections such as payment, commission, or gifts. A creator may share an honest opinion or raise a good-faith concern. We may seek a correction or end a campaign for a substantiated material breach, but will not use this clause to suppress criticism or prevent a creator from exercising a lawful right.',
      ],
    },
    {
      num: '5.5',
      title: '5. Strict compliance with advertising & cosmetic laws by affiliates',
      body: [
        'Creators must clearly disclose material connections such as payment, commission, gifts, or other benefits, using disclosures required by applicable law, advertising guidance, and the platform on which content appears. Product statements must be truthful, supported, and consistent with approved product information. Creators must not make unsupported medical, therapeutic, or guaranteed-result claims.',
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
      title: '7. Institutional B2B Supply & Raw Botanical Procurement Notice',
      body: [
        'Our Institutional B2B & Supplier desk (`/sell-on-bhumivera` and `/contact`) provides a formal channel for traceable raw botanical growers, analytical testing laboratories, and luxury retail boutiques to request written B2B procurement terms. Bhumivera strictly warns the public NEVER to pay any cash deposit, registration fee, or raw-material fee to any individual based on verbal phone or WhatsApp promises without a signed written contract from the registered legal entity.',
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
      title: '10. Ending a creator relationship',
      body: [
        'We may pause or end a creator relationship for a material breach after reviewing the available information and, where appropriate, giving notice and an opportunity to respond. Earned and undisputed commissions will be paid under the agreement; a dispute or criticism alone does not forfeit a creator’s payment or legal rights.',
      ],
    },
  ],

  privacy: [
    {
      num: '6.1',
      title: '1. Who is responsible and what personal data we collect',
      body: [
        'Bhumivera is responsible for personal data it determines to process through this website, mobile applications and customer-service channels. We collect information you provide directly, information generated when you use account or shopping features, and limited technical information needed to deliver and protect the service. We aim to ask only for information relevant to the interaction you choose.',
        'Depending on what you use, this may include your name, email address, phone number, login and account-security records, delivery and billing details, order contents and history, payment or refund references, cart and wishlist contents, loyalty or referral activity, product questions, support conversations, reviews and media you submit, and your recorded privacy or marketing choices. Do not include passwords, one-time codes, payment PINs or other secrets in support messages.',
        'When you use a passkey, the platform may receive and retain the public credential needed to verify it; the private key remains with your device or credential provider. We do not need your biometric template to verify a passkey. Payment providers may handle payment credentials directly; Bhumivera receives the transaction information needed to confirm, fulfil, refund or reconcile the payment.',
      ],
    },
    {
      num: '6.2',
      title: '2. Technical information, diagnostics and local storage',
      body: [
        'We may process technical and diagnostic information, such as device/browser details, security events, request metadata, and error records, to operate the service, troubleshoot failures, and protect accounts. We do not use this information for advertising unless we clearly disclose that use and obtain any consent required by law. We retain it only as long as reasonably needed for those purposes and applicable legal obligations, then delete or de-identify it where practicable.',
        'Our website and browser storage may keep information needed for sign-in, cart continuity, saved preferences, security and essential operation. Your browser controls whether local storage or cookies can be stored, but blocking them may prevent account, checkout or security features from working. Hosting, network-security and payment providers may independently process technical connection data under their own services and policies.',
      ],
    },
    {
      num: '6.3',
      title: '3. Why we use your data and the choices that govern it',
      body: [
        'We use personal data for specific service purposes: to create and secure accounts; maintain carts and wishlists; accept and fulfil orders; communicate delivery, payment, refund and support updates; issue invoices and maintain required financial records; administer a benefit or warranty you request; moderate customer-submitted content; prevent fraud and protect the platform; and meet legal obligations. We do not treat an optional marketing or personalization choice as a condition of buying a product.',
        'Where consent is the basis for an optional use, we will present the choice separately and use the information for the stated purpose. Where processing is necessary to provide a service you request or is otherwise permitted or required by applicable law, we may process it for that limited reason. If a requested detail is necessary to complete an order or verify an account, not providing it may mean we cannot complete that action.',
      ],
    },
    {
      num: '6.4',
      title: '4. Optional product recommendations and personalization',
      body: [
        'Personalized first-party product recommendations are optional and separate from account registration, order fulfilment and promotional email consent. If you opt in, we may use your Bhumivera purchases, wishlist items, approved reviews and product views to tailor recommendations on our own platform. We do not describe this as medical, biometric or health profiling.',
        'You can turn this choice off in your Profile. Once the change is accepted, we stop using the opt-in recommendation feature and remove stored product-view signals associated with that feature, subject to technical processing time and any record we must retain by law. Your past purchases and tax records are not erased merely because you turn recommendations off.',
      ],
    },
    {
      num: '6.5',
      title: '5. Marketing choices and essential service messages',
      body: [
        'We send promotional email campaigns only where you have opted in. You may withdraw that choice through your Profile or the unsubscribe control in a marketing email. We will apply the change to future promotional sends as promptly as our systems allow; a message already queued or sent before the change may still arrive.',
        'Marketing opt-out does not disable essential messages about authentication, account security, an order you placed, delivery, payment, refunds, invoices or a support request. These are service communications, not promotional campaigns. We do not add marketing content to a message in a way that defeats your opt-out.',
      ],
    },
    {
      num: '6.6',
      title: '6. Payment information and payment providers',
      body: [
        'Online payments are handled through the payment method and provider presented at checkout. We receive transaction status and references needed to confirm an order, handle a refund, reconcile accounts and respond to payment disputes. Payment providers may collect payment credentials directly and process them under their own privacy notices and applicable requirements.',
        'Never send a card security code, UPI PIN, password or one-time passcode to Bhumivera by email, chat or phone. We will not ask you to disclose those credentials to receive a refund. If you believe a payment credential has been exposed, contact your bank or payment provider immediately.',
      ],
    },
    {
      num: '6.7',
      title: '7. When information is shared and how we limit disclosure',
      body: [
        'We do not sell personal data to data brokers. We disclose information only as needed to provide the feature or service, protect users and the platform, or comply with law. Recipients may include couriers (delivery name, address, phone and shipment details), payment providers and banks (transaction references), hosting and storage providers, and email, SMS or OTP delivery providers. These providers receive only the information reasonably required for their assigned service.',
        'We may also disclose relevant information to a court, regulator, tax authority, law-enforcement agency or other person when required by applicable law or valid legal process, or when necessary to investigate suspected fraud, protect safety or enforce our rights. We do not authorize a service provider to use customer data for its own unrelated advertising. Where another business acts as an independent controller or fiduciary, its own notice also applies.',
      ],
    },
    {
      num: '6.8',
      title: '8. Security, access controls and incident response',
      body: [
        'We use administrative access controls and technical safeguards designed to reduce the risk of unauthorized access, alteration, loss or disclosure. Access is limited according to operational responsibilities, and authentication and security events may be reviewed to protect accounts and investigate incidents. We require personnel and service providers who handle information for us to protect it and use it only for their assigned purpose.',
        'No website, transmission method or storage system can be guaranteed completely secure. We therefore cannot promise that a breach or service interruption is impossible. If an incident affects personal data, we will investigate, take reasonable containment and remediation steps, and provide notices to affected people or authorities when required by applicable law.',
      ],
    },
    {
      num: '6.9',
      title: '9. Retention, deletion and account closure',
      body: [
        'We keep account information while your account is active and while it is needed to provide the services you use. We retain order, payment, invoice, tax and accounting records for the period required by applicable law, and may preserve relevant records longer where needed to resolve a dispute, prevent fraud or establish or defend a legal claim.',
        'When information is no longer needed, we aim to delete it or remove its association with you in accordance with our retention practices. Closing an account or asking us to erase data does not require us to delete records we are legally required to retain; any such retained information remains restricted to that legal or protective purpose. Backups and system logs may take time to cycle out.',
      ],
    },
    {
      num: '6.10',
      title: '10. Your privacy rights and how to exercise them',
      body: [
        'Subject to the Digital Personal Data Protection Act, 2023 and other applicable law, you may request access to information about personal data we process, correction or updating of inaccurate information, erasure where retention is no longer required, withdrawal of consent for processing based on consent, and grievance redressal. You may also nominate another person to exercise rights in the circumstances permitted by law.',
        'Contact support@bhumivera.com from your registered email address and describe the right you wish to exercise. We may ask for proportionate information to verify your identity and protect your account; do not send a password, OTP, payment PIN or full payment credential. We will review the request, respond within the time required by applicable law, explain any lawful reason we cannot fully comply, and provide an escalation route if you remain dissatisfied. Withdrawal applies prospectively and does not invalidate processing already lawfully completed.',
      ],
    },
    {
      num: '6.11',
      title: '11. Children’s data, policy updates and contact',
      body: [
        'Our account and shopping services are intended for adults. A parent or lawful guardian must create and manage any account or order needed for a minor. If you believe a minor has provided personal data in a way that is not permitted, contact us so we can review and take any action required by law.',
        'We may revise this Notice when our services, data practices or legal obligations change. The latest version and its effective date will appear on this page. Material changes will be communicated through an appropriate channel where required. For privacy requests or concerns, email support@bhumivera.com from your registered address; never include passwords or OTPs. This Notice is intended to explain our practices, not to limit rights that cannot be waived under applicable law.',
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
      title: '7. Liability and statutory remedies',
      body: [
        'Nothing in these Conditions excludes or caps liability, or limits a remedy, where applicable law does not permit that exclusion or cap. This includes any mandatory consumer remedy, product-safety obligation, or liability for conduct that cannot lawfully be disclaimed.',
      ],
    },
    {
      num: '7.8',
      title: '8. No blanket exclusion of legally recoverable loss',
      body: [
        'Any assessment of loss or damages is governed by applicable law and the facts of the claim. This section does not exclude a category of loss where that exclusion would be unlawful.',
      ],
    },
    {
      num: '7.9',
      title: '9. Responsibility for unlawful conduct',
      body: [
        'A person remains responsible for their own unlawful conduct and for losses that a competent authority or court determines they caused. This clause does not require a customer to indemnify the Seller for the Seller’s own conduct or waive any consumer right.',
      ],
    },
    {
      num: '7.10',
      title: '10. Force Majeure',
      body: [
        'Events beyond reasonable control may delay a service or delivery. We will take reasonable steps to resume performance and communicate material delays. This clause does not waive a refund, cancellation, or other remedy required by law.',
      ],
    },
  ],

  grievance: [
    {
      num: '8.1',
      title: '1. Mandatory 3-Tier internal escalation & pre-litigation resolution',
      body: [
        'You may contact customer support or the designated grievance officer using the details below. We encourage you to provide an order number if the issue relates to a purchase, but you do not have to complete an internal escalation process before using a consumer forum, bank/payment-provider dispute process, or other remedy available under law. Photos or video may assist a review but are not a prerequisite to raise a grievance.',
      ],
    },
    {
      num: '8.2',
      title: '2. Statutory Grievance Officer & Nodal Entity disclosure',
      body: [
        'For a grievance, email support@bhumivera.com with “GRIEVANCE” in the subject, or use the Contact page. Include an order number if relevant, but do not send passwords, one-time codes, payment PINs, or card security codes.',
        'The legal seller and its designated grievance officer’s full name, business address, and contact details must be clearly displayed on the relevant product listing and order documents. These details need to be verified and published by the Seller; the brand contact above is not a substitute for that statutory disclosure.',
      ],
    },
    {
      num: '8.3',
      title: '3. Statutory 48-hour acknowledgement & 30-day resolution timeline',
      body: [
        'We will acknowledge consumer grievances within 48 hours and seek to redress them within one month, as required by applicable e-commerce rules. Service outages or internal technical issues do not waive a consumer’s rights or extend a statutory deadline.',
      ],
    },
    {
      num: '8.4',
      title: '4. Verification of genuine buyer status to prevent vexatious claims',
      body: [
        'We may ask for information reasonably necessary to understand a grievance or verify an account before disclosing account-specific information. A missing order number, unboxing video, or purchase record will not by itself prevent us from receiving a complaint or considering other available information.',
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
      title: '6. Dispute resolution',
      body: [
        'We welcome good-faith discussion to resolve concerns. No consumer is required by these Conditions to arbitrate a dispute, waive a right to approach a competent consumer authority, or give up a remedy available under applicable law. Arbitration may be used only where separately and validly agreed by the parties after a dispute arises or where otherwise required by law.',
      ],
    },
    {
      num: '8.7',
      title: '7. Governing law and competent forums',
      body: [
        'Indian law applies to these Conditions. Any dispute may be taken to a court, consumer commission, regulator, or other forum that has jurisdiction under applicable law. These Conditions do not require a consumer to bring a claim only in Asansol or West Bengal.',
      ],
    },
    {
      num: '8.8',
      title: '8. No waiver of collective or statutory remedies',
      body: [
        'Nothing in these Conditions prevents a person from using any representative, collective, or other procedure that is available under applicable law.',
      ],
    },
    {
      num: '8.9',
      title: '9. Preservation of non-waivable statutory consumer rights',
      body: [
        'Nothing in these Conditions limits a consumer’s right to approach a competent Consumer Disputes Redressal Commission or another authority under applicable law. Using our internal grievance channel is optional and is not a precondition to that right.',
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
        title={`${activeProfile.title} | Bhumivera Policies & Terms`}
        description={activeProfile.subtitle}
        route={SECTION_TO_PATH[selectedSection] || '/legal'}
      />
      <div className="mx-auto max-w-6xl">
        {/* 1. DYNAMIC DOMAIN-SPECIFIC LEGAL HEADER */}
        <header className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#0d1520] text-[#e2e8f0] shadow-xl">
          <div>
            <div className="p-6 sm:p-9 lg:p-11">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sub-gold inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-3.5 py-1 text-[10px] tracking-[0.2em] text-[#fce096]">
                  <Scale size={12} className="text-[#d4af37]" /> {activeProfile.code} · Bhumivera Policies
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
                <span>Updated: 15 November 2026</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-silver-luxury inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#cbd5e1] transition"
                >
                  <Printer size={13} className="text-[#d4af37]" /> Print / Save
                </button>
              </div>
            </div>
          </div>

        </header>

        <p className="mt-5 rounded-xl border border-amber-300/30 bg-amber-950/20 px-4 py-3 text-xs leading-6 text-amber-100">
          These policies explain our current practices; they are not a guarantee against disputes and do not limit rights or remedies that cannot lawfully be waived.
        </p>

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

        {/* Detailed policy clauses */}
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
                      {sec.code} · BHUMIVERA POLICIES
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

      </div>
    </main>
  );
}
