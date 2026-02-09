import React from 'react';
import SliderForm from '@/components/admin/SliderForm';

const AddSliderPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Slider</h1>
        <p className="text-gray-600 mt-2">Add a new home page slider</p>
      </div>
      <SliderForm />
    </div>
  );
};

export default AddSliderPage;
