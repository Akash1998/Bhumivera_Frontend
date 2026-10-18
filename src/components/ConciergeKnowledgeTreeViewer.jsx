import React, { useState, useMemo } from 'react';
import {
  Search,
  Lock,
  ShoppingBag,
  Truck,
  RotateCcw,
  CreditCard,
  Leaf,
  Gift,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Sparkles,
  Star,
  ChevronRight,
  X,
  Package,
  ShieldCheck,
  Info,
  CheckCircle2,
  Percent,
  Clock,
  Mail,
} from 'lucide-react';
import {
  MASTER_PILLARS,
  KNOWLEDGE_TREE_NODES,
  searchKnowledgeTree,
  getNodesByPillar,
  getNodeById,
} from '../data/bhumiveraKnowledgeTree';

const PILLAR_ICON_MAP = {
  ShoppingBag,
  Lock,
  Truck,
  RotateCcw,
  CreditCard,
  Leaf,
  Gift,
  PhoneCall,
};

export default function ConciergeKnowledgeTreeViewer({
  isDark = true,
  searchQuery = '',
  setSearchQuery,
  onNavigate,
  onOpenVerification,
  onAddToCart,
}) {
  const [activePillarId, setActivePillarId] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchKnowledgeTree(searchQuery);
  }, [searchQuery]);

  // Active Node Object
  const activeNode = useMemo(() => {
    if (!activeNodeId) return null;
    return getNodeById(activeNodeId);
  }, [activeNodeId]);

  // Active Pillar Object
  const activePillar = useMemo(() => {
    if (!activePillarId) return null;
    return MASTER_PILLARS.find(p => p.id === activePillarId) || null;
  }, [activePillarId]);

  // Nodes for the currently selected pillar
  const pillarNodes = useMemo(() => {
    if (!activePillarId) return [];
    return getNodesByPillar(activePillarId);
  }, [activePillarId]);

  // Handlers
  const handleSelectNode = nodeId => {
    setActiveNodeId(nodeId);
    if (setSearchQuery) setSearchQuery('');
  };

  const handleBack = () => {
    if (activeNodeId) {
      setActiveNodeId(null);
    } else if (activePillarId) {
      setActivePillarId(null);
    }
  };

  const handleCopyCoupon = (code = 'WELCOME10') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleAddProductToCart = async product => {
    if (!onAddToCart || product.inStock === false) return false;
    const added = await onAddToCart(product);
    if (!added) return false;
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
    return true;
  };

  const handleDirectAction = action => {
    if (action.actionType === 'NAVIGATE' && onNavigate && action.target) {
      onNavigate(action.target);
    } else if (action.actionType === 'OPEN_ESCALATION' && onOpenVerification) {
      onOpenVerification();
    } else if (action.actionType === 'VIEW_NODE' && action.target) {
      handleSelectNode(action.target);
    } else if (action.actionType === 'ADD_TO_CART' && action.payload) {
      void handleAddProductToCart(action.payload);
    } else if (action.actionType === 'BUY_NOW' && action.payload) {
      void handleAddProductToCart(action.payload).then(added => {
        if (added && onNavigate) onNavigate('/checkout');
      });
    }
  };

  // =========================================================================
  // 1. LIVE SEARCH RESULTS VIEW (When user is typing in the finder bar)
  // =========================================================================
  if (searchQuery.trim().length > 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-current/10">
          <div className="flex items-center gap-2 text-xs">
            <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-semibold text-stone-300">
              Instant Knowledge Results for <span className="text-[#D4AF37]">"{searchQuery}"</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery && setSearchQuery('')}
            className="text-[10px] text-stone-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10"
          >
            Clear Search
          </button>
        </div>

        {searchResults.length === 0 ? (
          <div className="p-6 text-center rounded-2xl border border-dashed border-[#D4AF37]/30 my-4 bg-white/5">
            <Info className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 opacity-80" />
            <h4 className="font-serif text-sm font-semibold">No direct card match for "{searchQuery}"</h4>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              Browse our 8 master categories below or schedule a verified specialist callback.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectNode('account_forgot_password_guide')}
                className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B2419] transition-all"
              >
                🔐 Forgot Password Guide
              </button>
              <button
                type="button"
                onClick={() => handleSelectNode('orders_track_my_order')}
                className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B2419] transition-all"
              >
                🚚 Track My Order
              </button>
              <button
                type="button"
                onClick={() => handleSelectNode('product_sea_buckthorn_facewash')}
                className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B2419] transition-all"
              >
                🌿 Sea Buckthorn Face Wash
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {searchResults.map(node => (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectNode(node.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 group ${
                  isDark
                    ? 'bg-[#10241f]/70 border-white/10 hover:border-[#D4AF37] hover:bg-[#10241f]'
                    : 'bg-white border-stone-200 hover:border-[#0B2419] hover:shadow-md'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      {node.badge || 'Verified Solution'}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-stone-100 group-hover:text-[#D4AF37] transition-colors mt-1">
                    {node.title}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {node.summary}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all self-center shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. DETAILED KNOWLEDGE CARD VIEW (When a specific card is selected)
  // =========================================================================
  if (activeNode) {
    const parentPillar = MASTER_PILLARS.find(p => p.id === activeNode.pillarId);

    return (
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-current/10">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {activePillarId ? parentPillar?.shortTitle || 'Category' : 'Concierge Menu'}</span>
          </button>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            {parentPillar?.shortTitle || 'Concierge'}
          </span>
        </div>

        {/* Card Header & Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-transparent border border-[#D4AF37]/30 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30">
              {activeNode.badge}
            </span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-100 mt-2">
            {activeNode.title}
          </h3>
          <p className="text-xs text-stone-300 mt-1 leading-relaxed">
            {activeNode.summary}
          </p>
        </div>

        {/* VISUAL STEP-BY-STEP WORKFLOW (FORGOT PASSWORD & PROCEDURES) */}
        {activeNode.visualSteps && activeNode.visualSteps.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Step-by-Step Resolution Guide</span>
            </div>

            <div className="space-y-2">
              {activeNode.visualSteps.map(step => (
                <div
                  key={step.stepNumber}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isDark ? 'bg-[#0f241d]/80 border-white/10' : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#0B2419] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-stone-100">
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SALES & PRODUCT CONVERSION SHOWCASE CARD (DESIGNED TO CONVERT) */}
        {activeNode.productData && (
          <div className="p-4 rounded-3xl bg-gradient-to-b from-[#122e23] to-[#0a1c15] border border-[#D4AF37]/40 shadow-xl space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black/40 border border-[#D4AF37]/30 overflow-hidden shrink-0 relative group">
                <img
                  src={activeNode.productData.image_url}
                  alt={activeNode.productData.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => {
                    e.currentTarget.src = '/assets/images/seabuckthorn.webp';
                  }}
                />
                <span className="absolute top-1 right-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#D4AF37] text-[#0B2419] shadow-sm">
                  {activeNode.productData.discountPercent}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{activeNode.productData.rating}</span>
                  <span className="text-stone-400 text-[10px]">({activeNode.productData.reviewsCount} verified reviews)</span>
                </div>

                <h4 className="font-serif text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                  {activeNode.productData.name}
                </h4>

                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="font-serif text-lg font-bold text-[#D4AF37]">
                    ₹{activeNode.productData.discount_price}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{activeNode.productData.price}
                  </span>
                  <span className={`text-[10px] font-semibold ${activeNode.productData.inStock ? 'text-emerald-400' : 'text-stone-400'}`}>
                    {activeNode.productData.inStock
                      ? `In Stock (${activeNode.productData.stockCount} units)`
                      : 'Currently unavailable'}
                  </span>
                </div>

                <p className="text-[10px] text-stone-300 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#D4AF37]" />
                  <span>Dispatches today if ordered before 2:00 PM IST</span>
                </p>
              </div>
            </div>

            {/* Key Botanical Actives Pill Grid */}
            {activeNode.productData.keyActives && (
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block">
                  ✦ Transparent Botanical Actives
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeNode.productData.keyActives.map((act, i) => (
                    <div key={i} className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] flex items-center justify-between">
                      <span className="font-semibold text-stone-200">{act.name}</span>
                      <span className="text-[#D4AF37] font-medium">{act.conc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive 1-Click Action Buttons */}
            {activeNode.productData.inStock ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { void handleAddProductToCart(activeNode.productData); }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#D4AF37] text-[#0B2419] font-bold text-xs uppercase tracking-wider hover:bg-[#e4be42] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  {addedProductId === activeNode.productData.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-900" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag (₹{activeNode.productData.discount_price})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void handleAddProductToCart(activeNode.productData).then(added => {
                      if (added && onNavigate) onNavigate('/checkout');
                    });
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>⚡ Instant Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="pt-1 text-center text-xs text-stone-400">This product is not currently available to purchase.</p>
            )}

            {/* Complete the Ritual Upsell Banner */}
            {activeNode.productData.bundleRecommendation && (
              <div className="p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs space-y-1">
                <div className="flex items-center justify-between text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider">
                  <span>✨ {activeNode.productData.bundleRecommendation.title}</span>
                  <span className="bg-[#D4AF37] text-[#0B2419] px-1.5 py-0.5 rounded text-[9px] font-bold">Bundle Offer</span>
                </div>
                <p className="text-[11px] text-stone-200">
                  {activeNode.productData.bundleRecommendation.description}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(`/product/${activeNode.productData.bundleRecommendation.bundleSlug}`);
                    }
                  }}
                  className="mt-1 text-[11px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  Explore Paired Product <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Direct Action Buttons */}
        {activeNode.directActions && activeNode.directActions.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Direct Actions & Quick Navigation:
            </span>
            <div className="space-y-2">
              {activeNode.directActions
                .filter(action => activeNode.productData?.inStock !== false || !['ADD_TO_CART', 'BUY_NOW'].includes(action.actionType))
                .map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDirectAction(action)}
                  className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                    idx === 0
                      ? 'bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#143d2c]'
                      : 'bg-white/10 hover:bg-white/15 text-stone-200 border border-white/15'
                  }`}
                >
                  <span>{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Suggestions at Bottom of Card */}
        {activeNode.relatedSuggestions && activeNode.relatedSuggestions.length > 0 && (
          <div className="pt-3 border-t border-current/10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block">
              ✦ Related Solutions & Recommendations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeNode.relatedSuggestions.map(relatedId => {
                const relNode = getNodeById(relatedId);
                if (!relNode) return null;
                return (
                  <button
                    key={relatedId}
                    type="button"
                    onClick={() => handleSelectNode(relatedId)}
                    className="p-2.5 rounded-xl border border-current/15 bg-white/5 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-left text-xs group"
                  >
                    <span className="text-[10px] text-stone-400 font-medium block">
                      {relNode.badge}
                    </span>
                    <span className="font-semibold text-stone-100 group-hover:text-[#D4AF37] line-clamp-1 block mt-0.5">
                      {relNode.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. PILLAR SUB-TOPICS LIST VIEW (When a specific Pillar is clicked)
  // =========================================================================
  if (activePillar) {
    const PillarIcon = PILLAR_ICON_MAP[activePillar.iconName] || Sparkles;

    return (
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-current/10">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Categories</span>
          </button>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            Category Menu
          </span>
        </div>

        {/* Pillar Header Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/20 via-[#0B2419]/40 to-transparent border border-[#D4AF37]/35 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
            <PillarIcon className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-stone-100">
              {activePillar.title}
            </h3>
            <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
              {activePillar.description}
            </p>
          </div>
        </div>

        {/* Nodes in this Pillar */}
        <div className="space-y-2 pt-1">
          {pillarNodes.map(node => (
            <button
              key={node.id}
              type="button"
              onClick={() => handleSelectNode(node.id)}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 group ${
                isDark
                  ? 'bg-[#10241f]/70 border-white/10 hover:border-[#D4AF37] hover:bg-[#10241f]'
                  : 'bg-white border-stone-200 hover:border-[#0B2419] hover:shadow-md'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  {node.badge}
                </span>
                <h4 className="font-serif text-sm font-bold text-stone-100 group-hover:text-[#D4AF37] transition-colors mt-1">
                  {node.title}
                </h4>
                <p className="text-xs text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {node.summary}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all self-center shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. ROOT DECISION TREE (MAIN HOME MENU WITH 8 MASTER PILLARS)
  // =========================================================================
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
      {/* Concierge Welcome Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#D4AF37]/15 via-[#0B2419]/20 to-transparent border border-[#D4AF37]/30 text-center relative overflow-hidden shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-2 shadow-inner">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <h3 className="font-serif text-base sm:text-lg font-bold text-stone-100">
          Bhumivera Guided Knowledge Concierge
        </h3>
        <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto leading-relaxed">
          100% verified solutions across your entire website experience. Select a category below or type in the finder to locate instant answers.
        </p>

        {/* Quick Diagnostic Shortcuts */}
        <div className="mt-3 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap justify-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSelectNode('account_forgot_password_guide')}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#E07A24]/15 border border-[#E07A24]/40 text-[#E07A24] hover:bg-[#E07A24] hover:text-white transition-all"
          >
            🔐 Forgot Password
          </button>
          <button
            type="button"
            onClick={() => handleSelectNode('orders_track_my_order')}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#2D8A5E]/15 border border-[#2D8A5E]/40 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
          >
            🚚 Track Order
          </button>
          <button
            type="button"
            onClick={() => handleSelectNode('product_sea_buckthorn_facewash')}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B2419] transition-all"
          >
            🌿 Sea Buckthorn Wash
          </button>
          <button
            type="button"
            onClick={() => handleSelectNode('product_charcoal_facewash')}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-stone-200 hover:bg-white/20 transition-all"
          >
            🌋 Charcoal Wash
          </button>
        </div>
      </div>

      {/* 8 MASTER PILLARS GRID */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
          <span>✦ Browse by Website Pillar</span>
          <span className="text-stone-400 font-normal">8 Verified Categories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MASTER_PILLARS.map(pillar => {
            const Icon = PILLAR_ICON_MAP[pillar.iconName] || Sparkles;

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarId(pillar.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-150 flex items-start gap-2.5 group ${
                  isDark
                    ? 'bg-[#10241f]/70 border-white/10 hover:border-[#D4AF37] hover:bg-[#10241f]'
                    : 'bg-white border-stone-200 hover:border-[#0B2419] hover:shadow-md'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: `${pillar.accentColor}20`,
                    borderColor: `${pillar.accentColor}40`,
                    borderWidth: 1,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: pillar.accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded text-stone-300 bg-white/5">
                      {pillar.badge}
                    </span>
                  </div>
                  <h4 className="font-serif text-xs font-bold text-stone-100 group-hover:text-[#D4AF37] transition-colors mt-0.5">
                    {pillar.title}
                  </h4>
                  <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all self-center shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-3 rounded-2xl bg-[#091a13] border border-emerald-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-stone-200">
            Orders ₹500+ unlock <strong className="text-emerald-400">100% Free Standard Delivery</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onNavigate) onNavigate('/products');
          }}
          className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
        >
          Shop Now →
        </button>
      </div>
    </div>
  );
}
