'use client'

import { useState, useEffect } from 'react'
import { getAllReportedZones } from '@/utils/db/actions' // Fonction pour obtenir les zones signalées
import { toast } from 'react-hot-toast'

type Zone = {
  id: number;
  name: string; // Nom de la zone
  description: string; // Description de la zone à risque
  reportedAt: Date; // Date de signalement
  severity: number; // Niveau de risque (1-5)
}

export default function ReportedZonesPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchZones = async () => {
      setLoading(true)
      try {
        const fetchedZones = await getAllReportedZones() // Appel pour récupérer les zones
        setZones(fetchedZones)
      } catch (error) {
        console.error('Error fetching reported zones:', error)
        toast.error('Failed to load reported zones. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchZones()
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Zones à risque signalées</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 text-gray-600">Loading...</div>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date de signalement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Niveau de risque</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{zone.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{new Date(zone.reportedAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${zone.severity >= 4 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        Niveau {zone.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
