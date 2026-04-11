import type { KioskData } from '../../../types';

type Props = {
  data: KioskData;
  onLocaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const fields: { name: keyof KioskData['localeInfo']; label: string }[] = [
  { name: 'locale', label: 'Locale name' },
  { name: 'address', label: 'Address' },
  { name: 'contactPerson', label: 'Contact person' },
  { name: 'contactDetails', label: 'Contact details' },
  { name: 'googleMapLink', label: 'Google Maps link' },
];

export default function LocaleTab({ data, onLocaleChange }: Props) {
  return (
    <div className="space-y-5">
      {fields.map(({ name, label }) => (
        <div key={name}>
          <label className="admin-label">{label}</label>
          <input
            type="text"
            name={name}
            value={data.localeInfo[name] || ''}
            onChange={onLocaleChange}
            className="admin-input"
          />
        </div>
      ))}
    </div>
  );
}
