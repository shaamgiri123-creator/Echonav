import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, Phone } from 'lucide-react';
import { EmergencyContact } from '../../types/echonav';

interface EmergencyContactsCardProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onRemoveContact: (id: string) => void;
}

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({
  contacts,
  onAddContact,
  onRemoveContact,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Family');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAddContact({
      name: name.trim(),
      phone: phone.trim(),
      relation: relation.trim() || 'Caregiver',
    });

    setName('');
    setPhone('');
    setRelation('Family');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E7EFE8] space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F1]">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <ShieldAlert className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-[#0B3821] tracking-tight">
              Emergency SOS Contacts
            </h3>
            <p className="text-[11px] font-medium text-[#5F7E6C]">
              Recipients for GPS location distress broadcasts
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="min-h-[38px] px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
          aria-label="Add new emergency contact"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Add Contact Inline Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-3 bg-red-50/50 rounded-2xl border border-red-200 space-y-2.5 animate-in fade-in duration-150">
          <div className="text-xs font-extrabold text-red-900">Add Emergency Caregiver</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-white"
            />
            <input
              type="tel"
              placeholder="Phone (e.g. +91 98765 43210)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-white"
            />
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-white"
            >
              <option value="Family">Family Member</option>
              <option value="Caregiver">Caregiver / Nurse</option>
              <option value="Doctor">Doctor / Clinic</option>
              <option value="Neighbor">Neighbor / Friend</option>
              <option value="Emergency Services">Emergency 112 / 911</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-2">
        {contacts.length === 0 ? (
          <div className="text-center py-4 text-xs text-[#7A9586]">
            No emergency contacts saved. Tap &quot;Add&quot; to configure your primary caregiver.
          </div>
        ) : (
          contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF8] border border-[#EEF4EF] hover:bg-[#F2F7F3] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-black shrink-0">
                  {index + 1}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0B3821] flex items-center gap-1.5">
                    <span>{contact.name}</span>
                    <span className="text-[10px] font-bold text-[#0D8249] bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                      {contact.relation}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {contact.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 text-[#0D8249] hover:bg-emerald-100 rounded-xl transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label={`Call ${contact.name}`}
                >
                  <Phone className="w-4 h-4" />
                </a>

                {contacts.length > 1 && (
                  <button
                    onClick={() => onRemoveContact(contact.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label={`Remove ${contact.name} from emergency contacts`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
