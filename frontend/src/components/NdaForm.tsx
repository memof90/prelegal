'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { NdaFormData } from '@/types/nda';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const schema = z.object({
  purpose: z.string().min(1, 'Purpose is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  mndaTermType: z.enum(['expires', 'until_terminated']),
  mndaTermYears: z.number().min(1).max(20),
  confidentialityTermType: z.enum(['years', 'perpetuity']),
  confidentialityTermYears: z.number().min(1).max(20),
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

type SchemaType = z.infer<typeof schema>;

const today = new Date().toISOString().split('T')[0];

const defaultValues: SchemaType = {
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

interface NdaFormProps {
  onChange: (data: NdaFormData) => void;
}

export function NdaForm({ onChange }: NdaFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const watchedValues = watch();
  const mndaTermType = watch('mndaTermType');
  const confidentialityTermType = watch('confidentialityTermType');

  useEffect(() => {
    onChange(watchedValues as NdaFormData);
  }, [JSON.stringify(watchedValues)]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form className="space-y-6">
      {/* Agreement Details */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="purpose">Purpose <span className="text-red-500">*</span></Label>
            <Textarea
              id="purpose"
              rows={3}
              placeholder="How Confidential Information may be used..."
              {...register('purpose')}
            />
            {errors.purpose && <p className="text-xs text-red-500">{errors.purpose.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="effectiveDate">Effective Date <span className="text-red-500">*</span></Label>
            <Input id="effectiveDate" type="date" {...register('effectiveDate')} />
            {errors.effectiveDate && <p className="text-xs text-red-500">{errors.effectiveDate.message}</p>}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>MNDA Term</Label>
            <p className="text-xs text-gray-500">The length of this MNDA</p>
            <Controller
              control={control}
              name="mndaTermType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expires">Expires after a set number of years</SelectItem>
                    <SelectItem value="until_terminated">Continues until terminated</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {mndaTermType === 'expires' && (
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="mndaTermYears"
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      className="w-24"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                    />
                  )}
                />
                <span className="text-sm text-gray-600">year(s) from Effective Date</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Term of Confidentiality</Label>
            <p className="text-xs text-gray-500">How long Confidential Information is protected</p>
            <Controller
              control={control}
              name="confidentialityTermType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">For a set number of years</SelectItem>
                    <SelectItem value="perpetuity">In perpetuity</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {confidentialityTermType === 'years' && (
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="confidentialityTermYears"
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      className="w-24"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                    />
                  )}
                />
                <span className="text-sm text-gray-600">year(s) from Effective Date</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-1">
            <Label htmlFor="governingLaw">Governing Law (State) <span className="text-red-500">*</span></Label>
            <Input id="governingLaw" placeholder="e.g. Delaware" {...register('governingLaw')} />
            {errors.governingLaw && <p className="text-xs text-red-500">{errors.governingLaw.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="jurisdiction">Jurisdiction <span className="text-red-500">*</span></Label>
            <Input id="jurisdiction" placeholder='e.g. New Castle, DE' {...register('jurisdiction')} />
            {errors.jurisdiction && <p className="text-xs text-red-500">{errors.jurisdiction.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="modifications">MNDA Modifications</Label>
            <Textarea
              id="modifications"
              rows={2}
              placeholder="List any modifications to the Standard Terms (optional)..."
              {...register('modifications')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Party 1 */}
      <Card>
        <CardHeader>
          <CardTitle>Party 1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="party1Name">Full Name <span className="text-red-500">*</span></Label>
              <Input id="party1Name" placeholder="Jane Smith" {...register('party1Name')} />
              {errors.party1Name && <p className="text-xs text-red-500">{errors.party1Name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="party1Title">Title <span className="text-red-500">*</span></Label>
              <Input id="party1Title" placeholder="CEO" {...register('party1Title')} />
              {errors.party1Title && <p className="text-xs text-red-500">{errors.party1Title.message}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="party1Company">Company <span className="text-red-500">*</span></Label>
            <Input id="party1Company" placeholder="Acme Corp" {...register('party1Company')} />
            {errors.party1Company && <p className="text-xs text-red-500">{errors.party1Company.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="party1NoticeAddress">Notice Address <span className="text-red-500">*</span></Label>
            <Textarea
              id="party1NoticeAddress"
              rows={2}
              placeholder="email@example.com or postal address"
              {...register('party1NoticeAddress')}
            />
            {errors.party1NoticeAddress && <p className="text-xs text-red-500">{errors.party1NoticeAddress.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Party 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Party 2</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="party2Name">Full Name <span className="text-red-500">*</span></Label>
              <Input id="party2Name" placeholder="John Doe" {...register('party2Name')} />
              {errors.party2Name && <p className="text-xs text-red-500">{errors.party2Name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="party2Title">Title <span className="text-red-500">*</span></Label>
              <Input id="party2Title" placeholder="CTO" {...register('party2Title')} />
              {errors.party2Title && <p className="text-xs text-red-500">{errors.party2Title.message}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="party2Company">Company <span className="text-red-500">*</span></Label>
            <Input id="party2Company" placeholder="Globex Inc." {...register('party2Company')} />
            {errors.party2Company && <p className="text-xs text-red-500">{errors.party2Company.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="party2NoticeAddress">Notice Address <span className="text-red-500">*</span></Label>
            <Textarea
              id="party2NoticeAddress"
              rows={2}
              placeholder="email@example.com or postal address"
              {...register('party2NoticeAddress')}
            />
            {errors.party2NoticeAddress && <p className="text-xs text-red-500">{errors.party2NoticeAddress.message}</p>}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
