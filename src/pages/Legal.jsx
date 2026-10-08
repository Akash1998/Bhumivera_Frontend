import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-white py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
          {isPrivacy ? "Privacy Notice" : "Conditions of Use & Sale"}
        </h1>
        
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p className="text-sm font-bold text-gray-900">Last Updated: {new Date().getFullYear()}</p>
          
          {isPrivacy ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Information We Collect</h2>
              <p>We collect information needed to provide the site, process orders, and respond to customer support requests. This may include account, order, and service interactions.</p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8">2. How We Use Your Data</h2>
              <p>Your data helps us process orders, returns, and support requests. We do not sell your personal data to third parties.</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Optional Marketing Emails</h2>
              <p>Promotional emails are sent only to customers who explicitly opt in during registration or from Profile &gt; Security. You can change this preference at any time. Opting out does not affect order, account, or support emails.</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Acceptance of Terms</h2>
              <p>By using Bhumivera services or purchasing our automotive and audio products, you agree to these conditions. Please read them carefully.</p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Returns & Customer Support</h2>
              <p>Return and replacement requests are reviewed under the applicable order and product policies. Contact our support team through your account or the Contact Center for assistance.</p>
            </>
          )}
          
          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Need further clarification?</h3>
            <p>If you have any questions regarding these policies, please reach out to our legal and support team via the <a href="/contact" className="text-blue-600 hover:underline">Contact Center</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
