import React, { useEffect, useState } from 'react'
import { Search, ChevronDown, MessageSquare } from 'lucide-react'
import axios from 'axios'
import { set } from 'firebase/database'

interface Issue {
  id: number
  title: string
  labels: string[]
  comments: number
  openedBy: string
  openedAt: string
}

const issues: Issue[] = [
  { id: 1000, title: "JavaScript is not working as expected on Tuesdays", labels: ["question"], comments: 289, openedBy: "Bono", openedAt: "2 hours ago" },
  { id: 999, title: "The App is not working when I rage click it", labels: ["question"], comments: 87, openedBy: "Tanner", openedAt: "32 minutes ago" },
  { id: 998, title: "The App is not working properly when I'm on a plane", labels: ["wontfix"], comments: 169, openedBy: "Tanner", openedAt: "1 hour ago" },
  { id: 996, title: "Target is not responding when I'm on a bike", labels: ["duplicate"], comments: 211, openedBy: "Alex", openedAt: "1 hour ago" },
  { id: 995, title: "React won't run right on Tuesdays", labels: ["help wanted"], comments: 278, openedBy: "Sarah", openedAt: "2 hours ago" },
]

const labelColors: { [key: string]: string } = {
  bug: "bg-red-600",
  feature: "bg-blue-600",
  enhancement: "bg-green-600",
  question: "bg-yellow-600",
  "help wanted": "bg-green-500",
  wontfix: "bg-gray-500",
  duplicate: "bg-purple-600",
}

export default function IssueTracker() {
    const [searchTerm, setSearchTerm] = useState("")
    const [data, setData] = useState<Issue[]>([]);

    async function LoadData() {
    
        try{
            const response=await axios.get("http://localhost:3000/issue",{
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log(response.data);
    
            setData(response.data);
    
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        LoadData();
    }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Issue Tracker</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium mb-2">Search Issues</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4">Issues List</h2>
          <div className="space-y-4">
            {issues.filter(issue => 
              issue.title.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(issue => (
              <div key={issue.id} className="bg-gray-900 rounded-lg p-4 flex items-start">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-yellow-400 mb-1">{issue.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {issue.labels.map(label => (
                      <span key={label} className={`px-2 py-1 rounded-full text-xs font-medium ${labelColors[label]}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    #{issue.id} opened {issue.openedAt} by {issue.openedBy}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <MessageSquare className="h-4 w-4" />
                  <span>{issue.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Labels</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(labelColors).map(([label, color]) => (
              <span key={label} className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                {label}
              </span>
            ))}
          </div>
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="relative">
            <select className="w-full bg-yellow-400 text-black rounded-md py-2 px-4 appearance-none cursor-pointer">
              <option>Select a status to filter</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-black pointer-events-none" />
          </div>
          <button className="w-full bg-yellow-400 text-black rounded-md py-2 px-4 mt-6 font-medium hover:bg-yellow-300 transition-colors">
            Add Issue
          </button>
        </div>
      </div>
    </div>
  )
}
