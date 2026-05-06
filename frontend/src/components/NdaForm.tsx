'use client';

import { useEffect } from 'react';
import { useForm, Controller, type UseFormRegister, type FieldErrors, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ndaSchema, NdaFormData } from '@/types/nda';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const today = new Date().toISOString().split('T')[0];

export const defaultNdaValues: NdaFormData = {
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

interface PartyFieldsProps {
  partyNum: 1 | 2;
  fields: {
    name: Path<NdaFormData>;
    title: Path<NdaFormData>;
    company: Path<NdaFormData>;
    address: Path<NdaFormData>;
  };
  placeholders: { name: string; title: string; company: string };
  register: UseFormRegister<NdaFormData>;
  errors: FieldErrors<NdaFormData>;
}

function PartyFields({ partyNum, fields, placeholders, register, errors }: PartyFieldsProps) {
  const err = errors as Record<string, { message?: string } | undefined>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Party {partyNum}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={fields.name}>Full Name <span className="text-red-500">*</span></Label>
            <Input id={fields.name} placeholder={placeholders.name} {...register(fields.name)} />
            {err[fields.name] && <p className="text-xs text-red-500">{err[fields.name]?.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor={fields.title}>Title <span className="text-red-500">*</span></Label>
            <Input id={fields.title} placeholder={placeholders.title} {...register(fields.title)} />
            {err[fields.title] && <p className="text-xs text-red-500">{err[fields.title]?.message}</p>}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor={fields.company}>Company <span className="text-red-500">*</span></Label>
          <Input id={fields.company} placeholder={placeholders.company} {...register(fields.company)} />
          {err[fields.company] && <p className="text-xs text-red-500">{err[fields.company]?.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor={fields.address}>Notice Address <span className="text-red-500">*</span></Label>
          <Textarea
            id={fields.address}
            rows={2}
            placeholder="email@example.com or postal address"
            {...register(fields.address)}
          />
          {err[fields.address] && <p className="text-xs text-red-500">{err[fields.address]?.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function NdaForm({ onChange }: NdaFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<NdaFormData>({
    resolver: zodResolver(ndaSchema),
    defaultValues: defaultNdaValues,
    mode: 'onChange',
  });

  const { mndaTermType, confidentialityTermType } = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as NdaFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

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
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        field.onChange(isNaN(parsed) ? undefined : parsed);
                      }}
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
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        field.onChange(isNaN(parsed) ? undefined : parsed);
                      }}
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

      <PartyFields
        partyNum={1}
        fields={{ name: 'party1Name', title: 'party1Title', company: 'party1Company', address: 'party1NoticeAddress' }}
        placeholders={{ name: 'Jane Smith', title: 'CEO', company: 'Acme Corp' }}
        register={register}
        errors={errors}
      />

      <PartyFields
        partyNum={2}
        fields={{ name: 'party2Name', title: 'party2Title', company: 'party2Company', address: 'party2NoticeAddress' }}
        placeholders={{ name: 'John Doe', title: 'CTO', company: 'Globex Inc.' }}
        register={register}
        errors={errors}
      />
    </form>
  );
}
