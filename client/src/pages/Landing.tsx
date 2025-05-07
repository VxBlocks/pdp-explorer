import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Github, FileCode, Book, Calculator, X, Loader2, Search } from 'lucide-react'
import {
  getProviders,
  getProofSets,
  getNetworkMetrics,
  search,
  SearchResult,
} from '@/api/apiService'
import { Pagination } from '@/components/ui/pagination'
import { formatDate, formatDataSize } from '@/utility/helper'
import { explorerUrl, contractAddresses } from '@/utility/constants'
import { useToast } from '@/hooks/use-toast'
import { NetworkStatsCard } from '@/components/Landing/NetworkStatsCard'
import type { NetworkMetrics, Provider, ProofSet } from '@/utility/types'
import { RecentProofSetsTable } from '@/components/Landing/RecentProofSetsTable'
import { RecentProvidersTable } from '@/components/Landing/RecentProvidersTable'

export const Landing = () => {
  const [providers, setProviders] = useState<Provider[]>([])
  const [proofSets, setProofSets] = useState<ProofSet[]>([])
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [providerPage, setProviderPage] = useState(1)
  const [proofSetPage, setProofSetPage] = useState(1)
  const [totalProviders, setTotalProviders] = useState(0)
  const [totalProofSets, setTotalProofSets] = useState(0)
  const ITEMS_PER_PAGE = 10

  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const { toast } = useToast()


  const inputRef = useRef<HTMLInputElement>(null)

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) {
      setSearchError('Please enter a search term')
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const response = await search(trimmedQuery)
      const results = response.data.results

      if (results.length === 1) {
        // Single result - navigate directly
        const path =
          results[0].type === 'provider'
            ? `/providers/${results[0].id}`
            : `/proofsets/${results[0].id}`
        navigate(path)
      } else if (results.length > 1) {
        // Multiple results - show dropdown
        setSearchResults(results)
      } else {
        // No results
        setSearchResults([])
        toast({
          title: 'No results found',
          description: 'Try a different search term',
          variant: 'default',
        })
      }
    } catch (error) {
      toast({
        title: 'Search failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
      setSearchResults([])
      setSearchError(error instanceof Error ? error.message : 'Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [providersRes, proofSetsRes, metricsRes] = await Promise.all([
          getProviders((providerPage - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE),
          getProofSets(
            'proofsSubmitted',
            'desc',
            (proofSetPage - 1) * ITEMS_PER_PAGE,
            ITEMS_PER_PAGE
          ),
          getNetworkMetrics(),
        ])

        if (providersRes?.data) {
          setProviders(providersRes?.data)
          setTotalProviders(providersRes.metadata?.total || 0)
        }

        if (proofSetsRes?.data) { 
          let newDatas = proofSetsRes?.data.sort((a, b) => b.setId - a.setId) 
          setProofSets(newDatas)
          setTotalProofSets(proofSetsRes.metadata?.total || 0)
        }

        if (metricsRes?.data) {
          setMetrics(metricsRes.data)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setProviders([])
        setProofSets([])
        setMetrics(null)
        setTotalProviders(0)
        setTotalProofSets(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [providerPage, proofSetPage])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <FileCode className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              PDP Scan
            </h1>
          </div>
          <div className="flex items-center space-x-7">
            <Link
              to="/documentation"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center"
            >
              <Book className="h-4 w-4 mr-1" />
              Docs
            </Link>
            <Link
              to="/gas-calculator"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center"
            >
              <Calculator className="h-4 w-4 mr-1" />
              Gas Calculator
            </Link>
            <Link
              to="https://github.com/FilOzone/pdp-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium transition-colors flex items-center"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" /> GitHub
            </Link>
            {/* Network Selector */}
            {/* <NetworkSelector /> */}
            {/* TODO: Fix colors to add this toggle ( default theme is light) */}
            {/* <ModeToggle />  */}
          </div>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by ProofSet ID or Provider ID or Root CID"
              className={`w-full p-3 border rounded-lg pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${searchError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
                }`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchError(null)
                if (!e.target.value.trim()) {
                  setSearchResults([]) // Clear results when input is cleared
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  clearSearch()
                }
              }}
              aria-invalid={!!searchError}
              aria-describedby={searchError ? 'search-error' : undefined}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-colors ${isSearching
                ? 'bg-gray-100'
                : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700'
                }`}
              aria-label="Search"
            >
              {isSearching ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>

          {searchError && (
            <div id="search-error" className="text-red-500 text-sm mt-1 ml-1">
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg mt-2 z-10 max-h-80 overflow-y-auto">
              {searchResults.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={
                    result.type === 'provider'
                      ? `/providers/${result.id}`
                      : `/proofsets/${result.id}`
                  }
                  className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0 transition-colors"
                  onClick={() => setSearchResults([])} // Close dropdown on click
                >
                  <p className="font-medium truncate">
                    <span className="text-xs uppercase bg-gray-200 text-gray-700 rounded px-1.5 py-0.5 mr-2">
                      {result.type === 'root' ? 'Proof Set' : result.type}
                    </span>
                    {result.id}
                  </p>
                  {/* Additional info if available in search result */}
                  {(result.active_sets !== undefined ||
                    result.data_size !== undefined) && (
                      <p className="text-sm text-gray-600 mt-1">
                        {result.type === 'provider'
                          ? `${result.active_sets} active sets`
                          : result.type === 'root'
                            ? `${result.total_roots} roots`
                            : `${formatDataSize(result.data_size)}`}
                      </p>
                    )}
                </Link>
              ))}
            </div>
          )}
        </form>
      </div>
      {/* Network Wide Metrics Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Network Overview</h2>
        <NetworkStatsCard
          metrics={metrics}
          isLoading={loading}
          error={""}
        />
      </div>

      {/* Recent Proof Sets and Providers Sections */}
      <div className="flex flex-col gap-8">
        {/* Recent Providers */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Providers</h2>
            <Link
              to="/providers"
              className="text-blue-500 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="border rounded">
            <RecentProvidersTable
              providers={providers}
              isLoading={loading}
              error={""}
              itemsToShow={ITEMS_PER_PAGE}
            />
          </div>
        </div>

        {/* Recent Proof Sets */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Proof Sets</h2>
            <Link
              to="/proofsets"
              className="text-blue-500 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="border rounded">
            <RecentProofSetsTable
              proofSets={proofSets}
              isLoading={loading}
              error={""}
              itemsToShow={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 py-12 bg-muted/50 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Want to Learn More?</h2>
            <p className="text-muted-foreground">
              Explore our codebase and smart contracts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href={`${explorerUrl}/address/${contractAddresses.PDPVerifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">PDPVerifier Contract</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                View contract details and transactions on Filfox
              </p>
            </a>

            <a
              href={`${explorerUrl}/address/${contractAddresses.SimplePDPService}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">SimplePDPService Contract</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore the service contract on Filfox
              </p>
            </a>

            <a
              href="https://github.com/FilOzone/pdp"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Github className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">PDP Repository</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Check out our core PDP implementation
              </p>
            </a>

            <a
              href="https://github.com/FilOzone/pdp-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Github className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">PDP Scan</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Contribute to this explorer application
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export const MetricCard = ({
  title,
  value,
}: {
  title: string
  value: React.ReactNode
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}
