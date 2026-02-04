import React from 'react';
import './admin.css';

const metricKeys = [
  'safety',
  'affordability',
  'cleanliness',
  'walkability',
  'nightlife',
  'transport'
] as const;

const amenityKeys = [
  'schools',
  'hospitals',
  'parks',
  'restaurants',
  'shoppingCenters',
  'gyms'
] as const;

const housingKeys = [
  'averageRent1BHK',
  'averageRent2BHK',
  'averageRent3BHK',
  'averagePropertyPrice'
] as const;

export type NeighborhoodFormValues = {
  name: string;
  city: string;
  state: string;
  country: string;
  imageUrl: string;
  images: string[];
  metrics: Record<typeof metricKeys[number], number>;
  amenities: Record<typeof amenityKeys[number], number>;
  housing: Record<typeof housingKeys[number], number>;
  matchSuccessRate?: number;
  sentimentScore?: number;
};

const defaultValues: NeighborhoodFormValues = {
  name: '',
  city: '',
  state: '',
  country: 'India',
  imageUrl: '',
  images: [],
  metrics: metricKeys.reduce((acc, key) => ({ ...acc, [key]: 50 }), {} as NeighborhoodFormValues['metrics']),
  amenities: amenityKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as NeighborhoodFormValues['amenities']),
  housing: housingKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as NeighborhoodFormValues['housing']),
  matchSuccessRate: 0,
  sentimentScore: 0
};

interface NeighborhoodFormProps {
  initialValues?: Partial<NeighborhoodFormValues>;
  onSubmit: (values: NeighborhoodFormValues) => void;
  submitting?: boolean;
}

const NeighborhoodForm: React.FC<NeighborhoodFormProps> = ({ initialValues, onSubmit, submitting }) => {
  const [formValues, setFormValues] = React.useState<NeighborhoodFormValues>({
    ...defaultValues,
    ...initialValues,
    metrics: { ...defaultValues.metrics, ...initialValues?.metrics },
    amenities: { ...defaultValues.amenities, ...initialValues?.amenities },
    housing: { ...defaultValues.housing, ...initialValues?.housing },
    images: initialValues?.images || []
  });

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetricChange = (key: typeof metricKeys[number], value: number) => {
    setFormValues((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [key]: Math.max(1, Math.min(100, value))
      }
    }));
  };

  const handleAmenityChange = (key: typeof amenityKeys[number], value: number) => {
    setFormValues((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: Math.max(0, value)
      }
    }));
  };

  const handleHousingChange = (key: typeof housingKeys[number], value: number) => {
    setFormValues((prev) => ({
      ...prev,
      housing: {
        ...prev.housing,
        [key]: Math.max(0, value)
      }
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormValues((prev) => {
      const next = [...prev.images];
      next[index] = value;
      return { ...prev, images: next };
    });
  };

  const addImage = () => {
    setFormValues((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index: number) => {
    setFormValues((prev) => {
      const next = prev.images.filter((_, idx) => idx !== index);
      return { ...prev, images: next };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formValues,
      images: formValues.images.filter(Boolean)
    };
    onSubmit(payload);
  };

  return (
    <form className="admin-neighborhood-form" onSubmit={handleSubmit}>
      <section>
        <h4>Basic Info</h4>
        <div className="form-grid">
          <label>
            Name
            <input name="name" value={formValues.name} onChange={handleBasicChange} required />
          </label>
          <label>
            City
            <input name="city" value={formValues.city} onChange={handleBasicChange} required />
          </label>
          <label>
            State
            <input name="state" value={formValues.state} onChange={handleBasicChange} required />
          </label>
          <label>
            Country
            <input name="country" value={formValues.country} onChange={handleBasicChange} />
          </label>
        </div>
      </section>

      <section>
        <h4>Images</h4>
        <label>
          Primary Image URL
          <input name="imageUrl" value={formValues.imageUrl} onChange={handleBasicChange} />
        </label>
        <div className="images-list">
          {formValues.images.map((img, index) => (
            <div key={index} className="image-row">
              <input value={img} onChange={(e) => updateImage(index, e.target.value)} />
              <button type="button" onClick={() => removeImage(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addImage}>
          Add Image
        </button>
      </section>

      <section>
        <h4>Metrics (1-100)</h4>
        <div className="form-grid">
          {metricKeys.map((key) => (
            <label key={key}>
              {key}
              <input
                type="number"
                min={1}
                max={100}
                value={formValues.metrics[key]}
                onChange={(e) => handleMetricChange(key, Number(e.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h4>Amenities</h4>
        <div className="form-grid">
          {amenityKeys.map((key) => (
            <label key={key}>
              {key}
              <input
                type="number"
                min={0}
                value={formValues.amenities[key]}
                onChange={(e) => handleAmenityChange(key, Number(e.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h4>Housing</h4>
        <div className="form-grid">
          {housingKeys.map((key) => (
            <label key={key}>
              {key}
              <input
                type="number"
                min={0}
                value={formValues.housing[key]}
                onChange={(e) => handleHousingChange(key, Number(e.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Neighborhood'}
          </button>
      </div>
    </form>
  );
};

export default NeighborhoodForm;
