import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNetworkAccount } from '../context/WalletContex';
import { useDojo } from '../dojo/useDojo';
import { Account, CairoCustomEnum } from 'starknet';
import { toast } from 'react-toastify';

// Formation options based on your enum
const FormationOptions = [
  { value: 'F442', label: '4-4-2' },
  { value: 'F433', label: '4-3-3' },
  { value: 'F352', label: '3-5-2' },
  { value: 'F532', label: '5-3-2' },
  { value: 'F343', label: '3-4-3' }
];

const SquadModal = ({ isOpen, onClose, onSave, initialData = null,numSquads }) => {
  const [formData, setFormData] = useState({
    name: '',
    formation: 'F442',
    team_chemistry: 0
  });

    const {
      setup: {
        client
      },
    } = useDojo();

  const { account,address } = useNetworkAccount();
  // Set initial form data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        formation: initialData.formation || 'F442',
        team_chemistry: initialData.team_chemistry || 0
      });
    }
  }, [initialData, isOpen]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        formation: 'F442',
        team_chemistry: 0
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'team_chemistry' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const squadID = numSquads + 1;
    
    try {

        // #[derive(Copy, Drop, Serde, Debug)]
        // #[dojo::model]
        // pub struct Squad {
        //     #[key]
        //     pub player_id: ContractAddress,
        //     #[key]
        //     pub squad_id: u8,
        //     pub name: felt252,
        //     pub formation: Formation,
        //     pub team_chemistry: u8
        // }
        
        
        let result = await (await client).squad.createSquad(
          account as Account,
          formData.name,
          squadID,
          new CairoCustomEnum({ [formData.formation]: "()" })
        );
        if (result && result.transaction_hash){
            toast.success(`${formData.name} added to squads`);
        }
        
      } catch (error: any) {
        toast.error(error.message);
      }
  
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-lg w-full max-w-md overflow-hidden shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #064e3b, #065f46)',
          border: '1px solid rgba(5, 150, 105, 0.4)'
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-green-700">
          <h3 className="text-xl font-bold text-white">
            {initialData ? 'Edit Squad' : 'Create New Squad'}
          </h3>
          <button 
            onClick={onClose}
            className="text-green-200 hover:text-white rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-green-200 mb-1">
              Squad Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter squad name"
              required
              maxLength={31}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="formation" className="block text-sm font-medium text-green-200 mb-1">
              Formation
            </label>
            <select
              id="formation"
              name="formation"
              value={formData.formation}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {FormationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          

          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg text-white font-medium"
            >
              {initialData ? 'Update Squad' : 'Create Squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SquadModal;