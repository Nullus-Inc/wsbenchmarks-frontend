'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'

// Mock function to simulate API call for fetching companies
const fetchCompanies = async (query: string) => {
  // In a real application, replace this with an actual API call
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
  return [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  ].filter(company => company.symbol.toLowerCase().includes(query.toLowerCase()) || 
                      company.name.toLowerCase().includes(query.toLowerCase()))
}

type Purchase = {
  date: string
  amount: number
}

type Stock = {
  symbol: string
  name: string
  purchases: Purchase[]
}

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [companies, setCompanies] = useState<{ symbol: string; name: string }[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [showAddPurchase, setShowAddPurchase] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchCompanies(searchTerm).then(setCompanies)
      } else {
        setCompanies([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleSelectStock = (symbol: string, name: string) => {
    setSelectedStock({ symbol, name, purchases: [] })
    setSearchTerm('')
    setCompanies([])
  }

  const handleAddPurchase = (amount: number, date: string) => {
    if (selectedStock) {
      setSelectedStock({
        ...selectedStock,
        purchases: [...selectedStock.purchases, { amount, date }]
      })
    }
    setShowAddPurchase(false)
  }

  const handleRemovePurchase = (index: number) => {
    if (selectedStock) {
      const updatedPurchases = selectedStock.purchases.filter((_, i) => i !== index)
      setSelectedStock({ ...selectedStock, purchases: updatedPurchases })
    }
  }

  return (
    <div className="w-1/4 h-screen bg-primary-light border-r p-4 flex flex-col text-black">
      <div className="mb-4">
        <div className="block text-sm font-medium bg-gray-200 p-2 rounded-md">
          <label htmlFor="stock-search">Search Stocks</label>
        </div>
        <div className="relative mt-4 mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="stock-search"
            type="text"
            placeholder="Search by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black h-12"
          />
        </div>
      </div>

      {companies.length > 0 && (
        <div className="mb-4 border rounded-md bg-white">
          {companies.map((company) => (
            <button
              key={company.symbol}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              onClick={() => handleSelectStock(company.symbol, company.name)}
            >
              {company.symbol} - {company.name}
            </button>
          ))}
        </div>
      )}

      {selectedStock && (
        <div className="mb-4 border rounded-md p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-semibold text-black">{selectedStock.symbol}</h3>
              <p className="text-sm text-gray-500">{selectedStock.name}</p>
            </div>
            <button
              className="px-2 py-1 text-sm border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              onClick={() => setShowAddPurchase(true)}
            >
              <Plus className="h-4 w-4 inline mr-1" /> Add Purchase
            </button>
          </div>
          <div className="space-y-2"> 
            {selectedStock.purchases.map((purchase, index) => (
              <div key={index} className="flex justify-between items-center border rounded-md p-2 text-sm text-black">
                <div>
                  <div className="font-semibold">${purchase.amount.toFixed(2)}</div>
                  <div>{purchase.date}</div>
                </div>
                <button
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded-md"
                  onClick={() => handleRemovePurchase(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-black">Add Purchase for {selectedStock?.symbol}</h2>
            <AddPurchaseForm onAddPurchase={handleAddPurchase} onClose={() => setShowAddPurchase(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

type AddPurchaseFormProps = {
  onAddPurchase: (amount: number, date: string) => void
  onClose: () => void
}

function AddPurchaseForm({ onAddPurchase, onClose }: AddPurchaseFormProps) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddPurchase(parseFloat(amount), date)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-black">Amount Invested ($)</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-black">Purchase Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Purchase
        </button>
      </div>
    </form>
  )
}