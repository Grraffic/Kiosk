import ImageUpload from '../ImageUpload';
import type { KioskData } from '../../../types';

type Props = {
  data: KioskData;
  setData: React.Dispatch<React.SetStateAction<KioskData | null>>;
};

export default function MfaPosterTab({ data, setData }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="admin-label">Poster image URL (or upload)</label>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={data.mfaPosterUrl || ''}
            onChange={(e) => setData({ ...data, mfaPosterUrl: e.target.value })}
            className="admin-input flex-1 min-w-[12rem]"
          />
          <ImageUpload
            onUploadSuccess={(url) => setData({ ...data, mfaPosterUrl: url })}
            className="text-sm py-2 px-4 shrink-0"
          />
        </div>
      </div>
      <div>
        <label className="admin-label">Google Drive registration link</label>
        <input
          type="text"
          value={data.mfaDriveLink || ''}
          onChange={(e) => setData({ ...data, mfaDriveLink: e.target.value })}
          className="admin-input"
        />
      </div>
    </div>
  );
}
