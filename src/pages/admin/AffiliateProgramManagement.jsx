import React, { useState } from 'react';
import PromoterProgramManagement from './PromoterProgramManagement';
import AffiliateManagement from './AffiliateManagement';

export default function AffiliateProgramManagement() {
  const [activePanel, setActivePanel] = useState('promoters');
  const tabClass = panel => `rounded-lg px-4 py-2 text-xs font-bold transition ${
    activePanel === panel
      ? 'bg-[#D4AF37] text-[#102219]'
      : 'border border-[#315541] text-[#DFD7C4] hover:border-[#D4AF37]'
  }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[#244A38] bg-[#102219] px-4 py-3 md:px-6">
        <button type="button" className={tabClass('promoters')} onClick={() => setActivePanel('promoters')}>Influencer &amp; promoter program</button>
        <button type="button" className={tabClass('referrals')} onClick={() => setActivePanel('referrals')}>Customer referral rewards</button>
      </div>
      {activePanel === 'promoters' ? <PromoterProgramManagement/> : <AffiliateManagement/>}
    </div>
  );
}
