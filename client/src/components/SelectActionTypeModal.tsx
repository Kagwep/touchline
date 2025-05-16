import React, { useState } from 'react';
import { X, Check, Flame, Shield, Zap, RotateCw } from 'lucide-react';

const ActionType = {
  NONE: "None",
  ATTACK: "Attack",
  DEFEND: "Defend",
  SPECIAL: "Special",
  SUBSTITUTE: "Substitute"
};

interface SelectActionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelected: (actionType: string) => void;
  card?: any; // Optional card data to display
}

const SelectActionTypeModal = ({ isOpen, onClose, onActionSelected, card }: SelectActionTypeModalProps) => {
  const [selectedAction, setSelectedAction] = useState<string>(ActionType.ATTACK);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onActionSelected(selectedAction);
    onClose();
  };

  const handleActionSelect = (actionType: string) => {
    setSelectedAction(actionType);
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
            Select Action Type
          </h3>
          <button 
            onClick={onClose}
            className="text-green-200 hover:text-white rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {card && (
            <div className="mb-4 flex items-center gap-3 bg-green-900/30 p-3 rounded-lg">
              <div className="h-12 w-12 rounded bg-green-800 flex items-center justify-center overflow-hidden">
                <img src="/api/placeholder/48/48" alt="Card" className="object-cover" />
              </div>
              <div>
                <div className="font-bold text-white">{card.player_name}</div>
                <div className="text-sm text-green-200">{card.team} • {card.position}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="flex items-center">
                  <Flame size={12} className="mr-1 text-red-400" />
                  <span>{card.attack}</span>
                </div>
                <div className="flex items-center">
                  <Shield size={12} className="mr-1 text-blue-400" />
                  <span>{card.defense}</span>
                </div>
                <div className="flex items-center">
                  <Zap size={12} className="mr-1 text-yellow-400" />
                  <span>{card.special}</span>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-200 mb-2">
                Choose Action Type
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleActionSelect(ActionType.ATTACK)}
                  className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    selectedAction === ActionType.ATTACK 
                      ? 'bg-red-900/50 border-red-500 text-white' 
                      : 'bg-green-900/30 border-green-700 text-green-200 hover:bg-green-800/40'
                  }`}
                >
                  <Flame size={24} className={`mb-2 ${selectedAction === ActionType.ATTACK ? 'text-red-400' : ''}`} />
                  <span className="font-medium">Attack</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleActionSelect(ActionType.DEFEND)}
                  className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    selectedAction === ActionType.DEFEND 
                      ? 'bg-blue-900/50 border-blue-500 text-white' 
                      : 'bg-green-900/30 border-green-700 text-green-200 hover:bg-green-800/40'
                  }`}
                >
                  <Shield size={24} className={`mb-2 ${selectedAction === ActionType.DEFEND ? 'text-blue-400' : ''}`} />
                  <span className="font-medium">Defend</span>
                </button>
                
                {/* <button
                  type="button"
                  onClick={() => handleActionSelect(ActionType.SPECIAL)}
                  className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    selectedAction === ActionType.SPECIAL 
                      ? 'bg-yellow-900/50 border-yellow-500 text-white' 
                      : 'bg-green-900/30 border-green-700 text-green-200 hover:bg-green-800/40'
                  }`}
                >
                  <Zap size={24} className={`mb-2 ${selectedAction === ActionType.SPECIAL ? 'text-yellow-400' : ''}`} />
                  <span className="font-medium">Special</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleActionSelect(ActionType.SUBSTITUTE)}
                  className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    selectedAction === ActionType.SUBSTITUTE 
                      ? 'bg-purple-900/50 border-purple-500 text-white' 
                      : 'bg-green-900/30 border-green-700 text-green-200 hover:bg-green-800/40'
                  }`}
                >
                  <RotateCw size={24} className={`mb-2 ${selectedAction === ActionType.SUBSTITUTE ? 'text-purple-400' : ''}`} />
                  <span className="font-medium">Substitute</span>
                </button> */}
              </div>
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
                className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg text-white font-medium flex items-center"
              >
                <Check size={18} className="mr-1" />
                Confirm Action
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelectActionTypeModal;