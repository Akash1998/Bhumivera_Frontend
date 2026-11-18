import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FolderTree, Plus, Edit2, Trash2, Search, RefreshCw, 
  ChevronRight, ChevronDown, Layers, Link as LinkIcon, 
  AlertTriangle, CheckCircle, Component, XCircle, 
  Activity, BarChart2, Download, Filter, Move, Settings, 
  ShieldAlert, Eye, Server, Zap, PieChart, Info, Database, Terminal,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const toSlug = (str) => String(str || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export default function CategoryManagement() {
  // --- CORE DATA STATES ---
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- UI & INTERACTION STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all, missing_seo, master_only
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedaccesss, setSelectedaccesss] = useState([]);
  const [activeInspectoraccess, setActiveInspectoraccess] = useState(null);

  // --- MODAL / FORM STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('category'); // 'category' or 'subcategory'
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', meta_title: '', meta_description: '',
    category_id: '', is_active: 1, image_url: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditEvents, setAuditEvents] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState('');

  const { showToast } = useToast() || {};

  useEffect(() => {
    fetchAuditHistory();
  }, []);

  const fetchAuditHistory = async () => {
    setAuditLoading(true);
    setAuditError('');
    try {
      const response = await api.get('/categories/admin/audit?limit=30');
      if (!Array.isArray(response.data?.data)) {
        throw new Error('The category audit response was invalid.');
      }
      setAuditEvents(response.data.data);
    } catch (err) {
      if (err.response?.status !== 403) {
        console.error('Category audit history error:', err);
      }
      setAuditError(err.response?.status === 403
        ? 'Your admin profile does not have permission to view category audit history. Ask an administrator to grant Categories access.'
        : err.response?.data?.message || 'Audit history could not be loaded. Try again.');
    } finally {
      setAuditLoading(false);
    }
  };

  const fetchTaxonomy = useCallback(async () => {
    setLoading(true);
    try {
      // Execute parallel queries for high-speed data fetching
      const [catRes, subRes] = await Promise.all([
        api.get('/categories'),
        api.get('/subcategories')
      ]);
      
      const rawCategories = catRes.data?.categories || catRes.data?.data || catRes.data || [];
      const rawSubcategories = subRes.data?.subcategories || subRes.data?.data || subRes.data || [];
      
      const enrichedCategories = Array.isArray(rawCategories) ? rawCategories : [];
      const enrichedSubcategories = Array.isArray(rawSubcategories) ? rawSubcategories : [];

      setCategories(enrichedCategories);
      setSubcategories(enrichedSubcategories);
      
      // Auto-expand all master rows on initial load if data is manageable
      if (enrichedCategories.length < 20) {
        const initialExpandState = {};
        enrichedCategories.forEach(c => initialExpandState[c.id || c._id] = true);
        setExpandedRows(initialExpandState);
      }
    } catch (err) {
      console.error("Category loading error:", err);
      showToast?.('Could not load categories. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTaxonomy();
  }, [fetchTaxonomy]);

  // --- UTILITY FUNCTIONS ---
  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleaccessSelection = (id) => {
    setSelectedaccesss(prev => 
      prev.includes(id) ? prev.filter(accessId => accessId !== id) : [...prev, id]
    );
  };

  const selectAllaccesss = () => {
    if (selectedaccesss.length === categories.length + subcategories.length) {
      setSelectedaccesss([]);
    } else {
      const allIds = [
        ...categories.map(c => c.id || c._id),
        ...subcategories.map(s => s.id || s._id)
      ];
      setSelectedaccesss(allIds);
    }
  };

  const getSubcategories = useCallback((categoryId) => {
    return subcategories.filter(sub => 
      (sub.category_id === categoryId) || 
      (sub.category_id?._id === categoryId) || 
      (sub.category_id?.id === categoryId)
    );
  }, [subcategories]);

  const getMissingSeoFields = item => [
    ['slug', 'Slug'],
    ['description', 'Page description'],
    ['meta_title', 'SEO title'],
    ['meta_description', 'Search preview'],
  ].filter(([key]) => !String(item?.[key] || '').trim()).map(([, label]) => label);

  const taxonomyMetrics = useMemo(() => {
    const totalClusters = categories.length;
    const totalSubaccesss = subcategories.length;
    const totalaccesss = totalClusters + totalSubaccesss;
    const missingSeoFieldCount = [...categories, ...subcategories]
      .reduce((count, item) => count + getMissingSeoFields(item).length, 0);
    const emptyClusters = categories.filter(c => getSubcategories(c.id || c._id).length === 0).length;

    return { totalClusters, totalSubaccesss, totalaccesss, missingSeoFieldCount, emptyClusters };
  }, [categories, subcategories, getSubcategories]);

  // --- FILTERING ENGINE ---
  const filteredData = useMemo(() => {
    let processedCategories = [...categories];
    let processedSubcategories = [...subcategories];

    // 1. Text Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      processedCategories = processedCategories.filter(c => 
        c.name?.toLowerCase().includes(lowerTerm) || c.slug?.toLowerCase().includes(lowerTerm)
      );
      // Only show subcategories if they match, OR if their parent matches
      const parentIds = processedCategories.map(c => c.id || c._id);
      processedSubcategories = processedSubcategories.filter(s => 
        s.name?.toLowerCase().includes(lowerTerm) || 
        s.slug?.toLowerCase().includes(lowerTerm) ||
        parentIds.includes(s.category_id)
      );
    }

    // 2. Mode Filters
    if (filterMode === 'missing_seo') {
      processedCategories = processedCategories.filter(c => getMissingSeoFields(c).length > 0);
      processedSubcategories = processedSubcategories.filter(s => getMissingSeoFields(s).length > 0);
    } else if (filterMode === 'master_only') {
      processedSubcategories = []; // Hide all subs
    }

    return { master: processedCategories, subs: processedSubcategories };
  }, [categories, subcategories, searchTerm, filterMode]);

  // --- DATA EXPORT PROTOCOL ---
  const exportTaxonomyCSV = () => {
    
    const headers = ['Type', 'ID', 'Name', 'Slug', 'Parent ID', 'Missing SEO fields', 'Created At'];
    const rows = [];

    categories.forEach(cat => {
      const catId = cat.id || cat._id;
      rows.push(['Master', catId, cat.name, cat.slug, 'NULL', getMissingSeoFields(cat).join('; ') || 'None', cat.created_at || 'N/A']);
      
      const subs = getSubcategories(catId);
      subs.forEach(sub => {
        rows.push(['Subcategory', sub.id || sub._id, sub.name, sub.slug, catId, getMissingSeoFields(sub).join('; ') || 'None', sub.created_at || 'N/A']);
      });
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Bhumivera_categories_seo_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CRUD OPERATIONS ---
  const openModal = (mode, item = null, parentId = null) => {
    setModalMode(mode);
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name || '',
        slug: item.slug || '',
        description: item.description || '',
        meta_title: item.meta_title || '',
        meta_description: item.meta_description || '',
        category_id: item.category_id || parentId || '',
        is_active: item.is_active !== undefined ? item.is_active : 1,
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setForm({
        name: '', slug: '', description: '', meta_title: '', meta_description: '',
        category_id: parentId || '', is_active: 1, image_url: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleAutoSlug = (name) => {
    setForm(prev => ({ 
      ...prev, 
      name, 
      slug: editingItem ? prev.slug : toSlug(name),
    }));
  };

  const handleGenerateSeoDraft = async () => {
    if (!form.name.trim()) {
      showToast?.('Enter a category name first.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const selectedParent = categories.find(
        category => String(category.id || category._id) === String(form.category_id)
      );
      const { data } = await api.post('/ai/generate-taxonomy-seo', {
        items: [{
          id: 'draft',
          type: modalMode,
          name: form.name.trim(),
          parentName: selectedParent?.name || '',
          slug: form.slug,
          description: form.description,
        }],
      }, { adminAuth: true, notify: false });
      const generated = data?.items?.[0];
      if (!generated) throw new Error('Gemini did not return SEO fields. Please try again.');
      setForm(previous => ({
        ...previous,
        slug: previous.slug || generated.slug,
        description: generated.description,
        meta_title: generated.meta_title,
        meta_description: generated.meta_description,
      }));
      showToast?.(`SEO draft generated with ${data.model || 'Gemini'}. Review it before saving.`, 'success');
    } catch (error) {
      showToast?.(error.response?.data?.message || error.message || 'Gemini SEO generation failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoOptimizeAllSeo = async () => {
    const items = [
      ...categories.map(category => ({
        ...category,
        id: String(category.id || category._id),
        type: 'category',
      })),
      ...subcategories.map(subcategory => ({
        ...subcategory,
        id: String(subcategory.id || subcategory._id),
        type: 'subcategory',
        parentName: subcategory.category_name || categories.find(category =>
          String(category.id || category._id) === String(
            typeof subcategory.category_id === 'object'
              ? subcategory.category_id.id || subcategory.category_id._id
              : subcategory.category_id
          )
        )?.name || '',
      })),
    ].filter(item => getMissingSeoFields(item).length > 0);

    if (items.length === 0) {
      showToast?.('All categories and subcategories already have SEO fields.', 'success');
      return;
    }

    setIsProcessing(true);
    let updatedCount = 0;
    try {
      for (let offset = 0; offset < items.length; offset += 8) {
        const batch = items.slice(offset, offset + 8);
        const { data } = await api.post('/ai/generate-taxonomy-seo', {
          items: batch.map(item => ({
            id: item.id,
            type: item.type,
            name: item.name,
            parentName: item.parentName || '',
            slug: item.slug || '',
            description: item.description || '',
          })),
        }, { adminAuth: true, notify: false });
        if (!Array.isArray(data?.items) || data.items.length !== batch.length) {
          throw new Error('Gemini returned an incomplete SEO batch.');
        }

        const generatedById = new Map(data.items.map(item => [String(item.id), item]));
        for (const item of batch) {
          const generated = generatedById.get(item.id);
          if (!generated) throw new Error(`Gemini did not return SEO for "${item.name}".`);
          const entityId = item.id;
          const parentId = typeof item.category_id === 'object'
            ? item.category_id.id || item.category_id._id
            : item.category_id;
          const payload = {
            name: item.name,
            slug: item.slug || generated.slug,
            description: item.description || generated.description,
            meta_title: item.meta_title || generated.meta_title,
            meta_description: item.meta_description || generated.meta_description,
          };

          if (item.type === 'category') {
            payload.image_url = item.image_url || '';
            payload.is_active = item.is_active !== undefined ? item.is_active : 1;
            await api.put(`/categories/${entityId}`, payload, { adminAuth: true, notify: false });
          } else {
            payload.category_id = parentId;
            await api.put(`/subcategories/${entityId}`, payload, { adminAuth: true, notify: false });
          }
          updatedCount += 1;
        }
      }

      showToast?.(`Generated SEO for ${updatedCount} categories and subcategories.`, 'success');
      await Promise.all([fetchTaxonomy(), fetchAuditHistory()]);
    } catch (err) {
      console.error('Category SEO generation error:', err);
      const progress = updatedCount ? ` Saved ${updatedCount} item(s) before the error.` : '';
      showToast?.(`${err.response?.data?.message || err.message || 'Gemini SEO generation failed.'}${progress}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const endpoint = modalMode === 'category' ? '/categories' : '/subcategories';
      const payload = { ...form };

      if (editingItem) {
        await api.put(`${endpoint}/${editingItem.id || editingItem._id}`, payload);
        showToast?.(`${modalMode === 'category' ? 'Category' : 'Subcategory'} saved.`, 'success');
      } else {
        await api.post(endpoint, payload);
        showToast?.(`${modalMode === 'category' ? 'Category' : 'Subcategory'} added.`, 'success');
      }
      setIsModalOpen(false);
      fetchTaxonomy();
      if (modalMode === 'category') fetchAuditHistory();
    } catch (err) {
      console.error("Mutation Error:", err);
      showToast?.(err.response?.data?.message || 'Could not save this category.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id, mode, skipConfirm = false) => {
    const isCategory = mode === 'category';
    
    if (!skipConfirm) {
      const warning = isCategory
        ? 'Delete this category? Products and subcategories may still refer to it.'
        : 'Delete this subcategory?';
        
      if (!window.confirm(warning)) return;
    }

    try {
      const endpoint = isCategory ? `/categories/${id}` : `/subcategories/${id}`;
      await api.delete(endpoint);
      showToast?.('Category deleted.', 'success');
      fetchTaxonomy();
      if (isCategory) fetchAuditHistory();
    } catch (err) {
      console.error("Category deletion error:", err);
      showToast?.(err.response?.data?.message || 'Could not delete this category.', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedaccesss.length === 0) return;
    if (!window.confirm(`Delete ${selectedaccesss.length} selected categories or subcategories?`)) return;

    setIsProcessing(true);
    try {
      // In a real scenario, you'd have a bulk delete API. Simulating parallel deletes here.
      for (const id of selectedaccesss) {
        // We have to guess mode based on arrays since we just stored IDs
        const isCat = categories.some(c => (c.id || c._id) === id);
        const mode = isCat ? 'category' : 'subcategory';
        await handleDelete(id, mode, true);
      }
      setSelectedaccesss([]);
    } catch {
      showToast?.('Could not delete all selected categories.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- INSPECTOR PANE RENDERER ---
  const renderInspectorPane = () => {
    if (!activeInspectoraccess) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#10241f]/35 backdrop-blur-xl border-l border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
            <Eye size={24} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-black text-white tracking-tight mb-2">Category details</h3>
          <p className="text-xs text-slate-400">Choose a category or subcategory to review its URL and search preview fields.</p>
        </div>
      );
    }

    const isMaster = !!activeInspectoraccess.isMaster;
    return (
      <div className="h-full flex flex-col bg-[#10241f]/55 backdrop-blur-xl border-l border-slate-800/80 overflow-y-auto animate-in slide-in-from-right-4 duration-300">
        <div className="p-5 border-b border-slate-800 bg-[#081b15]/65 backdrop-blur-xl sticky top-0 z-10 flex justify-between items-start">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-3 border ${isMaster ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-amber-400/10 text-amber-200 border-amber-400/20'}`}>
              {isMaster ? <Layers size={10}/> : <Component size={10}/>}
              {isMaster ? 'Category' : 'Subcategory'}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight break-all">{activeInspectoraccess.name}</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
              <Server size={10} /> ID: {activeInspectoraccess.id || activeInspectoraccess._id}
            </p>
          </div>
          <button onClick={() => setActiveInspectoraccess(null)} className="p-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-slate-400 transition-colors">
            <XCircle size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="p-4 rounded-2xl border border-slate-800 bg-white/[0.02]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Activity size={12} /> SEO fields
            </h4>
            <div className="space-y-3">
              {[
                ['Slug', 'slug'],
                ['Page description', 'description'],
                ['SEO title', 'meta_title'],
                ['Search preview', 'meta_description'],
              ].map(([field, key]) => {
                const hasValue = Boolean(String(activeInspectoraccess[key] || '').trim());
                return (
                  <div key={field} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{field}</span>
                    <span className={hasValue ? 'text-emerald-400' : 'text-rose-400'}>
                      {hasValue ? 'Present' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Card */}
          <div className="p-4 bg-[#081b15]/55 backdrop-blur-xl rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Database size={12} /> Category information
            </h4>
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">URL</span>
                <div className="bg-[#10241f]/85 backdrop-blur-xl p-2 rounded border border-slate-800 font-mono text-xs text-cyan-400 break-all select-all">
                  /shop/{isMaster ? activeInspectoraccess.slug : `parent/${activeInspectoraccess.slug}`}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Description</span>
                <div className="bg-[#10241f]/85 backdrop-blur-xl p-3 rounded border border-slate-800 text-xs text-slate-300 min-h-[60px]">
                  {activeInspectoraccess.description || <span className="text-slate-600 italic">No semantic description provided.</span>}
                </div>
              </div>
              {isMaster && (
                <div>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Linked Entities</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-amber-400/10 text-amber-200 border border-amber-400/20 rounded font-mono text-xs">
                      {getSubcategories(activeInspectoraccess.id || activeInspectoraccess._id).length} subcategories
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="flex gap-2">
            <button 
              onClick={() => openModal(isMaster ? 'category' : 'subcategory', activeInspectoraccess, isMaster ? null : activeInspectoraccess.category_id)}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Edit2 size={14} /> Reconfigure
            </button>
            <button 
              onClick={() => {
                handleDelete(activeInspectoraccess.id || activeInspectoraccess._id, isMaster ? 'category' : 'subcategory');
                setActiveInspectoraccess(null);
              }}
              className="flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FolderTree size={20} className="text-emerald-300 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Loading categories</h3>
          <p className="text-slate-400 text-xs animate-pulse">Loading category and subcategory details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden text-slate-300 font-sans animate-in fade-in duration-500">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- COMMAND HEADER --- */}
      <div className="px-6 py-5 border-b border-slate-800/80 bg-[#081b15]/45 backdrop-blur-xl z-10 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <FolderTree size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                Categories <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-200">&amp; SEO</span>
              </h1>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <ShieldAlert size={10} className="text-emerald-300" /> Manage categories, URLs, and search previews
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Stats Mini-Bar */}
            <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-[#10241f]/80 backdrop-blur-xl border border-slate-800 rounded-xl mr-2">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Missing SEO fields</span>
                  <span className="text-sm font-black font-mono leading-none text-slate-300">
                    {taxonomyMetrics.missingSeoFieldCount}
                </span>
              </div>
              <div className="w-px h-6 bg-slate-800"></div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Total entries</span>
                <span className="text-sm font-black text-amber-200 font-mono leading-none">{taxonomyMetrics.totalaccesss}</span>
              </div>
            </div>

            <button onClick={fetchTaxonomy} className="p-3 bg-[#10241f]/85 backdrop-blur-xl border border-slate-700 text-slate-300 rounded-xl hover:border-emerald-500/50 hover:text-white transition-all shadow-sm" aria-label="Refresh categories">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={exportTaxonomyCSV} className="p-3 bg-[#10241f]/85 backdrop-blur-xl border border-slate-700 text-slate-300 rounded-xl hover:border-amber-300/50 hover:text-amber-200 transition-all shadow-sm group relative" aria-label="Export category data as CSV">
              <Download size={16} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[9px] font-bold text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">Export CSV</span>
            </button>
            
            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            <button
              onClick={handleAutoOptimizeAllSeo}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
              title="Use Gemini to fill missing slugs and search metadata"
            >
              <Zap size={14} className="text-yellow-300" />
              Generate missing SEO
            </button>

            <button onClick={() => openModal('subcategory')} className="flex items-center gap-2 px-4 py-3 bg-amber-400/10 border border-amber-300/30 text-amber-200 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-amber-300 hover:text-[#14251c] transition-all">
              <Plus size={14} /> Add subcategory
            </button>
            <button onClick={() => openModal('category')} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-[0_0_18px_rgba(16,185,129,0.18)]">
              <Layers size={14} /> Add category
            </button>
          </div>
        </div>
      </div>

      {/* --- TOOLBAR & BULK ACTIONS --- */}
      <div className="px-6 py-3 border-b border-slate-800/50 bg-[#081b15]/80 backdrop-blur-xl z-10 flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 w-full gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" placeholder="Search categories by name or slug..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#10241f]/85 backdrop-blur-xl border border-slate-800 focus:border-emerald-500/60 rounded-lg py-2 pl-9 pr-4 text-white text-xs outline-none transition-all"
            />
          </div>
          <div className="relative max-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <select
              value={filterMode} onChange={(e) => setFilterMode(e.target.value)}
              className="w-full bg-[#10241f]/85 backdrop-blur-xl border border-slate-800 text-xs text-white rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-emerald-500/60 appearance-none cursor-pointer"
            >
              <option value="all">All categories</option>
              <option value="missing_seo">Missing SEO fields</option>
              <option value="master_only">Categories only</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Context Menu */}
        <div className={`flex items-center gap-3 transition-all duration-300 ${selectedaccesss.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <span className="text-[10px] font-black text-emerald-200 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-mono">
            {selectedaccesss.length} SELECTED
          </span>
          <button onClick={handleBulkDelete} disabled={isProcessing} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50">
            <Trash2 size={14} /> Delete selected
          </button>
        </div>
      </div>

      {/* --- DUAL PANE LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: Tree View */}
        <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-12 bg-[#081b15]/90 backdrop-blur-xl border-b border-slate-800/80 p-3 text-[9px] font-black uppercase text-slate-500 tracking-widest sticky top-0 z-10 pr-6">
            <div className="col-span-5 pl-2 flex items-center gap-3">
              <button onClick={selectAllaccesss} className="w-4 h-4 rounded border border-slate-700 bg-[#10241f]/85 backdrop-blur-xl flex items-center justify-center hover:border-emerald-400 transition-colors">
                {selectedaccesss.length > 0 && <div className="w-2 h-2 bg-emerald-400 rounded-sm" />}
              </button>
              Category structure
            </div>
            <div className="col-span-4">SEO fields / Slug</div>
            <div className="col-span-3 text-right">Details</div>
          </div>

          {/* Tree Data */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 content-scroll">
            {filteredData.master.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500 space-y-2">
                <FolderTree size={24} className="opacity-50" />
                <span className="font-bold text-xs">No categories match this search.</span>
              </div>
            ) : (
              filteredData.master.map(category => {
                const catId = category.id || category._id;
                const isExpanded = expandedRows[catId];
                const subs = getSubcategories(catId);
                const isSelected = selectedaccesss.includes(catId);
                const missingFields = getMissingSeoFields(category);
                const isInspecting = activeInspectoraccess && (activeInspectoraccess.id || activeInspectoraccess._id) === catId;

                return (
                  <div key={`master-${catId}`} className="bg-[#10241f]/45 backdrop-blur-xl border border-slate-800/60 rounded-xl overflow-hidden shadow-sm transition-all hover:border-slate-700/80">
                    {/* Master Row */}
                    <div className={`grid grid-cols-12 items-center p-2.5 transition-colors ${isInspecting ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'}`}>
                      <div className="col-span-5 flex items-center gap-3 pl-1">
                        <button onClick={() => toggleaccessSelection(catId)} className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 bg-[#10241f]/85 backdrop-blur-xl'}`}>
                          {isSelected && <CheckCircle size={10} />}
                        </button>
                        <button onClick={() => toggleRow(catId)} className={`p-1 rounded transition-colors ${subs.length > 0 ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'opacity-20 cursor-default'}`}>
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-amber-400/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 flex-shrink-0">
                          <Layers size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{category.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">{subs.length} Subs</p>
                        </div>
                      </div>
                      
                      <div className="col-span-4 flex items-center gap-3">
                        <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
                          {missingFields.length ? `${missingFields.length} missing` : 'Complete'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 truncate">/{category.slug}</span>
                      </div>

                      <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
                        <button onClick={() => setActiveInspectoraccess({...category, isMaster: true})} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isInspecting ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                          Inspect
                        </button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="bg-[#081b15]/55 backdrop-blur-xl border-t border-slate-800/50">
                        {subs.length === 0 ? (
                          <div className="py-4 pl-16 text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2">
                            <Info size={12} className="text-amber-300" /> No subcategories yet.
                          </div>
                        ) : (
                          subs.map((sub, index) => {
                            const subId = sub.id || sub._id;
                            const isSubSelected = selectedaccesss.includes(subId);
                            const missingFields = getMissingSeoFields(sub);
                            const isSubInspecting = activeInspectoraccess && (activeInspectoraccess.id || activeInspectoraccess._id) === subId;
                            const isLast = index === subs.length - 1;

                            return (
                              <div key={`sub-${subId}`} className={`grid grid-cols-12 items-center p-2 transition-colors relative ${isSubInspecting ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'}`}>
                                {/* Tree connection line */}
                                <div className="absolute left-[38px] top-0 bottom-0 w-px bg-slate-800" style={{ bottom: isLast ? '50%' : '0' }}></div>
                                <div className="absolute left-[38px] top-1/2 w-4 h-px bg-slate-800"></div>

                                <div className="col-span-5 flex items-center gap-3 pl-[58px]">
                                  <button onClick={() => toggleaccessSelection(subId)} className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors ${isSubSelected ? 'border-amber-300 bg-amber-400/20 text-amber-200' : 'border-slate-700 bg-[#10241f]/85 backdrop-blur-xl'}`}>
                                    {isSubSelected && <CheckCircle size={8} className="stroke-[3]" />}
                                  </button>
                                  <div className="w-6 h-6 rounded-md bg-[#10241f]/85 backdrop-blur-xl border border-slate-800 flex items-center justify-center text-amber-200 flex-shrink-0">
                                    <Component size={10} />
                                  </div>
                                  <p className="text-xs font-semibold text-slate-300 truncate">{sub.name}</p>
                                </div>
                                
                                <div className="col-span-4 flex items-center gap-3">
                                  <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
                                    {missingFields.length ? `${missingFields.length} missing` : 'Complete'}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500 truncate">/{sub.slug}</span>
                                </div>

                                <div className="col-span-3 flex justify-end pr-2">
                                  <button onClick={() => setActiveInspectoraccess({...sub, isMaster: false})} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${isSubInspecting ? 'bg-amber-500 text-[#14251c]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                    Inspect
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: Inspector & Logs */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-col">
          {/* Top Half: Inspector */}
          <div className="flex-1 overflow-hidden">
            {renderInspectorPane()}
          </div>
          
          {/* Bottom Half: Audit Log */}
          <div className="h-1/3 bg-[#081b15]/80 backdrop-blur-xl border-l border-t border-slate-800/80 flex flex-col">
            <div className="p-3 border-b border-slate-800/80 bg-[#10241f]/85 backdrop-blur-xl flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit history</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {auditLoading ? (
                <p className="py-4 text-center text-xs text-slate-400" role="status">Loading saved category changes…</p>
              ) : auditError ? (
                <div className="py-4 text-center">
                  <p className="text-xs leading-5 text-rose-200" role="alert">{auditError}</p>
                  <button type="button" onClick={fetchAuditHistory} className="mt-3 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition hover:border-emerald-500/50 hover:text-white">
                    Retry audit history
                  </button>
                </div>
              ) : auditEvents.length === 0 ? (
                <p className="py-4 text-center text-xs leading-5 text-slate-400">No category changes have been recorded yet.</p>
              ) : (
                <ol className="space-y-3">
                  {auditEvents.map(event => {
                    const state = event.after_state || event.before_state;
                    const categoryName = state?.name || `Category ${event.category_id}`;
                    return (
                      <li key={event.id} className="border-l border-emerald-500/40 pl-3 text-xs">
                        <p className="font-semibold text-slate-200">
                          {event.action} <span className="text-emerald-200">{categoryName}</span>
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {event.actor_email || 'Admin'} · {new Date(event.created_at).toLocaleString()}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- UNIFIED CREATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081b15]/90 backdrop-blur-xl/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#10241f]/85 backdrop-blur-xl border border-slate-700 w-full max-w-2xl max-h-[90dvh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            
            <div className="relative h-1 w-full bg-gradient-to-r from-emerald-500 to-amber-300"></div>

            <div className="p-6 border-b border-slate-800/80 flex justify-between items-start bg-[#081b15]/55 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${modalMode === 'category' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-400/10 border-amber-400/30 text-amber-200'}`}>
                  {modalMode === 'category' ? <Layers size={24} /> : <Component size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {editingItem ? 'Edit' : 'Add'} <span className={modalMode === 'category' ? 'text-emerald-300' : 'text-amber-200'}>{modalMode === 'category' ? 'category' : 'subcategory'}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Set the name, URL, and search preview fields.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-rose-500/20 p-2 rounded-xl transition-colors">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 p-6 space-y-6 overflow-y-auto content-scroll">
                
                {/* Mode Specific Logic */}
                {modalMode === 'subcategory' && (
                  <div className="bg-amber-300/5 border border-amber-300/20 p-4 rounded-xl">
                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-200 flex items-center gap-2 mb-3">
                      <LinkIcon size={12} /> Parent category
                    </label>
                    <select 
                      required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                      className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-700 rounded-lg p-3 text-sm text-white font-bold outline-none focus:border-amber-300 appearance-none cursor-pointer"
                    >
                      <option value="">Choose a parent category…</option>
                      {categories.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
                    </select>
                  </div>
                )}

                {/* Core Routing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-2">Category or subcategory name</label>
                    <input 
                      required type="text" placeholder="e.g. Facial cleansers"
                      value={form.name} onChange={e => handleAutoSlug(e.target.value)}
                      className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 rounded-xl p-3.5 text-sm text-white font-bold outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-2">URL slug</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">/</span>
                      <input 
                        required type="text" 
                        value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                        className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 rounded-xl py-3.5 pl-7 pr-4 text-sm text-cyan-400 font-mono outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Meta */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page description</label>
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, slug: prev.slug || toSlug(prev.name) }))}
                        className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                      >
                        <Zap size={10} /> Generate slug
                      </button>
                    </div>
                    <span className={`text-[10px] font-mono ${form.description.length > 20 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {form.description.length} chars
                    </span>
                  </div>
                  <textarea 
                  rows={3} placeholder="Category description"
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 rounded-xl p-3.5 text-sm text-slate-300 resize-none outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <p className="text-[9px] text-slate-600 mt-1 font-mono">Saved with this category and shown wherever the catalog uses it.</p>
                </div>

                <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">Search preview</h3>
                      <p className="mt-1 text-[10px] text-slate-400">These fields are used for search and social previews.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateSeoDraft}
                      disabled={isProcessing || !form.name.trim()}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-[10px] font-bold text-emerald-200 transition hover:bg-emerald-400/20 disabled:opacity-50"
                    >
                      {isProcessing ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                      Generate SEO draft
                    </button>
                  </div>
                  <div>
                    <label className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      SEO title
                      <span className={form.meta_title.length > 60 ? 'text-amber-300' : 'text-slate-500'}>
                        {form.meta_title.length}/60
                      </span>
                    </label>
                    <input
                      maxLength={60}
                      value={form.meta_title}
                      onChange={event => setForm({ ...form, meta_title: event.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-[#081b15]/90 p-3 text-sm text-white outline-none transition focus:border-emerald-500"
                      placeholder="Category name | Bhumivera"
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Meta description
                      <span className={form.meta_description.length > 160 ? 'text-amber-300' : 'text-slate-500'}>
                        {form.meta_description.length}/160
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      maxLength={160}
                      value={form.meta_description}
                      onChange={event => setForm({ ...form, meta_description: event.target.value })}
                      className="w-full resize-y rounded-xl border border-slate-700 bg-[#081b15]/90 p-3 text-sm text-slate-300 outline-none transition focus:border-emerald-500"
                      placeholder="A clear, accurate description for search results."
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="bg-[#10241f]/85 backdrop-blur-xl border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Logic Gate Status</h4>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Enable or disable client-side routing visibility.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" className="sr-only peer"
                      checked={!!form.is_active} 
                      onChange={(e) => setForm({...form, is_active: e.target.checked ? 1 : 0})} 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              <div className="shrink-0 p-5 border-t border-slate-800 bg-[#081b15]/95 backdrop-blur-xl flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isProcessing} className={`px-8 py-3 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 ${modalMode === 'category' ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-400 text-[#14251c]'} disabled:opacity-50`}>
                  {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                  {isProcessing ? 'Saving...' : editingItem ? 'Save Changes' : `Save ${modalMode === 'category' ? 'Category' : 'Subcategory'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
