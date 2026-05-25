

import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

const AddDoctor = () => {
  const { aToken, getAllDoctors } = useContext(AdminContext);

  // State initialization
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form submission handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!docImg) {
        toast.error('Please upload a doctor profile picture');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      const doctorData = {
        name,
        email,
        password,
        image: docImg,
        speciality,
        degree,
        experience,
        about,
        fees: Number(fees),
        address: JSON.stringify({ line1: address1, line2: address2 }),
      };

      Object.entries(doctorData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: {
          aToken,
        },
      });

      if (response.data.success) {
        toast.success('Doctor added successfully!');
        getAllDoctors();
        
        // Reset form
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setAbout('');
        setSpeciality('General physician');
        setDegree('');
        setAddress1('');
        setAddress2('');
      } else {
        toast.error(response.data.message || 'Failed to add doctor');
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error(error.response?.data?.message || 'An error occurred while adding the doctor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl p-6 mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Doctor</h2>
          <p className="text-sm text-gray-500 mt-1">Enter the details below to register a new practitioner to the system.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmitHandler} className="p-8 space-y-8">
          
          {/* Image Upload Area */}
          <div className="flex items-center gap-6">
            <label htmlFor="doc-img" className="cursor-pointer flex items-center gap-4 group">
              <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-colors">
                {docImg ? (
                  <img className="w-full h-full object-cover" src={URL.createObjectURL(docImg)} alt="Preview" />
                ) : (
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Upload Profile Picture</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </label>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*" />
          </div>

          <hr className="border-gray-100" />

          {/* Grid Layout for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                <input required onChange={(e) => setName(e.target.value)} value={name} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" type="text" placeholder="Dr. John Doe" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input required onChange={(e) => setEmail(e.target.value)} value={email} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" type="email" placeholder="doctor@hospital.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input required onChange={(e) => setPassword(e.target.value)} value={password} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" type="password" placeholder="Create a strong password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select onChange={(e) => setExperience(e.target.value)} value={experience} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  {[...Array(15)].map((_, i) => (
                    <option key={i} value={`${i + 1} Year${i === 0 ? '' : 's'}`}>{i + 1} Year{i === 0 ? '' : 's'}</option>
                  ))}
                  <option value="15+ Years">15+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fees ($)</label>
                <input required onChange={(e) => setFees(e.target.value)} value={fees} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" type="number" min="0" placeholder="e.g. 50" />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speciality</label>
                <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  <option value="General physician">General physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education/Degree</label>
                <input required onChange={(e) => setDegree(e.target.value)} value={degree} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" type="text" placeholder="MBBS, MD, etc." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                <input required onChange={(e) => setAddress1(e.target.value)} value={address1} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" type="text" placeholder="Street Address, Block, etc." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                <input onChange={(e) => setAddress2(e.target.value)} value={address2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" type="text" placeholder="City, State, Zip Code" />
              </div>
            </div>
          </div>

          {/* Full Width About Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About Doctor</label>
            <textarea required onChange={(e) => setAbout(e.target.value)} value={about} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 resize-none" rows="5" placeholder="Write a brief description about the doctor's background, expertise, and patient approach..."></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full sm:w-auto px-8 py-3 text-white font-medium rounded-lg transition-all shadow-sm
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Doctor...
                </span>
              ) : (
                'Save Doctor Details'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
