import React, { useState, useEffect } from 'react';
import { X, Check, Flame, Shield, Zap } from 'lucide-react';
import { Card, Squad } from '../dojogen/models.gen';
import { useNetworkAccount } from '../context/WalletContex';
import { useDojo } from '../dojo/useDojo';
import { Account } from 'starknet';
import { toast } from 'react-toastify';
import { getRandomPlayerImage, parseStarknetError } from '../utils';

interface AddToSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  squads: Squad[];
}

const AddToSquadModal = ({ isOpen, onClose, card, squads }: AddToSquadModalProps) => {
  const [formData, setFormData] = useState({
    squad_id: squads.length > 0 ? squads[0].squad_id : 0,
    card_id: card ? card.id : 0,
    position_index: 1,
    chemistry_bonus: 0
  });
  
  const { account } = useNetworkAccount();
  const { setup: { client } } = useDojo();

  useEffect(() => {
    if (card) {
      const defaultPosition = getDefaultPosition(card.special as any);
      setFormData(prev => ({
        ...prev,
        card_id: card.id,
        position_index: defaultPosition || 1
      }));
    }
  }, [card]);

  useEffect(() => {
    if (squads.length > 0 && formData.squad_id === 0) {
      setFormData(prev => ({
        ...prev,
        squad_id: squads[0].squad_id
      }));
    }
  }, [squads]);

  const getAvailablePositions = (special: number): number[] => {
    if (special === 2 || special === 3) {
      return [12, 13];
    } else if (special === 4 || special === 5) {
      return [14, 15];
    } else {
          return [
      ...Array.from({ length: 11 }, (_, i) => i + 1),
      ...Array.from({ length: 8 }, (_, i) => i + 16)
    ]
    }
  };

  const getDefaultPosition = (special: number): number => {
    if (special === 2) {
      return 12;
    } else if (special === 3) {
      return 14;
    } else {
      return 1;
    }
  };

  const availablePositions = card ? getAvailablePositions(card.special as any) : [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const processedValue = 
        ['chemistry_bonus', 'position_index', 'squad_id'].includes(name) 
          ? parseInt(value, 10) || 0  
          : value;
      
      return {
        ...prev,
        [name]: processedValue
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData)

    if (formData.position_index === 0 || formData.squad_id === 0 || formData.card_id === 0) {
      toast.warning("Val cannot be zero, try again");
      return;
    }

    try {
      let result = await (await client).squad.addCardToPosition(
        account as Account,
        formData.squad_id,
        formData.position_index,
        formData.card_id
      );

      if (result && result.transaction_hash) {
        toast.success(`${card.player_name} added to squad ${formData.squad_id}`);
      }
    } catch (error: any) {
    const errorParsed = parseStarknetError(error);

    console.log(errorParsed)

    if (errorParsed){
      toast.error(errorParsed);
    }else{
       toast.error("failed to add player to squad");
    }
      
    }

    onClose();
  };

  if (!isOpen || !card) return null;

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
            Add Card to Squad
          </h3>
          <button 
            onClick={onClose}
            className="text-green-200 hover:text-white rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4 flex items-center gap-3 bg-green-900/30 p-3 rounded-lg">
            <div className="h-12 w-12 rounded bg-green-800 flex items-center justify-center overflow-hidden">
              <img src={getRandomPlayerImage()} alt="Card" className="object-cover" />
            </div>
            <div>
              <div className="font-bold text-white">{card.player_name}</div>
              <div className="text-sm text-green-200">{card.team} • {card.position as any}</div>
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
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="squad_id" className="block text-sm font-medium text-green-200 mb-1">
                Select Squad
              </label>
              <select
                id="squad_id"
                name="squad_id"
                value={formData.squad_id as number}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                {squads.length === 0 ? (
                  <option value="">No squads available</option>
                ) : (
                  squads.map(squad => (
                    <option key={squad.squad_id} value={squad.squad_id as number}>
                      {squad.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="position_index" className="block text-sm font-medium text-green-200 mb-1">
                Position {card.special === 2 ? '(Limited to 12-13)' : 
                          card.special === 3 ? '(Limited to 14-15)' : 
                          '(1-22)'}
              </label>
              <select
                id="position_index"
                name="position_index"
                value={formData.position_index}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                {availablePositions.map(pos => (
                  <option key={pos} value={pos}>
                    Position {pos}
                  </option>
                ))}
              </select>
              <p className="text-xs text-green-300 mt-1">
                {card.special === 2 ? 'This card can only be placed in special positions 12-13' : 
                 card.special === 3 ? 'This card can only be placed in special positions 14-15' : 
                 'This card can be placed in any standard position'}
              </p>
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
                disabled={squads.length === 0}
              >
                <Check size={18} className="mr-1" />
                Add to Squad
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToSquadModal;