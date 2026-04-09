import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSlider } from '@/hooks/useSlider';
import { HomeSlider } from '@/types/sliderTypes';
import { Plus, Edit, Trash2, ImageIcon, ToggleLeft, ToggleRight, Presentation, CheckCircle2, Clock3 } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

const SlidersList: React.FC = () => {
  const { sliders, fetchSliders, deleteSlider, toggleSliderStatus, loading } = useSlider();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<HomeSlider | null>(null);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  const handleDeleteClick = (slider: HomeSlider) => {
    setSliderToDelete(slider);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (sliderToDelete) {
      await deleteSlider(sliderToDelete.id);
      setDeleteDialogOpen(false);
      setSliderToDelete(null);
    }
  };

  const handleToggleStatus = async (slider: HomeSlider) => {
    await toggleSliderStatus(slider.id, !slider.is_active);
  };

  const activeSliders = sliders.filter((slider) => slider.is_active).length;
  const inactiveSliders = sliders.length - activeSliders;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-theme="neemadmin">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-theme="neemadmin">
      <div className="rounded-2xl border bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-800 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Presentation className="h-7 w-7" />
              Sliders Management
            </h1>
            <p className="text-white/80 mt-2">Control homepage slider visuals, ordering, and publication status.</p>
          </div>
          <Link to="/dashboard/slider-management/add" className="btn bg-white text-black hover:bg-white/90 border-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Slider
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-base-100 p-4">
          <p className="text-sm text-base-content/60">Total Sliders</p>
          <p className="text-2xl font-bold text-base-content mt-1">{sliders.length}</p>
        </div>
        <div className="rounded-xl border bg-base-100 p-4">
          <p className="text-sm text-base-content/60 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Active
          </p>
          <p className="text-2xl font-bold text-base-content mt-1">{activeSliders}</p>
        </div>
        <div className="rounded-xl border bg-base-100 p-4">
          <p className="text-sm text-base-content/60 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-warning" />
            Inactive
          </p>
          <p className="text-2xl font-bold text-base-content mt-1">{inactiveSliders}</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2 text-xl text-base-content">
            <ImageIcon className="h-5 w-5" />
            Home Sliders ({sliders.length})
          </h2>
          
          {sliders.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-base-content/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-base-content mb-2">No sliders found</h3>
              <p className="text-base-content/60 mb-4">Get started by creating your first slider.</p>
              <Link to="/dashboard/slider-management/add" className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Slider
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Head</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sliders.map((slider) => (
                    <tr key={slider.id} className="hover">
                      <td className="font-medium">{slider.sort_order}</td>
                      <td>
                        <div className="w-20 h-12 bg-base-200 rounded overflow-hidden">
                          {slider.image ? (
                            <img
                              src={getImageUrl(slider.image)}
                              alt={slider.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-base-content/40" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{slider.title}</td>
                      <td className="max-w-xs truncate">{slider.head}</td>
                      <td>
                        <span className={`badge ${slider.is_active ? 'badge-success' : 'badge-warning'}`}>
                          {slider.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(slider)}
                            title={slider.is_active ? 'Deactivate' : 'Activate'}
                            className="btn btn-ghost btn-xs"
                          >
                            {slider.is_active ? (
                              <ToggleRight className="h-4 w-4 text-success" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-base-content/40" />
                            )}
                          </Button>
                          <Link 
                            to={`/dashboard/slider-management/edit/${slider.id}`}
                            className="btn btn-ghost btn-xs"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(slider)}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteDialogOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Slider</h3>
          <p className="py-4">
            Are you sure you want to delete "{sliderToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setDeleteDialogOpen(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDeleteConfirm}>Delete</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setDeleteDialogOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default SlidersList;
