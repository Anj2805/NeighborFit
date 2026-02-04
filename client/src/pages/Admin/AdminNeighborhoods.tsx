import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import AdminLayout from '../../components/Admin/AdminLayout';
import AdminHeader from '../../components/Admin/AdminHeader';
import DataTable from '../../components/Admin/DataTable';
import Modal from '../../components/Admin/Modal';
import NeighborhoodForm, { type NeighborhoodFormValues } from '../../components/Admin/NeighborhoodForm';
import { api } from '../../lib/api';
import { adminApi } from '../../lib/adminApi';
import { useToast } from '../../contexts/ToastContext';
import { useAdminRealtime } from '../../contexts/AdminRealtimeContext';
import './AdminNeighborhoods.css';

interface AdminNeighborhood {
  _id: string;
  name: string;
  city: string;
  state: string;
  country?: string;
  overallRating: number;
  matchSuccessRate?: number;
  viewCount?: number;
  sentimentScore?: number;
  imageUrl?: string;
  images?: string[];
  metrics?: {
    safety?: number;
    affordability?: number;
    cleanliness?: number;
    walkability?: number;
    nightlife?: number;
    transport?: number;
  };
  housing?: {
    averageRent1BHK?: number;
    averageRent2BHK?: number;
    averageRent3BHK?: number;
    averagePropertyPrice?: number;
  };
  amenities?: {
    schools?: number;
    hospitals?: number;
    parks?: number;
    restaurants?: number;
    shoppingCenters?: number;
    gyms?: number;
  };
}

const prettyEventName = (name: string) =>
  name.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const AdminNeighborhoods: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { events } = useAdminRealtime();
  const [search, setSearch] = React.useState('');
  const [cityFilter, setCityFilter] = React.useState('');
  const [editorMode, setEditorMode] = React.useState<'create' | 'edit' | 'duplicate' | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] = React.useState<Partial<NeighborhoodFormValues> | undefined>();
  const [insightsNeighborhood, setInsightsNeighborhood] = React.useState<AdminNeighborhood | null>(null);
  const [lastManualRefresh, setLastManualRefresh] = React.useState<Date | null>(null);

  const buildFormValues = React.useCallback((data: Partial<AdminNeighborhood>): NeighborhoodFormValues => ({
    name: data.name ?? '',
    city: data.city ?? '',
    state: data.state ?? '',
    country: data.country ?? 'India',
    imageUrl: data.imageUrl ?? '',
    images: data.images ?? [],
    metrics: {
      safety: data.metrics?.safety ?? 50,
      affordability: data.metrics?.affordability ?? 50,
      cleanliness: data.metrics?.cleanliness ?? 50,
      walkability: data.metrics?.walkability ?? 50,
      nightlife: data.metrics?.nightlife ?? 50,
      transport: data.metrics?.transport ?? 50
    },
    amenities: {
      schools: data.amenities?.schools ?? 0,
      hospitals: data.amenities?.hospitals ?? 0,
      parks: data.amenities?.parks ?? 0,
      restaurants: data.amenities?.restaurants ?? 0,
      shoppingCenters: data.amenities?.shoppingCenters ?? 0,
      gyms: data.amenities?.gyms ?? 0
    },
    housing: {
      averageRent1BHK: data.housing?.averageRent1BHK ?? 0,
      averageRent2BHK: data.housing?.averageRent2BHK ?? 0,
      averageRent3BHK: data.housing?.averageRent3BHK ?? 0,
      averagePropertyPrice: data.housing?.averagePropertyPrice ?? 0
    },
    matchSuccessRate: data.matchSuccessRate ?? 0,
    sentimentScore: data.sentimentScore ?? 0
  }), []);

  const openCreate = () => {
    setEditorMode('create');
    setEditingId(null);
    setInitialFormValues(undefined);
  };

  const openEdit = (neighborhood: AdminNeighborhood) => {
    setEditorMode('edit');
    setEditingId(neighborhood._id);
    setInitialFormValues(buildFormValues(neighborhood));
  };

  const openDuplicate = (neighborhood: AdminNeighborhood) => {
    setEditorMode('duplicate');
    setEditingId(neighborhood._id);
    const values = buildFormValues(neighborhood);
    values.name = `${values.name} Copy`;
    setInitialFormValues(values);
  };

  const neighborhoodsQuery = useQuery({
    queryKey: ['admin-neighborhoods'],
    queryFn: async () => {
      const { data } = await api.get('/neighborhoods', { params: { limit: 500 } });
      return data.neighborhoods as AdminNeighborhood[];
    }
  });

  const data = React.useMemo(() => {
    if (!neighborhoodsQuery.data) return [];
    return neighborhoodsQuery.data.filter((n) => {
      const matchesSearch =
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.city.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter ? n.city === cityFilter : true;
      return matchesSearch && matchesCity;
    });
  }, [neighborhoodsQuery.data, search, cityFilter]);

  const cityOptions = React.useMemo(() => {
    const set = new Set<string>();
    neighborhoodsQuery.data?.forEach((n) => set.add(n.city));
    return Array.from(set).sort();
  }, [neighborhoodsQuery.data]);

  const columns = React.useMemo<ColumnDef<AdminNeighborhood>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Neighborhood',
      cell: ({ row }) => (
        <div>
          <strong>{row.original.name}</strong>
          <div className="muted">{row.original.city}, {row.original.state}</div>
        </div>
      )
    },
    {
      accessorKey: 'overallRating',
      header: 'Rating',
      cell: ({ row }) => row.original.overallRating?.toFixed(1)
    },
    {
      accessorKey: 'matchSuccessRate',
      header: 'Match Success',
      cell: ({ row }) => row.original.matchSuccessRate ? `${row.original.matchSuccessRate}%` : '—'
    },
    {
      accessorKey: 'viewCount',
      header: 'Views',
      cell: ({ row }) => row.original.viewCount ?? 0
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="admin-user-actions">
          <button onClick={() => setInsightsNeighborhood(row.original)}>Insights</button>
          <button onClick={() => openEdit(row.original)}>Edit</button>
          <button onClick={() => openDuplicate(row.original)}>Duplicate</button>
        </div>
      )
    }
  ], []);

  const { data: detailData, error: detailError } = useQuery({
    queryKey: ['admin-neighborhood', editingId],
    queryFn: () => adminApi.getNeighborhood(editingId!),
    enabled: Boolean(editingId)
  });

  React.useEffect(() => {
    if (detailData) {
      const values = buildFormValues(detailData);
      if (editorMode === 'duplicate') {
        values.name = `${values.name} Copy`;
      }
      setInitialFormValues(values);
    }
  }, [detailData, editorMode, buildFormValues]);

  React.useEffect(() => {
    if (detailError) {
      // @ts-ignore
      const message = detailError?.response?.data?.message || 'Failed to load neighborhood';
      showToast(message, 'error');
    }
  }, [detailError, showToast]);

  const mutation = useMutation({
    mutationFn: (values: NeighborhoodFormValues) => {
      if (editorMode === 'edit' && editingId) {
        return adminApi.updateNeighborhood(editingId, values);
      }
      return adminApi.createNeighborhood(values);
    },
    onSuccess: () => {
      showToast(`Neighborhood ${editorMode === 'edit' ? 'updated' : 'saved'} successfully`, 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-neighborhoods'] });
      closeEditor();
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to save neighborhood', 'error');
    }
  });

  function closeEditor() {
    setEditorMode(null);
    setEditingId(null);
    setInitialFormValues(undefined);
  }

  const handleSubmit = (values: NeighborhoodFormValues) => {
    mutation.mutate(values);
  };

  const latestEvent = events[0];
  const isRefreshing = neighborhoodsQuery.isFetching || mutation.isPending;

  const handleManualRefresh = () => {
    setLastManualRefresh(new Date());
    queryClient.invalidateQueries({ queryKey: ['admin-neighborhoods'] });
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Neighborhood Management"
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastManualRefresh}
      />
      {latestEvent && (
        <div className="admin-banner">
          <strong>Live update:</strong> {prettyEventName(latestEvent.event)}
          <span>{new Date(latestEvent.timestamp).toLocaleTimeString()}</span>
        </div>
      )}
      <div className="admin-neighborhoods-toolbar">
        <button onClick={openCreate}>Add Neighborhood</button>
        <input
          type="search"
          placeholder="Search neighborhood or city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      <DataTable
        data={data}
        columns={columns}
        loading={neighborhoodsQuery.isLoading}
        emptyMessage="No neighborhoods"
      />
      <Modal
        title={
          editorMode === 'edit'
            ? 'Edit Neighborhood'
            : editorMode === 'duplicate'
              ? 'Duplicate Neighborhood'
              : 'Create Neighborhood'
        }
        isOpen={Boolean(editorMode)}
        onClose={closeEditor}
      >
        {(editorMode === 'create' || initialFormValues) ? (
          <NeighborhoodForm
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            submitting={mutation.isPending}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
      <Modal
        title="Neighborhood Insights"
        isOpen={Boolean(insightsNeighborhood)}
        onClose={() => setInsightsNeighborhood(null)}
      >
        {insightsNeighborhood && (
          <NeighborhoodInsights neighborhood={insightsNeighborhood} />
        )}
      </Modal>
    </AdminLayout>
  );
};

const NeighborhoodInsights: React.FC<{ neighborhood: AdminNeighborhood }> = ({ neighborhood }) => {
  const metricsChartData = [
    { metric: 'Safety', value: neighborhood.metrics?.safety ?? 0 },
    { metric: 'Affordability', value: neighborhood.metrics?.affordability ?? 0 },
    { metric: 'Cleanliness', value: neighborhood.metrics?.cleanliness ?? 0 },
    { metric: 'Walkability', value: neighborhood.metrics?.walkability ?? 0 },
    { metric: 'Nightlife', value: neighborhood.metrics?.nightlife ?? 0 },
    { metric: 'Transport', value: neighborhood.metrics?.transport ?? 0 }
  ];

  const housingData = [
    { label: '1BHK', value: neighborhood.housing?.averageRent1BHK ?? 0 },
    { label: '2BHK', value: neighborhood.housing?.averageRent2BHK ?? 0 },
    { label: '3BHK', value: neighborhood.housing?.averageRent3BHK ?? 0 },
    { label: 'Property', value: neighborhood.housing?.averagePropertyPrice ?? 0 }
  ];

  return (
    <div className="admin-neighborhood-insights">
      <div className="insights-grid">
        <div className="insights-card">
          <h4>Match Success</h4>
          <p className="insights-value">{neighborhood.matchSuccessRate ?? 0}%</p>
          <small>Sentiment: {neighborhood.sentimentScore ?? 0}</small>
        </div>
        <div className="insights-card">
          <h4>Views</h4>
          <p className="insights-value">{neighborhood.viewCount ?? 0}</p>
          <small>Overall Rating: {neighborhood.overallRating?.toFixed(1)}</small>
        </div>
      </div>
      <section>
        <h4>Lifestyle Metrics</h4>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={metricsChartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <Radar dataKey="value" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </section>
      <section>
        <h4>Housing Costs</h4>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={housingData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default AdminNeighborhoods;
