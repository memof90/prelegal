'use client';

import { useState, useRef } from 'react';
import { NdaFormData } from '@/types/nda';
import { NdaForm } from '@/components/NdaForm';
import { NdaPreview } from '@/components/NdaPreview';
import { DownloadButton } from '@/components/DownloadButton';

const today = new Date().toISOString().split('T')[0];

const defaultFormData: NdaFormData = {
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: today,
  mndaTermType: 'expires',
  mndaTermYears: 1,
  confidentialityTermType: 'years',
  confidentialityTermYears: 1,
  governingLaw: 'Delaware',
  jurisdiction: 'New Castle, DE',
  modifications: '',
  party1Name: '',
  party1Title: '',
  party1Company: '',
  party1NoticeAddress: '',
  party2Name: '',
  party2Title: '',
  party2Company: '',
  party2NoticeAddress: '',
};

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mutual NDA Creator</h1>
            <p className="text-sm text-gray-500">Fill in the form to generate a ready-to-sign Mutual Non-Disclosure Agreement</p>
          </div>
          <div className="hidden sm:block">
            <DownloadButton previewRef={previewRef} formData={formData} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Form panel */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <NdaForm onChange={setFormData} />
          </div>

          {/* Preview panel */}
          <div className="w-full md:w-3/5 md:sticky md:top-24">
            <div className="flex items-center justify-between mb-3 no-print">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Live Preview</h2>
              <div className="sm:hidden">
                <DownloadButton previewRef={previewRef} formData={formData} />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-8rem)] rounded-lg">
              <NdaPreview ref={previewRef} data={formData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
