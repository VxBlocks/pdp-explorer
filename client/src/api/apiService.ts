import { getRequest } from '@/utility/generalServices'
import { Activity, ProviderActivitiesParams, ProviderDetailsResponse } from '@/utility/types'

export interface SearchResult {
  type: 'provider' | 'proofset' | 'root'
  id: string
  provider_id?: string
  active_sets?: number
  data_size: string
  total_roots?: number
}
// Provider-related API calls
export async function getProviders(offset = 0, limit = 10, search = '') {
  const queryParams = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    ...(search && { q: search }),
  })
  const res = await getRequest(`/providers?${queryParams}`)
  return res.data
}

export const getProviderDetails = async (
  providerId: string
): Promise<ProviderDetailsResponse> => {
  const res = await getRequest(`/providers/${providerId}`)
  return res.data
}

export const getProviderActivities = async (
  params: ProviderActivitiesParams
): Promise<Activity[]> => {
  const queryParams = new URLSearchParams({
    type: params.type,
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
  })

  const res = await getRequest(
    `/providers/${params.providerId}/activities?${queryParams}`
  )
  return res.data
}

export const getProviderProofSets = async (
  providerId: string,
  offset: number = 0,
  limit: number = 10
) => {
  const response = await getRequest(
    `/providers/${providerId}/proof-sets?offset=${offset}&limit=${limit}`
  )
  return response.data
}

// ProofSet-related API calls
export async function getProofSets(
  sortBy: string = 'proofsSubmitted',
  order: string = 'desc',
  offset = 0,
  limit = 10,
  search = ''
) {
  const queryParams = new URLSearchParams({
    sortBy,
    order,
    offset: offset.toString(),
    limit: limit.toString(),
    ...(search && { q: search }),
  })
  const res = await getRequest(`/proofsets?${queryParams}`)
  return res.data
}

export const getProofSetDetails = async (proofSetId: string) => {
  const response = await getRequest(`/proofsets/${proofSetId}`)

  return {
    data: {
      proofSet: response.data,
    },
  }
}

export async function getProofSetHeatmap(proofSetId: string) {
  const res = await getRequest(`/proofsets/${proofSetId}/heatmap`)
  return res.data
}

export async function getNetworkMetrics() {
  const res = await getRequest('/network-metrics')
  return { data: res.data } // Wrap the response data to match the expected format
}

export const search = (query: string) => {
  return getRequest(`/search?q=${query}`)
}

export const getProofSetEventLogs = async (
  proofSetId: string,
  filter: string,
  offset: number = 0,
  limit: number = 10
) => {
  const response = await getRequest(
    `/proofsets/${proofSetId}/event-logs?offset=${offset}&limit=${limit}&filter=${filter}`
  )
  return {
    data: {
      eventLogs: response.data.data || [],
      metadata: response.data.metadata,
    },
  }
}

export const getProofSetTxs = async (
  proofSetId: string,
  filter: string,
  offset: number = 0,
  limit: number = 10
) => {
  const response = await getRequest(
    `/proofsets/${proofSetId}/txs?offset=${offset}&limit=${limit}&filter=${filter}`
  )
  return {
    data: {
      txs: response.data.data || [],
      metadata: response.data.metadata,
    },
  }
}

export const getProofSetRoots = async (
  proofSetId: string,
  offset: number = 0,
  limit: number = 10,
  orderBy: string = 'root_id',
  order: string = 'asc'
) => {
  const response = await getRequest(
    `/proofsets/${proofSetId}/roots?offset=${offset}&limit=${limit}&orderBy=${orderBy}&order=${order}`
  )
  return {
    data: {
      roots: response.data.data || [],
      metadata: response.data.metadata,
    },
  }
}
