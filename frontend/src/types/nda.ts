export interface NdaFormData {
  // Cover page
  purpose: string;
  effectiveDate: string;
  mndaTermType: 'expires' | 'until_terminated';
  mndaTermYears: number;
  confidentialityTermType: 'years' | 'perpetuity';
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  // Party 1
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1NoticeAddress: string;
  // Party 2
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2NoticeAddress: string;
}
