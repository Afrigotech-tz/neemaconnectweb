import React from 'react';
import { useParams } from 'react-router-dom';
import SliderForm from '@/components/admin/SliderForm';

const EditSliderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Slider</h1>
        <p className="text-gray-600 mt-2">Update slider details</p>
      </div>
      <SliderForm sliderId={id ? parseInt(id) : undefined} />
    </div>
  );
};

export default EditSliderPage;
