import { z } from 'zod';

export const ndaSchema = z.object({
  purpose: z.string().min(1, 'Purpose is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  mndaTermType: z.enum(['expires', 'until_terminated']),
  mndaTermYears: z.number().min(1).max(20).optional(),
  confidentialityTermType: z.enum(['years', 'perpetuity']),
  confidentialityTermYears: z.number().min(1).max(20).optional(),
  governingLaw: z.string().min(1, 'Governing law state is required'),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  modifications: z.string(),
  party1Name: z.string().min(1, 'Party 1 name is required'),
  party1Title: z.string().min(1, 'Party 1 title is required'),
  party1Company: z.string().min(1, 'Party 1 company is required'),
  party1NoticeAddress: z.string().min(1, 'Party 1 notice address is required'),
  party2Name: z.string().min(1, 'Party 2 name is required'),
  party2Title: z.string().min(1, 'Party 2 title is required'),
  party2Company: z.string().min(1, 'Party 2 company is required'),
  party2NoticeAddress: z.string().min(1, 'Party 2 notice address is required'),
});

export type NdaFormData = z.infer<typeof ndaSchema>;
